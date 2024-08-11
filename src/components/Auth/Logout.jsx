import { useAuth } from '../../context/AuthContext';

const Logout = () => {
    const { actions } = useAuth();

    const handleLogout = () => {
        actions.logout();
    };

    return (
        <button className="btn btn-danger" onClick={handleLogout}>Salir</button>
    );
};

export default Logout;