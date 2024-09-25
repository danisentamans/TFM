const Order = require("../models/Order");
const User = require("../models/User");
const { sendEmail } = require("../utils/email");
const { sendWhatsApp } = require("../utils/whatsapp");
const dotenv = require("dotenv");

dotenv.config();

// Crear nuevo pedido
exports.createOrder = async (req, res) => {
  const { items, totalPrice } = req.body;
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId);
    const newOrder = new Order({
      user: userId,
      items,
      totalPrice,
      status: "Elaborando",
    });
    await newOrder.save();

    const message = `Nuevo pedido de ${user.firstName} ${
      user.lastName
    }:\n${items
      .map((item) => `${item.product}: ${item.quantity}`)
      .join("\n")}\nTotal: €${totalPrice}`;

    // Enviar email al administrador
    await sendEmail(process.env.ADMIN_EMAIL, "Nuevo Pedido", message);

    // Enviar WhatsApp si hay número de teléfono
    if (user.phone) {
      await sendWhatsApp(process.env.ADMIN_NUMBER_PHONE, message);
    }

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.getAllOrders = async (req, res) => {
    const userId = req.user.userId;
  try {
    var orders = [];
    const user = await User.findById(userId);
    if (user.role !== "admin"){
        orders = await Order.find({user: req.user.userId, status: { $ne: "Elaborando"}});
    }
    else{
        orders = await Order.find();
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener todos los pedidos (diferenciando roles)
exports.getOrders = async (req, res) => {
  const userId = req.user.userId;
  const { status } = req.query;

  try {
    const user = await User.findById(userId);
    let query = {};

    if (user.role === "admin") {
      // Si el usuario es administrador, permitir filtrar por status
      query = status ? { status } : {};
    } else {
      // Si es usuario normal, obtener solo sus pedidos no recogidos
      query = {
        user: userId,
        status: { $ne: "Recogido" }
      };
    }

    const orders = await Order.find(query);
    return res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};


// Obtener pedido por ID
exports.getOrdersById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { items, totalPrice } = req.body; // Recibimos totalPrice
  const userId = req.user.userId;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Verificar si el pedido está en estado "Elaborando"
    if (order.status !== "Elaborando") {
      return res
        .status(403)
        .json({
          message:
            "No se puede editar un pedido que ya está marcado como hecho o recogido",
        });
    }

    // Actualizar los items y el totalPrice
    order.items = items;
    order.totalPrice = totalPrice;
    const updatedOrder = await order.save();

    const user = await User.findById(userId);

    const message = `Pedido actualizado de ${user.firstName} ${
      user.lastName
    }:\n${items
      .map((item) => `${item.product}: ${item.quantity}`)
      .join("\n")}\nTotal: €${totalPrice}`;

    // Enviar email al administrador
    await sendEmail(process.env.ADMIN_EMAIL, "Pedido Actualizado", message);

    // Enviar WhatsApp si hay número de teléfono
    if (user.phone) {
      await sendWhatsApp(process.env.ADMIN_NUMBER_PHONE, message);
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Marcar pedido con el estado proporcionado
exports.changeStatus = async (req, res) => {
  const { id, status } = req.params;

  try {
    // Verificar si el estado proporcionado es válido
    const validStatuses = ["Elaborando", "Listo para recoger", "Recogido"]; // Ajusta los estados según tus necesidades
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Verificar si el pedido está en estado "Elaborando" solo si el nuevo estado es diferente
    if (
      order.status === "Listo para recoger" &&
      status === "Listo para recoger"
    ) {
      return res
        .status(400)
        .json({ message: 'El pedido ya está en estado "Listo para recoger"' });
    }

    // Actualizar el estado del pedido
    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Marcar pedido como pagado
exports.markAsPaid = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Verificar si ya está pagado
    if (order.isPaid) {
      return res.status(400).json({ message: "El pedido ya está pagado" });
    }

    // Marcar como pagado
    order.isPaid = true;
    order.paidAt = Date.now(); // Guardar la fecha de pago
    await order.save();

    res.status(200).json({ message: "El pedido ha sido marcado como pagado", order });
  } catch (error) {
    res.status(500).json({ message: "Error al marcar el pedido como pagado", error });
  }
};


// Eliminar pedido
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    const user = await User.findById(userId);
    const message = `${user.firstName} ${user.lastName} ha eliminado el pedido`;

    // Enviar email al administrador
    await sendEmail(process.env.ADMIN_EMAIL, "Pedido Eliminado", message);

    // Enviar WhatsApp si hay número de teléfono
    if (user.phone) {
      await sendWhatsApp(process.env.ADMIN_NUMBER_PHONE, message);
    }

    res.status(200).json({ message: "Pedido eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};
