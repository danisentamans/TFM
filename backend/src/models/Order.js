const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true }, // Precio total del pedido
    status: { type: String, enum: ['Elaborando', 'Listo para recoger', 'Recogido'], default: 'Elaborando' },
    createdAt: { type: Date, default: Date.now },
    isPaid: { type: Boolean, default: false }, // Indica si el pedido ha sido pagado
    paidAt: { type: Date }, // Fecha en la que se realizó el pago
});

module.exports = mongoose.model('Order', orderSchema);
