import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/EditUser.module.css';

const EditUser = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        role: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (user && user.token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    };
                    const response = await axios.get(`http://localhost:5000/api/users/${id}`, config);
                    setFormData(response.data);
                } catch (error) {
                    console.error('Error fetching user', error);
                }
            }
        };

        fetchUser();
    }, [id, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user && user.token) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };
                await axios.put(`http://localhost:5000/api/users/${id}`, formData, config);
                navigate('/admin');
            } catch (error) {
                console.error('Error updating user', error);
            }
        }
    };

    return (
        <div className={styles.container}>
            <h2>Editar Usuario</h2>
            <form onSubmit={handleSubmit} className={styles.formControl}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="Nombre"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Apellidos"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Teléfono"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label>
                    Rol:
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                    </select>
                </label>
                <button type="submit">Guardar cambios</button>
            </form>
        </div>
    );
};

export default EditUser;
