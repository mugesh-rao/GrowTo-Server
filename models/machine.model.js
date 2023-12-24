const mongoose = require("mongoose");

// Schema for booked dates
const bookedDateSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  bookingStatus: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
});

// Schema for machines
const machineSchema = new mongoose.Schema(
  {
    name: String,
    category: {
      key: Number,
      Name: String,
      Img: String,
    },
    modelyear: String,
    price: { type: Number, default: 0 },
    review: String,
    img: String,
    location: String,
    driverName: String,
    ownerName: String,
    postingdate: String,
    season: String,
    croptype: String,
    brand: String,
    description: String,
    isVerified: Boolean,
    discountPrice: Number,
    shop: Object,
    sold_out: { type: Number, default: 0 },
    ownerID: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
    bookedDates: [bookedDateSchema], 
  },
  { collection: "Machine", timestamps: true }
);

module.exports = mongoose.model("Machine", machineSchema);
