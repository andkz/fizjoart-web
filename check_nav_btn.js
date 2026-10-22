import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

const navMatch = html.match(/<nav[\s\S]*?<\/nav>/i)?.[0] || '';
// extract button styles
const btnMatch = navMatch.match(/<a[^>]*href=\"\.\/kontakt\"[^>]*>([\s\S]*?)<\/a>/gi);
console.log('Button matches in nav:', btnMatch);
