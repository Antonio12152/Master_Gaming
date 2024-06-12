const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const gameposts = require('./gameposts');
const tags = require('./tags')
const videos = require('./videos')

const app = express();
const port = 5000;

app.use(gameposts, tags, videos);

app.use('/images', express.static('images'));

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});