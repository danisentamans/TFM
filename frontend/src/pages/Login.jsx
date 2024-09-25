import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Register.module.css';
import hornoLogin from '../assets/images/logo.jpg';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
            const { token } = response.data;
            localStorage.setItem('token', token);
            setUser({ token });
            navigate('/')
        } catch (error) {
            console.error('Error logging in', error);
            alert('Invalid credentials');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img src={hornoLogin} alt="Descripción de la imagen" />
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>Iniciar sesión</h2>
                <input type="text" name="username" placeholder="Usuario" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
                <button type="submit">Iniciar sesión</button>
                <p>¿No tienes una cuenta? <Link to="/register"> Regístrate</Link></p>
            </form>
        </div>
    );
};

export default Login;
