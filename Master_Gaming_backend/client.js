require('dotenv').config();
const pg = require('pg');
const { Pool } = require("pg");

const connectionString = process.env.POOL

const config_aiven = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    database: process.env.DB,
    ssl: {
        rejectUnauthorized: true,
        ca: `${process.env.CA}`,
    },
};

const client = new Pool(config_aiven);

async function connectClient() {
    try {
        await client.connect();
        console.log('Connected to the database');
    } catch (err) {
        console.error('Connection error', err.stack);
    }
}

async function disconnectClient() {
    try {
        await client.end();
        console.log('Disconnected from the database');
    } catch (err) {
        console.error('Disconnection error', err.stack);
    }
}

module.exports = {
    client,
    connectClient,
    disconnectClient
}