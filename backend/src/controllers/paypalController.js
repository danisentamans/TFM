// /controllers/paypalController.js
const Payment = require('../models/Pay');
const { client } = require('../utils/paypal');
const paypal = require('@paypal/checkout-server-sdk');

exports.createOrder = async (req, res) => {
  const { total } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'EUR',
        value: total.toFixed(2),
      },
    }],
  });

  try {
    const order = await client.execute(request);
    const payment = new Payment({
      orderId: order.result.id,
      status: order.result.status,
      totalAmount: total,
    });
    await payment.save();
    res.status(201).json({ id: order.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

exports.captureOrder = async (req, res) => {
  const { orderId } = req.body;

  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await client.execute(request);
    await Payment.findOneAndUpdate(
      { orderId },
      { status: capture.result.status }
    );
    res.json({ status: 'Payment captured', details: capture.result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to capture payment' });
  }
};
