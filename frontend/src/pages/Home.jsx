import styles from '../styles/Home.module.css';
import ImageCarousel from '../components/ImageCarousel';
import logo from '../assets/images/logo.jpg';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
            <div className={styles.content}>
                <div className={styles.leftSection}>
                    <div className={styles.logoContainer}>
                        <img src={logo} alt="Logo del horno" className={styles.logoImage} />
                    </div>
                    <div className={styles.textContainer}>
                        {/* <h1 className={styles.title}>Horno Tradicional</h1> */}
                        <p className={styles.subtitle}>
                            El sabor de siempre, hecho con amor y dedicación.
                        </p>
                        <p className={styles.description}>
                            Ven a descubrir nuestros productos frescos y artesanales.
                        </p>
                        
                        <Link className={styles.ctaButton} to="/register">¡Regístrate!</Link>
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <ImageCarousel />
                </div>
            </div>
    );
};

export default Home;
