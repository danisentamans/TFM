import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/News.module.css";
import { useNavigate } from "react-router-dom";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/news");
        setNews(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching news");
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const response = await axios.get(
            "http://localhost:5000/api/users/me",
            config
          );
          setIsAdmin(response.data.role === "admin");
        } catch (error) {
          setError("Error fetching user role");
        }
      }
    };
    fetchUserRole();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`http://localhost:5000/api/news/${id}`, config);
      setNews(news.filter((n) => n._id !== id));
    } catch (error) {
      setError("Error deleting news");
    }
  };

  const handleEditClick = (id) => {
    navigate(`/news/edit/${id}`);  // Redirige a la página de edición
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles["news-container"]}>
        <h2>Noticias</h2>
        {isAdmin && (
          <button>
          <Link className={styles["news-link"]} to="/news/new">
            Nueva Noticia
          </Link>
          </button>
        )}
        <ul className={styles.ul}>
          {news.map((n) => (
            <li key={n._id}>
              <h3>{n.title}</h3>
              <p>{n.description}</p>
              <img
                src={n.image}
                alt={n.title}
                className={styles["news-image"]}
              />
              {isAdmin && (
                <div className={styles.buttons}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditClick(n._id)}  // Usa el handler de navegación
                  >
                    Editar
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(n._id)}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default News;
