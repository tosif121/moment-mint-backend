const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { fromEnv } = require('@aws-sdk/credential-providers');

const { AWS_REGION, AWS_S3_BUCKET } = process.env;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: fromEnv(),
});

// Function to upload an image to S3
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
    await s3Client.send(command);
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

module.exports = {
  uploadImageToS3,
};
