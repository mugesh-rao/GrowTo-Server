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
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    orderDate: { type: Date, default: Date.now },
    user: {
      name: String,
      email: String,
    },
    OrderStatus: {
      type: String,
      enum: ["pending", "Accepted","Rejected"],
      default: "pending",
    },
    requestDate: Date,
    paymentReceived: Number,
    ProductID: String,
    orderID: String,
    contactNumber: String,
    requestedAddress: String,
    requestedTime: String,
    fromDate: Date,
    toDate: Date,
    mobileNumber: String,
    totalAcres: Number,
    totalDays: Number,
    totalHours: Number,
    paymentToken: String,
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "wallet", "other"],
      default: "other",
    },
  },
  { collection: "Orders", timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
