const express = require('express');
const { client } = require('./client');

const videos = express.Router();
async function getVideos() {
    const query = `
    SELECT 
        videos.id as videoid, 
        videos.user_id,
        users.name AS username,
        videos.title, 
        videos.video, 
        to_char(videos.created_at, 'yyyy/mm/dd') as created_at
	FROM 
        videos
    INNER JOIN 
        users ON videos.user_id = users.id;
    `;
    try {
        const result = await client.query(query);
        return result.rows;
    } catch (err) {
        console.error('Query error', err.stack);
        throw err;
    }
}
videos.get('/videos', (req, res) => {
    (async () => {
        try {
            const videos = await getVideos();
            res.json(videos)
        } catch (err) {
            console.error('Error fetching posts:', err);
            res.status(500).send('Ошибка чтения или отправки данных');
        }
    })();
});

module.exports = videos 
