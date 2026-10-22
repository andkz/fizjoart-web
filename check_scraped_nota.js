import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/_nota-prawna.html', 'utf8');
console.log('Title:', html.match(/<title>([^<]+)<\/title>/)?.[1]);
console.log('Body length:', html.length);
console.log(html.substring(0, 1000));
