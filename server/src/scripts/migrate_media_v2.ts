import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { uploadBase64Buffer } from '../services/s3Service';

// Ensure env variables are loaded from the server directory
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const prisma = new PrismaClient();

const DRY_RUN = process.argv.includes('--dry-run');

async function migrateContent(content: string, type: 'avatar' | 'cover' | 'post', id: string): Promise<string | null> {
    if (!content || !content.startsWith('data:')) return null;

    try {
        const matches = content.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            console.error(`[${type}] Invalid base64 format for ID: ${id}`);
            return null;
        }

        const contentType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        
        const extension = contentType.split('/')[1] || 'png';
        const fileName = `${type}-${id}.${extension}`;

        if (DRY_RUN) {
            console.log(`[DRY RUN] Would upload ${type} for ID ${id} (${buffer.length} bytes)`);
            return `https://cdn.mock.com/migrated/${fileName}`;
        }

        console.log(`[UPLOAD] Uploading ${type} for ID ${id}...`);
        const url = await uploadBase64Buffer(buffer, fileName, contentType);
        return url;
    } catch (error) {
        console.error(`[ERROR] Failed to migrate ${type} for ID ${id}:`, error);
        return null;
    }
}

async function main() {
    console.log(`--- Starting Media Migration (DRY_RUN: ${DRY_RUN}) ---`);

    // 1. Migrate User Avatars and Covers
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { avatarUrl: { startsWith: 'data:' } },
                { coverUrl: { startsWith: 'data:' } }
            ]
        }
    });

    console.log(`Found ${users.length} users with base64 media.`);

    for (const user of users) {
        let updatedData: any = {};

        if (user.avatarUrl?.startsWith('data:')) {
            const newUrl = await migrateContent(user.avatarUrl, 'avatar', user.id);
            if (newUrl) updatedData.avatarUrl = newUrl;
        }

        if (user.coverUrl?.startsWith('data:')) {
            const newUrl = await migrateContent(user.coverUrl, 'cover', user.id);
            if (newUrl) updatedData.coverUrl = newUrl;
        }

        if (Object.keys(updatedData).length > 0 && !DRY_RUN) {
            await prisma.user.update({
                where: { id: user.id },
                data: updatedData
            });
            console.log(`[UPDATED] User ${user.username} (${user.id})`);
        }
    }

    // 2. Migrate Post Media
    const posts = await prisma.post.findMany({
        where: {
            // Prisma doesn't support easy array-contains for startsWith, so we fetch all with any media
            mediaUrls: { isEmpty: false }
        }
    });

    console.log(`Scanning ${posts.length} posts for base64 media...`);

    for (const post of posts) {
        let hasChanges = false;
        const newMediaUrls = await Promise.all(post.mediaUrls.map(async (url, index) => {
            if (url.startsWith('data:')) {
                const newUrl = await migrateContent(url, 'post', `${post.id}-${index}`);
                if (newUrl) {
                    hasChanges = true;
                    return newUrl;
                }
            }
            return url;
        }));

        if (hasChanges && !DRY_RUN) {
            await prisma.post.update({
                where: { id: post.id },
                data: { mediaUrls: newMediaUrls }
            });
            console.log(`[UPDATED] Post ${post.id}`);
        }
    }

    console.log("--- Migration Complete ---");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
