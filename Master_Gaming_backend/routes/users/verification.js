const crypto = require('crypto');
const express = require('express');
const { client } = require('../../client');
const { sendVerificationCode } = require('../../email');

const verification = express.Router();
const CODE_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

function createCode() {
    return crypto.randomInt(100000, 1000000).toString();
}

function hashCode(code) {
    return crypto.createHash('sha256').update(code).digest('hex');
}

async function ensureVerificationTable() {
    await client.query(`
        CREATE TABLE IF NOT EXISTS email_verifications (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            email text NOT NULL,
            purpose text NOT NULL CHECK (purpose IN ('registration', 'password_reset')),
            code_hash text NOT NULL,
            expires_at timestamptz NOT NULL,
            attempts integer NOT NULL DEFAULT 0,
            created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

async function saveCode(email, purpose, code) {
    await ensureVerificationTable();
    await client.query('DELETE FROM email_verifications WHERE email = $1 AND purpose = $2', [email, purpose]);
    await client.query(
        `INSERT INTO email_verifications (email, purpose, code_hash, expires_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP + ($4 * INTERVAL '1 minute'))`,
        [email, purpose, hashCode(code), CODE_EXPIRY_MINUTES]
    );
}

async function consumeCode(email, purpose, code) {
    await ensureVerificationTable();
    const result = await client.query(
        `SELECT id, code_hash, expires_at, attempts
         FROM email_verifications WHERE email = $1 AND purpose = $2`,
        [email, purpose]
    );
    const record = result.rows[0];
    if (!record || new Date(record.expires_at) < new Date()) {
        throw new Error('Invalid or expired code');
    }
    if (record.attempts >= MAX_ATTEMPTS || hashCode(code) !== record.code_hash) {
        await client.query('UPDATE email_verifications SET attempts = attempts + 1 WHERE id = $1', [record.id]);
        throw new Error('Invalid or expired code');
    }
    await client.query('DELETE FROM email_verifications WHERE id = $1', [record.id]);
}

async function emailExists(email) {
    const result = await client.query(
        'SELECT id FROM users WHERE email = $1 AND is_deleted = false',
        [email]
    );
    return result.rows.length > 0;
}

verification.saveCode = saveCode;
verification.consumeCode = consumeCode;
verification.emailExists = emailExists;
verification.normalizeEmail = normalizeEmail;
verification.createCode = createCode;
verification.sendVerificationCode = sendVerificationCode;

module.exports = verification;