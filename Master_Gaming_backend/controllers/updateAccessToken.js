const jwt = require('jsonwebtoken');
const express = require('express');
const { client } = require('../client');
const updateAccessToken = express.Router();
require('dotenv').config();

updateAccessToken.get('/updateaccessnoken', async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const userQuery = `
        SELECT id, name, email, img, is_admin, is_writer, refresh_token
        FROM users
        WHERE refresh_token = $1;
    `;
    const userResult = await client.query(userQuery, [refreshToken]);
    if (userResult.rows.length === 0) return res.sendStatus(403); //Forbidden 
    const user = userResult.rows[0];

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || user.id !== decoded.user.id) return res.sendStatus(403);
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
            res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    img: user.img
                },
                accessToken
            })
        }
    );
})


module.exports = updateAccessToken 