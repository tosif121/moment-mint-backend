const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const CommentController = require('../controllers/commentController');

// Comment routes
router.post('/', authMiddleware, CommentController.createComment);
router.get('/posts/:postId', authMiddleware, CommentController.getComments);
router.put('/:id', authMiddleware, CommentController.updateComment);
router.delete('/:id', authMiddleware, CommentController.deleteComment);

module.exports = router;
