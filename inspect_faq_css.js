import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

// search for czg96 or Open in styles
const matches = [...html.matchAll(/\.framer-[a-zA-Z0-9_\-]+[^{]*\{[^}]*\}/g)]
  .map(m => m[0])
  .filter(m => m.includes('czg96') || m.includes('framer-v-czg96'));

console.log('Matching CSS rules for FAQ:', matches.slice(0, 10));
