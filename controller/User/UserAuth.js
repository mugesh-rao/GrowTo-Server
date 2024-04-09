const { jwtSecrettoken } = require("../../helpers/generateKeys");
const jwt = require("jsonwebtoken");
const User = require('../../models/UserModel');
const axios = require("axios");

async function Registration(req, res) {
  try {
    const { mobileNumber } = req.body;
   
    const existingUser = await User.findOne({ mobileNumber });

    if (existingUser) {
      return res.status(400).json({ error: "User already registered" });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const newUser = new User({
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
      `🌱 Welcome to *GrowTo.in!* 🚜\n\n` +
      `Get ready to grow your farming journey with us. 🌾\n\n` +
      `Use This OTP for Login \n\n` +
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

async function loginOrRegisterUser(req, res) {
  const { mobileNumber, verificationCode } = req.body;

  try {
    let user = await User.findOne({ mobileNumber });

    if (!user) {
      // If user is not found, create a new user and send OTP
      const newVerificationCode = Math.floor(
        1000 + Math.random() * 9000
      ).toString();

      const newUser = new User({
        mobileNumber: req.body.mobileNumber,
        verificationCode: newVerificationCode,
        isVerified: false,
        name: null,
        email: null,
        password: null,
        aadharNumber: null,
        noOfAcres: null,
      });

      await newUser.save();

      const message =
        `🌱 Welcome to *GrowTo.in!* 🚜\n\n` +
        `Get ready to grow your farming journey with us. 🌾\n\n` +
        `Use This OTP for Login \n\n` +
        `Your OTP  is: *${newVerificationCode}*`;

      const waLink = `http://api.textmebot.com/send.php?recipient=+91${
        req.body.mobileNumber
      }&apikey=Hwd2BzkcxSY4&text=${encodeURIComponent(message)}`;
      await axios.post(waLink);

      return res.json({
        success: true,
        message: "Registration successful. Please enter the OTP received.",
      });
    }

    // If user is found, check the verification code
    const codeMatch = user.verificationCode === verificationCode;
    if (!codeMatch) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // If verification code is correct, generate JWT token for login
    const token = jwt.sign(
      { userId: user._id, mobileNumber: user.mobileNumber },
      jwtSecrettoken,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
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
    res.status(500).json({ error: "Internal server error" });
  }
}

async function loginUser(req, res) {
  const { mobileNumber, verificationCode } = req.body;

  try {
    const user = await User.findOne({ mobileNumber });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const message =
    `🌱 Welcome to *GrowTo.in!* 🚜\n\n` +
    `Get ready to grow your farming journey with us. 🌾\n\n` +
    `Use This OTP for Login \n\n` +
    `Your OTP  is: *${user.verificationCode}*`;

  const waLink = `http://api.textmebot.com/send.php?recipient=+91${
    mobileNumber
  }&apikey=Hwd2BzkcxSY4&text=${encodeURIComponent(message)}`;
  await axios.post(waLink);
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
async function sendOtpToUser(req,res) {
  const { mobileNumber } = req.body;

  try {
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      throw new Error('User not found');
    }
    const message =
    `🌱 Welcome to *GrowTo.in!* 🚜\n\n` +
    `Get ready to grow your farming journey with us. 🌾\n\n` +
    `Use This OTP for Login \n\n` +
    `Your OTP  is: *${user.verificationCode}*`;

  const waLink = `http://api.textmebot.com/send.php?recipient=+91${
    mobileNumber
  }&apikey=Hwd2BzkcxSY4&text=${encodeURIComponent(message)}`;
  await axios.post(waLink);

  } catch (error) {
    console.error('Error in sendOtpToUser:', error.message);
    throw error; // Rethrow the error for the caller to handle
  }
}
async function createProfile(req, res) {
  try {
    const mobileNumber = req.query.ph; // Extract mobile number from request parameters

    const user = await User.findOne({ mobileNumber });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's profile with the submitted data
    user.name = req.body.name;
    user.address = req.body.address;
    user.aadharNumber = req.body.aadharNumber;
    user.noOfAcres = req.body.noOfAcres;
    user.dob = req.body.dob;

    await user.save();

    res.json({ success: true, message: "Profile created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { Registration, loginUser, createProfile ,sendOtpToUser};
