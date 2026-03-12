require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Checking for double-encoding...");
  const post = await prisma.post.findFirst({
    where: { 
      mediaUrls: { hasSome: ['data:'] } // This doesn't work for substrings in arrays easily
    },
    orderBy: { createdAt: 'desc' }
  });

  // Let's just get the latest post and check its structure
  const latest = await prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  latest.forEach(p => {
    console.log(`Post ${p.id}: type(mediaUrls)=${typeof p.mediaUrls} isArray=${Array.isArray(p.mediaUrls)}`);
    if (p.mediaUrls && p.mediaUrls.length > 0) {
      const first = p.mediaUrls[0];
      console.log(`First element type: ${typeof first}`);
      console.log(`First 20 chars: ${JSON.stringify(first.substring(0, 20))}`);
    }
  });
}

run().finally(() => prisma.$disconnect());
