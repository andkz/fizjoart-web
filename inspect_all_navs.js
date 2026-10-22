import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

const navs = [...html.matchAll(/<nav[\s\S]*?<\/nav>/gi)].map(m => m[0]);
console.log('Nav tags count:', navs.length);
navs.forEach((n, i) => {
  const name = n.match(/data-framer-name="([^"]+)"/)?.[1];
  console.log(`Nav ${i}: data-framer-name="${name}"`);
});
