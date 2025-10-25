require('dotenv').config();
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

(async () => {
    const hostname = process.env.SITE_URL || 'http://localhost:3000';

    const sitemap = new SitemapStream({ hostname });

    const routes = [
        '/',
        '/posts',
        '/tags',
        '/videos',
        '/register',
        '/login'
    ];

    routes.forEach(route => {
        if (route.includes(':')) return;
        sitemap.write({ url: route, changefreq: 'weekly', priority: 0.8 });
    });

    sitemap.end();

    const outputPath = path.join(__dirname, 'public', 'sitemap.xml');
    const data = await streamToPromise(sitemap);
    createWriteStream(outputPath).write(data);

    console.log(`Sitemap - ${outputPath}`);
})();
