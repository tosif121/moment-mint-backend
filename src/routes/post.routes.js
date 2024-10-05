const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getCurrentUserPosts,
} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/createPosts', authMiddleware, upload.single('file'), createPost);
router.get('/posts', authMiddleware, getAllPosts);
router.get('/myPosts', authMiddleware, getCurrentUserPosts);
router.get('/posts/:id', authMiddleware, getPostById);
router.post('/posts/:id', authMiddleware, upload.single('file'), updatePost);
router.post('/posts/:id', authMiddleware, deletePost);

module.exports = router;
