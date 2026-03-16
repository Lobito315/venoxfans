require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const p = await prisma.post.findUnique({
    where: { id: 'cfd094f8-17fc-4efc-aeae-9b5f581f70b0' },
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
    console.log("Post found:", JSON.stringify(p, null, 2));
    console.log("Type of mediaUrls:", typeof p.mediaUrls);
    console.log("Is array?", Array.isArray(p.mediaUrls));
  }
}

run().finally(() => prisma.$disconnect());
