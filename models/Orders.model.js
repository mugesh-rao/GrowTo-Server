const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }, 
    ownerID: { type: mongoose.Schema.Types.ObjectId, ref: "Owners" },
    machineID: { type: mongoose.Schema.Types.ObjectId, ref: "Machine" }, 
    quantity: { type: Number, default: 1 },
    totalPrice: { type: Number },
    isDelivered: { type: Boolean, default: false },
    deliveryAddress: String, 
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    orderDate: { type: Date, default: Date.now },
    user: {      
      name: String,
      email: String,
    },
  },
  { collection: "Orders", timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
