const fs = require('fs');
const path = require('path');

const map = JSON.parse(fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/asset_map.json', 'utf8'));
const files = fs.readdirSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped').filter(f => f.endsWith('.html'));

const roles = {};

for (const [url, localPath] of Object.entries(map)) {
  roles[localPath] = { contexts: [] };
  const filename = path.basename(url);

  for (const file of files) {
    const html = fs.readFileSync(path.join('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped', file), 'utf8');
    if (html.includes(filename)) {
      // find alt or surrounding text
      const regex = new RegExp(`<img[^>]*${filename}[^>]*>`, 'g');
      const matches = [...html.matchAll(regex)].map(m => m[0]);
      if (matches.length > 0) {
        roles[localPath].contexts.push({ file, tags: matches });
      } else {
        roles[localPath].contexts.push({ file, inCssOrJs: true });
      }
    }
  }
}

for (const [img, data] of Object.entries(roles)) {
  console.log(`\n=== ${img} ===`);
  data.contexts.forEach(c => {
    if (c.tags) {
      console.log(`  File: ${c.file}`);
      c.tags.forEach(t => console.log(`    Tag: ${t.substring(0, 150)}`));
    } else {
      console.log(`  File: ${c.file} (CSS/background)`);
    }
  });
}
