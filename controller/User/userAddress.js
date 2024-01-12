async function addAddress(req, res) {
    const { mobileNumber, newAddress } = req.body;
    try {
      const user = await User.findOne({ mobileNumber });
  
      if (!user) {
        return res.status(400).json({ status: 'error', error: 'User not found' });
      }
  
      user.addresses.push(newAddress);
      await user.save();
  
      res.json({ status: 'ok', message: 'Address added successfully' });
    } catch (error) {
      console.error('Error adding address:', error);
      res.status(500).json({ status: 'error', error: 'Address addition failed' });
    }
  }
  async function getAddresses(req, res) {
    const { mobileNumber } = req.params;
    try {
      const user = await User.findOne({ mobileNumber });
  
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
  