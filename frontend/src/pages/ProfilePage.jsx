import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/ProfilePage.module.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const { user: currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        receiveNews: false
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
                setUser(response.data);
                setFormData({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    phone: response.data.phone,
                    email: response.data.email,
                    receiveNews: response.data.receiveNews
                });
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        if (currentUser) {
            fetchUserData();
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:5000/api/users/me', formData, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
            setUser({ ...user, ...formData });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user data', error);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Perfil de Usuario</h2>
            {user && (
                <div>
                    <p>Nombre de usuario: {user.username}</p>
                    {isEditing ? (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="Nombre"
                                placeholder="First Name"
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
                                <input
                                    type="checkbox"
                                    name="receiveNews"
                                    checked={formData.receiveNews}
                                    onChange={handleChange}
                                />
                                Recibir las últimas novedades
                            </label>
                            <button type="submit">Guardar cambios</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                        </form>
                    ) : (
                        <div>
                            <p>Nombre: {user.firstName} {user.lastName}</p>
                            <p>Teléfono: {user.phone}</p>
                            <p>Correo electrónico: {user.email}</p>
                            <p>Fecha de nacimiento: {new Date(user.dateOfBirth).toLocaleDateString()}</p>
                            <p>Recibir noticias: {user.receiveNews ? 'Sí' : 'No'}</p>
                            <p>Rol: {user.role}</p>
                            <p>Fecha de registro: {new Date(user.createdAt).toLocaleDateString()}</p>
                            <button onClick={() => setIsEditing(true)}>Editar Perfil</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
