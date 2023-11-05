// registration.js

const { User } = require('../models/user.model'); // Import or create your User schema

async function Registration(req, res) {
  try {
    // Generate a random verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Create a new user object
    const newUser = new User({
      mobileNumber: req.body.mobileNumber,
      verificationCode,
    });

    await newUser.save();
    const waLink = `https://wa.me/+91${req.body.mobileNumber}?text=Your%20verification%20code%20is%20${verificationCode}.%20Please%20use%20this%20code%20to%20verify%20your%20mobile%20number.`;

    // Send the link in the response
    res.json({ success: true, waLink });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function Verification(req, res) {
  try {
    const { mobileNumber, verificationCode } = req.body;

    // Find the user by mobileNumber and verificationCode using Promises
    const user = await User.findOne({ mobileNumber, verificationCode });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    
    user.isVerified = true;

    // Save the user using Promises
    await user.save();

    res.json({ message: 'Mobile number verified successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { Registration, Verification };
