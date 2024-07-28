const express = require('express');
const cors = require('cors');
const app = express();

const { connectClient, disconnectClient } = require('./client');
const gameposts = require('./gameposts')
const videos = require('./videos')
const tags = require('./tags')
const {users, user} = require('./users')
const port = process.env.SERVER_PORT || 5000;

(async () => {
  await connectClient()
})();

app.use(cors());
app.use(gameposts, videos, tags, users, user);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
















// const cors = require('cors');
// const gameposts = require('./gameposts');
// const tags = require('./tags')
// const videos = require('./videos')

// const app = express();
// const port = 5000;

// app.use(cors());

// app.use(gameposts, tags, videos);

// app.use('/images/posts', express.static('images'));
// app.use('/images/users', express.static('images'));

// app.listen(port, () => {
//   console.log(`Сервер запущен на порту ${port}`);
// });