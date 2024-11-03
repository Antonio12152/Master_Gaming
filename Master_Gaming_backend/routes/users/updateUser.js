const express = require('express');
const { client } = require('../../client');

const updateUser = express.Router();

async function verifyPassword(userId, password) {
    const query = `SELECT password FROM users WHERE id = $1`;
    const result = await client.query(query, [userId]);

    if (result.rows.length === 0) {
        throw new Error('User not found');
    }

    const hashedPassword = result.rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
        throw new Error('Incorrect password');
    }
}

async function updateUserData(id, name, email, img, about) {
    try {
        const userCheckQuery = `
            SELECT id
            FROM users
            WHERE email = $1 AND id != $2;
        `;
        const userCheckResult = await client.query(userCheckQuery, [email, id]);

        if (userCheckResult.rows.length === 0) {
            throw new Error('User not found');
        }

        const updateQuery = `
            UPDATE users
            SET name = $1, email = $2, img = $3, about = $4
            WHERE id = $5;
        `;
        await client.query(updateQuery, [name, email, img, about, id]);
    } catch (err) {
        console.error('Error updating user:', err);
        throw err;
    }
}

updateUser.put('/updateUser', async (req, res) => {
    const { id, name, email, img, about } = req.body;

    if (!id || !name || !email) {
        return res.status(400).json({ message: 'User ID, name, and email are required' });
    }

    try {
        await verifyPassword(id, password);

        await updateUserData(id, name, email, img, about);
        res.status(200).send({ message: `Account ${name} updated successfully!` });
    } catch (err) {
        console.error('Error updating user:', err);
        if (err.message === 'Username or email already exists') {
            res.status(409).json({ err: 'Username or email already exists!' });
        } else {
            res.status(500).json({ err: 'Internal server error' });
        }
    }
});

module.exports = updateUser;
