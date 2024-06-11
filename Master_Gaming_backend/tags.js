const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const tags = express.Router();

const gamePostsPath = path.join(__dirname, 'database', 'gameposts.json');

tags.get('/tags', (req, res) => {
    try {
        const gamePosts = require(gamePostsPath);
        const tags = gamePosts.reduce((arr, post) => {
            if (post.tags && Array.isArray(post.tags)) {
                post.tags.forEach(tag => {
                    if (!arr.includes(tag)) {
                        arr.push(tag);
                    }
                });
            }
            return arr;
        }, []);
        res.json(tags);
    } catch (err) {
        console.error('Ошибка чтения или отправки данных:', err);
        res.status(500).send('Ошибка чтения или отправки данных');
    }
});

module.exports = tags 
