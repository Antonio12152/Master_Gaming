const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const cors = require('cors');

const { connectClient, disconnectClient } = require('../client');
const gameposts = require('../gameposts')
const videos = require('../videos')
const tags = require('../tags')
const { users, user } = require('../users')

router.get('/', (req, res) => {
    res.send('App is running..');
});

(async () => {
    await connectClient()
})();

app.use(cors());
app.use(gameposts, videos, tags, users, user);

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);

const port = 8080;
app.listen(process.env.PORT || port, () => {
    console.log(`Listening on port ${port}`);
});