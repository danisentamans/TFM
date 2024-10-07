import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import styles from "../styles/OrderList.module.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const OrderList = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [orderInProgress, setOrderInProgress] = useState(false);
  const navigate = useNavigate();
  const [users, setUsers] = useState({});
  const [filter, setFilter] = useState(""); // Nuevo estado para el filtro

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

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders`, {
        headers: { Authorization: `Bearer ${user.token}` },
        params: { status: filter }, // Pasar el filtro como parámetro
      });
      setOrders(response.data);
    } catch (error) {
      setError("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders`, {
          headers: { Authorization: `Bearer ${user.token}` },
          params: { status: filter }, // Pasar el filtro como parámetro
        });
        setOrders(response.data);
      } catch (error) {
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    const intervalId = setInterval(fetchOrders, 60000); // Fetch orders every minute
    return () => clearInterval(intervalId);
  }, [user.token, filter]); // Dependemos del filtro

  const handleStatus = async (id, status) => {
    try {
      setOrderInProgress(true); // Iniciar la animación de carga
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await axios.put(
        `http://localhost:5000/api/orders/${id}/${status}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setOrderInProgress(false); // Detener la animación de carga
      setPopupVisible(true); // Mostrar el popup de confirmación
    } catch (error) {
      console.error(
        "Error creando el pedido, realice uno de nuevo por favor.",
        error
      );
      setError("Error creando el pedido, realice uno de nuevo por favor.");
    }
  };

  const handleDelete = async (id) => {
    try {
      setOrderInProgress(true); // Iniciar la animación de carga
      // Simular la espera de 3 segundos
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await axios.delete(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(orders.filter((order) => order._id !== id));
      setOrderInProgress(false);
      setPopupVisible(true);
    } catch (error) {
      console.error("Error deleting order", error);
      setError("Error deleting order");
    }
  };

  const handleAccept = async () => {
    setPopupVisible(false);
    // Recargamos la misma página para ver el pedido pagado
    // window.location.reload();
    await fetchOrders();
  };

  const onPayPalSuccess = async (details, orderId) => {
    try {
      console.log("Transaction completed by " + details.payer.name.given_name);

      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/paid`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setPopupVisible(true);
    } catch (error) {
      console.error("Error al procesar el pago", error);
      setError("Error al procesar el pago");
    }
  };

  if (loading) return <p className={styles.loading}>Cargando pedidos...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.containerOrders}>
      <h2 className={styles.title}>Pedidos</h2>
      {users.role === "admin" ? (
        <div className={styles.filters}>
          <button onClick={() => setFilter("")} className={styles.filterButton}>
            Todos
          </button>
          <button
            onClick={() => setFilter("Elaborando")}
            className={styles.filterButton}
          >
            Elaborando
          </button>
          <button
            onClick={() => setFilter("Listo para recoger")}
            className={styles.filterButton}
          >
            Listo para recoger
          </button>
          <button
            onClick={() => setFilter("Recogido")}
            className={styles.filterButton}
          >
            Recogido
          </button>
        </div>
      ) : null}
      {users.role === "admin" ? (
        ""
      ) : (
        <Link to="/order/new" className={styles.newOrderButton}>
          Nuevo pedido
        </Link>
      )}
      {users.role === "admin" ? (
        ""
      ) : (
        <Link to="/history" className={styles.historyButton}>
          Historial
        </Link>
      )}
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
            {users.role === "user" ? (
              <p>
                <span
                  className={order.status === "Elaborando" ? styles.status : ""}
                >
                  {order.status}
                </span>
              </p>
            ) : (
              ""
            )}
            <p className={styles.total}>Total: {order.totalPrice}€</p>
            <div className={styles.buttons}>
              {/* Botones "Editar" y "Eliminar" agrupados horizontalmente */}
              {users.role === "user" && order.status === "Elaborando" && (
                <div className={styles.actionButtons}>
                  <Link
                    to={`/order/edit/${order._id}`}
                    className={styles.editButton}
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className={styles.deleteButton}
                  >
                    Eliminar
                  </button>
                </div>
              )}

              {users.role === "user" && !order.isPaid ? (
                <div className={styles.paypalContainer}>
                  <PayPalScriptProvider
                    options={{
                      "client-id":
                        "AZxXcC3pSG7CcLcHFKX8vdbHlhd_Zha9cVWESPG-p99YHDDzUOw9jrzD6h7HuNj_gMNNpQymUBMJUVfE",
                      currency: "EUR",
                      intent: "capture", // Aseguramos la intención de pago
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: order.totalPrice.toString(),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                          onPayPalSuccess(details, order._id);
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              ) : null}

              {/* Botones adicionales de admin */}
              {users.role === "admin" &&
                (order.status === "Elaborando" ? (
                  <div className={styles.adminButtons}>
                    <button
                      className={styles.doneButton}
                      onClick={() =>
                        handleStatus(order._id, "Listo para recoger")
                      }
                    >
                      Hecho
                    </button>
                  </div>
                ) : order.status === "Listo para recoger" ? (
                  <div className={styles.adminButtons}>
                    <button
                      className={styles.collectedButton}
                      onClick={() => handleStatus(order._id, "Recogido")}
                    >
                      Recogido
                    </button>
                  </div>
                ) : (
                  <div className={styles.adminButtons}>
                    <button className={styles.endButton}>Finalizado</button>
                  </div>
                ))}

              {users.role === "admin" ? (
                <div className={styles.adminButtons}>
                  <button
                    className={
                      order.isPaid
                        ? styles.paidButtonGreen
                        : styles.paidButtonRed
                    }
                  >
                    {order.isPaid ? "Pagado" : "Pendiente de pago"}
                  </button>
                </div>
              ) : null}
            </div>
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
          <p>Cambios procesados...🥐</p>
          <button onClick={handleAccept} className={styles.acceptButton}>
            Aceptar
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderList;
