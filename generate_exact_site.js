import fs from 'fs';
import path from 'path';

const distDir = 'c:/Users/kamil/Documents/antigravity/fizjoart-web/dist';
const scrapedDir = 'c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped';
const publicDir = 'c:/Users/kamil/Documents/antigravity/fizjoart-web/public';
const assetMap = JSON.parse(fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/asset_map.json', 'utf8'));

// Copy public folders to dist
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(path.join(publicDir, 'images'), path.join(distDir, 'images'));
copyDir(path.join(publicDir, 'admin'), path.join(distDir, 'admin'));

const pageMappings = [
  { src: 'home.html', dest: 'index.html' },
  { src: '_o-mnie.html', dest: 'o-mnie/index.html' },
  { src: '_cennik.html', dest: 'cennik/index.html' },
  { src: '_kontakt.html', dest: 'kontakt/index.html' },
  { src: '_nota-prawna.html', dest: 'nota-prawna/index.html' },
  { src: '_blog.html', dest: 'blog/index.html' },
  { src: '_blog_kiedy-warto-zg_C5_82osi_C4_87-si_C4_99-do-fizjoterapeuty.html', dest: 'blog/kiedy-warto-zglosic-sie-do-fizjoterapeuty/index.html' }
];

const interactionScript = `
<script>
document.addEventListener('DOMContentLoaded', function() {
  // 1. FAQ Accordion toggle
  document.querySelectorAll('.framer-4eoZp').forEach(function(item) {
    item.addEventListener('click', function() {
      item.classList.toggle('framer-v-czg96');
      var icon = item.querySelector('.framer-181xy7y-container svg, .framer-181xy7y-container');
      if (icon) {
        icon.style.transition = 'transform 0.2s ease';
        icon.style.transform = item.classList.contains('framer-v-czg96') ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });
  });

  // 2. Mobile Menu toggle
  var menuBtn = document.querySelector('.framer-1wprfjj-container');
  if (menuBtn) {
    menuBtn.style.cursor = 'pointer';
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var existingOverlay = document.getElementById('mobile-menu-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
        return;
      }
      var overlay = document.createElement('div');
      overlay.id = 'mobile-menu-overlay';
      overlay.style.cssText = 'position:fixed;top:70px;left:0;width:100%;background:rgba(255,255,255,0.98);backdrop-filter:blur(20px);padding:24px;border-bottom:1px solid #eee;z-index:9999;box-shadow:0 10px 30px rgba(0,0,0,0.08);display:flex;flex-direction:column;gap:18px;';
      overlay.innerHTML = '<a href="/o-mnie" style="font-size:18px;font-weight:500;color:#0a0a0a;text-decoration:none;">O mnie</a>' +
        '<a href="/cennik" style="font-size:18px;font-weight:500;color:#0a0a0a;text-decoration:none;">Cennik</a>' +
        '<a href="/blog" style="font-size:18px;font-weight:500;color:#0a0a0a;text-decoration:none;">Blog</a>' +
        '<a href="/kontakt" style="font-size:18px;font-weight:500;color:#0a0a0a;text-decoration:none;">Kontakt</a>' +
        '<a href="/kontakt" style="margin-top:8px;padding:12px 20px;background:#004727;color:#fff;border-radius:8px;text-align:center;font-weight:500;text-decoration:none;">Umów Wizytę</a>';
      document.body.appendChild(overlay);
    });
  }
});
</script>
`;

for (const { src, dest } of pageMappings) {
  const srcPath = path.join(scrapedDir, src);
  if (!fs.existsSync(srcPath)) {
    console.warn('File not found:', srcPath);
    continue;
  }

  let html = fs.readFileSync(srcPath, 'utf8');

  // 1. Map asset URLs to local
  for (const [remote, local] of Object.entries(assetMap)) {
    html = html.replaceAll(remote, local);
  }
  html = html.replace(/https:\/\/framerusercontent\.com\/images\/([a-zA-Z0-9_\-\.]+)/g, (match, filename) => {
    return `/images/${filename}`;
  });

  // 2. Hide framer badge safely using CSS
  html = html.replace('</head>', '<style>#__framer-badge-container, .__framer-badge { display: none !important; }</style>\n</head>');

  // 3. Remove Framer tracking & editor bar scripts
  html = html.replace(/<script[^>]*events\.framer\.com[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script[^>]*__framer_force_showing_editorbar_since[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script[^>]*framer-bundle="main"[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<link rel="modulepreload"[^>]*>/gi, '');

  // 4. Fix navigation links
  html = html.replace(/href="\.\/o-mnie"/g, 'href="/o-mnie"');
  html = html.replace(/href="\.\/cennik"/g, 'href="/cennik"');
  html = html.replace(/href="\.\/kontakt"/g, 'href="/kontakt"');
  html = html.replace(/href="\.\/blog"/g, 'href="/blog"');
  html = html.replace(/href="\.\/nota-prawna"/g, 'href="/nota-prawna"');
  html = html.replace(/href="\.\/"/g, 'href="/"');

  // 5. Special handling for /kontakt: Netlify Forms
  if (src === '_kontakt.html') {
    html = html.replace(
      /<form class="framer-1pj9bh7"/g,
      '<form class="framer-1pj9bh7" name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" action="/kontakt?success=true"><input type="hidden" name="form-name" value="contact" />'
    );
  }

  // 6. Append interaction script before </body>
  html = html.replace('</body>', `${interactionScript}\n</body>`);

  // Write to dest
  const destPath = path.join(distDir, dest);
  const destDirPath = path.dirname(destPath);
  if (!fs.existsSync(destDirPath)) fs.mkdirSync(destDirPath, { recursive: true });

  fs.writeFileSync(destPath, html, 'utf8');
  console.log(`Processed ${src} -> ${dest} (${html.length} bytes)`);
}

console.log('All exact Framer pages generated successfully.');
