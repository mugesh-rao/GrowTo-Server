const OrdersModel = require("../../models/Orders.model");
const Owner = require("../../models/Owner.model");

async function generateUniqueOrderID() {
  // Find the latest order in the database to determine the next counter value
  const latestOrder = await OrdersModel.findOne({}, {}, { sort: { 'createdAt' : -1 } });
  let counter = 1; // Default counter value if no orders exist yet

  // If there are existing orders, extract the counter value from the latest order ID
  if (latestOrder && latestOrder.orderID) {
    const lastOrderID = latestOrder.orderID;
    const lastCounterIndex = lastOrderID.lastIndexOf('A') + 1; // Index of the counter portion in the ID
    const lastCounter = parseInt(lastOrderID.substring(lastCounterIndex)); // Extract the counter value
    counter = lastCounter + 1; // Increment the counter for the next order
  }

  // Generate the order ID based on the counter value
  const orderID = `GT${String.fromCharCode(65 + Math.floor((counter - 1) / 9999))}${String(counter).padStart(4, '0')}`;
  return orderID;
}

async function PlaceOrder(req, res) {
  try {
    const { userID, machineID, quantity, totalPrice, deliveryAddress, ownerID } = req.body;

    // Generate a unique order ID
    const orderID = await generateUniqueOrderID();

    const sanitizedOwnerID = ownerID || null;

    // Create the order
    const order = new OrdersModel({
      orderID: orderID,
      userID: userID,
      machineID: machineID,
      ownerID: sanitizedOwnerID,
      quantity,
      totalPrice,
      deliveryAddress,
    });

    // Save the order to the database
    await order.save();

    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Error placing order:", error);

    // Handle specific error cases if needed
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}


async function getUserOrders(req, res) {
  try {
    const userId = req.params.userId;

    // Fetch orders for the given user ID
    const orders = await OrdersModel.find({ userID: userId }).exec();

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}


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

// Update the server-side function
async function getAdminOrders(req, res) {
  try {
    const adminId = req.params.adminId;

    // Replace OrdersModel with your actual model for orders
    const orders = await OrdersModel.find({ ownerID: adminId }).exec();

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}


module.exports = {
  PlaceOrder,
  getUserOrders,
  getAdminOrders,
  AcceptOrder,RejectOrder,ViewOrder
};
