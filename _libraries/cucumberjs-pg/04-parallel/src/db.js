const { Pool } = require('pg');

function createPool() {
    const workerId = process.env.CUCUMBER_WORKER_ID || 'default';
    const schemaName = `test_schema_${workerId}`;

    const pool = new Pool({
        connectionString: 'postgresql://user:password@localhost:5432/yourdb'
    });

    pool.on('connect', async (client) => {
        await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
        await client.query(`SET search_path TO ${schemaName}`);
    });

    return pool;
}

module.exports = createPool();