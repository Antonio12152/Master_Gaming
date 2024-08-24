const express = require('express');
const getCookie = express.Router();

getCookie.get('/getcookie', (req, res) => {
    const username = req.session.username;
    const userId = req.session.userId;

    if (username && userId) {
        res.send(`Logged in as ${username} with ID ${userId}`);
    } else {
        res.status(401).send('You are not logged in.');
    }
});

module.exports = getCookie;