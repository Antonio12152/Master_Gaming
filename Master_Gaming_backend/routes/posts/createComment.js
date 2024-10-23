const express = require('express');
const { client } = require('../../client');
const authenticateToken = require('../../middleware/authenticateToken');

const comment = express.Router();

async function createComment(comment, post_id, userid) {
    try {
        const idCheckQuery = `
            SELECT id
            FROM posts
            WHERE id = $1;
        `;
        const idCheckResult = await client.query(idCheckQuery, [post_id]);

        if (idCheckResult.rows.length === 0) {
            throw new Error('A post does not exists.');
        }

        const userQuery = `
        SELECT 
            users.id, 
            users.is_deleted
        FROM 
            users
        WHERE
            users.id = $1
        `;
        const userQueryResult = await client.query(userQuery, [userid]);

        if (userQueryResult.rows.is_deleted) {
            throw new Error('This user has been deleted');
        }

        const commentCreateQuery = `
            INSERT INTO comments (post_id, user_id, text)
            VALUES ($1, $2, $3);
        `;
        await client.query(commentCreateQuery, [post_id, userid, comment]);

        console.log('Comment created successfully');
    } catch (err) {
        console.error('Error inserting post:', err);
        throw err;
    }
}
comment.post('/comment', authenticateToken, async (req, res) => {
    const { comment, post_id } = req.body;

    if (!comment || !post_id) {
        return res.status(400).json({ message: 'Missing data' });
    }

    try {
        if (!req.user) return res.status(303).send('No access, please login.');
        const userId = req.user.id;
        await createComment(comment, post_id, userId);

        res.status(201).send('Comment has created successfully');
    } catch (err) {
        res.status(400).send('Error creating comment', err.message);
    }
});

module.exports = comment 