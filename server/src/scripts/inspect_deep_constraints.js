const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function inspectDeepSchema() {
    try {
        console.log("Inspecting foreign keys pointing to 'Purchase', 'Like', or 'Comment'...");
        const result = await prisma.$queryRaw`
            SELECT
                tc.table_name, 
                kcu.column_name, 
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name,
                rc.delete_rule
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                  AND ccu.table_schema = tc.table_schema
                JOIN information_schema.referential_constraints AS rc
                  ON rc.constraint_name = tc.constraint_name
            WHERE constraint_type = 'FOREIGN KEY' AND ccu.table_name IN ('Purchase', 'Like', 'Comment');
        `;
        console.table(result);
    } catch (e) {
        console.error("Error inspecting schema:", e);
    } finally {
        await prisma.$disconnect();
    }
}

inspectDeepSchema();
