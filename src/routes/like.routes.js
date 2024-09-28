const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const LikeController = require('../controllers/likeController');

// Like routes
router.post('/', authMiddleware, LikeController.toggleLike);
router.get('/', authMiddleware, LikeController.getLikes);

module.exports = router;
