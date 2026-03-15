const fs = require('fs');

const pages = [
  { url: '/', priority: 1.0 },
  { url: '/about', priority: 0.8 },
  { url: '/search', priority: 0.9 },
  { url: '/contact', priority: 0.8 },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `\n  <url>\n    <loc>https://scriptureunityai.vercel.app${page.url}</loc>\n    <priority>${page.priority}</priority>\n  </url>`
    )
    .join('')}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemap);
console.log('Sitemap generated!');
