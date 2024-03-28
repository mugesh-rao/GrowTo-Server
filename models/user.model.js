const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { jwtSecrettoken, refreshToken } = require("../helpers/generateKeys"); // Import environment variables

const addressSchema = new mongoose.Schema(
  {
    flat: String,
    landmark: String,
    city: String,
    district: String,
    type: { type: String, enum: ["home", "office", "other"] },
    name: String,
    mobileNumber: String,
    
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    aadharNumber: String,
    noOfAcres: Number,
    token: String,
    mobileNumber: String,
    isVerified: Boolean,
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    addresses: [addressSchema],
    dob: String,
    verificationCode: String,
    boughtProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    favoriteProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ],
  },
  { collection: "Users", timestamps: true }
);

// Generate and return a JSON Web Token (JWT) for the user
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, jwtSecrettoken, {
    expiresIn: refreshToken, // Use refreshToken from environment variables
  });
};

// Generate a reset token and store it in the database
userSchema.methods.getResetToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Store the hashed token and expiration time in the database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  minutes;

  return resetToken;
};

module.exports =  mongoose.model("User", userSchema);


