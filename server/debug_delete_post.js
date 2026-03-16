require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDelete(postId) {
    console.log(`Attempting to delete post: ${postId}`);
    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                likes: true,
                comments: true,
                purchasers: true
            }
        });

        if (!post) {
            console.log("Post not found.");
            return;
        }

        console.log(`Found post with ${post.likes.length} likes, ${post.comments.length} comments, and ${post.purchasers.length} purchases.`);

        await prisma.post.delete({
            where: { id: postId }
        });

        console.log("Post deleted successfully from Prisma.");
    } catch (error) {
        console.error("Error during deletion:", error);
    }
}

// Find a post with likes or comments to test cascade delete
async function run() {
    const postsWithInteractions = await prisma.post.findMany({
        where: {
            OR: [
                { likes: { some: {} } },
                { comments: { some: {} } }
            ]
        },
        take: 1,
        include: { _count: { select: { likes: true, comments: true } } }
    });

    if (postsWithInteractions.length > 0) {
        await testDelete(postsWithInteractions[0].id);
    } else {
        console.log("No posts with likes/comments found. Trying any oldest post...");
        const oldest = await prisma.post.findMany({
            take: 1,
            orderBy: { createdAt: 'asc' }
        });
        if (oldest.length > 0) {
            await testDelete(oldest[0].id);
        } else {
            console.log("No posts at all.");
        }
    }
}

run().finally(() => prisma.$disconnect());
