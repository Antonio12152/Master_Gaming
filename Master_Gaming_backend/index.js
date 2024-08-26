const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const gamePosts = require('./posts/gamePosts')
const videos = require('./posts/videos')
const tags = require('./posts/tags')
const users = require('./users/users')
const user = require('./users/user')
const register = require('./users/register')
const insert = require('./posts/insertPost')
const login = require('./users/login')
const port = process.env.SERVER_PORT || 5000;

const app = express();
// use it to connect with aiven. don't use it on railway!
// (async () => {
//   await connectClient()
// })();
const allowedOrigins = [
    'http://localhost:3000',
    'https://master-gaming.netlify.app/',
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
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(gamePosts, videos, tags, users, user, insert, register, login);

app.get('/', (req, res) => {
    res.json("Hello world!")
});

app.listen(port, () => {
    console.log(`Server start on port ${port}`);
});