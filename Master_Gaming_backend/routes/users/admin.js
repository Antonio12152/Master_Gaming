const express = require('express');
const { client } = require('../../client');
const authenticateToken = require('../../middleware/authenticateToken');

const admin = express.Router();

function normalizeRoleUpdatePayload(body = {}) {
    const nextRoles = {
        is_admin: null,
        is_writer: null
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
    if (nextRoles.is_admin === null && nextRoles.is_writer === null) {
        return res.status(400).json({ err: 'At least one role must be provided.' });
    }

    if (userId === Number(req.user.id) &&
        (nextRoles.is_admin === false || nextRoles.is_writer === false)) {
        return res.status(403).json({ err: 'You cannot remove your own admin or writer role.' });
    }

    try {
        const result = await client.query(
            `
                UPDATE users
                SET is_admin = COALESCE($1, is_admin),
                    is_writer = COALESCE($2, is_writer)
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
