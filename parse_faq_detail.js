import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

const faqIdx = html.lastIndexOf('FAQ');
const chunk = html.substring(faqIdx, faqIdx + 6000);
const clean = chunk.replace(/<[^>]+>/g, '\n').split('\n').map(s => s.trim()).filter(Boolean);
console.log(clean);
