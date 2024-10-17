const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { client } = require('../client');
const login = express.Router();

async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

async function createJWT(user) {
    const accessToken = jwt.sign(
        {
            "user": {
                "id": user.id,
                "name": user.name,
                "roles": {
                    "admin": user.is_admin,
                    "writer": user.is_writer
                }
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        {
            "user": {
                "id": user.id,
                "name": user.name
            }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

    return { accessToken, refreshToken };
}

async function saveRefreshToken(userId, refreshToken) {
    const saveRefreshTokenQuery = `
        UPDATE users
        SET refresh_token = $1
        WHERE id = $2;
    `;
    await client.query(saveRefreshTokenQuery, [refreshToken, userId]);
}

async function loginUser(email, password) {
    const userQuery = `
        SELECT id, name, email, password, img, is_admin, is_writer, is_deleted
        FROM users
        WHERE email = $1;
    `;
    const userResult = await client.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
        throw new Error('User not found');
    }

    const user = userResult.rows[0];

    if (user.is_deleted) {
        throw new Error('User account is deleted');
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid password');
    }

    return user;
}

login.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await loginUser(email, password);
        const tokens = await createJWT(user);

        await saveRefreshToken(user.id, tokens.refreshToken);

        res.cookie('jwt', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        });

        delete user.password;

        res.json({
            img: user.img,
            accessToken: tokens.accessToken
        });
    } catch (err) {
        console.error('Error logging in user:', err.message);
        if (err.message === 'User not found') {
            res.status(404).json({ err: 'User not found' });
        } else if (err.message === 'Invalid password') {
            res.status(401).json({ err: 'Invalid password' });
        } else if (err.message === 'User account is deleted') {
            res.status(403).json({ err: 'User account is deleted' });
        } else {
            res.status(500).json({ err: 'Internal server error' });
        }
    }
});

module.exports = login;