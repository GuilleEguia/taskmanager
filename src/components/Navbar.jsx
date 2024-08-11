import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const Navbar = () => {
    const { state } = useAuth();
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}taskmanager/projects/`, {
                    headers: {
                        Authorization: `Token ${state.token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Error al obtener proyectos');
                }
                const data = await response.json();
                if (state.user && state.user.user__id) {
                    const filteredProjects = data.results.filter(proj => proj.owner === state.user.user__id);
                    setProjects(filteredProjects);
                }
            } catch (error) {
                setError('Ocurrió un error al obtener proyectos');
            }
        };

        if (showCreateTaskModal) {
            fetchProjects();
        }
    }, [showCreateTaskModal, state.token, state.user]);

    const handleCreateProject = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}taskmanager/projects/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${state.token}`,
                },
                body: JSON.stringify({ name: projectName }),
            });
            if (!response.ok) {
                throw new Error('Error al crear proyecto');
            }
            setShowCreateProjectModal(false);
            setProjectName('');
        } catch (error) {
            setError('Ocurrió un error al crear el proyecto');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTask = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const formattedDueDate = dueDate ? format(dueDate, 'yyyy-MM-dd') : null;
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}taskmanager/tasks/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${state.token}`,
                },
                body: JSON.stringify({ title: taskTitle, description: taskDescription, project: selectedProject, due_date: formattedDueDate }),
            });
            if (!response.ok) {
                throw new Error('Error al crear tarea');
            }
            setShowCreateTaskModal(false);
            setTaskTitle('');
            setTaskDescription('');
            setSelectedProject('');
            setDueDate(null);
        } catch (error) {
            setError('Ocurrió un error al crear la tarea');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/" style={{ fontFamily: 'Poppins', fontWeight: 'bold' }}>TaskManager</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={() => setShowCreateProjectModal(true)}>Crear Proyecto</button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={() => setShowCreateTaskModal(true)}>Crear Tarea</button>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`} to="/profile">Perfil</Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Crear Proyecto Modal */}
            <div className={`modal ${showCreateProjectModal ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content bg-dark text-white" style={{ border: '1px solid gray' }}>
                        <div className="modal-header">
                            <h5 className="modal-title">Crear Proyecto</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateProjectModal(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input type="text" className="form-control bg-dark text-white" placeholder="Nombre del Proyecto" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                            {error && <div className="alert alert-danger mt-3">{error}</div>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowCreateProjectModal(false)}>Cerrar</button>
                            <button type="button" className="btn btn-primary" onClick={handleCreateProject} disabled={isLoading || !projectName}>
                                {isLoading ? 'Creando...' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Crear Tarea Modal */}
            <div className={`modal ${showCreateTaskModal ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content bg-dark text-white" style={{ border: '1px solid gray' }}>
                        <div className="modal-header">
                            <h5 className="modal-title">Crear Tarea</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateTaskModal(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input type="text" className="form-control bg-dark text-white mb-3" placeholder="Título de la Tarea" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
                            <input type="text" className="form-control bg-dark text-white mb-3" placeholder="Descripción de la Tarea" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
                            <select className="form-control bg-dark text-white mb-3" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                                <option value="" disabled>Seleccionar un proyecto</option>
                                {projects.map(project => (
                                    <option key={project.id} value={project.id}>{project.name}</option>
                                ))}
                            </select>
                            <div className="mb-3">
                                <label htmlFor="dueDate" className="form-label">Fecha Límite</label>
                                <DatePicker
                                    id="dueDate"
                                    selected={dueDate}
                                    onChange={(date) => setDueDate(date)}
                                    className="form-control bg-dark text-white"
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Seleccionar fecha límite"
                                />
                            </div>
                            {error && <div className="alert alert-danger mt-3">{error}</div>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowCreateTaskModal(false)}>Cerrar</button>
                            <button type="button" className="btn btn-primary" onClick={handleCreateTask} disabled={isLoading || !taskTitle || !selectedProject}>
                                {isLoading ? 'Creando...' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;