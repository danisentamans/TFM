import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/NewsForm.module.css';

const NewsForm = () => {
    const [formData, setFormData] = useState({ title: '', description: '', image: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        if (id) {
            const fetchNews = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`http://localhost:5000/api/news/${id}`);
                    setFormData(response.data);
                    setLoading(false);
                } catch (error) {
                    setError('Error fetching news');
                    setLoading(false);
                }
            };
            fetchNews();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            if (id) {
                await axios.put(`http://localhost:5000/api/news/${id}`, formData, config);
            } else {
                await axios.post('http://localhost:5000/api/news', formData, config);
            }
            navigate('/news');
        } catch (error) {
            setError('Error saving news');
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>{id ? 'Actualizar' : 'Nueva'} Noticia</h2>
                {error && <p className={styles.error}>{error}</p>}
                <input
                    type="text"
                    name="title"
                    placeholder="Título"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Descripción"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="image"
                    placeholder="Enlace imagen (URL)"
                    value={formData.image}
                    onChange={handleChange}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Cargando...' : id ? 'Actualizar' : 'Crear'} Noticia
                </button>
            </form>
        </div>
    );
};

export default NewsForm;
