const express = require('express');
const { client } = require('./client');

const gameposts = express.Router();

async function getPosts() {
    const query = `
    SELECT 
        posts.id AS postid, 
        posts.user_id, 
        users.name AS username, 
        posts.title, 
        posts.img, 
        posts.text, 
        to_char(posts.created_at, 'yyyy/mm/dd') as created_at,
        COALESCE(array_agg(tags.name) FILTER (WHERE tags.name IS NOT NULL), '{}') AS tags
    FROM 
        posts
    INNER JOIN 
        users ON posts.user_id = users.id
    LEFT JOIN 
        post_tags ON posts.id = post_tags.post_id
    LEFT JOIN 
        tags ON post_tags.tag_id = tags.id
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
        const result = await client.query(query);
        return result.rows;
    } catch (err) {
        console.error('Query error', err.stack);
        throw err;
    }
}

gameposts.get('/gameposts', (req, res) => {
    (async () => {
        try {
            const posts = await getPosts();
            res.json(posts)
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    })();
});

module.exports = gameposts

// use if you really want
// async function getPostsWithTag(tag) {
//     const query = `
//     SELECT 
//         posts.id AS post_id, 
//         posts.user_id, 
//         users.name AS username, 
//         posts.title, 
//         posts.img, 
//         posts.text, 
//         to_char(posts.created_at, 'yyyy/mm/dd') as created_at,
//         COALESCE(array_agg(tags.name) FILTER (WHERE tags.name IS NOT NULL), '{}') AS tags
//     FROM 
//         posts
//     INNER JOIN 
//         users ON posts.user_id = users.id
//     LEFT JOIN 
//         post_tags ON posts.id = post_tags.post_id
//     LEFT JOIN 
//         tags ON post_tags.tag_id = tags.id
//     WHERE 
//         posts.id IN (
//             SELECT posts.id
//             FROM posts
//             LEFT JOIN post_tags ON posts.id = post_tags.post_id
//             LEFT JOIN tags ON post_tags.tag_id = tags.id
//             WHERE tags.id = ${tag}
//         )
//     GROUP BY 
//         posts.id, 
//         posts.user_id, 
//         users.name, 
//         posts.title, 
//         posts.img, 
//         posts.text, 
//         posts.created_at;
//     `;
//     try {
//         const result = await client.query(query);
//         return result.rows;
//     } catch (err) {
//         console.error('Query error', err.stack);
//         throw err;
//     }
// }
//
// gamePostsTag.get('/gamePosts/:tag_id', (req, res) => {
//     (async () => {
//         try {
//             const tag = req.params.tag_id;
//
//             const posts = await getPostsWithTag(tag);
//             res.json(posts)
//         } catch (err) {
//             console.error('Error fetching posts:', err);
//             res.status(500).send('Ошибка чтения или отправки данных');
//         }
//     })();
// });