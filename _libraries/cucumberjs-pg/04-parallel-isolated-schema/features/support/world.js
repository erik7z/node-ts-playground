const {setWorldConstructor, BeforeAll, AfterAll} = require('@cucumber/cucumber');
const app = require('../../src/app');
const supertest = require('supertest');
const pool = require('../../src/db')

class CustomWorld {
    constructor() {
        this.request = supertest(app);
    }
}

setWorldConstructor(CustomWorld);

let server;

BeforeAll(async function () {
    if (!server) {
        server = await app.listen(0);
    }

    const workerId = process.env.CUCUMBER_WORKER_ID || 'default';
    const schemaName = `test_schema_${workerId}`;
    await pool.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
    await pool.query(`SET search_path TO ${schemaName}`);
    await pool.query('CREATE TABLE IF NOT EXISTS your_table (id SERIAL PRIMARY KEY, data TEXT NOT NULL)')
});

AfterAll(async function () {
    const workerId = process.env.CUCUMBER_WORKER_ID || 'default';
    const schemaName = `test_schema_${workerId}`;
    await pool.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);

    if(server) {
        await server.close();
        server = null;
    }
});
