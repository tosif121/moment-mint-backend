const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createComment, getComments, updateComment, deleteComment } = require('../controllers/commentController');

// Comment routes
router.post('/createComment', authMiddleware, createComment);
router.get('/posts/:postId', authMiddleware, getComments);
router.post('/updateComment', authMiddleware, updateComment);
router.post('/deleteComment', authMiddleware, deleteComment);

module.exports = router;
