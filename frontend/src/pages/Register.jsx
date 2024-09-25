import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Register.module.css";
import hornoLogin from '../assets/images/logo.jpg';

const countryCodes = {
  España: "+34",
  Alemania: "+49",
  Francia: "+33",
  Italia: "+39",
  "Reino Unido": "+44",
};

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    receiveNews: false,
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    countryCode: "+34",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullPhone = formData.countryCode + formData.phone;
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        ...formData,
        phone: fullPhone,
      });
      navigate("/login");
    } catch (error) {
      console.error("Error registering", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
      <img src={hornoLogin} alt="Descripción de la imagen" />
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Registrarse</h2>
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={formData.username}
            onChange={handleChange}
            required
          />
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
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.fullWidth}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.fullWidth}
          />
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            required
          >
            {Object.entries(countryCodes).map(([country, code]) => (
              <option key={country} value={code}>
                {country} ({code})
              </option>
            ))}
          </select>
          <input
            type="text"
            name="phone"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dateOfBirth"
            placeholder="Fecha de nacimiento"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
          <label className={styles.fullWidth}>
            <input
              type="checkbox"
              name="receiveNews"
              checked={formData.receiveNews}
              onChange={handleChange}
            />
            Recibir las últimas novedades
          </label>
        <button type="submit">Registrarse</button>
        <p>¿Ya tienes una cuenta?  <Link to="/login"> Inicia sesión </Link></p>
      </form>
    </div>
  );
};

export default Register;
