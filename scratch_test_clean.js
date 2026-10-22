import fs from 'fs';
import path from 'path';

const map = JSON.parse(fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/asset_map.json', 'utf8'));
let html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

// replace asset URLs
for (const [remote, local] of Object.entries(map)) {
  html = html.replaceAll(remote, local);
}

// Also replace any remaining framerusercontent images or srcset
html = html.replace(/https:\/\/framerusercontent\.com\/images\/([a-zA-Z0-9_\-\.]+)/g, (match, filename) => {
  return `/images/${filename}`;
});

// Remove framer badge
html = html.replace(/<div id="__framer-badge[\s\S]*?<\/div>\s*<\/div>/g, '');
html = html.replace(/<a[^>]*class="[^"]*__framer-badge[^"]*"[\s\S]*?<\/a>/g, '');
html = html.replace(/__framer-badge[\s\S]*?<\/div>/g, '');

// Clean up links: href="./o-mnie" -> href="/o-mnie", href="./" -> href="/"
html = html.replace(/href="\.\/([^"]*)"/g, (m, p) => `href="/${p}"`);
html = html.replace(/href="\.\/"/g, 'href="/"');

// Remove Framer tracking and editorbar scripts
html = html.replace(/<script[^>]*events\.framer\.com[\s\S]*?<\/script>/gi, '');
html = html.replace(/<script[^>]*__framer_force_showing_editorbar_since[\s\S]*?<\/script>/gi, '');
html = html.replace(/<script[^>]*framer-bundle="main"[\s\S]*?<\/script>/gi, '');

fs.writeFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/test_home.html', html, 'utf8');
console.log('Saved test_home.html, size:', html.length);
