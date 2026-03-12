require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Searching for user valormasivo@gmail.com...");
  const user = await prisma.user.findFirst({
    where: { 
      OR: [
        { email: 'valormasivo@gmail.com' },
        { username: 'valormasivo@gmail.com' }
      ]
    }
  });

  if (!user) {
    console.log("User not found.");
    return;
  }

  console.log(`Found user ID: ${user.id}`);
  const posts = await prisma.post.findMany({
    where: { creatorId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  console.log(`Found ${posts.length} posts.`);
  posts.forEach((p, i) => {
    if (p.mediaUrls && p.mediaUrls.length > 0) {
      const url = p.mediaUrls[0];
      console.log(`Post ${p.id}: startsWith=${url.substring(0, 50)}... length=${url.length}`);
      // Check for common video patterns and log matches
      const isVideo = url.startsWith('data:video/') || url.match(/\.(mp4|webm|ogg|mov)(?:\?|$)/i);
      console.log(`Detected as video? ${isVideo}`);
    } else {
      console.log(`Post ${p.id}: No mediaUrls`);
    }
  });
}

run().then(() => prisma.$disconnect()).catch(console.error);
