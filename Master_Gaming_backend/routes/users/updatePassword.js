const bcrypt = require('bcrypt');
const express = require('express');
const { client } = require('../../client');

const updatePasswordRouter = express.Router();
const saltRounds = 10;

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

async function verifyPassword(userId, password) {
    const query = `SELECT password FROM users WHERE id = $1`;
    const result = await client.query(query, [userId]);

    if (result.rows.length === 0) {
        throw new Error('User not found');
    }

    const hashedPassword = result.rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
        throw new Error('Incorrect password');
    }
}

async function updatePassword(userId, newPassword) {
    const hashedPassword = await hashPassword(newPassword);

    const updateQuery = `
        UPDATE users
        SET password = $1
        WHERE id = $2;
    `;
    await client.query(updateQuery, [hashedPassword, userId]);
}

updatePasswordRouter.put('/updatePassword', async (req, res) => {
    const { id, currentPassword, newPassword } = req.body;

    if (!id || !currentPassword || !newPassword) {
        return res.status(400).json({ message: 'User ID, current password, and new password are required' });
    }

    try {
        await verifyPassword(id, currentPassword);

        await updatePassword(id, newPassword);
        res.status(200).send({ message: 'Password updated successfully!' });
    } catch (err) {
        console.error('Error updating password:', err);
        if (err.message === 'Incorrect current password') {
            res.status(401).json({ err: 'Incorrect current password' });
        } else if (err.message === 'User not found') {
            res.status(404).json({ err: 'User not found' });
        } else {
            res.status(500).json({ err: 'Internal server error' });
        }
    }
});

module.exports = updatePasswordRouter;
