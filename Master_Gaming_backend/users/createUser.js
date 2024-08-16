const bcrypt = require('bcrypt');
const express = require('express');
const { client } = require('../client');

const createUser = express.Router();

const saltRounds = 10;

async function hashPassword(password) {
    let pass = password.toString();
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(pass, salt);
    return hash;
}
    
async function verifyPassword(password, hash) {
    const match = await bcrypt.compare(password, hash);
    return match;
}

async function pushUser(name, email, password, img, about) {
    const hashedPassword = await hashPassword(password);
    const query = `
        INSERT INTO users (name, email, password, img, about) 
        VALUES ($1, $2, $3, $4, $5);
    `;
    
    try {
        const result = await client.query(query, [name, email, hashedPassword, img, about]);
        return result.rows[0];
    } catch (err) {
        if (err.code === '23505') {
            res.status(400).json({ err: 'Username or email already exists' });
        } else{
            throw new Error('Error inserting user into the database');
        }
    }
}

createUser.post('/createuser', (req, res) => {
    (async () => {
        const { name, email, password, img, about } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }
        try {
//            const user = await pushUser(name, email, password, img, about);
            res.status(201).json(user);
        } catch (err) {
            console.error('Error adding user:', err);
            res.status(500).json({ message: err.message });
        }
    })();
});

module.exports = createUser