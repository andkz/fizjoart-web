import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');
const links = [...html.matchAll(/href="([^"]*fonts\.googleapis\.com[^"]*)"/g)].map(m => m[1]);
console.log('Google font links:', links);
const preconnect = [...html.matchAll(/href="([^"]*fonts\.gstatic\.com[^"]*)"/g)].map(m => m[1]);
console.log('Preconnect:', preconnect);
