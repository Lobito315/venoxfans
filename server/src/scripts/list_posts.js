const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function listPosts() {
    try {
        console.log("Database URL:", process.env.DATABASE_URL ? "Defined" : "UNDEFINED");
        const posts = await prisma.post.findMany({
            include: {
                _count: {
                    select: { likes: true, comments: true, purchasers: true }
                }
            }
        });
        console.log(`Total posts found: ${posts.length}`);
        posts.forEach(p => {
            console.log(`- ID: ${p.id}, Creator: ${p.creatorId}, Likes: ${p._count.likes}, Comments: ${p._count.comments}, Purchasers: ${p._count.purchasers}`);
        });
    } catch (e) {
        console.error("Error listing posts:", e);
    } finally {
        await prisma.$disconnect();
    }
}

listPosts();
