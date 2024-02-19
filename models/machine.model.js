const mongoose = require("mongoose");

const bookedDateSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookingStatus: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

const reviewSchema = new mongoose.Schema({
  reviewerName: String,
  reviewerProfilePic: String,
  reviewerJoiningDate: { type: Date, default: Date.now },
  ratings: { type: Number, min: 0, max: 5 },
  reviewText: String,
  helpfulCount: { type: Number, default: 0 },
});

const machineSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    modelYear: String,
    price: { type: Number, default: 0 },
    reviews: [reviewSchema],
    images: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    img: String,
    avatar: String,
    location: String,
    driverName: String,
    GTID: String,
    ownerName: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postingDate: { type: Date, default: Date.now },
    season: String,
    cropType: String,
    brand: String,
    description: String,
    isVerified: { type: Boolean, default: false },
    discountPrice: Number,
    shop: Object,
    soldOut: { type: Number, default: 0 },
    ownerID: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
    bookedDates: [bookedDateSchema],
    withDriver: { type: Boolean, default: false },
  },
  { collection: "Machine", timestamps: true }
);

// Add indexes if needed

module.exports = mongoose.model("Machine", machineSchema);
