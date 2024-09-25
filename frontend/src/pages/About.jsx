import { useEffect } from "react";
import styles from '../styles/About.module.css';

export default function About() {
    useEffect(() => {
        if (!window.FB) {
            const script = document.createElement("script");
            script.src = "https://connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v12.0";
            script.async = true;
            script.crossOrigin = 
            script.onload = () => {
                window.FB.XFBML.parse(); // Inicializa el widget una vez cargado
            };
            document.body.appendChild(script);
        } else {
            window.FB.XFBML.parse(); // Inicializa el widget si ya está cargado
        }
    }, []);

    return (
        <>
            <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>¿QUIÉNES SOMOS?</h1>
            </div>
                <p>
                    Somos un horno familiar con años de tradición, dedicados a ofrecer productos artesanales de la más alta calidad. A través de nuestra nueva plataforma digital, queremos acercarnos más a ti, facilitando la realización de pedidos online y manteniéndote informado sobre nuestras últimas novedades. Nuestra pasión es hornear, y tu satisfacción es nuestro objetivo.
                </p>
                <div className={styles.ubicacionFacebookContainer}>
                    <div className={styles.ubicacionContainer}>
                        <h2 className={styles.subtitle}>Dónde encontrarnos</h2>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1745.4361979841674!2d-0.4769464343048173!3d39.188623755328614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd61af29b1da5003%3A0xf8a1a62a02f634dd!2sPa%20I%20Dol%C3%A7%20Forn%20Artesanal!5e1!3m2!1ses!2ses!4v1726244864856!5m2!1ses!2ses"
                            width="600"
                            height="450"
                            style={{ border: '0', borderRadius: '10px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className={styles.ubicacionIframe}
                        ></iframe>
                    </div>
                    <div className={styles.facebookWidget}>
                        <div className="fb-page"
                            data-href="https://www.facebook.com/forngranvia"
                            data-tabs="timeline"
                            data-width="340"
                            data-height="500"
                            data-small-header="false"
                            data-adapt-container-width="true"
                            data-hide-cover="false"
                            data-show-facepile="true">
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
