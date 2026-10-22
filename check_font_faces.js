import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');
const fontFaces = [...html.matchAll(/@font-face\s*\{([^}]+)\}/g)].map(m => m[1]);
console.log('Font faces count:', fontFaces.length);
fontFaces.slice(0, 5).forEach((f, i) => console.log(`Face ${i}:`, f));
