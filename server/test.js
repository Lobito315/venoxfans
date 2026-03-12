require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Checking DB...");
  const posts = await prisma.post.findMany({ take: 5, orderBy: { createdAt: 'desc' }});
  posts.forEach(p => console.log(p.mediaUrls));
}
run().then(() => prisma.$disconnect()).catch(console.error);
