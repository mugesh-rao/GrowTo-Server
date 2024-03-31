const Users = require('../../models/user.model'); // Update the path based on your structure

exports.getAllUsers = async (req, res) => {
  try {
    const providers = await Users.find(); 
    res.status(200).json({
      status: 'success',
      results: providers.length,
      users
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};