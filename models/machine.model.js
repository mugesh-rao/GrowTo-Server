const mongoose = require("mongoose");

const MachineModel = new mongoose.Schema(
  {
    name: { type: String, },
    category: { type: String },
    price: { type: String },
    review: { type: String },
    img: { type: String },
    location: { type: String }, // Add location field
    driverName: { type: String }, // Add driverName field
    ownerName: { type: String }, 
    // Add ownerName field
  },
  { collection: "Machine", timestamps: true }
);

module.exports = mongoose.model("Machine", MachineModel);
