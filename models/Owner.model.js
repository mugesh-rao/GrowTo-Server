const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: Date,
  status: { type: String, enum: ["Present", "Absent", "Undecided"] },
  reasonForAbsence: String,
});

const salarySchema = new mongoose.Schema({
  baseSalary: Number,
  bonuses: Number,
  extraAmount: Number,
});

const locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});



const ownerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  token: String,
  mobileNumber: String,
  isVerified: Boolean,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationCode: String,
  address: String,
  aadharNumber: Number,
  ownedMachines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Machine" }],

});

const Owner = mongoose.model("owners", ownerSchema);

module.exports = Owner;
