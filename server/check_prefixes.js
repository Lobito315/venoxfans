require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Checking last 5 posts...");
  const posts = await prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      mediaUrls: true
    }
  });

  posts.forEach(p => {
    if (p.mediaUrls && p.mediaUrls.length > 0) {
      const url = p.mediaUrls[0];
      console.log(`Post ID: ${p.id}`);
      console.log(`Prefix: ${url.substring(0, 50)}...`);
      console.log(`Length: ${url.length}`);
    }
  });
}

run().finally(() => prisma.$disconnect());
