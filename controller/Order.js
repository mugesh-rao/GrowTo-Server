const OrdersModel = require("../models/Orders.model");
const Owner = require("../models/Owner.model"); // Adjust the import

async function PlaceOrder(req, res) {
  try {
    // Assuming req.body contains necessary order information
    const { userId, machineId, quantity, totalPrice, deliveryAddress } =
      req.body;

    // Create the order
    const order = new OrdersModel({
      user: userId,
      machine: machineId,
      quantity,
      totalPrice,
      deliveryAddress,
    });

    // Save the order to the database
    await order.save();

    // Find the owner to get the provider information
    const owner = await Owner.findById(userId); // Assuming userId is the owner's ID

    // Check if the owner is also a provider
    if (owner.ownedMachines.length > 0) {
      // Implement logic to notify the provider (send notification, email, etc.)
      console.log(`Order notification sent to owner/provider: ${owner.name}`);
    }

    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Error placing order:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

module.exports = {
  PlaceOrder,
};
