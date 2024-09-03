const express = require('express');
const { client } = require('../client');

const user = express.Router();

async function getUserIdByName(name) {
    const query = `
    SELECT 
        id
    FROM 
        users
    WHERE
        name = $1
    `;

    try {
        const result = await client.query(query, [name]);
        return result.rows[0]?.id;
    } catch (err) {
        console.error('Query error', err.stack);
        throw err;
    }
}

async function getUserById(id) {
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
    WHERE
        users.id = $1
    `;

    try {
        const result = await client.query(query, [id]);
        return result.rows;
    } catch (err) {
        console.error('Query error', err.stack);
        throw err;
    }
}

user.get(`/users/:username`, (req, res) => {
    (async () => {
        try {
            const username = req.params.username;
            const userId = await getUserIdByName(username);
            const posts = await getUserById(userId);
            res.json(posts)
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    })();
});

module.exports = user