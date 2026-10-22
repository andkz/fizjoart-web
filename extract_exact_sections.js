import fs from 'fs';
import path from 'path';

const files = [
  { name: 'Home', file: 'home.html' },
  { name: 'O mnie', file: '_o-mnie.html' },
  { name: 'Cennik', file: '_cennik.html' },
  { name: 'Kontakt', file: '_kontakt.html' },
  { name: 'Nota prawna', file: '_nota-prawna.html' },
  { name: 'Blog', file: '_blog.html' },
  { name: 'Post', file: '_blog_kiedy-warto-zg_C5_82osi_C4_87-si_C4_99-do-fizjoterapeuty.html' }
];

for (const { name, file } of files) {
  const p = path.join('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped', file);
  if (!fs.existsSync(p)) continue;
  const html = fs.readFileSync(p, 'utf8');

  // get all visible texts inside framer text blocks
  const textMatches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>|<h1[^>]*>([\s\S]*?)<\/h1>|<h2[^>]*>([\s\S]*?)<\/h2>|<h3[^>]*>([\s\S]*?)<\/h3>|<span[^>]*class=\"[^\"]*framer-text[^\"]*\"[^>]*>([\s\S]*?)<\/span>/gi)]
    .map(m => (m[1] || m[2] || m[3] || m[4] || m[5] || '').replace(/<[^>]+>/g, '').trim())
    .filter(t => t.length > 0);

  const unique = [];
  const seen = new Set();
  for (const t of textMatches) {
    if (!seen.has(t)) {
      seen.add(t);
      unique.push(t);
    }
  }

  console.log(`\n================== ${name} (${unique.length} texts) ==================`);
  unique.forEach((t, i) => {
    if (i < 30 || t.length > 50) {
      console.log(`[${i}] ${t.substring(0, 120)}`);
    }
  });
}
