const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { toggleLike, getLikes } = require('../controllers/likeController');

// Like routes
router.post('/toggleLike', authMiddleware, toggleLike);
router.get('/getLikes', authMiddleware, getLikes);

module.exports = router;
