const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const helmet = require('helmet');

// Импортируйте ваши маршруты
const posts = require('./routes/posts');
const users = require('./routes/users');

const port = process.env.SERVER_PORT || 5000;

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'https://master-gaming.netlify.app'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(helmet()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(posts, users);

app.get('/', (req, res) => {
    res.json("Hello world!");
});

app.use((err, req, res, next) => {
    if (err instanceof Error && err.message === 'Not allowed by CORS') {
        return res.status(403).json({ message: 'Access denied by CORS policy.' });
    }
    next(err);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
