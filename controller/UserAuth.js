const { jwtSecrettoken } = require("../helpers/generateKeys");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const axios = require("axios");

async function Registration(req, res) {
  try {
    const { mobileNumber } = req.body;

    const existingUser = await User.findOne({ mobileNumber });

    if (existingUser) {
      return res.status(400).json({ error: 'User already registered' });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const newUser = new User({
      mobileNumber: req.body.mobileNumber,
      verificationCode,
      isVerified: false, 
    });

    await newUser.save();

    const message = `🌱 Welcome to *Grow Guard!* 🚜\n\n`
      + `Get ready to grow your farming journey with us. 🌾\n\n`
      + `Your OTP  is: *${verificationCode}*`;

    const waLink = `http://api.textmebot.com/send.php?recipient=+91${req.body.mobileNumber}&apikey=ezTBGZEDoJxH&text=${encodeURIComponent(message)}`;
    await axios.post(waLink);



    
    res.json({ success: true, message: 'Registration successful'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function loginUser(req, res) {
  const { mobileNumber, verificationCode } = req.body;

  try {
    const user = await User.findOne({ mobileNumber });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // user.isVerified = true;


    // if (user.isVerified) {
    //   return res.status(400).json({ message: "User is not verified" });
    // }

    // Check the verification code
    const codeMatch = user.verificationCode === verificationCode;

    if (!codeMatch) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Generate a JWT token for the user
    const token = jwt.sign(
      { userId: user._id, mobileNumber: user.mobileNumber },
      jwtSecrettoken,
      { expiresIn: "1h" } // Set the expiration time as needed
    );
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        mobileNumber: user.mobileNumber,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function createProfile(req, res) {
  try {
    const mobileNumber = req.query.ph; // Extract mobile number from request parameters

    const user = await User.findOne({ mobileNumber });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's profile with the submitted data
    user.name = req.body.name;
    user.address = req.body.address;
    user.aadharNumber = req.body.aadharNumber;
    user.noOfAcres = req.body.noOfAcres;
    user.dob = req.body.dob;

    await user.save();

    res.json({ success: true, message: 'Profile created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { Registration, loginUser,createProfile };
