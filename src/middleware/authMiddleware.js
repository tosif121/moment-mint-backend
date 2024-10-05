const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Adjust the path as necessary

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Tosssi@2121');
    req.user = await User.findByPk(decoded.id); // Assuming `id` is stored in the token
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
