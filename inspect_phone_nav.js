import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

const navs = [...html.matchAll(/<nav[\s\S]*?<\/nav>/gi)].map(m => m[0]);
console.log('Phone Nav HTML:');
console.log(navs[1]);
