import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/_cennik.html', 'utf8');

const cardsMatch = html.match(/Czas:[\s\S]*?zł/gi);
console.log('Prices found on cennik:', cardsMatch);
