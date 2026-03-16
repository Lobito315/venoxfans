require('dotenv').config();
const { S3Client, GetBucketLocationCommand } = require("@aws-sdk/client-s3");

async function getRegion() {
    const s3Client = new S3Client({
        region: 'us-west-2', // Trying us-west-2 based on Supabase region in .env
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
    });

    const command = new GetBucketLocationCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME || 'venox-st'
    });

    try {
        const response = await s3Client.send(command);
        console.log("Bucket Location Constraint:", response.LocationConstraint);
        console.log("Region should be:", response.LocationConstraint || 'us-east-1');
    } catch (error) {
        console.error("Failed to get bucket location:", error);
    }
}

getRegion();
