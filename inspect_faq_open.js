import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

const matches = [...html.matchAll(/\.framer-4eoZp[^{]*\{[^}]*\}/g)].map(m => m[0]);
console.log('framer-4eoZp CSS rules:', matches);
