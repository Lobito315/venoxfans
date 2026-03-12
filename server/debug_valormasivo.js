require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Searching for user valormasivo...");
  const user = await prisma.user.findFirst({
    where: { 
      OR: [
        { email: 'valormasivo@gmail.com' },
        { username: 'valormasivo' },
        { username: 'valormasivo@gmail.com' }
      ]
    }
  });

  if (!user) {
    console.log("User not found.");
    return;
  }

  const posts = await prisma.post.findMany({
    where: { creatorId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  console.log(`Found ${posts.length} posts for ${user.username}`);
  posts.forEach(p => {
    if (p.mediaUrls && p.mediaUrls.length > 0) {
      const url = p.mediaUrls[0];
      console.log(`Post ID: ${p.id}`);
      console.log(`Preview (100 chars): ${url.substring(0, 100)}`);
      console.log(`Extension match? ${!!url.match(/\.(mp4|webm|ogg|mov|m4v|3gp|mkv|avi)(?:\?|$)/i)}`);
      console.log(`Size: ${(url.length / 1024).toFixed(2)} KB`);
      console.log('---');
    }
  });
}

run().finally(() => prisma.$disconnect());
