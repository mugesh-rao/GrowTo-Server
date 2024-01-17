const OrdersModel = require("../../models/Orders.model");
const Owner = require("../../models/Owner.model");

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

    // Create the order
    const order = new OrdersModel({
      userID: userID,
      machineID: machineID,
      ownerID: ownerID,
      quantity,
      totalPrice,
      deliveryAddress,
    });

    // Save the order to the database
    await order.save();

    // Find the owner to get the provider information
    // const owner = await Owner.findById(userId);

    // // Check if the owner is also a provider
    // if (owner.ownedMachines.length > 0) {
    //   // Implement logic to notify the provider (send notification, email, etc.)
    //   console.log(`Order notification sent to owner/provider: ${owner.name}`);
    // }

    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Error placing order:", error);
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
};
