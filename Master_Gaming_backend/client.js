require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.POOL || process.env.DATABASE_URL;

const sslConfig = (() => {
    const ca = process.env.CA?.replace(/\\n/g, '\n');

    if (!ca) {
        return { rejectUnauthorized: false };
    }

    return {
        rejectUnauthorized: true,
        ca,
    };
})();

const config_aiven = connectionString
    ? {
        connectionString,
        ssl: sslConfig,
    }
    : {
        user: process.env.USER,
        password: process.env.PASSWORD,
        host: process.env.HOST,
        port: Number(process.env.DB_PORT || 5432),
        database: process.env.DB,
        ssl: sslConfig,
    };

const client = new Pool({
    ...config_aiven,
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
    keepAlive: true,
});

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