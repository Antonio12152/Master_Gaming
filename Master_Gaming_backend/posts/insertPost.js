const express = require('express');
const { client } = require('../client');
const authenticateToken = require('../middleware/authenticateToken');

const insert = express.Router();

function hasSpecialChars(tag) {
    const regex = /[^a-zA-Z0-9 ]/;
    return regex.test(tag);
}

async function insertTagAndReturnId(tagName) {
    const lowerCaseTagName = tagName.toLowerCase();

    let query = `
        SELECT id
        FROM tags
        WHERE name = $1;
    `;

    try {
        let result = await client.query(query, [lowerCaseTagName]);
        if (result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            query = `
                INSERT INTO tags (name)
                VALUES ($1)
                ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
                RETURNING id;
            `;
            result = await client.query(query, [lowerCaseTagName]);
            return result.rows[0].id;
        }
    } catch (err) {
        console.error('Query error', err.stack);
        throw err;
    }
}

async function insertPostWithTags(userid, title, img, text, tagsArray) {
    try {
        const titleCheckQuery = `
            SELECT id
            FROM posts
            WHERE title = $1;
        `;
        const titleCheckResult = await client.query(titleCheckQuery, [title]);

        if (titleCheckResult.rows.length > 0) {
            throw new Error('A post with this title already exists.');
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

        if (!userQueryResult.rows.is_admin || !userQueryResult.rows.is_writer) {
            throw new Error('No access to insert post.');
        }

        for (const tag of tagsArray) {
            if (hasSpecialChars(tag)) {
                throw new Error(`Tag "${tag}" contains special characters.`);
            }
        }

        const postInsertQuery = `
            INSERT INTO posts (user_id, title, img, text, created_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            RETURNING id;
        `;
        const postResult = await client.query(postInsertQuery, [userid, title, img, text]);
        const postId = postResult.rows[0].id;

        for (const tag of tagsArray) {
            const tagId = await insertTagAndReturnId(tag);

            const postTagInsertQuery = `
                INSERT INTO post_tags (post_id, tag_id)
                VALUES ($1, $2);
            `;
            await client.query(postTagInsertQuery, [postId, tagId]);
        }

        console.log('Post inserted successfully');
    } catch (err) {
        console.error('Error inserting post:', err);
        throw err;
    }
}
insert.post('/insertpost', authenticateToken, async (req, res) => {
    const { title, img, text, tags } = req.body;

    const tagsArray = tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

    try {
        if (!req.user) return res.status(303).send('No access, please login.');
        if (!req.user.roles.writer) return res.status(303).send('No access to make posts.');
        const userId = req.user.id;
        await insertPostWithTags(userId, title, img, text, tagsArray);

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

module.exports = insert 