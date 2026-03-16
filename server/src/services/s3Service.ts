import { S3Client, PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET = process.env.AWS_S3_BUCKET_NAME || 'venox-st';
const REGION = process.env.AWS_REGION || 'us-east-2';
const CDN_URL = process.env.CDN_URL || '';

/**
 * Returns the public CDN or S3 URL for a given object key.
 */
export const getCDNUrl = (key: string): string => {
    if (CDN_URL) {
        return `${CDN_URL.replace(/\/$/, '')}/${key}`;
    }
    return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
};

/**
 * Generates a presigned PUT URL for direct browser→S3 upload.
 * Returns { uploadUrl, fileUrl } where fileUrl is the public CDN/S3 URL.
 */
export const generatePresignedUrl = async (fileName: string, contentType: string) => {
    const key = `uploads/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: contentType,
    });

    // URL expires in 15 minutes
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    const fileUrl = getCDNUrl(key);

    console.log(`[S3] Presigned URL generated for key: ${key}`);
    console.log(`[S3] ContentType signed: ${contentType}`);
    return { uploadUrl, fileUrl, key };
};

/**
 * Uploads a buffer directly to S3 (used for server-side migrations).
 */
export const uploadBase64Buffer = async (buffer: Buffer, fileName: string, contentType: string): Promise<string> => {
    const key = `migrated/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    });

    await s3Client.send(command);
    console.log(`[S3] Buffer uploaded for key: ${key}`);
    return getCDNUrl(key);
};

/**
 * Extracts the S3 object key from a URL (CDN or direct S3 URL).
 * CDN URL format: https://venox-media.valormasivo.workers.dev/uploads/timestamp-file.ext
 * S3 URL format:  https://venox-st.s3.us-east-2.amazonaws.com/uploads/timestamp-file.ext
 */
const extractKeyFromUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url);

        // Direct S3 URL: extract everything after the .amazonaws.com/
        if (urlObj.hostname.includes('.amazonaws.com')) {
            const parts = url.split('.amazonaws.com/');
            const key = parts.length > 1 ? parts[1] : null;
            return key || null;
        }

        // CDN URL (Cloudflare Worker): pathname is /uploads/... → strip leading /
        const key = urlObj.pathname.substring(1); // e.g. "uploads/123-file.mp4"
        return key || null;
    } catch (e) {
        console.error(`[S3] Could not parse URL: ${url}`, e);
        return null;
    }
};

/**
 * Deletes one or more media files from S3 given their public URLs.
 * Logs the exact keys being deleted and surfaces any errors.
 */
export const deleteObjects = async (urls: string[]): Promise<void> => {
    const keys = urls.map(extractKeyFromUrl).filter((k): k is string => k !== null && k.length > 0);

    if (keys.length === 0) {
        console.warn('[S3] deleteObjects called but no valid keys could be extracted from URLs:', urls);
        return;
    }

    console.log(`[S3] Deleting ${keys.length} object(s) from bucket "${BUCKET}":`, keys);

    try {
        const command = new DeleteObjectsCommand({
            Bucket: BUCKET,
            Delete: {
                Objects: keys.map(Key => ({ Key })),
                Quiet: false, // surface per-object errors in the response
            },
        });

        const result = await s3Client.send(command);

        if (result.Deleted && result.Deleted.length > 0) {
            console.log(`[S3] Successfully deleted ${result.Deleted.length} object(s):`,
                result.Deleted.map(d => d.Key));
        }

        if (result.Errors && result.Errors.length > 0) {
            console.error('[S3] Some objects could not be deleted:', result.Errors);
        }
    } catch (error: any) {
        // Re-throw so the caller (deletePost) can log it properly
        console.error('[S3] DeleteObjects command failed:', error.message || error);
        throw error;
    }
};
