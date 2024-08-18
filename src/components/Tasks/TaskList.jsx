import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPriorityEmoji } from '../../utils/taskUtils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';

const TaskList = () => {
    const { state, actions } = useAuth();
    const [tasks, setTasks] = useState(state.tasks);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [statusChanged, setStatusChanged] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const totalCountResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}taskmanager/tasks/`, {
                    headers: {
                        Authorization: `Token ${state.token}`,
                    },
                });
                if (!totalCountResponse.ok) {
                    throw new Error('Error al obtener el conteo de tareas');
                }
                const totalCountData = await totalCountResponse.json();
                setTotalCount(totalCountData.count);

                const totalCountProjects = await fetch(`${import.meta.env.VITE_API_BASE_URL}taskmanager/projects/`, {
                    headers: {
                        Authorization: `Token ${state.token}`,
                    },
                })
                if (!totalCountProjects.ok) {
                    throw new Error('Error al obtener el conteo de proyectos');
                }
                const totalCountPjs = await totalCountProjects.json();

                const tasksResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}taskmanager/tasks/?page=1&page_size=${totalCountData.count}`, {
                    headers: {
                        Authorization: `Token ${state.token}`,
                    },
                });
                if (!tasksResponse.ok) {
                    throw new Error('Error al obtener tareas');
                }
                const tasksData = await tasksResponse.json();
                const filteredTasks = tasksData.results.filter(task => task.owner === state.user.user__id);
                setTasks(filteredTasks);
                actions.setTasks(filteredTasks);

                const projectsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}taskmanager/projects/?page=1&page_size=${totalCountPjs.count}`, {
                    headers: {
                        Authorization: `Token ${state.token}`,
                    },
                });
                if (!projectsResponse.ok) {
                    throw new Error('Error al obtener proyectos');
                }
                const projectsData = await projectsResponse.json();
                const filteredProjects = projectsData.results.filter(proj => proj.owner === state.user.user__id);
                setProjects(filteredProjects);
            } catch (error) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (state.isAuthenticated && state.token && state.user) {
            fetchData();
        }
    }, [state.token, state.isAuthenticated, state.user]);

    useEffect(() => {
        setTasks(state.tasks);
    }, [state.tasks]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const getProjectName = (projectId) => {
        const project = projects.find(proj => proj.id === projectId);
        return project ? project.name : 'S/P';
    };

    const formatDate = (dateString) => {
        return format(parseISO(dateString), 'yyyy-MM-dd');
    };

    const handleEdit = (task) => {
        setEditingTask({ ...task, due_date: task.due_date ? parseISO(task.due_date) : null });
        setStatusChanged(false);
    };

    const handleUpdate = async (task) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}taskmanager/tasks/${task.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${state.token}`,
                },
                body: JSON.stringify({
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    project: task.project,
                    assigned_to: task.assigned_to,
                    due_date: task.due_date ? format(task.due_date, 'yyyy-MM-dd') : null,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.status || 'Error al actualizar tarea');
            }
            setTasks(tasks.map(t => t.id === task.id ? { ...task, due_date: task.due_date ? format(task.due_date, 'yyyy-MM-dd') : null } : t));
            setEditingTask(null);
            setStatusChanged(false);
        } catch (error) {
            setIsError(true);
            console.error('Error al actualizar tarea:', error);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}taskmanager/tasks/${taskId}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Token ${state.token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error al eliminar tarea');
            }
            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (error) {
            setIsError(true);
        }
    };

    const handleStatusChange = async (taskId, status) => {
        const updatedTask = tasks.find(task => task.id === taskId);
        if (updatedTask) {
            const newStatus = status ? 48 : 49;
            setEditingTask({ ...updatedTask, status: newStatus, due_date: updatedTask.due_date ? parseISO(updatedTask.due_date) : null });
            setStatusChanged(true);
        }
    };

    const handleCancel = () => {
        setEditingTask(null);
        setStatusChanged(false);
    };

    if (isLoading) return <div>Cargando...</div>;
    if (isError) return <div>Error al cargar tareas</div>;

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-dark" style={{ overflow: 'hidden' }}>
            <div className="card bg-dark text-white" style={{ width: '90%' }}>
                <div className="card-header text-center">
                    <h1 className="display-6" style={{ fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 'bold' }}>Lista de Tareas 📑</h1>
                </div>
                <div className="card-body">
                    <div style={{ maxHeight: '500px', overflow: 'hidden' }}>
                        <table className="table table-dark table-striped table-hover" style={{ maxHeight: '500px', overflowY: 'auto', display: 'block', width: '100%' }}>
                            <thead>
                                <tr>
                                    <th style={{ width: '5%' }} className="text-center">ID</th>
                                    <th style={{ width: '5%' }} className="text-center">Urgencia</th>
                                    <th style={{ width: '5%' }} className="text-center">Estado</th>
                                    <th style={{ width: '15%' }}>Título</th>
                                    <th style={{ width: '25%' }}>Descripción</th>
                                    <th style={{ width: '10%' }}>Proyecto</th>
                                    <th style={{ width: '15%' }} className="text-center">Actualizado En</th>
                                    <th style={{ width: '15%' }} className="text-center">Fecha Límite</th>
                                    <th style={{ width: '10%' }} className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.id} style={{ height: '50px' }}>
                                        <td className="text-center">{task.id}</td>
                                        <td className="text-center">{getPriorityEmoji(task)}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center">
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={editingTask?.id === task.id ? editingTask.status === 48 : task.status === 48}
                                                        onChange={(e) => handleStatusChange(task.id, e.target.checked)}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {editingTask?.id === task.id ? (
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-white"
                                                    value={editingTask.title}
                                                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            ) : (
                                                task.title
                                            )}
                                        </td>
                                        <td>
                                            {editingTask?.id === task.id ? (
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-white"
                                                    value={editingTask.description}
                                                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            ) : (
                                                task.description
                                            )}
                                        </td>
                                        <td>{getProjectName(task.project)}</td>
                                        <td className="text-center">{formatDate(task.updated_at)}</td>
                                        <td className="text-center">
                                            {editingTask?.id === task.id ? (
                                                <DatePicker
                                                    selected={editingTask.due_date}
                                                    onChange={(date) => setEditingTask({ ...editingTask, due_date: date })}
                                                    className="form-control bg-dark text-white"
                                                    dateFormat="yyyy-MM-dd"
                                                    placeholderText="Seleccionar fecha límite"
                                                />
                                            ) : (
                                                task.due_date ? task.due_date : 'N/A'
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center">
                                                {editingTask?.id === task.id || statusChanged ? (
                                                    <>
                                                        <button className="btn btn-success btn-sm me-2" style={{ width: '60px' }} onClick={() => handleUpdate(editingTask)}>
                                                            <i className="fas fa-save"></i>
                                                        </button>
                                                        <button className="btn btn-secondary btn-sm" style={{ width: '60px' }} onClick={handleCancel}>
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button className="btn btn-primary btn-sm me-2" style={{ width: '60px' }} onClick={() => handleEdit(task)}>
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button className="btn btn-danger btn-sm" style={{ width: '60px' }} onClick={() => handleDelete(task.id)}>
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskList;