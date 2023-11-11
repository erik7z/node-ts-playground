const express = require('express');
const pool = require("./db");

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const { rows } = await pool.query('SELECT * FROM your_table');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/add', async (req, res) => {
    try {
        const { data } = req.body;
        await new Promise(resolve => setTimeout(resolve, 2000));

        const result = await pool.query('INSERT INTO your_table (data) VALUES ($1) RETURNING *', [data]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = app;