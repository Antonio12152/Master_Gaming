const express = require('express');
const { client } = require('../client');

const users = express.Router();

async function getUsers() {
    const query = `
    SELECT 
        users.id, 
        users.name AS username, 
        users.about,
        users.email,
        to_char(users.created_at, 'yyyy/mm/dd') AS user_created_at,
        users.img AS user_img
    FROM 
        users
    `;

    try {
        const result = await client.query(query);
        return result.rows;
    } catch (err) {
        console.error('Query error', err.stack);
        throw err;
    }
}

users.get(`/users`, (req, res) => {
    (async () => {
        try {
            const posts = await getUsers();
            res.json(posts)
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    })();
});

module.exports = users