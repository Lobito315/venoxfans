require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const p = await prisma.post.findUnique({
    where: { id: '7b1bfe66-f9a6-4c86-a0be-e259564f5761' },
    include: { creator: true }
  });

  if (!p) {
    console.log("Post fe316836 not found. Trying another recent one...");
    const recent = await prisma.post.findMany({ take: 1, orderBy: { createdAt: 'desc' }, include: { creator: true } });
    if (recent.length > 0) {
      console.log("Latest post:", JSON.stringify({
        id: recent[0].id,
        creator: {
          username: recent[0].creator.username,
          email: recent[0].creator.email
        }
      }, null, 2));
    }
  } else {
    console.log("Post found:", JSON.stringify({
        id: p.id,
        creator: {
          username: p.creator.username,
          email: p.creator.email
        }
    }, null, 2));
  }
}

run().finally(() => prisma.$disconnect());
