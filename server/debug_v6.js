require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Searching for any post by creator matching 'valormasivo'...");
  const posts = await prisma.post.findMany({
    where: {
      creator: {
        OR: [
          { username: { contains: 'valormasivo' } },
          { email: { contains: 'valormasivo' } }
        ]
      }
    },
    include: { creator: true }
  });

  console.log(`Found ${posts.length} posts.`);
  posts.forEach(p => {
    console.log(`Post ID: ${p.id} | Creator: ${p.creator.username} | Media count: ${p.mediaUrls?.length}`);
    if (p.mediaUrls?.length > 0) {
      console.log(`Prefix: ${p.mediaUrls[0].substring(0, 100)}`);
    }
  });
}

run().finally(() => prisma.$disconnect());
