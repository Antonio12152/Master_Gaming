const express = require('express');
const bcrypt = require('bcrypt');
const { client } = require('../../client');

const updateUser = express.Router();

async function verifyPassword(userEmail, password) {
    const query = `SELECT id, password FROM users WHERE email = $1 AND is_deleted = false`;
    const result = await client.query(query, [userEmail]);

    if (result.rows.length === 0) {
        throw new Error('User not found');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    return id;
}

async function updateUserData(id, name, img, about) {
    try {
        const userCheckByNameQuery = `SELECT id FROM users WHERE name = $1 AND id != $2`;
        const nameCheckResult = await client.query(userCheckByNameQuery, [name, id]);

        if (nameCheckResult.rows.length > 0) {
            throw new Error('Username already exists');
        }

        const updateQuery = `
            UPDATE users
            SET name = $1, img = $2, about = $3, updated_at = NOW()
            WHERE id = $4;
        `;
        await client.query(updateQuery, [name, img, about, id]);
    } catch (err) {
        console.error('Error updating user:', err);
        throw err;
    }
}

updateUser.put('/users/update', async (req, res) => {
    const { name, email, password, img, about } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, password, and email are required' });
    }

    try {
        const userId = await verifyPassword(email, password);

        await updateUserData(userId, name, img, about);
        res.status(200).send({ message: `Account ${name} updated successfully!` });
    } catch (err) {
        console.error('Error updating user:', err);
        if (err.message === 'Username already exists') {
            res.status(409).json({ err: 'Username already exists!' });
        } else if (err.message === 'Incorrect password') {
            res.status(401).json({ err: 'Incorrect password' });
        } else if (err.message === 'User not found') {
            res.status(404).json({ err: 'User not found' });
        } else {
            res.status(500).json({ err: 'Internal server error' });
        }
    }
});

module.exports = updateUser;
