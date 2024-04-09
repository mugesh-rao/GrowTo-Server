const OrdersModel = require("../../models/Orders.model");
const Owner = require("../../models/Owner.model");
const User = require("../../models/UserModel");
const Machine = require("../../models/machine.model");

const AcceptOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await OrdersModel.findById(orderId).exec();

    // Fetch current time to mark order acceptance
    const currentTime = new Date();
    const user = await User.findById(order.userID).exec();
    const owner = await Owner.findById(order.ownerID).exec();

    // Update the order with acceptance details
    const updatedOrder = await OrdersModel.findByIdAndUpdate(
      orderId,
      {
        status: "Accepted",
        acceptedAt: currentTime,
        "deliveryDetails.estimatedDeliveryDate": new Date(
          currentTime.getTime() + 24 * 60 * 60 * 1000
        ), // Assuming delivery is estimated within 24 hours
        "providerDetails.name": owner.name,
        "providerDetails.contactInfo": owner.mobileNumber,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    return res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error accepting order:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

async function RejectOrder(req, res) {
  try {
    const orderId = req.params.orderId;

    // Find the order by ID and update its status to 'rejected'
    const updatedOrder = await OrdersModel.findByIdAndUpdate(
      orderId,
      { OrderStatus: "Rejected" },
      { new: true }
    );

    return res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error rejecting order:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
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
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

const ViewOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    // Fetch the order details
    const order = await OrdersModel.findById(orderId).exec();
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // Initialize variables to hold machine and user data
    let machine = null;
    let user = null;

    // Attempt to fetch machine details if machineID is present in the order
    if (order.machineID) {
      machine = await Machine.findById(order.machineID).exec();
      if (!machine) {
        console.log("Machine not found for this order");
      }
    }

    // Attempt to fetch user details if userID is present in the order
    if (order.userID) {
      console.log(User);
      console.log(order);
      user = await User.findById(order.ownerID).exec();
      if (!user) {
        console.log("User not found for this order");
      }
    }

    // Return order, machine, and user details in the response
    return res.status(200).json({ success: true, order, machine, user });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  AcceptOrder,
  RejectOrder,
  ViewOrder,
  getAdminOrders,
};
