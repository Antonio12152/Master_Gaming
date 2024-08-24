const express = require('express');
const bcrypt = require('bcrypt');
const { client } = require('../client');
const login = express.Router();

async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

async function loginUser(name, password) {
    const userQuery = `
        SELECT id, name, password
        FROM users
        WHERE name = $1;
    `;
    const userResult = await client.query(userQuery, [name]);
    if (userResult.rows.length === 0) {
        throw new Error('User not found');
    }
    const user = userResult.rows[0];
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid password');
    }
    return user;
}

login.post('/login', async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await loginUser(name, password);

        req.session.user = { id: user.id }

        res.status(200).json({ message: `Welcome, ${user.name}!` });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(401).json({ message: err.message });
    }
});

module.exports = login;