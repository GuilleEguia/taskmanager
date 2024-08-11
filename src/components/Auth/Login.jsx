import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { actions } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}api-auth/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                actions.login(data.token);
            } else {
                setError(data.detail || 'Error de inicio de sesión');
            }
        } catch (error) {
            setError('Ocurrió un error durante el inicio de sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-dark">
            <div className="card bg-dark text-white" style={{ width: '25rem' }}>
                <div className="card-header text-center">
                    <h1 className="display-5" style={{ fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 'bold' }}>TaskManager</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Nombre de Usuario</label>
                            <input type="text" className="form-control bg-dark text-white" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input type="password" className="form-control bg-dark text-white" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={isLoading || !username || !password}>
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;