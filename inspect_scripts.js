import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/gi)].map(m => m[1]);
console.log('Scripts:', scripts);
