const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function checkData() {
    try {
        const userCount = await prisma.user.count();
        const postCount = await prisma.post.count();
        console.log(`Users: ${userCount}, Posts: ${postCount}`);
        
        if (userCount > 0) {
            const users = await prisma.user.findMany({ take: 5, select: { id: true, username: true } });
            console.log("Sample Users:", users);
        }
    } catch (e) {
        console.error("Error checking data:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
