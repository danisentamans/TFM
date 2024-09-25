import { FaFacebookSquare } from 'react-icons/fa';
import styles from '../styles/Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container_footer}>
                <div className={styles.copyRight}>
                    <a href="https://www.facebook.com/forngranvia/" target="_blank" rel="noopener noreferrer"><FaFacebookSquare /></a>
                    <p>© 2024 Forn Pa i Dolç Gran Via. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
