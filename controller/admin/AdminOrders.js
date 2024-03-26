const OrdersModel = require("../../models/Orders.model");
const Owner = require("../../models/Owner.model");




  async function AcceptOrder(req, res) {
    try {
      const orderId = req.params.orderId;
  
      // Find the order by ID and update its status to 'Accepted'
      const updatedOrder = await OrdersModel.findByIdAndUpdate(orderId, { OrderStatus: 'Accepted' }, { new: true });
  
      return res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
      console.error("Error accepting order:", error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
  
  async function RejectOrder(req, res) {
    try {
      const orderId = req.params.orderId;
  
      // Find the order by ID and update its status to 'rejected'
      const updatedOrder = await OrdersModel.findByIdAndUpdate(orderId, { OrderStatus: 'Rejected' }, { new: true });
  
      return res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
      console.error("Error rejecting order:", error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  // Update the server-side function
  const getAdminOrders = async (req, res) => {
    const { adminId } = req.params;
    const { status } = req.query; // Use query parameter for filtering by status
  
    let query = { ownerID: adminId };
    if (status) {
      query.OrderStatus = status;
    }
  
    try {
      const orders = await OrdersModel.find(query).exec();
      return res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };
  
  const ViewOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      // Use the orderId to fetch the corresponding order from the database
      const order = await OrdersModel.findOne({ orderId }).exec();
  
      if (!order) {
        return res.status(404).json({ success: false, error: "Order not found" });
      }
  
      return res.status(200).json({ success: true, order });
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };


  module.exports = {
AcceptOrder,RejectOrder,ViewOrder,getAdminOrders,
  };
  