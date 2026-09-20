const express = require('express');
const { client } = require('../../client');
const authenticateToken = require('../../middleware/authenticateToken');

const admin = express.Router();

function normalizeRoleUpdatePayload(body = {}) {
    const nextRoles = {
        is_admin: false,
        is_writer: false
    };

    if (typeof body.is_admin === 'boolean') {
        nextRoles.is_admin = body.is_admin;
    }

    if (typeof body.is_writer === 'boolean') {
        nextRoles.is_writer = body.is_writer;
    }

    return nextRoles;
}

admin.get('/admin/users', authenticateToken, async (req, res) => {
    if (!req.user?.roles?.admin) {
        return res.status(403).json({ err: 'Only administrators can access the admin panel.' });
    }

    try {
        const result = await client.query(`
            SELECT id, name, email, img, is_admin, is_writer, created_at
            FROM users
            WHERE is_deleted = false
            ORDER BY id ASC
        `);

        return res.json(result.rows);
    } catch (error) {
        console.error('Error fetching admin users list:', error);
        return res.status(500).json({ err: 'Unable to load users.' });
    }
});

admin.patch('/admin/users/:id/roles', authenticateToken, async (req, res) => {
    if (!req.user?.roles?.admin) {
        return res.status(403).json({ err: 'Only administrators can update roles.' });
    }

    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({ err: 'Invalid user id.' });
    }

    const nextRoles = normalizeRoleUpdatePayload(req.body);

    try {
        const result = await client.query(
            `
                UPDATE users
                SET is_admin = $1, is_writer = $2
                WHERE id = $3 AND is_deleted = false
                RETURNING id, name, email, is_admin, is_writer
            `,
            [nextRoles.is_admin, nextRoles.is_writer, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ err: 'User not found.' });
        }

        return res.json({
            message: 'User roles updated successfully.',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating user roles:', error);
        return res.status(500).json({ err: 'Unable to update user roles.' });
    }
});

module.exports = admin;
module.exports.normalizeRoleUpdatePayload = normalizeRoleUpdatePayload;
