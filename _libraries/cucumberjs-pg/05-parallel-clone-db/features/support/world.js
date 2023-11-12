const {setWorldConstructor, BeforeAll, AfterAll, setDefaultTimeout} = require('@cucumber/cucumber');
const app = require('../../src/app');
const supertest = require('supertest');
const getPool = require('../../src/db')

class CustomWorld {
    constructor() {
        this.request = supertest(app);
    }
}

setDefaultTimeout(10 * 1000);
setWorldConstructor(CustomWorld);

let server;

BeforeAll(async function () {
    if (!server) {
        server = await app.listen(0);
    }
    const pool = await getPool()
    await pool.query('CREATE TABLE IF NOT EXISTS your_table (id SERIAL PRIMARY KEY, data TEXT NOT NULL)')
});

AfterAll(async function () {
    if (server) {
        await server.close();
        server = null;
    }
});
