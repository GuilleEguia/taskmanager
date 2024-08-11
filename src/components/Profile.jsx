import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Logout from './Auth/Logout';

const Profile = () => {
    const { state } = useAuth();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}users/profiles/profile_data/`, {
                headers: {
                    Authorization: `Token ${state.token}`,
                },
            });
            const data = await response.json();
            setProfile(data);
        };

        fetchProfile();
    }, [state.token]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const defaultImage = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

    if (!profile) return <div className="text-white bg-dark p-3">Loading...</div>;

    return (
        <div className="container-fluid vh-100 bg-dark">
            <div className="row justify-content-center align-items-start" style={{ height: '100vh' }}>
                <div className="col-md-6">
                    <div className="card bg-dark text-white mt-5" style={{ width: '100%' }}>
                        <div className="card-body">
                            <div className="text-center">
                                <img src={profile.image || defaultImage} alt="Profile" className="img-fluid rounded-circle mb-3" style={{ width: '150px', height: '150px' }} />
                            </div>
                            <h2 className="card-title text-center">{profile.first_name} {profile.last_name}</h2>
                            <p className="card-text text-center">{profile.email}</p>
                            <div className="text-center mt-3">
                                <Logout />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;