const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function discoverTables() {
    try {
        const result = await prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        console.log("Tables in database:", result);
    } catch (e) {
        console.error("Error discovering tables:", e);
    } finally {
        await prisma.$disconnect();
    }
}

discoverTables();
