import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

console.log('Framer badge:', html.includes('framer-badge') || html.includes('__framer-badge'));
const scripts = [...html.matchAll(/<script[\s\S]*?<\/script>/gi)].map(m => m[0]);
console.log('Script count:', scripts.length);
scripts.forEach((s, i) => console.log(`Script ${i}:`, s.substring(0, 150)));

const styles = [...html.matchAll(/<style[\s\S]*?<\/style>/gi)].map(m => m[0]);
console.log('Style tags count:', styles.length);
