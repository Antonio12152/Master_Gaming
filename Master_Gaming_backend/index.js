const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const { connectClient, disconnectClient } = require('./client');
const gamePosts = require('./posts/gamePosts')
const videos = require('./videos')
const tags = require('./tags')
const users = require('./users/users')
const user = require('./users/user')
const createUser = require('./users/createUser')
const insert = require('./posts/insertPost')
const port = process.env.SERVER_PORT || 5000;

// use it to connect with aiven. don't use it on railway!
// (async () => {
//   await connectClient()
// })();
app.use(bodyParser.json());
app.use(cors());
app.use(gamePosts, videos, tags, users, user, insert, createUser);

app.get('/', (req, res) => {
    res.send('Hello! How did you get here?')
})

app.listen(port, () => {
  console.log(`Server start on port ${port}`);
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