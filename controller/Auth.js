const { jwtSecrettoken } = require("../helpers/generateKeys");

const { User } = require("../models/user.model"); // Import or create your User schema
const { generateOTP } = require("../utils/OTP");
const axios = require("axios");


async function Registration(req, res) {
  try {
    const { mobileNumber } = req.body;

    const existingUser = await User.findOne({ mobileNumber });

    if (existingUser) {
      return res.status(400).json({ error: 'User already registered' });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Create a new user object
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

    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}


async function verifyUser(req, res) {
  try {
    const { mobileNumber, verificationCode } = req.body;

    const user = await User.findOne({ mobileNumber, verificationCode });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    user.isVerified = true;
    user.token = jwtSecrettoken;
    
    const message = `🌱 User Allowed Succesfully !!🚜`;

    const waLink = `http://api.textmebot.com/send.php?recipient=+91${req.body.mobileNumber}&apikey=ezTBGZEDoJxH&text=${encodeURIComponent(message)}`;
    axios.post(waLink);
    
    await user.save();

    // Generate a JWT token for the user
    // const token = jwt.sign(
    //   { userId: user._id, mobileNumber: user.mobileNumber },
    //   jwtSecrettoken,
    //   { expiresIn: "1h" }
    // );

    res.status(200).json({
      message: "Mobile number verified successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


async function loginUser(req, res) {
  const { mobileNumber, verificationCode } = req.body;

  try {
    // Find the user by mobileNumber
    const user = await User.findOne({ mobileNumber });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "User is not verified" });
    }

    // Check the password (you can use a library like bcrypt)
    const passwordMatch = await bcrypt.compare(verificationCode, user.verificationCode);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Generate a JWT token for the user
    // const token = jwt.sign(
    //   { mobileNumber: user.mobileNumber },
    //   jwtSecrettoken,
    //   { expiresIn: "1h" }
    // );

    // res.status(200).json({
    //   message: "Login successful",
    //   token: token,
    // });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = { verifyUser, Registration,loginUser};
