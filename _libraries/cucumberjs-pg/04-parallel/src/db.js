const { Pool } = require('pg');

let pool;

function getPool() {
    if(!pool) {
        pool = new Pool({
            connectionString: 'postgresql://user:password@localhost:5432/yourdb'
        });
    }
    return pool;
}

module.exports = getPool();