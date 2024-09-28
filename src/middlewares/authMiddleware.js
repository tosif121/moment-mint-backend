const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Import your User model

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from the authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret
    req.user = await User.findByPk(decoded.id); // Attach user to the request

    if (!req.user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid.', error: error.message });
  }
};

module.exports = authMiddleware;
