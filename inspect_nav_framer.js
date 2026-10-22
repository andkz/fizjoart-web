import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

const navMatch = html.match(/<nav[\s\S]*?<\/nav>/i)?.[0] || '';
console.log('Nav classes:', navMatch.substring(0, 300));
