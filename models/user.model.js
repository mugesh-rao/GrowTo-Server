const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    mobileNumber: {
      type: String,
    
    },
    isVerified: {
      type: Boolean,
     
    },
    verificationCode: String,
    boughtProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    favoriteProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { collection: "Users", timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
