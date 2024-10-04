const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { fromEnv } = require('@aws-sdk/credential-providers');
const { AWS_REGION, AWS_S3_BUCKET } = require('../config/config');

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: fromEnv(),
});

async function uploadImageToS3(folderName, file, userId) {
  const timestamp = Date.now();
  const fileName = `${userId}_${timestamp}_${file.originalname.replace(/\s+/g, '_')}`;
  const key = `${folderName}/${fileName}`;

  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return {
      url: `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`,
      key: key,
      userId,
      timestamp,
    };
  } catch (err) {
    console.error('S3 upload error:', err);
    throw new Error('Upload to S3 failed: ' + err.message);
  }
}

async function deleteFromS3(key) {
  const command = new DeleteObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
  });
  await s3Client.send(command);
}

module.exports = {
  uploadImageToS3,
  deleteFromS3,
};