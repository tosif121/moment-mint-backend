
const validateUploadRequest = (req, res, next) => {
  const file = req.file;
  const { uploadType, activity } = req.body;

  if (!file) {
    return res.status(400).json({ status: false, message: 'No file uploaded' });
  }

  if (file.size > 52428800) {
    return res.status(400).json({ status: false, message: 'File size must be less than 50MB' });
  }

  if (!['profile', 'post'].includes(uploadType)) {
    return res.status(400).json({ status: false, message: 'Invalid upload type' });
  }

  if (uploadType === 'post' && !activity) {
    return res.status(400).json({ status: false, message: 'Activity required for posts' });
  }

  next();
};

module.exports = {
  validateUploadRequest,
};
