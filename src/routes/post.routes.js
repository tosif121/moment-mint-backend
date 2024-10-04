const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/posts', authMiddleware, createPost);

router.get('/posts', authMiddleware, getAllPosts);

router.get('/posts/:id', authMiddleware, getPostById);

router.post('/posts/:id', authMiddleware, updatePost);

router.post('/posts/:id', authMiddleware, deletePost);

module.exports = router;
