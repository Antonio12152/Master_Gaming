const express = require('express');
const { client } = require('../client');

const post = express.Router();

async function getPost(id) {
    const query = `
        SELECT 
            posts.id AS postid, 
            posts.user_id, 
            post_user.name AS username, 
            posts.title, 
            posts.img, 
            posts.text, 
            to_char(posts.created_at, 'yyyy/mm/dd') as created_at,
            posts.is_deleted,
            COALESCE(array_agg(DISTINCT tags.name) FILTER (WHERE tags.name IS NOT NULL), '{}') AS tags,
            COALESCE(json_agg(DISTINCT jsonb_build_object(
                'comment_id', comments.id, 
                'comment_text', comments.text, 
                'comment_created_at', to_char(comments.created_at, 'yyyy/mm/dd'),
                'comment_author_id', comment_user.id,
                'comment_author_name', comment_user.name,
                'comment_author_img', comment_user.img
            )) FILTER (WHERE comments.id IS NOT NULL AND comments.is_deleted = FALSE), '[]') AS comments
        FROM 
            posts
        INNER JOIN 
            users AS post_user ON posts.user_id = post_user.id
        LEFT JOIN 
            post_tags ON posts.id = post_tags.post_id
        LEFT JOIN 
            tags ON post_tags.tag_id = tags.id
        LEFT JOIN 
            comments ON posts.id = comments.post_id
        LEFT JOIN 
            users AS comment_user ON comments.user_id = comment_user.id
        WHERE
            posts.id = $1 AND posts.is_deleted = FALSE
        GROUP BY 
            posts.id, 
            post_user.name
        ORDER BY 
            posts.id;
            `;

    try {
        const result = await client.query(query, [id]);

        if (result.rows.length === 0) {
            throw new Error('Post not found or has been deleted');
        }

        return result.rows[0];
    } catch (err) {
        console.error('Error get posts:', err);
        throw err;
    }
}

post.get('/post/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const post = await getPost(id);
        res.json(post);
    } catch (err) {
        console.error('Error fetching post:', err);
        if (err.message === 'Post not found or has been deleted') {
            res.status(404).json({ err: 'Post not found or has been deleted' });
        } else {
            res.status(500).json({ err: 'Internal server error' });
        }
    }
});

module.exports = post