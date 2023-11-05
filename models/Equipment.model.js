const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  name: { type: String },
  img: { type: String },
  location: { type: String },
  owner: { type: String },
  season: { type: String },
  type: { type: String },
  brand: { type: String },
  availability: { type: String },
  description: { type: String },
  price: { type: Number },
  // Add any additional fields specific to machine equipment
});

const Equipment = mongoose.model("equipment", equipmentSchema);

module.exports = Equipment;
