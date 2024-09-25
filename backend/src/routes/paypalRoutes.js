// /routes/paypalRoutes.js
const express = require('express');
const { createOrder, captureOrder } = require('../controllers/paypalController');

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/capture-order', captureOrder);

module.exports = router;
