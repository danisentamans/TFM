const paypal = require('@paypal/checkout-server-sdk');

// Crea un nuevo entorno sandbox o live, según sea necesario
let environment = new paypal.core.SandboxEnvironment('AZxXcC3pSG7CcLcHFKX8vdbHlhd_Zha9cVWESPG-p99YHDDzUOw9jrzD6h7HuNj_gMNNpQymUBMJUVfE', 'EJwYgCDV7YXMHVdFVYyCAzJI6dsXjS2sjR5Jfz1j6ufibJG2Lf8YwJEpW2S0jNcksMoqhoIiv3CIJi0L');
let client = new paypal.core.PayPalHttpClient(environment);

const OrdersCreateRequest = paypal.orders.OrdersCreateRequest;
const OrdersCaptureRequest = paypal.orders.OrdersCaptureRequest;

module.exports = { client, OrdersCreateRequest, OrdersCaptureRequest };