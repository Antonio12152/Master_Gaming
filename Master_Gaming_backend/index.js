const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const posts = require('./posts/posts')
const post = require('./posts/post')
const videos = require('./posts/videos')
const tags = require('./posts/tags')
const deletePost = require('./posts/deletePost')
const comment = require('./posts/createComment')
const deleteComment = require('./posts/deleteComment')
const update = require('./posts/updatePost')
const users = require('./users/users')
const user = require('./users/user')
const register = require('./users/register')
const insert = require('./posts/insertPost')
const login = require('./users/login')
const logout = require('./users/logout')
const updateAccessToken = require('./controllers/updateAccessToken')
const port = process.env.SERVER_PORT || 5000;

const app = express();
// use it to connect db without url.
// (async () => {
//   await connectClient()
// })();
const allowedOrigins = [
    'http://localhost:3000',
    'https://master-gaming.netlify.app',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, 
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(posts, post, videos, tags, users, user, insert, register, login, logout, updateAccessToken, deletePost, comment, deleteComment, update);

app.get('/', (req, res) => {
    res.json("Hello world!")
});

app.listen(port, () => {
    console.log(`Server start on port ${port}`);
});