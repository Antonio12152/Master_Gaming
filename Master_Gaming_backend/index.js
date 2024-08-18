const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const gamePosts = require('./posts/gamePosts')
const videos = require('./videos')
const tags = require('./tags')
const users = require('./users/users')
const user = require('./users/user')
const register = require('./users/register')
const insert = require('./posts/insertPost')
const login = require('./users/login')
const port = process.env.SERVER_PORT || 5000;
const secret = crypto.randomBytes(64).toString('hex');

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
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use(gamePosts, videos, tags, users, user, insert, register, login);

app.get('/', (req, res) => {
    if (!req.session.views) {
        req.session.views = 1;
    } else {
        req.session.views++;
    }
    res.send(`Number of views: ${req.session.views}`);
});

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