require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Listing latest 10 posts from ALL users...");
  const posts = await prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      creator: { select: { id: true, username: true, email: true } }
    }
  });

  console.log(`Found ${posts.length} posts.`);
  posts.forEach(p => {
    console.log(`Post ID: ${p.id} | Creator: ${p.creator.username} (${p.creator.email})`);
    if (p.mediaUrls && p.mediaUrls.length > 0) {
      console.log(`Prefix: ${p.mediaUrls[0].substring(0, 150)}`);
      console.log(`Length: ${p.mediaUrls[0].length}`);
    }
    console.log('---');
  });
}

run().catch(console.error).finally(() => prisma.$disconnect());
