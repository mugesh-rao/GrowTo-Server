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
  businessName: String,
  district: String,
  pinCode: String,
  gstNumber: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    pinCode: String,
  },
  ownerType: { type: String, enum: ['Individual', 'Business'] },
  businessDetails: {
    businessName: String,
    gstNumber: String,
    taxId: String, 
    businessAddress: String,
  },
  bankDetails: { 
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branchName: String,
  },
  ownedMachines: [{
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: "Machine" },
    registrationDate: Date,
    machineDetails: {
      make: String,
      model: String,
      yearOfManufacture: Date,
      machineType: String,
      operationalStatus: { type: String, enum: ["Operational", "Under Maintenance", "Out of Service"], default: "Operational" },
    },
    insuranceDetails: { 
      provider: String,
      policyNumber: String,
      validTill: Date,
    },
    complianceCertificates: [{
      certificateName: String,
      issuedBy: String,
      issueDate: Date,
      expiryDate: Date,
      certificateNumber: String,
    }],
  }],
  operationalAreas: [{ 
    district: String,
    state: String,
    country: String,
  }],
  profileCompleted: { type: Boolean, default: false },
  location: {
    type: { type: String, default: "Point" },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  createdAt: { type: Date, default: Date.now },
  ownedMachines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Machine" }],

});

const Owner = mongoose.model("owners", ownerSchema);

module.exports = Owner;
