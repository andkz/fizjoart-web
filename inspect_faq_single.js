import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

const ans = 'Jestem fizjoterapeutą. Pracuję z bólem';
const idx = html.indexOf(ans);
const chunk = html.substring(Math.max(0, idx - 1200), idx + 100);
const clean = chunk.replace(/<[^>]+>/g, '\n').split('\n').map(s => s.trim()).filter(Boolean);
console.log(clean);
