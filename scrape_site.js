const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://fizjoart.framer.media';
const pages = [
  '/',
  '/o-mnie',
  '/cennik',
  '/kontakt',
  '/nota-prawna',
  '/blog',
  '/blog/kiedy-warto-zg%C5%82osi%C4%87-si%C4%99-do-fizjoterapeuty'
];

async function run() {
  const outputDir = 'c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped';
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const allImages = new Set();
  const allFonts = new Set();
  const pageData = {};

  for (const p of pages) {
    const url = p === '/' ? BASE_URL : `${BASE_URL}${p}`;
    console.log(`Fetching ${url}...`);
    try {
      const res = await fetch(url);
      const html = await res.text();
      const safeName = p === '/' ? 'home' : p.replace(/[\/%]/g, '_');
      fs.writeFileSync(path.join(outputDir, `${safeName}.html`), html, 'utf8');

      // extract images
      const imgMatches = [...html.matchAll(/https:\/\/framerusercontent\.com\/images\/[a-zA-Z0-9_\-\.]+/g)].map(m => m[0]);
      imgMatches.forEach(img => allImages.add(img));

      // extract fonts
      const fontMatches = [...html.matchAll(/https:\/\/framerusercontent\.com\/assets\/[a-zA-Z0-9_\-\.]+\.(woff2|woff|ttf|otf)/g)].map(m => m[0]);
      fontMatches.forEach(f => allFonts.add(f));

      // extract title & meta description
      const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || '';
      const desc = html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '';

      pageData[p] = { title, desc, imgCount: imgMatches.length };
    } catch (e) {
      console.error(`Error fetching ${p}:`, e.message);
    }
  }

  console.log('\n--- Page Summary ---');
  console.log(pageData);
  console.log('\nTotal unique images:', allImages.size);
  console.log('Total unique fonts:', allFonts.size);

  fs.writeFileSync(path.join(outputDir, 'summary.json'), JSON.stringify({
    pageData,
    images: Array.from(allImages),
    fonts: Array.from(allFonts)
  }, null, 2), 'utf8');
}

run().catch(console.error);
