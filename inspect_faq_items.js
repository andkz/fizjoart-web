import fs from 'fs';

const report = JSON.parse(fs.readFileSync('c:/Users/kamil/Documents/antigravity/bania2/audit_report_full.json', 'utf8'));
const home = report.pagesAnalysis.find(p => p.path === '/');

const faqTexts = [];
for (let i = 48; i <= 66; i++) {
  if (home.texts[i]) {
    faqTexts.push({ idx: i, text: home.texts[i].text });
  }
}

console.log(faqTexts);
