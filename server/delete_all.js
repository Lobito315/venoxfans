const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteAllPosts() {
  try {
    const result = await prisma.post.deleteMany({});
    console.log(`Successfully deleted ${result.count} posts.`);
  } catch (error) {
    console.error('Error deleting posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllPosts();
