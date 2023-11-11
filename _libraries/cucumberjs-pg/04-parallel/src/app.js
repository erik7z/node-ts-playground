const express = require('express');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
    connectionString: 'postgresql://user:password@localhost:5432/yourdb'
});

app.get('/', async (req, res) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 3000));

        const { rows } = await pool.query('SELECT * FROM your_table');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = app;