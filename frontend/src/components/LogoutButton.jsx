import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LogoutButton = () => {
    const { setUser } = useAuth(); // Obtener el usuario del contexto de autenticación
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return <Link to="/Login" onClick={handleLogout}>Cerrar sesión</Link>;
};

export default LogoutButton;
