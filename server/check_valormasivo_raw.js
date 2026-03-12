require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Measuring media prefixes via raw SQL...");
  try {
    const user = await prisma.$queryRaw`SELECT id FROM "User" WHERE email = 'valormasivo@gmail.com' LIMIT 1`;
    if (user.length === 0) {
      console.log("User not found.");
      return;
    }
    const userId = user[0].id;

    const stats = await prisma.$queryRawUnsafe(`
      SELECT 
        id, 
        substring(cast("mediaUrls" as text) from 1 for 100) as "prefix",
        octet_length(cast("mediaUrls" as text)) as "size"
      FROM "Post" 
      WHERE "creatorId" = $1
      ORDER BY "createdAt" DESC 
      LIMIT 3
    `, userId);
    
    stats.forEach(s => {
      console.log(`Post ID: ${s.id}`);
      console.log(`Prefix: ${s.prefix}`);
      console.log(`Size: ${s.size} bytes`);
    });
  } catch (e) {
    console.error("SQL Error:", e);
  }
}

run().finally(() => prisma.$disconnect());
