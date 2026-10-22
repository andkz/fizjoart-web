import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/test_home.html', 'utf8');

// check external links
const external = [...html.matchAll(/(src|href)="([^"]+)"/g)]
  .map(m => m[2])
  .filter(u => u.startsWith('http://') || u.startsWith('https://'));

console.log('Unique external URLs:', Array.from(new Set(external)));
