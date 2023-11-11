const jwt = require('jsonwebtoken');
const { jwtSecrettoken } = require('./generateKeys'); 

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.header('x-auth-token'); // Assuming you send the token in a header
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecrettoken);
    req.user = decoded; // Store user data in the request for further use
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
}

// Example of using the verifyToken middleware
