import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Logout from './Auth/Logout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';

const Profile = () => {
    const { state } = useAuth();
    const [profile, setProfile] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedProfile, setEditedProfile] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}users/profiles/profile_data/`, {
                headers: {
                    Authorization: `Token ${state.token}`,
                },
            });
            const data = await response.json();
            setProfile(data);
            setEditedProfile(data);
        };

        fetchProfile();
    }, [state.token]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleSaveClick = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}users/profiles/${profile.user__id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${state.token}`,
            },
            body: JSON.stringify({
                username: editedProfile.username,
                first_name: editedProfile.first_name,
                last_name: editedProfile.last_name,
                email: editedProfile.email,
                dob: format(parseISO(editedProfile.dob), 'yyyy-MM-dd'),
                bio: editedProfile.bio,
                state: editedProfile.state,
            }),
        });
        if (response.ok) {
            setProfile(editedProfile);
            setShowEditModal(false);
        }
    };

    const handleCancelClick = () => {
        setEditedProfile(profile);
        setShowEditModal(false);
    };

    const defaultImage = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

    if (!profile) return <div className="text-white bg-dark p-3">Cargando...</div>;

    return (
        <div className="container-fluid vh-100 bg-dark">
            <div className="row justify-content-center align-items-start" style={{ height: '100vh' }}>
                <div className="col-md-6">
                    <div className="card bg-dark text-white mt-5" style={{ width: '100%' }}>
                        <div className="card-body">
                            <div className="text-left">
                                <i className="fas fa-pencil-alt cursor-pointer" onClick={handleEditClick}></i>
                            </div>
                            <div className="text-center">
                                <img src={profile.image || defaultImage} alt="Profile" className="img-fluid rounded-circle mb-3" style={{ width: '150px', height: '150px' }} />
                            </div>
                            <h2 className="card-title text-center">{profile.first_name} {profile.last_name}</h2>
                            <p className="card-text text-center">{profile.email}</p>
                            <p className="card-text text-center"><strong>Fecha de Cumpleaños:</strong> {profile.dob}</p>
                            <p className="card-text text-center"><strong>Bio:</strong> {profile.bio}</p>
                            <div className="text-center mt-3">
                                <Logout />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`modal ${showEditModal ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content bg-dark text-white" style={{ border: '1px solid gray' }}>
                        <div className="modal-header">
                            <h5 className="modal-title">Editar Perfil</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={handleCancelClick} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="first_name" className="form-label">Nombre</label>
                                <input type="text" className="form-control bg-dark text-white" id="first_name" value={editedProfile.first_name} readOnly />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="last_name" className="form-label">Apellido</label>
                                <input type="text" className="form-control bg-dark text-white" id="last_name" value={editedProfile.last_name} readOnly />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control bg-dark text-white" id="email" value={editedProfile.email} readOnly />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="dob" className="form-label">Fecha de Cumpleaños</label>
                                <DatePicker
                                    id="dob"
                                    selected={editedProfile.dob ? parseISO(editedProfile.dob) : null}
                                    onChange={(date) => setEditedProfile({ ...editedProfile, dob: format(date, 'yyyy-MM-dd') })}
                                    className="form-control bg-dark text-white"
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Seleccionar fecha de cumpleaños"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="bio" className="form-label">Bio</label>
                                <textarea
                                    id="bio"
                                    className="form-control bg-dark text-white"
                                    value={editedProfile.bio}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCancelClick}>Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveClick}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;