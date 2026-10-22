import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

const navIdx = html.indexOf('data-framer-name="Phone"');
const chunk = html.substring(navIdx, navIdx + 5000);
console.log('Phone Nav surrounding:');
console.log(chunk.substring(0, 1500));
