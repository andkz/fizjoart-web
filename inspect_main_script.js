import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

const scriptTag = html.match(/<script type="module" async data-framer-bundle="main"[\s\S]*?<\/script>/i)?.[0];
console.log('Main script tag:');
console.log(scriptTag);
