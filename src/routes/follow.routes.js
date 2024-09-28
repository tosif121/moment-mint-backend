const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const FollowController = require('../controllers/followController');

// Follow routes
router.post('/', authMiddleware, FollowController.toggleFollow);
router.get('/users/:userId/followers', authMiddleware, FollowController.getFollowers);
router.get('/users/:userId/following', authMiddleware, FollowController.getFollowing);

module.exports = router;
