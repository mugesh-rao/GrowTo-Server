const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  token: String,
  mobileNumber: {
    type: Number,
    unique: true,
  },
  isVerified: Boolean,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationCode:  { type: Number, default: 0 },
  address: String,
  aadharNumber:  { type: Number, default: 0 },
  ownedMachines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Machine" }],
});

module.exports = mongoose.model("Owners", farmerSchema);
