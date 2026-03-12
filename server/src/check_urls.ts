import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  
  console.log("Latest Media URLs:");
  posts.forEach(post => {
      console.log(`Post ID: ${post.id}`);
      console.log(`Media URLs: ${JSON.stringify(post.mediaUrls)}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
