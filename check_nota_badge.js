import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/_nota-prawna.html', 'utf8');
const idx = html.indexOf('__framer-badge');
console.log('Index of __framer-badge:', idx);
const chunk = html.substring(idx - 100, idx + 300);
console.log(chunk);
