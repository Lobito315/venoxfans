require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Checking structure...");
  const p = await prisma.post.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: { mediaUrls: true }
  });
  
  p.forEach((post, i) => {
    console.log(`Post ${i}: mediaUrls is array? ${Array.isArray(post.mediaUrls)}`);
    if (post.mediaUrls && post.mediaUrls.length > 0) {
      const val = post.mediaUrls[0];
      console.log(`Element 0: type=${typeof val} length=${val.length}`);
      console.log(`First 50 chars: ${JSON.stringify(val.substring(0, 50))}`);
    }
  });
}

run().catch(console.error).finally(() => prisma.$disconnect());
