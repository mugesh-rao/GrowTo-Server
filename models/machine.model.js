const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: String,
  review: String,
  img: String,
  location: String,
  driverName: String,
  ownerName: String,
  season: String,
  type: String,
  brand: String,
  description: String,
  discountPrice: Number,
  stock: Number,
  shopId: String,
  shop: Object,
  sold_out: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' },
}, { collection: 'Machine', timestamps: true });

module.exports = mongoose.model('Machine', machineSchema);
