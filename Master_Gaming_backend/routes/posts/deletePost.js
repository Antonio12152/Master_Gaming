const express = require('express');
const { client } = require('../../client');
const authenticateToken = require('../../middleware/authenticateToken');

const deletePost = express.Router();

async function deletePostbyId(userid, id) {
    try {
        const idCheckQuery = `
            SELECT id, user_id
            FROM posts
            WHERE id = $1;
        `;
        const idCheckResult = await client.query(idCheckQuery, [id]);

        if (idCheckResult.rows.length === 0) {
            throw new Error('A post does not exist.');
        }

        const post = idCheckResult.rows[0];

        const userQuery = `
            SELECT 
                id, 
                is_writer,
                is_admin
            FROM 
                users
            WHERE
                id = $1
        `;
        const userQueryResult = await client.query(userQuery, [userid]);

        const user = userQueryResult.rows[0];

        if (post.user_id !== userid && !user.is_admin) {
            throw new Error('No access to delete this post.');
        }

        const deletePostQuery = `
            UPDATE posts
            SET is_deleted = TRUE
            WHERE id = $1;
        `;

        await client.query(deletePostQuery, [id]);

        console.log('Post deleted successfully');
    } catch (err) {
        console.error('Error deleting post:', err);
        throw err;
    }
}

deletePost.put('/deletepost', authenticateToken, async (req, res) => {
    const { id } = req.body;

    try {
        if (!req.user) return res.status(303).send('No access, please login.');
        const userId = req.user.id;
        await deletePostbyId(userId, id);

        res.status(200).send('Post deleted successfully');
    } catch (err) {
        res.status(400).send(`Error deleting post: ${err.message}`);
    }
});

module.exports = deletePost;
