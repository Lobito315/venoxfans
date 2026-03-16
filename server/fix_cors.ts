import { S3Client, GetBucketCorsCommand, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const client = new S3Client({
    region: process.env.AWS_REGION || "us-east-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

const bucketName = process.env.AWS_S3_BUCKET_NAME || "venox-st";

async function fixCors() {
    try {
        console.log(`Checking CORS for bucket: ${bucketName}`);
        try {
            const getCors = await client.send(new GetBucketCorsCommand({ Bucket: bucketName }));
            console.log("Current CORS:", JSON.stringify(getCors.CORSRules, null, 2));
        } catch (err) {
            console.log("No CORS configuration found or error:", err.message);
        }

        console.log("Applying new CORS configuration...");
        const putCorsCommand = new PutBucketCorsCommand({
            Bucket: bucketName,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: ["*"],
                        AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                        AllowedOrigins: ["*"],
                        ExposeHeaders: ["ETag"],
                        MaxAgeSeconds: 3000,
                    },
                ],
            },
        });
        await client.send(putCorsCommand);
        console.log("CORS updated successfully!");
    } catch (err) {
        console.error("Error setting CORS:", err);
    }
}

fixCors();
