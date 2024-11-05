const { Mistral } = require('@mistralai/mistralai');
const express = require('express');
const { client } = require('../../client.js');
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.API_KEY;

const clientAI = new Mistral({ apiKey: apiKey });

const commentAI = express.Router();

const processingPosts = {};

async function generateComment(post_id, title, text) {
    try {
        if (processingPosts[post_id]) {
            throw new Error(`Post with ID ${post_id} is already being processed.`);
        }

        processingPosts[post_id] = true;

        const message = {
            role: 'user',
            content: [
                {
                    "type": "text",
                    "text": `You are given information about a post. It has a title and text. Write a short comment for this post, maximum 4 sentences.`
                },
                {
                    "type": "text",
                    "text": `title: ${title}`
                },
                {
                    "type": "text",
                    "text": `text: ${text}`
                }
            ]
        };

        const commentCheckQuery = `
            SELECT post_id, user_id
            FROM comments
            WHERE post_id = $1 and user_id = 3;
        `;

        const commentCheckResult = await client.query(commentCheckQuery, [post_id]);

        if (commentCheckResult.rows.length !== 0) {
            throw new Error('Comment by AI already exists or was deleted earlier.');
        }

        const chatResponse = await clientAI.chat.complete({
            model: 'open-mistral-nemo',
            messages: [message],
        });

        let resAI = chatResponse.choices[0].message.content;

        const commentCreateQuery = `
            INSERT INTO comments (post_id, user_id, text)
            VALUES ($1, $2, $3);
        `;

        await client.query(commentCreateQuery, [post_id, 3, resAI]);
        console.log("end")
    } catch (error) {
        throw new Error(`Error generating comment: ${error.message}`);
    } finally {
        delete processingPosts[post_id];
    }
}

commentAI.post('/commentAI', async (req, res) => {
    const { post_id, title, text } = req.body;

    if (!text || !title || !post_id) {
        return res.status(400).json({ message: 'Missing data' });
    }

    try {
        await generateComment(post_id, title, text);

        res.status(201).send('Comment has been created successfully by AI.');
    } catch (err) {
        res.status(400).send(`Error creating comment: ${err.message}`);
    }
});

module.exports = commentAI;
