const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    ownerID: { type: mongoose.Schema.Types.ObjectId, ref: "Owners" },
    machineID: { type: mongoose.Schema.Types.ObjectId, ref: "Machine" },
    totaldays: { type: Number, default: 1 },
    totalPrice: { type: Number },
    isDelivered: { type: Boolean, default: false },
    ProductID: String,
    orderID: String,
    fromDate: Date,
    toDate: Date,
    acceptedAt: Date,
    totalHours: Number,
    paymentToken: String,
    estimatedArrival: Date,
    actualArrival: Date,
    completionTime: Date,
    deliveryAddress: String,
    supportContact: String,
    mobileNumber: String,
    deliveryDetails: {
      estimatedDeliveryDate: Date,
      actualDeliveryDate: Date,
      deliveryStatus: {
        type: String,
        enum: ["Pending", "In Transit", "Delivered"],
        default: "Pending",
      },
    },

    incidentReports: [
      {
        date: Date,
        description: String,
        resolved: { type: Boolean, default: false },
      },
    ],
    cancellation: {
      isCancelled: { type: Boolean, default: false },
      cancelledBy: {
        type: String,
        enum: ["Renter", "Owner", "System"],
        default: "System",
      },
      reason: String,
      cancelledAt: Date,
    },
    issues: [
      {
        reportedAt: Date,
        description: String,
        resolved: { type: Boolean, default: false },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Cancelled", "Completed"],
      default: "Pending",
    },

    payment: {
      amount: Number,
      method: String,
      status: {
        type: String,
        enum: ["Pending", "Paid", "Refunded"],
        default: "Pending",
      },
      transactionId: String,
    },
    orderDate: { type: Date, default: Date.now },
    user: {
      name: String,
      email: String,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "processing", "confirmed", "failed"],
      default: "pending",
    },

    providerDetails: {
      name: String,
      contactInfo: String,
      vehicleDetails: {
        type: String,
        model: String,
        color: String,
        plateNumber: String,
      },
    },

    paymentInfo: {
      amount: Number,
      method: String,
      status: String,
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "wallet", "other"],
      default: "other",
    },
    feedback: {
      userRating: Number,
      providerRating: Number,
      userComments: String,
      providerComments: String,
    },

  
  },
  { collection: "Orders", timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
