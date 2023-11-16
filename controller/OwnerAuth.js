const { jwtSecrettoken } = require("../helpers/generateKeys");
const { Owner } = require("../models/Owner.model"); // Assuming you have an Owner model
const { generateOTP } = require("../utils/OTP");
const axios = require("axios");

// Registration for owners
async function registerOwner(req, res) {
  try {
    const { mobileNumber } = req.body;

    // Check if the owner with the given mobile number already exists
    const existingOwner = await Owner.findOne({ mobileNumber });

    if (existingOwner) {
      return res.status(400).json({ error: 'Owner already registered' });
    }

    // Generate a random verification code
    const verificationCode = generateOTP();

    // Create a new owner object
    const newOwner = new Owner({
      mobileNumber: req.body.mobileNumber,
      verificationCode,
      isVerified: false,
    });

    // Save the new owner to the database
    await newOwner.save();

    // Send the verification code to the owner via WhatsApp
    const message = `🌱 Welcome to *Your Farming App!* 🚜\n\n`
      + `Get ready to manage your farming machines with us. 🌾\n\n`
      + `Your OTP is: *${verificationCode}*`;

    const waLink = `http://api.textmebot.com/send.php?recipient=+91${req.body.mobileNumber}&apikey=ezTBGZEDoJxH&text=${encodeURIComponent(message)}`;
    await axios.post(waLink);

    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Verification for owners
async function verifyOwner(req, res) {
  try {
    const { mobileNumber, verificationCode } = req.body;

    // Find the owner by mobileNumber and verificationCode
    const owner = await Owner.findOne({ mobileNumber, verificationCode });

    if (!owner) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    // Check if the owner is already verified
    if (owner.isVerified) {
      return res.status(400).json({ message: "Owner is already verified." });
    }

    // Mark the owner as verified
    owner.isVerified = true;

    // Save the changes to the database
    await owner.save();

    // Generate a JWT token for the owner
    const token = jwt.sign(
      { ownerId: owner._id, mobileNumber: owner.mobileNumber },
      jwtSecrettoken,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Mobile number verified successfully.",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Login for owners
async function loginOwner(req, res) {
  const { mobileNumber, verificationCode } = req.body;

  try {
    // Find the owner by mobileNumber
    const owner = await Owner.findOne({ mobileNumber });

    if (!owner) {
      return res.status(400).json({ message: "Owner not found" });
    }

    // Check if the owner is verified
    if (!owner.isVerified) {
      return res.status(400).json({ message: "Owner is not verified" });
    }

    // Check the verification code
    const codeMatch = owner.verificationCode === verificationCode;

    if (!codeMatch) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Generate a JWT token for the owner
    const token = jwt.sign(
      { ownerId: owner._id, mobileNumber: owner.mobileNumber },
      jwtSecrettoken,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { registerOwner, verifyOwner, loginOwner };
