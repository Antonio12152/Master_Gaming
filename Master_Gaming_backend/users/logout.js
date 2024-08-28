const express = require('express');
const { client } = require('../client');
const logout = express.Router();

logout.post('/logout', async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No Content
    const refreshToken = cookies.jwt;

    const userQuery = `
        SELECT id 
        FROM users
        WHERE refresh_token = $1;
    `;

    const userResult = await client.query(userQuery, [refreshToken]);

    if (userResult.rows.length === 0) {
        res.clearCookie('jwt', { httpOnly: false, secure: false, sameSite: 'None' }); // change on true true
        return res.sendStatus(204);
    }

    const foundUser = userResult.rows[0];

    const deleteRefreshToken = `
        UPDATE users
        SET refresh_token = NULL
        WHERE id = $1;
    `;

    await client.query(deleteRefreshToken, [foundUser.id]);
    res.clearCookie('jwt', { httpOnly: false, secure: false, sameSite: 'None' }); // change on true true
    res.sendStatus(204);
});

module.exports = logout;