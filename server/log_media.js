require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Fetching sample media prefixes...");
  const posts = await prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: { mediaUrls: true }
  });

  posts.forEach((p, i) => {
    if (p.mediaUrls && p.mediaUrls.length > 0) {
      console.log(`Post ${i}: ${p.mediaUrls[0].substring(0, 30)}... (length: ${p.mediaUrls[0].length})`);
    }
  });
}
run().finally(() => prisma.$disconnect());
