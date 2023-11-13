const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    modelyear: String,
    price: String,
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
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
  },
  { collection: "Machine", timestamps: true }
);

module.exports = mongoose.model("Machine", machineSchema);
