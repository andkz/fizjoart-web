import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');
const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i)?.[0] || '';
console.log('Footer text:');
console.log(footerMatch.replace(/<[^>]+>/g, '\n').split('\n').map(s => s.trim()).filter(Boolean).join('\n'));
