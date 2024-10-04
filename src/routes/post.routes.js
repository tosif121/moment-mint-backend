const express = require('express');
const router = express.Router();
const multer = require('multer');
const { validateUploadRequest } = require('../middlewares/validation');
const { uploadImage, getFeed, getPostById, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 52428800 },
});

router.post('/upload', authMiddleware, upload.single('image'), validateUploadRequest, uploadImage);
router.get('/feed', authMiddleware, getFeed);
router.get('/:id', authMiddleware, getPostById);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
