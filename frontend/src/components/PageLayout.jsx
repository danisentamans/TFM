import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./Footer";
import styles from "../styles/Navbar.module.css";
import LogoutButton from "./LogoutButton";
import Chatbot from "./Chatbot/Chatbot";

export default function PageLayout() {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState({});

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
                        `http://localhost:5000/api/users/me`,
                        config
                    );
                    setUsers(response.data);
                    if (response.data.role === "admin") {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error("Error fetching user role", error);
                }
            }
        };

        fetchUserRole();
    }, [user]);

    return (
        <>
            <header>
                <nav className={styles.navbar}>
                    <input
                        type="checkbox"
                        id="menu-toggle-checkbox"
                        className={styles.menuToggleCheckbox}
                    />
                    <label htmlFor="menu-toggle-checkbox" className={styles.menuIcon}>
                        &#9776;
                    </label>
                    <ul className={styles.menuItems}>
                        <li>
                            <Link to="/">Forn Pa i Dolç Gran Via</Link>
                        </li>
                        <li>{user ? <Link to="/orders">Pedidos</Link> : null}</li>
                        <li>
                            <Link to="/news">Noticias</Link>
                        </li>
                        <li>
                            <Link to="/about">Sobre nosotros</Link>
                        </li>
                        <li>
                            {user ? (
                                <Link to="/profilePage">Mi perfil</Link>
                            ) : (
                                ""
                            )}
                        </li>
                        <li>
                            {isAdmin && user && (
                                <Link to="/admin">Panel de administración</Link>
                            )}
                        </li>
                        <li>
                            {user && users.firstName && (
                                <>
                                    <span>Bienvenido, {users.firstName}</span> 
                                    <span style={{ marginLeft: "10px" }}></span>
                                    <LogoutButton />
                                </>
                            )}
                            {!user && <Link to="/login">Iniciar sesión</Link>}
                        </li>
                    </ul>
                </nav>
            </header>

            <Outlet />

            <Footer />
            <Chatbot/>
        </>
    );
}
