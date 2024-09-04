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
        to_char(posts.created_at, 'yyyy/mm/dd') as created_at,
        posts.is_deleted,
        COALESCE(array_agg(DISTINCT tags.name) FILTER (WHERE tags.name IS NOT NULL), '{}') AS tags,
        COALESCE(json_agg(json_build_object(
            'id', comments.id,
            'text', comments.text,
            'created_at', to_char(comments.created_at, 'yyyy/mm/dd'),
            'author_name', comment_users.name
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
        users AS comment_users ON comments.user_id = comment_users.id
    WHERE
        posts.is_deleted = False AND posts.id = $1
    GROUP BY 
        posts.id, 
        posts.user_id, 
        users.name, 
        posts.title, 
        posts.img, 
        posts.text, 
        posts.created_at
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
        console.error('Error querying post with comments and tags:', err);
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