const express = require('express');
const { client } = require('../client');

const post = express.Router();

async function getPost(id) {
    const query = `
        SELECT 
            posts.id AS postid, 
            posts.user_id, 
            users.name AS username, 
            posts.title, 
            posts.img, 
            posts.text, 
            to_char(posts.created_at, 'yyyy/mm/dd') AS created_at,
            posts.is_deleted,
            COALESCE(array_agg(DISTINCT tags.name) FILTER (WHERE tags.name IS NOT NULL), '{}') AS tags,
            COALESCE(json_agg(DISTINCT jsonb_build_object(
                'comment_id', comments.id, 
                'comment_text', comments.text, 
                'comment_created_at', comments.created_at,
                'comment_author_name', comment_author.name
            )) FILTER (WHERE comments.id IS NOT NULL), '[]') AS comments
        FROM 
            posts
        INNER JOIN 
            users ON posts.user_id = users.id
        LEFT JOIN 
            post_tags ON posts.id = post_tags.post_id
        LEFT JOIN 
            tags ON post_tags.tag_id = tags.id
        LEFT JOIN 
            comments ON posts.id = comments.post_id
        LEFT JOIN 
            users AS comment_author ON comments.user_id = comment_author.id
        WHERE
            posts.is_deleted = FALSE AND posts.id = $1
        GROUP BY 
            posts.id, 
            users.name
        ORDER BY 
            posts.id;
    `;

    try {
        const result = await client.query(query, [id]);

        if (result.rows.length === 0) {
            throw new Error('Post not found');
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
        res.status(500).json({ error: err.message });
    }
});

module.exports = post