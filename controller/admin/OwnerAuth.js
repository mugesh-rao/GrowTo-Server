const { jwtSecrettoken } = require("../../helpers/generateKeys");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Owner = require("../../models/Owner.model");

async function ownerRegistration(req, res) {
  try {
    const { mobileNumber } = req.body;

    const existingOwner = await Owner.findOne({ mobileNumber });

    if (existingOwner) {
      return res.status(400).json({ error: "Owner already registered" });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const newOwner = new Owner({
      mobileNumber: req.body.mobileNumber,
      verificationCode,
      isVerified: false,
    });

    await newOwner.save();

    const message =
      `🌱 Welcome to *Grow Guard!* 🚜\n\n` +
      `Get ready to grow your farming journey with us. 🌾\n\n` +
      `Your OTP  is: *${verificationCode}*`;

    const waLink = `http://api.textmebot.com/send.php?recipient=+91${
      req.body.mobileNumber
    }&apikey=Hwd2BzkcxSY4&text=${encodeURIComponent(message)}`;
    await axios.post(waLink);

    res.json({ success: true, message: "Owner registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function ownerLogin(req, res) {
  const { mobileNumber, verificationCode } = req.body;

  try {
    const owner = await Owner.findOne({ mobileNumber });

    // if (!owner) {
    //   return res.status(400).json({ message: "Owner not found" });
    // }

    const codeMatch = owner.verificationCode === verificationCode;

    if (!codeMatch) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    const token = jwt.sign(
      { ownerId: owner._id, mobileNumber: owner.mobileNumber },
      jwtSecrettoken,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Owner login successful",
      token: token,
      AdminId: owner._id,
      AdminProfile: owner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
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
  ownerRegistration,
  ownerLogin,
  createOwnerProfile,
  updateProfile,
};
