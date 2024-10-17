const express = require('express');
const { client } = require('../client');

const tags = express.Router();

async function getTags() {
    const query = `
    SELECT 
        tags.id, 
        tags.name
	FROM 
        tags;
    `;
    try {
        const result = await client.query(query);
        return result.rows;
    } catch (err) {
        console.error('Query error', err.stack);
        throw err;
    }
}
tags.get('/tags', (req, res) => {
    (async () => {
        try {
            const tags = await getTags();
            res.json(tags)
        } catch (err) {
            console.error('Error fetching posts:', err);
            res.status(500).json({ err: 'Internal server error' });
        }
    })();
});

module.exports = tags 
