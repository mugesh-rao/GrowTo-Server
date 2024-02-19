const { jwtSecrettoken } = require("../../helpers/generateKeys");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Owner = require("../../models/Owner.model");

async function OwnerRegistration(req, res) {
  try {
    const { mobileNumber } = req.body;

    const existingUser = await Owner.findOne({ mobileNumber });

    if (existingUser) {
      return res.status(400).json({ error: "User already registered" });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const newUser = new Owner({
      mobileNumber: req.body.mobileNumber,
      verificationCode,
      isVerified: false,
      name: null,
      email: null,
      password: null,
      aadharNumber: null,
      noOfAcres: null,
    });

    await newUser.save();

    const message =
      `🌱 Welcome to *GrowTo.in - For busniess!* 🚜\n\n` +
      `Get ready to grow your farming journey with us. 🌾\n\n` +`Use This OTP for Login \n\n` +
      `Your OTP  is: *${verificationCode}*`;

    const waLink = `http://api.textmebot.com/send.php?recipient=+91${
      req.body.mobileNumber
    }&apikey=Hwd2BzkcxSY4&text=${encodeURIComponent(message)}`;
    await axios.post(waLink);

    res.json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function sendOTP(req, res) {
  const { mobileNumber } = req.body;

  try {
  
    const user = await Owner.findOne({ mobileNumber });


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

 
    const verificationCode = user.verificationCode;

   
    const message =
      `🌱 Welcome Back to *GrowTo.in - For busniess!* 🚜\n\n` +
      `Your OTP is: *${verificationCode}*`;

    // Construct the WhatsApp API link
    const waLink = `http://api.textmebot.com/send.php?recipient=+91${
      mobileNumber
    }&apikey=Hwd2BzkcxSY4&text=${encodeURIComponent(message)}`;

    // Send the message using axios
    await axios.post(waLink);

    // Respond with success message
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function Ownerlogin(req, res) {
  const { mobileNumber, verificationCode } = req.body;

  try {
    const user = await Owner.findOne({ mobileNumber });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Check the verification code
    const codeMatch = user.verificationCode === verificationCode;
    if (!codeMatch) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    // Generate a JWT token for the user
    const token = jwt.sign(
      { userId: user._id, mobileNumber: user.mobileNumber },
      jwtSecrettoken,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      userProfile: {
        name: user.name,
        address: user.address,
        aadharNumber: user.aadharNumber,
        noOfAcres: user.noOfAcres,
        dob: user.dob,
        _id: user._id,
        mobileNumber: user.mobileNumber,
        // Include other profile data as needed
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function createOwnerProfile(req, res) {
  try {
    const mobileNumber = req.query.ph; // Extract mobile number from request parameters

    const owner = await Owner.findOne({ mobileNumber });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Update the owner's profile with the submitted data
    owner.name = req.body.name;
    owner.email = req.body.email;
    owner.address = req.body.address;
    owner.aadharNumber = req.body.aadharNumber;

    await owner.save();

    res.json({ success: true, message: "Owner profile created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateProfile(req, res) {
  const { mobileNumber, dateOfBirth, address } = req.body;
  try {
    const owner = await Owner.findOne({ mobileNumber });
    if (!owner) {
      return res
        .status(400)
        .json({ status: "error", error: "Owner not found" });
    }

    owner.dateOfBirth = dateOfBirth;
    owner.address = address;

    await owner.save();

    res.json({ status: "ok", message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating owner profile:", error);
    res.status(500).json({ status: "error", error: "Profile update failed" });
  }
}

module.exports = {
  OwnerRegistration,
  Ownerlogin,
  sendOTP,
  createOwnerProfile,
  updateProfile,
};
