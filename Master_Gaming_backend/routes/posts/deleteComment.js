const express = require('express');
const { client } = require('../../client');
const authenticateToken = require('../../middleware/authenticateToken');

const deleteComment = express.Router();

async function deleteCommentById(userId, commentId) {
    try {
        const commentCheckQuery = `
            SELECT id, user_id
            FROM comments
            WHERE id = $1;
        `;
        const commentCheckResult = await client.query(commentCheckQuery, [commentId]);

        if (commentCheckResult.rows.length === 0) {
            throw new Error('Comment does not exist.');
        }

        const comment = commentCheckResult.rows[0];

        const userQuery = `
            SELECT 
                id, 
                is_admin
            FROM 
                users
            WHERE
                id = $1;
        `;
        const userQueryResult = await client.query(userQuery, [userId]);

        const user = userQueryResult.rows[0];

        if (comment.user_id !== userId && !user.is_admin) {
            throw new Error('No access to delete this comment.');
        }

        const deleteCommentQuery = `
            UPDATE comments
            SET is_deleted = TRUE
            WHERE id = $1;
        `;

        await client.query(deleteCommentQuery, [commentId]);

        console.log('Comment deleted successfully');
    } catch (err) {
        console.error('Error deleting comment:', err);
        throw err;
    }
}

deleteComment.put('/deletecomment', authenticateToken, async (req, res) => {
    const { commentId } = req.body;

    try {
        if (!req.user) return res.status(403).send('No access, please login.');
        const userId = req.user.id;
        
        await deleteCommentById(userId, commentId);

        res.status(200).send('Comment deleted successfully');
    } catch (err) {
        res.status(400).send(`Error deleting comment: ${err.message}`);
    }
});

module.exports = deleteComment;
