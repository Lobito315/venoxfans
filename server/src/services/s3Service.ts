import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

export const generatePresignedUrl = async (fileName: string, contentType: string) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME || 'venox-st';
    const key = `uploads/${Date.now()}-${fileName}`;
    
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
    });

    // URL expires in 15 minutes
    const url = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    
    return {
        uploadUrl: url,
        fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-2'}.amazonaws.com/${key}`
    };
};

export const deleteObjects = async (urls: string[]) => {
    const { DeleteObjectsCommand } = await import("@aws-sdk/client-s3");
    const bucketName = process.env.AWS_S3_BUCKET_NAME || 'venox-st';
    
    // Extract keys from URLs
    // Example URL: https://venox-st.s3.us-east-2.amazonaws.com/uploads/123456789-file.jpg
    const keys = urls.map(url => {
        const parts = url.split('.amazonaws.com/');
        return parts.length > 1 ? parts[1] : null;
    }).filter(key => key !== null) as string[];

    if (keys.length === 0) return;

    try {
        const command = new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: {
                Objects: keys.map(Key => ({ Key }))
            }
        });
        await s3Client.send(command);
    } catch (error) {
        console.error("Error deleting objects from S3:", error);
    }
};
