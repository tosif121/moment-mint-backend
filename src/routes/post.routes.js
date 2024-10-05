const express = require('express');
const multer = require('multer');
const router = express.Router();
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ensure these are correctly defined and not undefined
router.post('/createPosts', authMiddleware, upload.single('file'), createPost);
router.get('/posts', authMiddleware, getAllPosts);
router.get('/posts/:id', authMiddleware, getPostById);
router.put('/posts/:id', authMiddleware, upload.single('file'), updatePost);
router.delete('/posts/:id', authMiddleware, deletePost);

module.exports = router;
