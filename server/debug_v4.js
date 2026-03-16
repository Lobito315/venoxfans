require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Fetching latest posts media formats via raw SQL...");
  try {
    const stats = await prisma.$queryRaw`
      SELECT 
        p.id, 
        u.username,
        u.email,
        substring(cast(p."mediaUrls" as text) from 1 for 200) as "prefix",
        octet_length(cast(p."mediaUrls" as text)) as "size"
      FROM "Post" p
      JOIN "User" u ON p."creatorId" = u.id
      ORDER BY p."createdAt" DESC 
      LIMIT 10
    `;
    
    stats.forEach(s => {
      console.log(`Post ID: ${s.id} | Creator: ${s.username} (${s.email})`);
      console.log(`mediaUrls: ${s.prefix}`); // This will now show the full content since it's limited in query
      console.log(`Size: ${s.size} bytes`);
      console.log('---');
    });
  } catch (e) {
    console.error("SQL Error:", e);
  }
}

run().finally(() => prisma.$disconnect());
