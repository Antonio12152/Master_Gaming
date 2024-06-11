const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const gameposts = express.Router();

const gamePostsPath = path.join(__dirname, 'database', 'gameposts.json');
const usersDataPath = path.join(__dirname, 'database', 'usersData.json');

function mergeData(posts, users) {
    return posts.map(post => {
        const user = users.find(user => user.id === post.userid);
        return user ? { ...post, username: user.username, imgurl: `http://localhost:5000${post.img}` } : { ...post, username: 'Deleted', imgurl: `http://localhost:5000${post.img}` };
    });
}
gameposts.get('/gameposts', (req, res) => {
    try {
        const gamePosts = require(gamePostsPath);
        const usersData = require(usersDataPath);

        const mergedData = mergeData(gamePosts, usersData);

        res.json(mergedData);
    } catch (err) {
        console.error('Ошибка чтения или отправки данных:', err);
        res.status(500).send('Ошибка чтения или отправки данных');
    }
});

module.exports = gameposts 