const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createComment, getComments, updateComment, deleteComment } = require('../controllers/commentController');

// Comment routes
router.post('/createComment', authMiddleware, createComment);
router.get('/posts/:postId', authMiddleware, getComments);
router.post('/updateComment:id', authMiddleware, updateComment);
router.post('/deleteComment:id', authMiddleware, deleteComment);

module.exports = router;
