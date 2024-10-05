const express = require('express');
const { uploadImage } = require('../controllers/imageController');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/uploadImage', authMiddleware, upload.single('file'), uploadImage);

module.exports = router;
