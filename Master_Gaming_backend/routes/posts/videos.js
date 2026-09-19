const express = require('express');
const { client } = require('../../client');
const authenticateToken = require('../../middleware/authenticateToken');

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

videos.post('/videos', authenticateToken, async (req, res) => {
    const { title, video } = req.body;

    if (!title || !video) {
        return res.status(400).json({ err: 'Title and video URL are required' });
    }

    try {
        const adminResult = await client.query(
            'SELECT is_admin FROM users WHERE id = $1 AND is_deleted = false',
            [req.user.id]
        );
        if (!adminResult.rows[0]?.is_admin) {
            return res.status(403).json({ err: 'Only administrators can add videos' });
        }

        const result = await client.query(
            `INSERT INTO videos (user_id, title, video)
             VALUES ($1, $2, $3)
             RETURNING id AS videoid, user_id, title, video,
                       to_char(created_at, 'yyyy/mm/dd') AS created_at`,
            [req.user.id, title.trim(), video.trim()]
        );
        res.status(201).json({ ...result.rows[0], username: req.user.name });
    } catch (err) {
        console.error('Error adding video:', err);
        if (err.code === '23505') {
            return res.status(409).json({ err: 'A video with this title already exists' });
        }
        res.status(500).json({ err: 'Unable to add video' });
    }
});

module.exports = videos 
