require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const users = await prisma.user.findMany();
  console.log("USERS IN DB:");
  users.forEach(u => console.log(`${u.id} | ${u.username} | ${u.email}`));

  const posts = await prisma.post.findMany({ include: { creator: true } });
  console.log("\nPOSTS IN DB:");
  posts.forEach(p => {
    console.log(`${p.id} | ${p.creator.username} | ${p.mediaUrls?.length > 0 ? p.mediaUrls[0].substring(0, 50) : 'NO MEDIA'}`);
  });
}

run().finally(() => prisma.$disconnect());
