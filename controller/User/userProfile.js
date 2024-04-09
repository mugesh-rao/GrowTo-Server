// controllers/userController.js
const User = require("../../models/UserModel");

async function updateProfile(req, res) {
  const { mobileNumber, dateOfBirth, address } = req.body;
  try {
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(400).json({ status: "error", error: "User not found" });
    }

    user.dateOfBirth = dateOfBirth;
    user.address = address;

    await user.save();

    res.json({ status: "ok", message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ status: "error", error: "Profile update failed" });
  }
}

module.exports = {
  updateProfile,
};
