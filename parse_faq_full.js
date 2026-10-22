import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

const faqIdx = html.lastIndexOf('FAQ');
const chunk = html.substring(faqIdx, faqIdx + 20000);

// Look for texts inside the FAQ items
const textRegex = /data-framer-name=\"(Closed|Open)\"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
const items = [...chunk.matchAll(/<(?:h[1-6]|p|span)[^>]*>([^<]+)<\/(?:h[1-6]|p|span)>/g)].map(m => m[1].trim()).filter(Boolean);

const uniqueItems = [];
const seen = new Set();
items.forEach(item => {
  if (!seen.has(item)) {
    seen.add(item);
    uniqueItems.push(item);
  }
});

console.log(uniqueItems);
