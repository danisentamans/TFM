import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/OrderList.module.css";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [orderInProgress, setOrderInProgress] = useState(false); // Estado para el loading de pedido
  const navigate = useNavigate();
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
        } catch (error) {
          console.error("Error fetching user role", error);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders/all", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(response.data);
      } catch (error) {
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders(); // Initial fetch

    // Set up interval to fetch orders every minute
    const intervalId = setInterval(fetchOrders, 60000); // 60000 ms = 1 minute

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [user.token]);

  const handleSubmit = async (orderItems, orderPrice) => {
    try {
      setOrderInProgress(true); // Iniciar la animación de carga
      // Simular la espera de 3 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderToSubmit = {
        items: orderItems,
        totalPrice: orderPrice,
      };
      
      // Realizar la solicitud POST con la orden seleccionada
      await axios.post("http://localhost:5000/api/orders", orderToSubmit, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setOrderInProgress(false); // Detener la animación de carga
      setPopupVisible(true); // Mostrar el popup de confirmación
    } catch (error) {
      console.error("Error creando el pedido, realice uno de nuevo por favor.", error);
      setError("Error creando el pedido, realice uno de nuevo por favor.");
    }
  };

  const handleAccept = () => {
    setPopupVisible(false);
    navigate("/orders");
  };

  if (loading) return <p className={styles.loading}>Cargando historial...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.containerOrders}>
      {users.role === "user" ?
        <h2 className={styles.title}>Historial de pedidos</h2>
        : <h2 className={styles.title}>Pedidos</h2>}
      <ul className={styles.orderList}>
        {orders.map((order) => (
          <li key={order._id} className={styles.orderItem}>
            <ul className={styles.itemList}>
              {order.items.map((item, index) => (
                <li key={index} className={styles.item}>
                  {item.product} - {item.quantity}
                </li>
              ))}
            </ul>
            <p className={styles.total}>Total: {order.totalPrice}€</p>
            {users.role === "user" ? 
              <div className={styles.buttons}>
              <button
                onClick={() => handleSubmit(order.items, order.totalPrice)}
                className={styles.submitButton}
              >
                Volver a pedir
              </button>
            </div>
            : null}
          </li>
        ))}
      </ul>

      {/* Mostrar el popup mientras se realiza el pedido */}
      {orderInProgress && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {/* Mostrar el popup de confirmación cuando se complete el pedido */}
      {popupVisible && (
        <div className={styles.popup}>
          <p>¡Pedido realizado! Gracias por volver a confiar en nosotros.</p>
          <button onClick={handleAccept} className={styles.acceptButton}>
            Aceptar
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderList;
