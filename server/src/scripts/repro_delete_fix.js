const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function runTest() {
    try {
        // 1. Get or create a creator
        let creator = await prisma.user.findFirst({ where: { isCreator: true } });
        if (!creator) {
            console.log("No creator found, creating one...");
            creator = await prisma.user.create({
                data: {
                    email: `test_creator_${Date.now()}@example.com`,
                    username: `test_creator_${Date.now()}`,
                    isCreator: true
                }
            });
        }
        console.log(`Using creator: ${creator.id}`);

        // 2. Create a post
        console.log("Creating post...");
        const post = await prisma.post.create({
            data: {
                creatorId: creator.id,
                content: "Test post for simplified deletion",
                mediaUrls: ["https://example.com/media.jpg"],
                isPremium: false
            }
        });
        console.log(`Post created: ${post.id}`);

        // 3. Add a like and a comment
        console.log("Adding like and comment...");
        await prisma.like.create({ data: { postId: post.id, userId: creator.id } });
        await prisma.comment.create({ data: { postId: post.id, userId: creator.id, content: "Test comment" } });

        // 4. Try to delete the post using NEW simplified controller logic
        console.log("Attempting simplified deletion (direct post.delete)...");
        
        await prisma.post.delete({ where: { id: post.id } });

        console.log("Post deleted successfully via cascading!");

        // 5. Verify records are gone
        const likeCount = await prisma.like.count({ where: { postId: post.id } });
        const commentCount = await prisma.comment.count({ where: { postId: post.id } });
        console.log(`Orphaned Likes found: ${likeCount}, Comments: ${commentCount}`);

        if (likeCount === 0 && commentCount === 0) {
            console.log("VERIFICATION SUCCESS: Records were correctly cascaded by the DB.");
        } else {
            console.error("VERIFICATION FAILED: Cascading did not work as expected.");
        }

    } catch (e) {
        console.error("DELETION FAILED:", e);
    } finally {
        await prisma.$disconnect();
    }
}

runTest();
