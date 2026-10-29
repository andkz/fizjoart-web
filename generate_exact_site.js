import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const rootDir = 'c:/Users/kamil/Documents/antigravity/fizjoart-web';
const distDir = path.join(rootDir, 'dist');
const scrapedDir = path.join(rootDir, '_scraped');
const publicDir = path.join(rootDir, 'public');
const contentBlogDir = path.join(rootDir, 'src/content/blog');
const assetMap = JSON.parse(fs.readFileSync(path.join(rootDir, 'asset_map.json'), 'utf8'));

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

function formatPolishDate(dateStr) {
  const months = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
  if (!dateStr) return '';
  const str = String(dateStr).trim();
  if (str.includes('-')) {
    const parts = str.split('T')[0].split('-');
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parts[0];
    return `${day} ${months[month]} ${year}`;
  }
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Read blog posts from src/content/blog
function loadBlogPosts() {
  const posts = [];
  if (!fs.existsSync(contentBlogDir)) return posts;
  const files = fs.readdirSync(contentBlogDir).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const content = fs.readFileSync(path.join(contentBlogDir, file), 'utf8');
    const { data, content: body } = matter(content);
    posts.push({
      slug,
      title: data.title || 'Bez tytułu',
      description: data.description || '',
      pubDate: data.pubDate || '2026-01-01',
      formattedDate: formatPolishDate(data.pubDate),
      author: data.author || 'Artur Bania',
      category: data.category || 'Porady',
      image: data.image || '/images/17ktvQuSBDmjDTM3Gr3L7nOKHE.jpg',
      body: body || ''
    });
  }
  // Sort descending by date
  posts.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  return posts;
}

const blogPosts = loadBlogPosts();
console.log(`Loaded ${blogPosts.length} blog posts from ${contentBlogDir}`);

function cleanHtmlCommon(html) {
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

  // 4. Inject Speculation Rules, View Transitions, and Badge hiding into <head>
  html = html.replace('</head>', `${instantHeadTags}\n</head>`);

  // 5. Append interaction script before </body>
  html = html.replace('</body>', `${interactionScript}\n</body>`);

  return html;
}

// Static page mappings
const staticPages = [
  { src: 'home.html', dest: 'index.html' },
  { src: '_o-mnie.html', dest: 'o-mnie/index.html' },
  { src: '_cennik.html', dest: 'cennik/index.html' },
  { src: '_kontakt.html', dest: 'kontakt/index.html' },
  { src: '_nota-prawna.html', dest: 'nota-prawna/index.html' }
];

for (const { src, dest } of staticPages) {
  const srcPath = path.join(scrapedDir, src);
  if (!fs.existsSync(srcPath)) continue;
  let html = fs.readFileSync(srcPath, 'utf8');

  if (src === '_kontakt.html') {
    html = html.replace(
      /<form class="framer-1pj9bh7"/g,
      '<form class="framer-1pj9bh7" name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" action="/kontakt/?success=true"><input type="hidden" name="form-name" value="contact" />'
    );
  }

  html = cleanHtmlCommon(html);
  const destPath = path.join(distDir, dest);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, html, 'utf8');
  console.log(`Generated static page: ${dest}`);
}

// Generate /blog/index.html with all cards
function generateBlogListing() {
  const srcPath = path.join(scrapedDir, '_blog.html');
  let html = fs.readFileSync(srcPath, 'utf8');

  // Build cards HTML
  const cardsHtml = blogPosts.map(post => `
    <div class="framer-1tygonj-container">
      <a class="framer-9YldO framer-G4ikZ framer-H5kJp framer-1kjk97w framer-v-1kjk97w framer-6pbzcx" data-framer-name="Default" href="/blog/${post.slug}/" style="background-color:var(--token-80553515-7ab0-44ac-b981-96d7680674fd, rgb(255, 255, 255));width:100%;border-bottom-left-radius:16px;border-bottom-right-radius:16px;border-top-left-radius:16px;border-top-right-radius:16px;box-shadow:0px 4px 8px 0px rgba(0, 0, 0, 0.08)">
        <div class="framer-1ls4zx8" data-framer-name="Image Wrapper" style="border-bottom-left-radius:10px;border-bottom-right-radius:10px;border-top-left-radius:10px;border-top-right-radius:10px">
          <div class="framer-ehb8t6" data-framer-name="Image" style="transform:none">
            <div style="position:absolute;border-radius:inherit;corner-shape:inherit;top:0;right:0;bottom:0;left:0" data-framer-background-image-wrapper="true">
              <img decoding="async" src="${post.image}" alt="${post.title}" style="display:block;width:100%;height:100%;border-radius:inherit;corner-shape:inherit;object-position:center;object-fit:cover" />
            </div>
          </div>
          <div class="framer-1sz5eah" data-framer-name="Overlay" style="background-color:rgb(23, 23, 23);opacity:0"></div>
        </div>
        <div class="framer-16958fj" data-framer-name="Text Wrapper">
          <div class="framer-1t02orb">
            <div class="framer-1g4ac3s-container">
              <div class="framer-bT280 framer-NZyzg framer-1a4fu0n framer-v-1a4fu0n" data-border="true" data-framer-name="Primary / L" style="--border-bottom-width:1px;--border-color:var(--token-cea865e2-a56c-48f4-b031-3e5821c6e8aa, rgb(229, 229, 229));--border-left-width:1px;--border-right-width:1px;--border-style:solid;--border-top-width:1px;background:linear-gradient(180deg, var(--token-1e4de996-fe4b-4667-88fc-284e9577f815, rgb(250, 250, 250)) 0%, var(--token-1e4de996-fe4b-4667-88fc-284e9577f815, rgb(250, 250, 250)) 100%);background-color:var(--token-1e4de996-fe4b-4667-88fc-284e9577f815, rgb(250, 250, 250));border-bottom-left-radius:8px;border-bottom-right-radius:8px;border-top-left-radius:8px;border-top-right-radius:8px">
                <div class="framer-14tzjtf" data-framer-name="Label Wrapper">
                  <div class="framer-1e0yg06" data-framer-component-type="RichTextContainer" style="--extracted-r6o4lv:var(--token-9054ee5e-347f-4b51-933a-5c869b1f745c, rgb(0, 71, 39));transform:none">
                    <p class="framer-text framer-styles-preset-11v2ke7" data-styles-preset="nAZw8NEQ6" dir="auto" style="--framer-text-color:var(--extracted-r6o4lv, var(--token-9054ee5e-347f-4b51-933a-5c869b1f745c, rgb(0, 71, 39)))">${post.category}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="framer-957hzn" data-framer-component-type="RichTextContainer" style="--framer-link-text-color:rgb(0, 153, 255);--framer-link-text-decoration:underline;transform:none">
              <p class="framer-text">${post.formattedDate}</p>
            </div>
          </div>
          <div class="framer-6grcbr">
            <div class="framer-1en3lq8" data-framer-component-type="RichTextContainer" style="transform:none">
              <h2 class="framer-text framer-styles-preset-108a0d4" data-styles-preset="r_EkJQedq" style="--framer-text-alignment:left">${post.title}</h2>
            </div>
            <div class="framer-1oqcm3s" data-framer-component-type="RichTextContainer" style="--extracted-r6o4lv:var(--token-c9883a06-0714-4bde-a248-d9d8eb496918, rgb(64, 64, 64));--framer-link-text-color:rgb(0, 153, 255);--framer-link-text-decoration:underline;transform:none">
              <p class="framer-text framer-styles-preset-vuyne3" data-styles-preset="GygTAX8TE" style="--framer-text-alignment:left;--framer-text-color:var(--extracted-r6o4lv, var(--token-c9883a06-0714-4bde-a248-d9d8eb496918, rgb(64, 64, 64)))">${post.description}</p>
            </div>
          </div>
        </div>
      </a>
    </div>
  `).join('\n');

  // Replace collection list in _blog.html
  const blogListStart = html.indexOf('<div class="framer-3ivwsy" data-framer-name="Blog List">');
  if (blogListStart !== -1) {
    const listEnd = html.indexOf('</div></div></div></section>', blogListStart);
    if (listEnd !== -1) {
      const beforeList = html.substring(0, blogListStart);
      const afterList = html.substring(listEnd);
      html = beforeList + `<div class="framer-3ivwsy" data-framer-name="Blog List"><div class="ssr-variant" style="display:flex;flex-wrap:wrap;gap:24px;width:100%;">${cardsHtml}</div>` + afterList;
    }
  }

  html = cleanHtmlCommon(html);
  const destPath = path.join(distDir, 'blog/index.html');
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, html, 'utf8');
  console.log(`Generated blog listing: blog/index.html with ${blogPosts.length} cards`);
}

generateBlogListing();

// Markdown to Framer RichText converter
function convertMarkdownToFramerHtml(markdown) {
  const rawHtml = marked.parse(markdown, { gfm: true, breaks: true });
  // Add framer classes
  let html = rawHtml;
  html = html.replace(/<p>/g, '<p dir="auto" class="framer-text framer-styles-preset-vuyne3">');
  html = html.replace(/<h2>/g, '<h2 dir="auto" class="framer-text framer-styles-preset-hx2mqj">');
  html = html.replace(/<h3>/g, '<h3 dir="auto" class="framer-text framer-styles-preset-108a0d4">');
  html = html.replace(/<ul>/g, '<ul style="padding-left: 24px; margin-bottom: 16px; color: #404040; line-height: 1.7;">');
  html = html.replace(/<ol>/g, '<ol style="padding-left: 24px; margin-bottom: 16px; color: #404040; line-height: 1.7;">');
  html = html.replace(/<li>/g, '<li style="margin-bottom: 8px;">');
  html = html.replace(/<blockquote>/g, '<blockquote style="border-left: 3px solid #004727; padding-left: 16px; margin: 20px 0; font-style: italic; color: #555;">');
  return html;
}

// Generate single post pages
const postTemplatePath = path.join(scrapedDir, '_blog_kiedy-warto-zg_C5_82osi_C4_87-si_C4_99-do-fizjoterapeuty.html');
const rawTemplate = fs.readFileSync(postTemplatePath, 'utf8');

for (const post of blogPosts) {
  let postHtml = rawTemplate;

  const originalTitle = 'Kiedy warto zgłosić się do fizjoterapeuty?';
  const originalDate = '1 lip 2026';
  const originalDesc = 'Nie zawsze trzeba czekać, aż ból stanie się codziennym problemem. Przeczytaj artykuł fizjoArt o fizjoterapii, zdrowiu i świadomej pracy z ciałem.';

  // 1. Replace Titles & Descriptions in Head & OpenGraph
  postHtml = postHtml.replaceAll(originalTitle, post.title);
  postHtml = postHtml.replaceAll(originalDesc, post.description || post.title);
  postHtml = postHtml.replaceAll(originalDate, post.formattedDate);
  if (post.category) {
    // Replace category badge
    postHtml = postHtml.replaceAll('>Porady<', `>${post.category}<`);
  }

  // 2. Replace Hero Image
  if (post.image) {
    postHtml = postHtml.replaceAll('/images/17ktvQuSBDmjDTM3Gr3L7nOKHE.jpg', post.image);
    postHtml = postHtml.replaceAll('https://framerusercontent.com/images/17ktvQuSBDmjDTM3Gr3L7nOKHE.jpg', post.image);
  }

  // 3. Replace Article Content in all rich text containers framer-14sotxs
  const formattedBodyHtml = convertMarkdownToFramerHtml(post.body);
  
  // Replace content inside framer-14sotxs
  postHtml = postHtml.replace(/(<div class="framer-14sotxs"[^>]*>)([\s\S]*?)(<\/div><\/div><\/div><\/div><\/div>)/g, (match, open, oldContent, close) => {
    return `${open}${formattedBodyHtml}${close}`;
  });

  postHtml = cleanHtmlCommon(postHtml);

  const destPath = path.join(distDir, `blog/${post.slug}/index.html`);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, postHtml, 'utf8');
  console.log(`Generated blog post: blog/${post.slug}/index.html`);
}

console.log('✅ Site build complete! Exact Framer design & Decap CMS articles generated.');
