require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Checking for user valormasivo...");
  const users = await prisma.user.findMany({
    where: { 
      OR: [
        { email: { contains: 'valormasivo' } },
        { username: { contains: 'valormasivo' } }
      ]
    },
    select: { id: true, username: true, email: true }
  });

  console.log("Found users matching 'valormasivo':", JSON.stringify(users, null, 2));

  if (users.length === 0) {
     console.log("No such user. Listing ALL posts recently created...");
     const allPosts = await prisma.post.findMany({
       take: 5,
       orderBy: { createdAt: 'desc' },
       select: { id: true, mediaUrls: true, creatorId: true }
     });
     allPosts.forEach(p => {
       console.log(`Post ID: ${p.id} | Creator: ${p.creatorId}`);
       if (p.mediaUrls && p.mediaUrls.length > 0) {
         console.log(`Prefix: ${p.mediaUrls[0].substring(0, 100)}`);
       }
     });
     return;
  }

  const userId = users[0].id;
  const posts = await prisma.post.findMany({
    where: { creatorId: userId },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  console.log(`Found ${posts.length} posts for user ${userId}`);
  posts.forEach(p => {
    console.log(`Post ID: ${p.id}`);
    if (p.mediaUrls && p.mediaUrls.length > 0) {
      console.log(`Prefix: ${p.mediaUrls[0].substring(0, 100)}`);
      console.log(`Type: ${typeof p.mediaUrls[0]}`);
      console.log(`Length: ${p.mediaUrls[0].length}`);
    }
  });
}

run().catch(console.error).finally(() => prisma.$disconnect());
