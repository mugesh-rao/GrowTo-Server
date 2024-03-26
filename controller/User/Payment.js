const axios = require('axios');
require('dotenv').config();

// Utility function to create a centralized Axios instance
const createCashfreeApi = () => {
  return axios.create({
    baseURL: process.env.CASHFREE_API_ENDPOINT,
    headers: {
      "Content-Type": "application/json",
      "x-api-version": "2023-08-01",
      "x-client-id": process.env.CASHFREE_APP_ID,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
    },
  });
};

const cashfreeApi = createCashfreeApi();

// Utility function for handling Cashfree API responses
const handleApiResponse = (response, res) => {
  if (response.status === 200 && response.data.status === 'OK') {
    res.json({ success: true, data: response.data });
  } else {
    res.status(response.status).json({ success: false, message: response.data.message || 'Cashfree API error' });
  }
};

// Enhanced error handler to interpret different error scenarios
const handleError = (error, res) => {
  if (error.response) {
    res.status(error.response.status).json({ success: false, message: error.response.data.message });
  } else if (error.request) {
    res.status(503).json({ success: false, message: 'Cashfree API is unreachable' });
  } else {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Function to initiate a payment with Cashfree
const initiateCashfreePayment = async (req, res) => {
  const { amount, orderId, orderNote, customerName, customerPhone, customerEmail } = req.body;
  const data = {
    orderId, orderAmount: amount, orderCurrency: 'INR', orderNote, customerName, customerEmail, customerPhone,
    returnUrl: 'http://growto.in/thank-you',
    notifyUrl: 'http://growto.in/orders',
  };

  try {
    const response = await cashfreeApi.post('/cftoken/order', data);
    handleApiResponse(response, res);
  } catch (error) {
    handleError(error, res);
  }
};

// Function to create a Cashfree order
const createCashfreeOrder = async (req, res) => {
  const { userId, amount, currency = "INR", customerDetails } = req.body;
  const data = { order_id: `Order_${Date.now()}`, order_amount: amount, order_currency: currency, customer_details: customerDetails };

  try {
    const response = await cashfreeApi.post('/orders', data);
    handleApiResponse(response, res);
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = { initiateCashfreePayment, createCashfreeOrder };
