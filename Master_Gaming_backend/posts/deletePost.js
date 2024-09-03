const express = require('express');
const { client } = require('../client');
const authenticateToken = require('../middleware/authenticateToken');

const deletePost = express.Router();

async function deletePostbyId(userid, id) {
    try {
        const idCheckQuery = `
            SELECT id, user_id
            FROM posts
            WHERE id = $1;
        `;
        const idCheckResult = await client.query(idCheckQuery, [id]);

        if (idCheckResult.rows.length > 0) {
            throw new Error('A post does not exist.');
        }

        const userQuery = `
        SELECT 
            users.id, 
            users.is_writer,
            users.is_admin
        FROM 
            users
        WHERE
            users.id = $1
        `;
        const userQueryResult = await client.query(userQuery, [userid]);

        if (idCheckResult.rows.user_id !== userid || !userQueryResult.rows.is_admin) {
            throw new Error('No access to delete this post.');
        }

        const deletePostQuery = `
            UPDATE posts
            SET is_deleted = True
            WHERE posts.id = $1
        `;

        console.log(idCheckResult.rows, userQueryResult.rows)

        //await client.query(deletePostQuery, [id]);

        console.log('Post deleted successfully');
    } catch (err) {
        console.error('Error deleting post:', err);
        throw err;
    }
}

deletePost.post('/deletepost', authenticateToken, async (req, res) => {
    const { id } = req.body;

    try {
        if (!req.user) return res.status(303).send('No access, please login.');
        if (!req.user.roles.writer) return res.status(303).send('No access to make posts.');
        const userId = req.user.id;
        await deletePostbyId(userId, id);

        res.status(201).send('Post and tags inserted successfully');
    } catch (err) {
        if (err.message.includes('A post with this title already exists.')) {
            res.status(400).send(err.message);
        } else if (err.message.includes('contains special characters')) {
            res.status(400).send(err.message);
        } else {
            res.status(500).send('Error inserting post and tags', err.message);
        }
    }
});

module.exports = deletePost 