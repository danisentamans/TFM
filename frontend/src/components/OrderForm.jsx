import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/OrderForm.module.css";
import imageCroissant from "/images/products/croissant.jpeg";
import imagePalmera from "/images/products/palmera-chocolate.jpg";
import imageEnsaimada from "/images/products/ensaimada.png";
import imagePanDeCereales from "/images/products/pan-cereales.jpg";
import imagePanIntegral from "/images/products/pan-integral.jpg";
import imagePanDeCenteno from "/images/products/pan-centeno.jpg";
import imagePanNormal from "/images/products/pan-normal.jpg";
import imageTarta from "/images/products/tarta.webp";
import imageHojaldres from "/images/products/hojaldre.jpg";
import imageTiramisu from "/images/products/tiramisu.webp";

const productPrices = {
  bolleria: {
    Croissant: 2,
    "Palmera de chocolate": 2.5,
    Ensaimada: 3,
  },
  pan: {
    "Pan De cereales": 1.5,
    "Pan Integral": 1.8,
    "Pan de Centeno": 2,
    "Pan Normal": 1.2,
  },
  dulces: {
    Tarta: 15,
    Hojaldres: 5,
    Tiramisú: 8,
  },
};

const OrderForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderData, setOrderData] = useState({
    items: [{ product: "", quantity: 1, image: "" }],
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [orderInProgress, setOrderInProgress] = useState(false);

  const productOptions = {
    bolleria: Object.keys(productPrices.bolleria),
    pan: Object.keys(productPrices.pan),
    dulces: Object.keys(productPrices.dulces),
  };

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/orders/${id}`,
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );
          setOrderData({ items: response.data.items });
        } catch (error) {
          console.error("Error fetching order", error);
          setError("Error fetching order");
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [id, user.token]);

  useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      orderData.items.forEach((item) => {
        const productPrice =
          productPrices.bolleria[item.product] ||
          productPrices.pan[item.product] ||
          productPrices.dulces[item.product] ||
          0;
        total += productPrice * item.quantity;
      });
      setTotalPrice(total);
    };

    calculateTotalPrice();
  }, [orderData]);

  const handleAccept = () => {
    setPopupVisible(false);
    navigate("/orders");
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...orderData.items];
    
    // Convertir el valor a número
    let newValue = value;

    if (name === 'quantity') {
        newValue = Math.max(1, parseInt(value));  // Si el valor es menor que 1, lo establece a 1
    }

    newItems[index] = { ...newItems[index], [name]: newValue };
    setOrderData({ ...orderData, items: newItems });

    if (name === "product") {
        const productImageMap = {
            'Croissant': imageCroissant,
            'Palmera de chocolate': imagePalmera,
            'Ensaimada': imageEnsaimada,
            'Pan De cereales': imagePanDeCereales,
            'Pan Integral': imagePanIntegral,
            'Pan de Centeno': imagePanDeCenteno,
            'Pan Normal': imagePanNormal,
            'Tarta': imageTarta,
            'Hojaldres': imageHojaldres,
            'Tiramisú': imageTiramisu,
        };
        newItems[index].image = productImageMap[newValue] || '';
        setOrderData({ ...orderData, items: newItems });
    }
};


  const handleAddItem = () => {
    setOrderData({
      ...orderData,
      items: [...orderData.items, { product: "", quantity: 1, image: "" }],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = [...orderData.items];
    newItems.splice(index, 1);
    setOrderData({ ...orderData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOrderInProgress(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const orderToSubmit = { ...orderData, totalPrice };
      if (id) {
        await axios.put(
          `http://localhost:5000/api/orders/${id}`,
          orderToSubmit,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/orders", orderToSubmit, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
      setOrderInProgress(false);
      setPopupVisible(true);
    } catch (error) {
      console.error(
        "Error creando el pedido, realice uno de nuevo por favor.",
        error
      );
      setError("Error creando el pedido, realice uno de nuevo por favor.");
    }
  };

  if (loading) return <p className={styles.loading}>Cargando...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.orderFormContainer}>
      <form onSubmit={handleSubmit} className={styles.containerForm}>
        <h2>{id ? "Actualizar" : "Nuevo"} Pedido</h2>

        {orderData.items.map((item, index) => (
          <div key={index} className={styles.formGroup}>
            <select
              name="product"
              value={item.product}
              onChange={(e) => handleChange(index, e)}
              required
              className={styles.select}
            >
              <option value="">Seleccione un producto</option>
              <optgroup label="Bollería">
                {productOptions.bolleria.map((product) => (
                  <option key={product} value={product}>
                    {product} - {productPrices.bolleria[product]}€
                  </option>
                ))}
              </optgroup>
              <optgroup label="Pan">
                {productOptions.pan.map((product) => (
                  <option key={product} value={product}>
                    {product} - {productPrices.pan[product]}€
                  </option>
                ))}
              </optgroup>
              <optgroup label="Dulces">
                {productOptions.dulces.map((product) => (
                  <option key={product} value={product}>
                    {product} - {productPrices.dulces[product]}€
                  </option>
                ))}
              </optgroup>
            </select>
            <input
              type="number"
              name="quantity"
              placeholder="Cantidad"
              value={item.quantity}
              onChange={(e) => handleChange(index, e)}
              required
              min="1"
              step="1"
              className={styles.input}
            />
            {item.image && (
              <div className={styles.imageContainer}>
                <img
                  src={item.image}
                  alt="Producto seleccionado"
                  className={styles.productImage}
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className={styles.removeButton}
            >
              Eliminar
            </button>
          </div>
        ))}

        <h3>Total: {totalPrice.toFixed(2)}€</h3>
        <button
          type="button"
          onClick={handleAddItem}
          className={styles.addButton}
        >
          Añadir artículo
        </button>
        <button type="submit" className={styles.submitButton}>
          {id ? "Actualizar" : "Crear"} Pedido
        </button>
      </form>

      {orderInProgress && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {popupVisible && (
        <div className={styles.popup}>
          <p>¡Pedido realizado! Gracias por confiar en nosotros.</p>
          <button onClick={handleAccept} className={styles.acceptButton}>
            Aceptar
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
