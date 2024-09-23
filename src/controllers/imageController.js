const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { fromEnv } = require('@aws-sdk/credential-providers');

const { AWS_REGION, AWS_S3_BUCKET } = process.env;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: fromEnv(),
});

async function uploadImageToS3(folderName, file, userId) {
  const timestamp = Date.now();
  const fileName = `${userId}_${timestamp}_${file.originalname.replace(/\s+/g, '_')}`;

  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: `${folderName}/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: 'public-read',
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    return {
      url: `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${folderName}/${fileName}`,
      key: `${folderName}/${fileName}`,
      userId,
      timestamp,
    };
  } catch (err) {
    console.error('S3 upload error:', err);
    throw new Error('Upload to S3 failed: ' + err.message);
  }
}

exports.uploadImage = async (req, res) => {
  console.log('Received upload request');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  const file = req.file;
  const { userId, uploadType } = req.body;
  
  if (!file) {
    console.log('No file uploaded');
    return res.status(400).json({ status: false, message: 'No file uploaded' });
  }

  if (file.size > 52428800) {
    console.log('File too large');
    return res.status(400).json({ status: false, message: 'File size must be less than 50MB' });
  }

  const folderName = uploadType === 'profile' ? 'profiles' : 'posts';

  try {
    console.log('Attempting to upload to S3');
    const uploadResult = await uploadImageToS3(folderName, file, userId);
    console.log('S3 upload result:', uploadResult);

    res.status(200).json({
      status: true,
      message: `${uploadType === 'profile' ? 'Profile picture' : 'Post'} uploaded successfully`,
      data: uploadResult,
    });
  } catch (error) {
    console.error('Upload process error:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user profile data from your database
    // const userProfile = await getUserProfileFromDatabase(userId);

    // For this example, we'll just return the latest profile picture
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
        // Include other user profile data here
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
    // In a real app, you'd fetch posts from your database, ordered by timestamp
    // Here's a simplified version using S3 directly (not recommended for production)
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
