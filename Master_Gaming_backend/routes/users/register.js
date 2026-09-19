const bcrypt = require('bcrypt');
const express = require('express');
const { client } = require('../../client');
const verification = require('./verification');

const register = express.Router();

const saltRounds = 10;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

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

register.post('/register/request-code', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password || !EMAIL_REGEX.test(email) || !PWD_REGEX.test(password)) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const normalizedEmail = verification.normalizeEmail(email);
    try {
        const existingUser = await client.query(
            'SELECT id FROM users WHERE name = $1 OR email = $2',
            [name, normalizedEmail]
        );
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ err: 'Username or email already exists!' });
        }

        const code = verification.createCode();
        await verification.saveCode(normalizedEmail, 'registration', code);
        await verification.sendVerificationCode(normalizedEmail, code, 'registration');
        res.status(202).json({ message: 'Verification code sent to your email.' });
    } catch (err) {
        console.error('Error sending registration code:', err);
        res.status(500).json({ err: 'Unable to send verification code' });
    }
});

register.post('/register/verify', async (req, res) => {
    const { name, email, password, img, about, code } = req.body;
    if (!name || !email || !password || !EMAIL_REGEX.test(email) || !PWD_REGEX.test(password) || !/^\d{6}$/.test(code || '')) {
        return res.status(400).json({ message: 'Registration details and a 6-digit code are required' });
    }

    const normalizedEmail = verification.normalizeEmail(email);
    try {
        await verification.consumeCode(normalizedEmail, 'registration', code);
        await pushUser(name, normalizedEmail, password, img, about);
        res.status(201).json({ message: `Account ${name} created successfully! You can login now.` });
    } catch (err) {
        console.error('Error verifying registration:', err);
        if (err.message === 'Invalid or expired code') {
            return res.status(400).json({ err: err.message });
        }
        if (err.message.includes('already exists')) {
            return res.status(409).json({ err: 'Username or email already exists!' });
        }
        res.status(500).json({ err: 'Internal server error' });
    }
});

module.exports = register