const express = require('express');
const { uploadImage } = require('../controllers/imageController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message,
    });
  }
  next(err);
};

router.post('/uploadImage', upload.single('file'), handleMulterError, uploadImage);

module.exports = router;
