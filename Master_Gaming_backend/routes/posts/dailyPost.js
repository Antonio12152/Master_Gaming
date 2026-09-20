const express = require('express');
const { client } = require('../../client');
const authenticateToken = require('../../middleware/authenticateToken');

const dailyPost = express.Router();

const dailyPostQuery = `
    SELECT
        daily_posts.selection_date,
        posts.id AS postid,
        posts.user_id,
        users.name AS username,
        posts.title,
        posts.img,
        posts.text,
        to_char(posts.created_at, 'yyyy/mm/dd') AS created_at,
        COALESCE(array_agg(DISTINCT tags.name) FILTER (WHERE tags.name IS NOT NULL), '{}') AS tags
    FROM daily_posts
    INNER JOIN posts ON posts.id = daily_posts.post_id
    INNER JOIN users ON users.id = posts.user_id
    LEFT JOIN post_tags ON post_tags.post_id = posts.id
    LEFT JOIN tags ON tags.id = post_tags.tag_id
    WHERE daily_posts.selection_date = CURRENT_DATE
      AND posts.is_deleted = FALSE
    GROUP BY daily_posts.selection_date, posts.id, users.name;
`;

dailyPost.get('/daily-post', async (req, res) => {
    try {
        const result = await client.query(dailyPostQuery);

        if (result.rows.length === 0) {
            return res.status(404).json({ err: 'No post has been selected for today' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching daily post:', err);
        res.status(500).json({ err: 'Unable to fetch daily post' });
    }
});

dailyPost.post('/daily-post', authenticateToken, async (req, res) => {
    const postId = req.body.postId ?? req.body.post_id ?? null;

    try {
        const adminResult = await client.query(
            'SELECT is_admin FROM users WHERE id = $1 AND is_deleted = false',
            [req.user.id]
        );
        if (!adminResult.rows[0]?.is_admin) {
            return res.status(403).json({ err: 'Only administrators can select the daily post' });
        }

        const result = await client.query(
            `WITH selected_post AS (
                SELECT id
                FROM posts
                WHERE is_deleted = FALSE
                  AND ($1::bigint IS NULL OR id = $1::bigint)
                ORDER BY CASE WHEN $1::bigint IS NULL THEN RANDOM() END
                LIMIT 1
            )
            INSERT INTO daily_posts (post_id)
            SELECT id FROM selected_post
            ON CONFLICT (selection_date) DO NOTHING
            RETURNING post_id`,
            [postId]
        );

        if (result.rows.length === 0) {
            const existing = await client.query(dailyPostQuery);
            if (existing.rows.length > 0) {
                return res.json(existing.rows[0]);
            }
            return res.status(404).json({ err: 'Post not found or has been deleted' });
        }

        const selected = await client.query(dailyPostQuery);
        res.status(201).json(selected.rows[0]);
    } catch (err) {
        console.error('Error selecting daily post:', err);
        res.status(500).json({ err: 'Unable to select daily post' });
    }
});

module.exports = dailyPost;