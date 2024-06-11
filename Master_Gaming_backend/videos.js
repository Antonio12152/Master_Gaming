const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const videos = express.Router();

const videosPath = path.join(__dirname, 'database', 'videos.json');
const usersDataPath = path.join(__dirname, 'database', 'usersData.json');

function mergeData(posts, users) {
    return posts.map(post => {
        const user = users.find(user => user.id === post.userid);
        return user ? { ...post, username: user.username } : { ...post, username: 'Deleted' };
    });
}

videos.get('/videos', (req, res) => {
    try {
        const videos = require(videosPath);
        const usersData = require(usersDataPath);
        const mergedData = mergeData(videos, usersData);
        res.json(mergedData);
    } catch (err) {
        console.error('Ошибка чтения или отправки данных:', err);
        res.status(500).send('Ошибка чтения или отправки данных');
    }
});

module.exports = videos 
