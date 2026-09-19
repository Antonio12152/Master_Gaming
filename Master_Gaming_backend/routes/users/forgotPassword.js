const bcrypt = require('bcrypt');
const express = require('express');
const { client } = require('../../client');
const verification = require('./verification');

const forgotPassword = express.Router();
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

forgotPassword.post('/forgot-password/request-code', async (req, res) => {
    const email = typeof req.body.email === 'string' ? verification.normalizeEmail(req.body.email) : '';
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        if (await verification.emailExists(email)) {
            const code = verification.createCode();
            await verification.saveCode(email, 'password_reset', code);
            await verification.sendVerificationCode(email, code, 'password_reset');
        }
        res.status(202).json({ message: 'If that email exists, a reset code has been sent.' });
    } catch (err) {
        console.error('Error sending password reset code:', err);
        res.status(500).json({ err: 'Unable to send reset code' });
    }
});

forgotPassword.post('/forgot-password/reset', async (req, res) => {
    const { email, code, newPassword } = req.body;
    const normalizedEmail = typeof email === 'string' ? verification.normalizeEmail(email) : '';
    if (!normalizedEmail) {
        return res.status(400).json({ err: 'Validation error: email is required.' });
    }
    if (!/^\d{6}$/.test(code || '')) {
        return res.status(400).json({ err: 'Validation error: the email code must contain exactly 6 digits.' });
    }
    if (!PWD_REGEX.test(newPassword || '')) {
        return res.status(400).json({ err: 'Validation error: password must be 8-24 characters and include uppercase, lowercase, a number, and one of ! @ # $ %.' });
    }

    try {
        await verification.consumeCode(normalizedEmail, 'password_reset', code);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await client.query(
            `UPDATE users
             SET password = $1, refresh_token = NULL
             WHERE email = $2 AND is_deleted = false`,
            [hashedPassword, normalizedEmail]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ err: 'User not found' });
        }
        res.status(200).json({ message: 'Password reset successfully. You can login now.' });
    } catch (err) {
        console.error('Error resetting password:', err);
        if (err.message === 'Invalid or expired code') {
            return res.status(400).json({ err: err.message });
        }
        res.status(500).json({ err: 'Internal server error' });
    }
});

module.exports = forgotPassword;