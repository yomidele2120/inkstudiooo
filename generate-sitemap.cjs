const fs = require('fs');

const BASE_URL = 'https://inkstudiooo.lovable.app';

const pages = [
  { url: '/', priority: 1.0 },
  { url: '/search', priority: 0.9 },
  { url: '/results', priority: 0.6 },
  { url: '/topics', priority: 0.8 },
  { url: '/compare', priority: 0.8 },
  { url: '/understanding', priority: 0.8 },
  { url: '/scripture/bible', priority: 0.8 },
  { url: '/scripture/quran', priority: 0.8 },
  { url: '/scripture/other', priority: 0.8 },
  { url: '/read/bible', priority: 0.7 },
  { url: '/read/quran', priority: 0.7 },
  { url: '/read/other', priority: 0.7 },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages
  .map((p) => `\n  <url><loc>${BASE_URL}${p.url}</loc><priority>${p.priority}</priority></url>`)
  .join('')}
</urlset>
`;

fs.writeFileSync('public/sitemap.xml', sitemap);
console.log('Sitemap generated!');
