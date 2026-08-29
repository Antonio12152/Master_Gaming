const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const helmet = require('helmet');

const posts = require('./routes/posts');
const users = require('./routes/users');
const ai = require('./routes/ai');
const updateAccessToken = require('./controllers/updateAccessToken');

const app = express();
const port = Number(process.env.PORT || process.env.SERVER_PORT || 5000);

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://master-gaming.netlify.app',
    'https://master-gaming.vercel.app'
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
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(posts, users, ai, updateAccessToken);

app.get('/', (req, res) => {
    res.json({ message: 'Hello world!' });
});

app.use((err, req, res, next) => {
    if (err instanceof Error && err.message === 'Not allowed by CORS') {
        return res.status(403).json({ message: 'Access denied by CORS policy.' });
    }

    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

module.exports = app;
