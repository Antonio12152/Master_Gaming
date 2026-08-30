const express = require('express');
const { client } = require('../../client');
const logout = express.Router();

logout.post('/logout', async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204);

        const refreshToken = cookies.jwt;

        const userQuery = `SELECT id FROM users WHERE refresh_token = $1;`;
        const userResult = await client.query(userQuery, [refreshToken]);

        if (userResult.rows.length === 0) {
            const requestOrigin = req.get('Origin') || '';
            const isCrossSite = requestOrigin && !/^https?:\/\/localhost(?::\d+)?$/.test(requestOrigin);
            res.clearCookie('jwt', {
                httpOnly: true,
                secure: Boolean(isCrossSite),
                sameSite: isCrossSite ? 'None' : 'Lax'
            });
            return res.sendStatus(204);
        }

        const foundUser = userResult.rows[0];

        const deleteRefreshToken = `UPDATE users SET refresh_token = NULL WHERE id = $1;`;
        await client.query(deleteRefreshToken, [foundUser.id]);

        const requestOrigin = req.get('Origin') || '';
        const isCrossSite = requestOrigin && !/^https?:\/\/localhost(?::\d+)?$/.test(requestOrigin);

        res.clearCookie('jwt', {
            httpOnly: true,
            secure: Boolean(isCrossSite),
            sameSite: isCrossSite ? 'None' : 'Lax'
        });

        res.sendStatus(204);
    } catch (error) {
        console.error("Logout error:", error);
        res.sendStatus(500);
    }
});

module.exports = logout;
