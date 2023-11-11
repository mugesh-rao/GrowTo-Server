const { jwtSecrettoken } = require("../helpers/generateKeys");

const { User } = require("../models/user.model"); // Import or create your User schema
const { generateOTP } = require("../utils/OTP");
const axios = require("axios");

async function registerUser(req, res) {
  try {
    const { mobileNumber } = req.body;

    const existingUser = await User.findOne({ mobileNumber });

    if (existingUser) {
      return res.status(400).json({ message: "User already registered." });
    }

    const verificationCode = generateOTP();


    const newUser = new User({
      mobileNumber,
      verificationCode,
      isVerified: false,
    });

    await newUser.save();

    // Send the OTP to the user
    const otpMessage = `Your OTP is: ${verificationCode}`;
    const recipient = `+91${mobileNumber}`;
    const apiKey = "rXbvAnSLLtdr";
    const encodedMessage = encodeURIComponent(otpMessage);
    const textMeBotUrl = `http://api.textmebot.com/send.php?recipient=${recipient}&apikey=${apiKey}&text=${encodedMessage}`;

    const response = await axios.post(textMeBotUrl);

    if (response.data && response.data.success) {
      const token = jwt.sign(
        { mobileNumber: newUser.mobileNumber },
        jwtSecrettoken,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "OTP sent successfully",
        token: token, 
      });

      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      res.status(500).json({ message: "Failed to send OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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

    await user.save();

    // Generate a JWT token for the user
    const token = jwt.sign(
      { userId: user._id, mobileNumber: user.mobileNumber },
      jwtSecrettoken,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Mobile number verified successfully.",
      token: token, // Include the token in the response
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
    const token = jwt.sign(
      { mobileNumber: user.mobileNumber },
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

module.exports = { verifyUser, registerUser,loginUser };
