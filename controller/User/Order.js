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

   
    const sanitizedOwnerID = ownerID || null;

    // Create the order
    const order = new OrdersModel({
      userID: userID,
      machineID: machineID,
      ownerID: sanitizedOwnerID,
      quantity,
      totalPrice,
      deliveryAddress,
    });

    // Save the order to the database
    await order.save();

    // If you want to find the owner, uncomment the following lines
    // const owner = await Owner.findById(ownerID);
    // if (owner && owner.ownedMachines.length > 0) {
    //   console.log(`Order notification sent to owner/provider: ${owner.name}`);
    // }

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
