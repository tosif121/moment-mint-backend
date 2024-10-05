const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token || token.split('.').length !== 3) {
    return res.status(403).json({ message: 'Access denied. Invalid token format.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Tosssi@2121');
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token.' });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token has expired.' });
    } else {
      console.error('Error in authMiddleware:', error);
      return res.status(500).json({ message: 'An error occurred while verifying the token.' });
    }
  }
};

module.exports = authMiddleware;
