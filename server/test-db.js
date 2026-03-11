const { Client } = require('pg');
const connectionString = "postgresql://postgres:0460028059br1119@venoxfans-db.c5w6c4uog2o0.us-east-2.rds.amazonaws.com:5432/postgres?schema=public";

async function testConnection() {
    const client = new Client({
        user: 'postgres',
        host: 'venoxfans-db.c5w6c4uog2o0.us-east-2.rds.amazonaws.com',
        database: 'postgres',
        password: '0460028059br1119',
        port: 5432,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Successfully connected!');
        const res = await client.query('SELECT NOW()');
        console.log('Query success:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('Connection error detail:', err);
        process.exit(1);
    }
}

testConnection();
