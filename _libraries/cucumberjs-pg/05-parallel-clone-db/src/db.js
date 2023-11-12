const { Pool } = require('pg');

let pool;

async function cloneDatabase(new_db_name) {


    const originalDb = 'original_db';
    const adminPool = new Pool({
        connectionString: `postgresql://user:password@localhost:5432/postgres`
    });
    const adminClient = await adminPool.connect();

    await adminClient.query(`DROP DATABASE IF EXISTS ${new_db_name};`);
    await adminClient.query(`CREATE DATABASE ${new_db_name} WITH TEMPLATE ${originalDb};`);
    await adminClient.release();
    adminPool.end()
}

async function getPool() {
    if(!pool) {
        const workerId = process.env.CUCUMBER_WORKER_ID || 'default';
        const new_db_name = `db_clone_${workerId}`;

        await cloneDatabase(new_db_name);

        pool = new Pool({connectionString: `postgresql://user:password@localhost:5432/${new_db_name}`});
        await pool.connect();
    }
    return pool
}

module.exports = getPool