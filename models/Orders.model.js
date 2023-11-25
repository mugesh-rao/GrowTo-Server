const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }, // Reference to the user (farmer)
    ownerID: { type: mongoose.Schema.Types.ObjectId, ref: "Owners" }, // Reference to the user (farmer)
    machineID: { type: mongoose.Schema.Types.ObjectId, ref: "Machine" }, // Reference to the purchased machine
    quantity: { type: Number, default: 1 }, // You can adjust this based on your requirements
    totalPrice: { type: Number },
    isDelivered: { type: Boolean, default: false },
    deliveryAddress: String, 
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    orderDate: { type: Date, default: Date.now },
  },
  { collection: "Orders", timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
