// const bcrypt = require('bcrypt');

const express = require('express');
const { client } = require('./client');

const users = express.Router();
const user = express.Router();

async function getUsers() {
    const query = `
    SELECT 
        users.id, 
        users.name AS username, 
        users.about,
        users.email,
        to_char(users.created_at, 'yyyy/mm/dd') AS user_created_at,
        users.img AS user_img
    FROM 
        users
    `;

    try {
        const result = await client.query(query);
        return result.rows;
    } catch (err) {
        console.error('Query error', err.stack);
        throw err;
    }
}

async function getUserIdByName(name) {
    const query = `
    SELECT 
        id
    FROM 
        users
    WHERE
        name = $1
    `;

    try {
        const result = await client.query(query, [name]);
        return result.rows[0]?.id;
    } catch (err) {
        console.error('Query error', err.stack);
        throw err;
    }
}

async function getUserById(id) {
    const query = `
    SELECT 
        users.id, 
        users.name AS username, 
        users.about,
        users.email,
        to_char(users.created_at, 'yyyy/mm/dd') AS user_created_at,
        users.img AS user_img
    FROM 
        users
    WHERE
        users.id = ${parseInt(id)}
    `;

    try {
        const result = await client.query(query);
        return result.rows;
    } catch (err) {
        console.error('Query error', err.stack);
        throw err;
    }
}

users.get(`/users`, (req, res) => {
    (async () => {
        try {
            const posts = await getUsers();
            res.json(posts)
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    })();
});

user.get(`/users/:username`, (req, res) => {
    (async () => {
        try {
            const username = req.params.username;
            const userId = await getUserIdByName(username);
            const posts = await getUserById(userId);
            res.json(posts)
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    })();
});


module.exports = {user, users}

// const saltRounds = 10;

// async function hashPassword(password) {
//     let pass = password.toString();
//     const salt = await bcrypt.genSalt(saltRounds);
//     const hash = await bcrypt.hash(pass, salt);
//     return hash;
// }
    
// async function verifyPassword(password, hash) {
//     const match = await bcrypt.compare(password, hash);
//     return match;
// }

// async function addUser(name, password) {
//     const hashedPassword = await hashPassword(password);
//     const query = 'INSERT INTO users (name, password_hash) VALUES ($1, $2)';
//     await client.query(query, [name, hashedPassword]);
//     console.log('User added');
// }