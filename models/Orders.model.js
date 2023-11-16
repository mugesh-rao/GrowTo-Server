const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Owners" }, // Reference to the user (farmer)
    machine: { type: mongoose.Schema.Types.ObjectId, ref: "Machine" }, // Reference to the purchased machine
    quantity: { type: Number, default: 1 }, // You can adjust this based on your requirements
    totalPrice: { type: Number, required: true },
    isDelivered: { type: Boolean, default: false },
    deliveryAddress: String, // You can expand this based on your requirements
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    orderDate: { type: Date, default: Date.now },
  },
  { collection: "Orders", timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
