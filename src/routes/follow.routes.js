const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { toggleFollow, getFollowers, getFollowing } = require('../controllers/followController');

// Follow routes
router.post('/toggleFollow', authMiddleware, toggleFollow);
router.get('/users/:userId/followers', authMiddleware, getFollowers);
router.get('/users/:userId/following', authMiddleware, getFollowing);

module.exports = router;
