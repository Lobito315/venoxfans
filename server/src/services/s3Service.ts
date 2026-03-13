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
    
    const cdnUrl = process.env.CDN_URL; // e.g. https://media.venoxfans.com
    const fileUrl = cdnUrl 
        ? `${cdnUrl.replace(/\/$/, '')}/${key}` 
        : `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-2'}.amazonaws.com/${key}`;

    return { uploadUrl: url, fileUrl };
};

export const deleteObjects = async (urls: string[]) => {
    const { DeleteObjectsCommand } = await import("@aws-sdk/client-s3");
    const bucketName = process.env.AWS_S3_BUCKET_NAME || 'venox-st';
    
    // Extract keys from URLs robustly
    const keys = urls.map(url => {
        try {
            const urlObj = new URL(url);
            // If it's an S3 URL like bucket.s3.region.amazonaws.com/key
            if (urlObj.hostname.includes('.amazonaws.com')) {
                const parts = url.split('.amazonaws.com/');
                return parts.length > 1 ? parts[1] : null;
            }
            // If it's a CDN URL like media.domain.com/key
            // Pathname starts with / so we remove it
            return urlObj.pathname.substring(1);
        } catch (e) {
            return null;
        }
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
