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

const instantHeadTags = `
  <meta name="view-transition" content="same-origin">
  <style>
    @view-transition { navigation: auto; }
    #__framer-badge-container, .__framer-badge { display: none !important; }
  </style>
  <script type="speculationrules">
  {
    "prerender": [
      {
        "source": "list",
        "urls": ["/", "/o-mnie/", "/cennik/", "/kontakt/", "/blog/", "/nota-prawna/"],
        "eagerness": "moderate"
      }
    ],
    "prefetch": [
      {
        "source": "list",
        "urls": ["/", "/o-mnie/", "/cennik/", "/kontakt/", "/blog/", "/nota-prawna/"],
        "eagerness": "immediate"
      }
    ]
  }
  </script>
`;

const interactionScript = `
<script>
document.addEventListener('DOMContentLoaded', function() {
  // 1. Instant Hover & Touch Pre-fetching for maximum speed across all browsers
  (function() {
    var prefetched = new Set();
    function prefetchUrl(url) {
      if (!url || prefetched.has(url)) return;
      prefetched.add(url);
      var link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    }
    ['mouseover', 'touchstart', 'pointerdown'].forEach(function(ev) {
      document.addEventListener(ev, function(e) {
        var a = e.target.closest('a');
        if (a && a.origin === location.origin && a.pathname && !a.pathname.startsWith('/admin')) {
          prefetchUrl(a.href);
        }
      }, { passive: true });
    });
  })();

  // 2. FAQ Accordion toggle
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

  // 3. Mobile Menu toggle with proper trailing slashes
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
      overlay.innerHTML = '<a href="/o-mnie/" style="font-size:18px;font-weight:500;color:#0a0a0a;text-decoration:none;">O mnie</a>' +
        '<a href="/cennik/" style="font-size:18px;font-weight:500;color:#0a0a0a;text-decoration:none;">Cennik</a>' +
        '<a href="/blog/" style="font-size:18px;font-weight:500;color:#0a0a0a;text-decoration:none;">Blog</a>' +
        '<a href="/kontakt/" style="font-size:18px;font-weight:500;color:#0a0a0a;text-decoration:none;">Kontakt</a>' +
        '<a href="/kontakt/" style="margin-top:8px;padding:12px 20px;background:#004727;color:#fff;border-radius:8px;text-align:center;font-weight:500;text-decoration:none;">Umów Wizytę</a>';
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

  // 2. Remove Framer tracking & editor bar scripts
  html = html.replace(/<script[^>]*events\.framer\.com[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script[^>]*__framer_force_showing_editorbar_since[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script[^>]*framer-bundle="main"[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<link rel="modulepreload"[^>]*>/gi, '');

  // 3. Standardize and normalize all navigation links to trailing slashes
  html = html.replace(/href="(?:\.\/|\.\.\/|https:\/\/fizjoart\.framer\.media\/)?o-mnie\/?([#?][^"]*)?"/g, (m, q) => `href="/o-mnie/${q || ''}"`);
  html = html.replace(/href="(?:\.\/|\.\.\/|https:\/\/fizjoart\.framer\.media\/)?cennik\/?([#?][^"]*)?"/g, (m, q) => `href="/cennik/${q || ''}"`);
  html = html.replace(/href="(?:\.\/|\.\.\/|https:\/\/fizjoart\.framer\.media\/)?kontakt\/?([#?][^"]*)?"/g, (m, q) => `href="/kontakt/${q || ''}"`);
  html = html.replace(/href="(?:\.\/|\.\.\/|https:\/\/fizjoart\.framer\.media\/)?blog\/?([#?][^"]*)?"/g, (m, q) => `href="/blog/${q || ''}"`);
  html = html.replace(/href="(?:\.\/|\.\.\/|https:\/\/fizjoart\.framer\.media\/)?nota-prawna\/?([#?][^"]*)?"/g, (m, q) => `href="/nota-prawna/${q || ''}"`);
  html = html.replace(/href="(?:\.\/|\.\.\/|https:\/\/fizjoart\.framer\.media\/)?blog\/kiedy-warto-(?:zgłosić|zg%C5%82osi%C4%87)-si(?:ę|%C4%99)-do-fizjoterapeuty\/?([#?][^"]*)?"/g, (m, q) => `href="/blog/kiedy-warto-zglosic-sie-do-fizjoterapeuty/${q || ''}"`);
  html = html.replace(/href="https:\/\/fizjoart\.framer\.media\/?"/g, 'href="/"');
  html = html.replace(/href="\.\/"/g, 'href="/"');
  html = html.replace(/href="\.\.\/"/g, 'href="/"');

  // 4. Special handling for /kontakt/: Netlify Forms
  if (src === '_kontakt.html') {
    html = html.replace(
      /<form class="framer-1pj9bh7"/g,
      '<form class="framer-1pj9bh7" name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" action="/kontakt/?success=true"><input type="hidden" name="form-name" value="contact" />'
    );
  }

  // 5. Inject Speculation Rules, View Transitions, and Badge hiding into <head>
  html = html.replace('</head>', `${instantHeadTags}\n</head>`);

  // 6. Append interaction script before </body>
  html = html.replace('</body>', `${interactionScript}\n</body>`);

  // Write to dest
  const destPath = path.join(distDir, dest);
  const destDirPath = path.dirname(destPath);
  if (!fs.existsSync(destDirPath)) fs.mkdirSync(destDirPath, { recursive: true });

  fs.writeFileSync(destPath, html, 'utf8');
  console.log(`Processed ${src} -> ${dest} (${html.length} bytes)`);
}

console.log('All exact Framer pages generated successfully with Instant Navigation.');
