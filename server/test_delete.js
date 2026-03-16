const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testDelete() {
    try {
        console.log("Fetching a post...");
        const post = await prisma.post.findFirst({
            include: {
                likes: true,
                comments: true
            }
        });

        if (!post) {
            console.log("No posts found in the database to test.");
            return;
        }

        console.log(`Found post: ${post.id}. Likes: ${post.likes.length}, Comments: ${post.comments.length}`);
        
        console.log(`Attempting to delete post ${post.id}...`);
        await prisma.post.delete({
            where: { id: post.id }
        });
        
        console.log("Post deleted successfully!");
    } catch (e) {
        console.error("Error deleting post:", e);
    } finally {
        await prisma.$disconnect();
    }
}

testDelete();
