// controllers/ownerController.js
const Owner = require('../models/Owner.model');

async function updateProfile(req, res) {
  const { mobileNumber, dateOfBirth, address } = req.body;
  try {
    const owner = await Owner.findOne({ mobileNumber });
    if (!owner) {
      return res.status(400).json({ status: 'error', error: 'Owner not found' });
    }

    owner.dateOfBirth = dateOfBirth;
    owner.address = address;

    await owner.save();

    res.json({ status: 'ok', message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating owner profile:', error);
    res.status(500).json({ status: 'error', error: 'Profile update failed' });
  }
}

module.exports = {
  updateProfile,
};
