import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');
const report = JSON.parse(fs.readFileSync('c:/Users/kamil/Documents/antigravity/bania2/audit_report_full.json', 'utf8'));
const home = report.pagesAnalysis.find(p => p.path === '/');

const reviewAuthors = ['Justyna', 'Agata', 'Sławek', 'Karolina', 'Janina', 'Jacek', 'Kamil', 'Ewa'];
const reviews = [];

home.texts.forEach((t, i) => {
  for (const author of reviewAuthors) {
    if (t.text.trim() === author) {
      // the review text is usually right before or after
      const prev = home.texts[i - 1]?.text || '';
      const next = home.texts[i + 1]?.text || '';
      const body = prev.length > 30 ? prev : next;
      reviews.push({ author, text: body });
      break;
    }
  }
});

console.log('Found reviews:', reviews);
