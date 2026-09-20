const express = require('express');
const { client } = require('../../client');

const tags = express.Router();

function normalizeTagList(data = []) {
    return data
        .map((tag) => ({
            id: tag.id,
            name: tag.name,
            count: Number(tag.count || 0)
        }))
        .sort((a, b) => {
            if (b.count !== a.count) return b.count - a.count;
            return a.name.localeCompare(b.name);
        });
}

async function getTags() {
    const query = `
    SELECT
        tags.id,
        tags.name,
        COUNT(post_tags.post_id) AS count
    FROM tags
    LEFT JOIN post_tags ON post_tags.tag_id = tags.id
    GROUP BY tags.id, tags.name
    ORDER BY count DESC, tags.name ASC;
    `;

    try {
        const result = await client.query(query);
        return normalizeTagList(result.rows);
    } catch (err) {
        console.error('Query error', err.stack);
        throw err;
    }
}

tags.get('/tags', (req, res) => {
    (async () => {
        try {
            const tagList = await getTags();
            res.json(tagList);
        } catch (err) {
            console.error('Error fetching tags:', err);
            res.status(500).json({ err: 'Internal server error' });
        }
    })();
});

module.exports = tags;
module.exports.normalizeTagList = normalizeTagList;

