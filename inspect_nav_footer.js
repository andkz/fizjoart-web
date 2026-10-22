import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');
const nav = html.match(/<nav[\s\S]*?<\/nav>/i)?.[0] || '';

const links = [...nav.matchAll(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)];
console.log('--- Nav Links ---');
links.forEach(l => {
  const text = l[2].replace(/<[^>]+>/g, '').trim();
  console.log(`Href: ${l[1]} | Text: "${text}"`);
});

// find footer
const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i)?.[0] || '';
console.log('\n--- Footer Links ---');
const fLinks = [...footerMatch.matchAll(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)];
fLinks.forEach(l => {
  const text = l[2].replace(/<[^>]+>/g, '').trim();
  console.log(`Href: ${l[1]} | Text: "${text}"`);
});
