require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Measuring media data sizes via raw SQL...");
  try {
    // We join the array and check the length of the resulting text to estimate size
    const stats = await prisma.$queryRaw`
      SELECT 
        id, 
        content,
        octet_length(cast("mediaUrls" as text)) as "byteSize"
      FROM "Post" 
      ORDER BY "createdAt" DESC 
      LIMIT 10
    `;
    
    stats.forEach(s => {
      const mb = (Number(s.byteSize) / (1024 * 1024)).toFixed(2);
      console.log(`Post ID: ${s.id} | Approximate Size: ${mb} MB | Content: ${s.content?.substring(0, 30)}...`);
    });
  } catch (e) {
    console.error("SQL Error:", e);
  }
}

run().finally(() => prisma.$disconnect());
