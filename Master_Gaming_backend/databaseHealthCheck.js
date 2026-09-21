const cron = require('node-cron');
const { client } = require('./client');

async function checkDatabase() {
    console.log('Checking database availability...');

    try {
        await client.query('SELECT NOW()');
        console.log(`Database available - ${new Date().toISOString()}`);
    } catch (error) {
        console.error('Database health check failed:', error.message);
    }
}

function startDatabaseHealthCheck() {
    return cron.schedule('0 0 * * *', checkDatabase, {
        timezone: process.env.TZ || 'UTC'
    });
}

module.exports = {
    checkDatabase,
    startDatabaseHealthCheck
};