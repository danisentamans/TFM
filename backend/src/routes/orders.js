const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrder, deleteOrder, getOrdersById, changeStatus, markAsPaid, getAllOrders } = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

router.post('/', auth, createOrder);
router.get('/all', auth, getAllOrders);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrdersById);
router.put('/:id/paid', auth, markAsPaid);
router.put('/:id/:status', auth, changeStatus);
router.put('/:id', auth, updateOrder);
router.delete('/:id', auth, deleteOrder);

module.exports = router;
