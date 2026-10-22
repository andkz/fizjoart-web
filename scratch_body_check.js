import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
  const bodyContent = bodyMatch[1];
  console.log('Body length:', bodyContent.length);
  // find top-level children of body
  const topDivs = [...bodyContent.matchAll(/<div[^>]*class="([^"]+)"[^>]*>/g)].map(m => m[1]);
  console.log('Top div classes:', topDivs.slice(0, 10));
}
