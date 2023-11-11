const jwt = require('jsonwebtoken');
const { jwtSecrettoken } = require('../helpers/generateKeys'); // Import your JWT secret key

const requireAuth = (req, res, next) => {
  const token = req.header('x-auth-token');

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, jwtSecrettoken);

    // Attach the user's ID to the request object for use in subsequent middleware or routes
    req.user = decoded;

    // Continue to the next middleware or route
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = requireAuth;
