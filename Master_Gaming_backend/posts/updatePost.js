const express = require('express');
const { client } = require('../client');
const authenticateToken = require('../middleware/authenticateToken');

const update = express.Router();

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

async function updatePostWithTags(userid, postId, title, img, text, tagsArray) {
    try {
        const postCheckQuery = `
            SELECT id, user_id
            FROM posts
            WHERE id = $1;
        `;
        const postCheckResult = await client.query(postCheckQuery, [postId]);

        if (postCheckResult.rows.length === 0) {
            throw new Error('Post not found.');
        }

        const existingPost = postCheckResult.rows[0];
        if (existingPost.user_id !== userid) {
            throw new Error('No access to update this post.');
        }

        for (const tag of tagsArray) {
            if (hasSpecialChars(tag)) {
                throw new Error(`Tag "${tag}" contains special characters.`);
            }
        }

        const postUpdateQuery = `
            UPDATE posts
            SET title = $2, img = $3, text = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1;
        `;
        await client.query(postUpdateQuery, [postId, title, img, text]);

        const deletePostTagsQuery = `
            DELETE FROM post_tags
            WHERE post_id = $1;
        `;
        await client.query(deletePostTagsQuery, [postId]);

        for (const tag of tagsArray) {
            const tagId = await insertTagAndReturnId(tag);

            const postTagInsertQuery = `
                INSERT INTO post_tags (post_id, tag_id)
                VALUES ($1, $2);
            `;
            await client.query(postTagInsertQuery, [postId, tagId]);
        }

        console.log('Post updated successfully');
    } catch (err) {
        console.error('Error updating post:', err);
        throw err;
    }
}

update.put('/updatepost/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, img, text, tags } = req.body;

    const tagsArray = tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

    try {
        if (!req.user) return res.status(303).send('No access, please login.');
        if (!req.user.roles.writer) return res.status(303).send('No access to update posts.');
        const userId = req.user.id;
        await updatePostWithTags(userId, id, title, img, text, tagsArray);

        res.status(200).send('Post and tags updated successfully');
    } catch (err) {
        if (err.message.includes('Post not found.')) {
            res.status(404).send(err.message);
        } else if (err.message.includes('contains special characters')) {
            res.status(400).send(err.message);
        } else {
            res.status(500).send('Error updating post and tags');
        }
    }
});

module.exports = update;