require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Listing ALL users in DB...");
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true }
  });
  console.log(JSON.stringify(users, null, 2));

  console.log("Listing latest 10 posts with full data...");
  const posts = await prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { creator: true }
  });
  
  posts.forEach(p => {
    console.log(`Post ID: ${p.id} | Creator: ${p.creator.username} (${p.creator.email})`);
    if (p.mediaUrls && p.mediaUrls.length > 0) {
      console.log(`Format: ${p.mediaUrls[0].substring(0, 50)}...`);
    } else {
      console.log("No media");
    }
  });
}

run().finally(() => prisma.$disconnect());
