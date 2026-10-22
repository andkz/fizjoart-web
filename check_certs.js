import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/_o-mnie.html', 'utf8');

const certIds = ['md3tQ4bbdEeSCf0iQJqMy4BZgLs', 'EzJuQpGPffSI3XdIC1eXtrQZ01M', 'arVHDDRC4aVSstO3s74a6vdqE', 'ZSKBGMyjdSyJmYfgYZ2eQdN7fM', 'zC4cWuLIe05bVMWjyBWPtQmh7c0'];

certIds.forEach(id => {
  const idx = html.indexOf(id);
  if (idx !== -1) {
    console.log(`=== Cert: ${id} ===`);
    console.log(html.substring(Math.max(0, idx - 150), idx + 250));
  }
});
