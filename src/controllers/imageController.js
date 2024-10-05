const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { fromEnv } = require('@aws-sdk/credential-providers');
const { createPost } = require('./postController');

const { AWS_REGION, AWS_S3_BUCKET } = process.env;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: fromEnv(),
});

async function uploadImageToS3(folderName, file) {
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.originalname.replace(/\s+/g, '_')}`;

  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: `${folderName}/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    return {
      url: `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${folderName}/${fileName}`,
      key: `${folderName}/${fileName}`,
      timestamp,
    };
  } catch (err) {
    console.error('S3 upload error:', err);
    throw new Error('Upload to S3 failed: ' + err.message);
  }
}

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const { uploadType, activity } = req.body;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const s3Result = await uploadImageToS3(uploadType, file,);

    return res.status(200).json({
      imageUrl: s3Result.url,
      message: 'Image uploaded successfully.',
      fileName: file.originalname,
      uploadType,
      activity,
      timestamp: s3Result.timestamp,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const params = {
      Bucket: AWS_S3_BUCKET,
      Prefix: `profiles/${userId}_`,
      MaxKeys: 1,
    };

    const command = new ListObjectsV2Command(params);
    const data = await s3Client.send(command);
    const profilePicture = data.Contents[0]
      ? `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${data.Contents[0].Key}`
      : null;

    res.status(200).json({
      status: true,
      message: 'User profile retrieved successfully',
      data: {
        userId,
        profilePicture,
      },
    });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.getFeed = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  try {
    const params = {
      Bucket: AWS_S3_BUCKET,
      Prefix: 'posts/',
      MaxKeys: limit,
      StartAfter: `posts/${page > 1 ? (page - 1) * limit : ''}`,
    };

    const command = new ListObjectsV2Command(params);
    const data = await s3Client.send(command);
    const posts = data.Contents.map((item) => ({
      url: `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${item.Key}`,
      userId: item.Key.split('_')[1],
      timestamp: new Date(parseInt(item.Key.split('_')[2])).toISOString(),
    }));

    res.status(200).json({
      status: true,
      message: 'Feed retrieved successfully',
      data: posts,
      nextPage: data.IsTruncated ? page + 1 : null,
    });
  } catch (error) {
    console.error('Error retrieving feed:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
