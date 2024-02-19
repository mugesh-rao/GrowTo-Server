const { Payment } = require('@cashfreepayments/cashfree-sdk');
const { paymentInstance } = require('../../config/cashfree');



async function UPIPayment(req, res) { try {
    const response = await paymentInstance.upi.initiatePayment({
      orderId: req.body.orderId,
      orderAmount: req.body.orderAmount,
      orderNote: req.body.orderNote,
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone,
      customerEmail: req.body.customerEmail,
      returnUrl: req.body.returnUrl, 
    });
    res.json(response);
  } catch (error) {
    console.error('Error initiating UPI payment:', error);
    res.status(500).json({ message: 'Failed to initiate UPI payment' });
  }
  }
  
  
  module.exports = {
    UPIPayment,
  };
  