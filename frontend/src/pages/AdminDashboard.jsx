import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AdminDashboard.module.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all users
        const fetchUsers = async () => {
            if (user && user.token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    };
                    const response = await axios.get('http://localhost:5000/api/users', config);
                    setUsers(response.data);
                } catch (error) {
                    console.error('Error fetching users', error);
                }
            }
        };

        fetchUsers();
    }, [user]);

    const handleDelete = async (userId) => {
        if (user && user.token) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };
                await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
                setUsers(users.filter(user => user._id !== userId));
            } catch (error) {
                console.error('Error deleting user', error);
            }
        }
    };

    const handleUpdateToAdmin = async (username) => {
        if (user && user.token) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };
                await axios.put(`http://localhost:5000/api/users/${username}/update-to-admin`, {}, config);
                setUsers(users.map(user => user.username === username ? { ...user, role: 'admin' } : user));
            } catch (error) {
                console.error('Error updating user to admin', error);
            }
        }
    };

    const handleEdit = (userId) => {
        navigate(`/admin/edit/${userId}`);
    };

    return (
        <div className={styles.container}>
            <h2>Panel del administrador</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Suscrito</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.receiveNews ? 'Sí' : 'No'}</td>
                            <td>
                                <div className={styles.actions}>
                                <button onClick={() => handleEdit(user._id)}>Editar</button>
                                <button onClick={() => handleDelete(user._id)}>Eliminar</button>
                                {user.role !== 'admin' && (
                                    <button onClick={() => handleUpdateToAdmin(user.username)}>Hacer Admin</button>
                                )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
