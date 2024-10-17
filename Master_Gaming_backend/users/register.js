const bcrypt = require('bcrypt');
const express = require('express');
const { client } = require('../client');

const register = express.Router();

const saltRounds = 10;

async function hashPassword(password) {
    let pass = password.toString();
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(pass, salt);
    return hash;
}

async function pushUser(name, email, password, img, about) {
    try {
        const userCheckByNameQuery = `
            SELECT id
            FROM users
            WHERE name = $1;
        `;
        const userCheckByEmailQuery = `
            SELECT id
            FROM users
            WHERE email = $1;
        `;
        let usernameCheckResult = await client.query(userCheckByNameQuery, [name]);
        let useremailCheckResult = await client.query(userCheckByEmailQuery, [email]);
        if (usernameCheckResult.rows.length > 0 || useremailCheckResult.rows.length > 0) {
            throw new Error('Username or email already exists');
        }
        const hashedPassword = await hashPassword(password);
        const query = `
                INSERT INTO users (name, email, password, img, about) 
                VALUES ($1, $2, $3, $4, $5);
            `;
        const result = await client.query(query, [name, email, hashedPassword, img, about]);
        return result.rows[0];
    } catch (err) {
        if (err.code === '23505') {
            throw new Error('Username or email already exists (code)');
        } else {
            console.error('Error inserting user:', err);
            throw err;
        }
    }
}

register.post('/register', (req, res) => {
    (async () => {
        const { name, email, password, img, about } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }
        try {
            await pushUser(name, email, password, img, about);
            res.status(201).send({ message: `Account ${name} created successfully! You can login now.` });
        } catch (err) {
            console.error('Error register user:', err);
            if (err.message === 'Username or email already exists' || err.message === 'Username or email already exists (code)') {
                res.status(409).json({ err: 'Username or email already exists!' });
            } else {
                res.status(500).json({ err: 'Internal server error' });
            }
        }
    })();
});

module.exports = register