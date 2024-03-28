const OrdersModel = require("../../models/Orders.model");
const Owner = require("../../models/Owner.model");
const Machine = require("../../models/machine.model");
const User = require("../../models/user.model");

async function generateUniqueOrderID() {
  // Find the latest order in the database to determine the next counter value
  const latestOrder = await OrdersModel.findOne(
    {},
    {},
    { sort: { createdAt: -1 } }
  );
  let counter = 1; // Default counter value if no orders exist yet

  // If there are existing orders, extract the counter value from the latest order ID
  if (latestOrder && latestOrder.orderID) {
    const lastOrderID = latestOrder.orderID;
    const lastCounterIndex = lastOrderID.lastIndexOf("A") + 1; // Index of the counter portion in the ID
    const lastCounter = parseInt(lastOrderID.substring(lastCounterIndex)); // Extract the counter value
    counter = lastCounter + 1; // Increment the counter for the next order
  }

  // Generate the order ID based on the counter value
  const orderID = `GT${String.fromCharCode(
    65 + Math.floor((counter - 1) / 9999)
  )}${String(counter).padStart(4, "0")}`;
  return orderID;
}

async function PlaceOrder(req, res) {
  try {
    const {
      userID,
      machineID,
      quantity,
      totalPrice,
      deliveryAddress,
      ownerID,
    } = req.body;

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

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
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

const ViewOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await OrdersModel.findById(orderId).exec();

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // Assuming your order document contains a field named 'machineId'
    const machine = await Machine.findById(order.machineID).exec();
    const User = await User.findById(order.userID).exec();
    if (!machine) {
      // Handle the case where the machine data could not be found
      console.log("Machine not found for this order");
    }

    return res
      .status(200)
      .json({ success: true, order: order, machine: machine, user: User });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  PlaceOrder,
  getUserOrders,
  ViewOrder,
};
