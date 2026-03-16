const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

async function testUpload() {
    console.log("Testing S3 upload to bucket:", process.env.AWS_S3_BUCKET_NAME);
    const s3Client = new S3Client({
        region: process.env.AWS_REGION || 'us-east-2',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
    });

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME || 'venox-st',
        Key: `test-${Date.now()}.txt`,
        Body: "Hello from VenoxFans Debug",
        ContentType: "text/plain"
    });

    try {
        const response = await s3Client.send(command);
        console.log("Upload successful!", response);
    } catch (error) {
        console.error("Upload failed:", error);
    }
}

testUpload();
