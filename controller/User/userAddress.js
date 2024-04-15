const User = require('../../models/UserModel');

async function addAddress(req, res) {
  const { userId, newAddress } = req.body;
  if (!userId || !newAddress) {
    return res.status(400).json({ status: 'error', error: 'Missing userId or address data' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', error: 'User not found' });
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ status: 'ok', message: 'Address added successfully', address: newAddress });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
}
  async function getAddresses(req, res) {
    const {userId } = req.params;

    try {
      const user = await User.findById(userId);
      
  
      if (!user) {
        return res.status(400).json({ status: 'error', error: 'User not found' });
      }
  
      res.json({ status: 'ok', addresses: user.addresses });
     

    } catch (error) {
      console.error('Error fetching addresses:', error);
      res.status(500).json({ status: 'error', error: 'Address fetch failed' });
    }
  }
  async function editAddress(req, res) {
    const { mobileNumber, addressId, updatedAddress } = req.body;
    try {
      const user = await User.findOne({ mobileNumber });
  
      if (!user) {
        return res.status(400).json({ status: 'error', error: 'User not found' });
      }
  
      const addressToUpdate = user.addresses.id(addressId);
      if (!addressToUpdate) {
        return res.status(400).json({ status: 'error', error: 'Address not found' });
      }
  
      addressToUpdate.set(updatedAddress);
      await user.save();
  
      res.json({ status: 'ok', message: 'Address updated successfully' });
    } catch (error) {
      console.error('Error updating address:', error);
      res.status(500).json({ status: 'error', error: 'Address update failed' });
    }
  }
  async function deleteAddress(req, res) {
    const { mobileNumber, addressId } = req.body;
    try {
      const user = await User.findOne({ mobileNumber });
  
      if (!user) {
        return res.status(400).json({ status: 'error', error: 'User not found' });
      }
  
      user.addresses.id(addressId).remove();
      await user.save();
  
      res.json({ status: 'ok', message: 'Address deleted successfully' });
    } catch (error) {
      console.error('Error deleting address:', error);
      res.status(500).json({ status: 'error', error: 'Address deletion failed' });
    }
  }

  module.exports = {
    addAddress,   getAddresses,    editAddress,deleteAddress,
  };
  