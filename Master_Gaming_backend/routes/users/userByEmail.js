const express = require('express');
const { client } = require('../../client');
const user = express.Router();

async function getUserByEmail(email) {
    const query = `
    SELECT 
        id, 
        name AS username, 
        about,
        email,
        to_char(created_at, 'yyyy/mm/dd') AS user_created_at,
        img AS user_img
    FROM 
        users
    WHERE
        email = $1
    `;

    try {
        const result = await client.query(query, [email]);
        return result.rows[0];
    } catch (err) {
        console.error('Query error', err.stack);
        throw err;
    }
}

user.get('/users/email/:email', async (req, res) => {
    const email = req.params.email;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const userData = await getUserByEmail(email);

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(userData);
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = user;
