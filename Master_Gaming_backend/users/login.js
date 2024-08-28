const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const { client } = require('../client');
const login = express.Router();

async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

async function createJWT(user, res) {
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
        { expiresIn: '15m' }
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

    const saveRefreshToken = `
        UPDATE users
        SET refresh_token = $1
        WHERE id = $2;
    `;

    await client.query(saveRefreshToken, [refreshToken, user.id]);
    res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); // change on true true
    return { accessToken, refreshToken }
}

async function loginUser(email, password, res) {
    const userQuery = `
        SELECT id, name, email, password, img, is_admin, is_writer, is_delete
        FROM users
        WHERE email = $1;
    `;
    const userResult = await client.query(userQuery, [email]);
    if (userResult.rows.length === 0) {
        throw new Error('User not found');
    }
    const user = userResult.rows[0];
    if (user.is_delete) {
        throw new Error('The user was deleted earlier');
    }
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid password');
    }
    const tokens = await createJWT(user, res);
    return { user, tokens };
}



login.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: req.body });
    }

    try {
        const { user, tokens } = await loginUser(email, password, res);
        delete user.password;
        console.log('success')
        res.json({
            user: {
                id: user.id,
                name: user.name,
                img: user.img,
            },
            accessToken: tokens.accessToken
        });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(401).json({ message: err.message });
    }
});

module.exports = login;