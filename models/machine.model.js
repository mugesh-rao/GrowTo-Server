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
const bookingSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  
  renter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "In Use", "Completed", "Cancelled"],
    default: "Pending",
  },
  priceAtBooking: Number,
  cancellationDetails: {
    cancelledBy: String,
    cancellationReason: String,
    cancellationDate: Date,
  },
  logistics: {
    deliveryStatus: { type: String, enum: ["Pending", "Dispatched", "Delivered"], default: "Pending" },
    returnStatus: { type: String, enum: ["Pending", "Dispatched", "Returned"], default: "Pending" },
    deliveryProvider: String,
    trackingDetails: String,
  },
  feedback: {
    rating: Number,
    review: String,
    submittedOn: Date,
  },
});

const maintenanceLogSchema = new mongoose.Schema({
  date: Date,
  description: String,
  actionTaken: String,
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
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    postingDate: { type: Date, default: Date.now },
    season: String,
    availabilityStatus: {
      type: String,
      enum: ["Available", "In Use", "Maintenance", "Unavailable"],
      default: "Available",
    },
    bookings: [bookingSchema],
    maintenanceLogs: [maintenanceLogSchema],
   
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

module.exports  = mongoose.model("Machine", machineSchema);





