require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Analyzing DB record sizes...");
  const posts = await prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      mediaUrls: true,
      content: true
    }
  });

  posts.forEach(p => {
    let totalMediaSize = 0;
    if (p.mediaUrls) {
      p.mediaUrls.forEach(url => totalMediaSize += url.length);
    }
    const sizeInMB = (totalMediaSize / (1024 * 1024)).toFixed(2);
    console.log(`Post ID: ${p.id} | Media Size: ${sizeInMB} MB | Content: ${p.content?.substring(0, 30)}...`);
  });
}

run().catch(console.error).finally(() => prisma.$disconnect());
