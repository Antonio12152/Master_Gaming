const jwt = require('jsonwebtoken');
const express = require('express');
const { client } = require('../client');
const updateAccessToken = express.Router();
require('dotenv').config();

updateAccessToken.post('/updateAccessToken', async (req, res) => {
    const cookies = req.cookies;

    if (!cookies || !cookies.jwt) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = decoded.user.id;

        const userQuery = `
            SELECT id, name, img, is_admin, is_writer, refresh_token
            FROM users
            WHERE id = $1;
        `;
        const userResult = await client.query(userQuery, [userId]);

        if (userResult.rows.length === 0) {
            return res.status(403).json({ message: 'User not found' });
        }

        const user = userResult.rows[0];

        if (user.refresh_token !== refreshToken) {
            return res.status(403).json({ message: 'Refresh token not valid' });
        }

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

        res.json({
            img: user.img,
            accessToken: accessToken
        });
    } catch (err) {
        console.error('Error refreshing access token:', err.message);
        res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
});

module.exports = updateAccessToken;