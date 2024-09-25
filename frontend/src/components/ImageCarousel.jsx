import { useState, useEffect } from 'react';
import styles from '../styles/ImageCarousel.module.css';
import image1 from '../assets/images/image1.jpg';
import image2 from '../assets/images/image2.jpg';
import image3 from '../assets/images/image3.jpg';
import image4 from '../assets/images/image4.jpg';
import image5 from '../assets/images/image5.jpg';
import image6 from '../assets/images/image6.jpg';
import image7 from '../assets/images/image7.jpg';
import image8 from '../assets/images/image8.jpg';
import image9 from '../assets/images/image9.jpg';

const ImageCarousel = () => {
    const images = [
        { src: image1, alt: 'Pan artesanal recién horneado' },
        { src: image2, alt: 'Horno tradicional con fuego' },
        { src: image3, alt: 'Variedad de panes en la mesa' },
        { src: image4, alt: 'Pan artesanal recién horneado' },
        { src: image5, alt: 'Horno tradicional con fuego' },
        { src: image6, alt: 'Variedad de panes en la mesa' },
        { src: image7, alt: 'Pan artesanal recién horneado' },
        { src: image8, alt: 'Horno tradicional con fuego' },
        { src: image9, alt: 'Variedad de panes en la mesa' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Cambia la imagen cada 5 segundos
        return () => clearInterval(interval); // Limpieza del intervalo
    }, [images.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className={styles.carouselContainer}>
            <div
                className={styles.carousel}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div className={styles.slide} key={index}>
                        <img src={image.src} alt={image.alt} />
                    </div>
                ))}
            </div>
            <button className={styles.prevButton} onClick={goToPrevious}>
                &#10094;
            </button>
            <button className={styles.nextButton} onClick={goToNext}>
                &#10095;
            </button>
            <div className={styles.indicators}>
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
