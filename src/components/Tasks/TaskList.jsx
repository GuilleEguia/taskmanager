import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPriorityEmoji } from '../../utils/taskUtils';

const TaskList = () => {
    const { state } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [statusChanged, setStatusChanged] = useState(false);
    const [page, setPage] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}taskmanager/tasks/?page=${page}`, {
                    headers: {
                        Authorization: `Token ${state.token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Error al obtener tareas');
                }
                const data = await response.json();
                const filteredTasks = data.results.filter(task => task.owner === state.user.user__id);
                setTasks(filteredTasks);
                setNextPage(data.next);
                setPreviousPage(data.previous);
            } catch (error) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (state.isAuthenticated && state.token && state.user) {
            fetchTasks();
        }
    }, [state.token, state.isAuthenticated, state.user, page]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleEdit = (task) => {
        setEditingTask(task);
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
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.status || 'Error al actualizar tarea');
            }
            setTasks(tasks.map(t => t.id === task.id ? task : t));
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
            setEditingTask({ ...updatedTask, status: newStatus });
            setStatusChanged(true);
        }
    };

    const handleCancel = () => {
        setEditingTask(null);
        setStatusChanged(false);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0) {
            setPage(newPage);
        }
    };

    if (isLoading) return <div>Cargando...</div>;
    if (isError) return <div>Error al cargar tareas</div>;

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-dark" style={{ overflow: 'hidden' }}>
            <div className="card bg-dark text-white" style={{ width: '80%' }}>
                <div className="card-header text-center">
                    <h1 className="display-6" style={{ fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 'bold' }}>Lista de Tareas 📑</h1>
                </div>
                <div className="card-body">
                    <table className="table table-dark table-striped table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: '5%' }} className="text-center">ID</th>
                                <th style={{ width: '5%' }} className="text-center">Urgencia</th>
                                <th style={{ width: '5%' }} className="text-center">Estado</th>
                                <th style={{ width: '20%' }}>Título</th>
                                <th style={{ width: '30%' }}>Descripción</th>
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
                                    <td className="text-center">{new Date(task.updated_at).toLocaleDateString()}</td>
                                    <td className="text-center">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</td>
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
                    <div className="d-flex justify-content-center mt-3">
                        <button
                            className="btn btn-outline-primary me-2"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={!previousPage}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={!nextPage}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskList;