
const Owner = require('../../models/Owner.model'); // Update the path based on your structure

exports.getAllProviders = async (req, res) => {
  try {
    const providers = await Owner.find(); 
    res.status(200).json({
      status: 'success',
      results: providers.length,
      providers
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
