import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

const faqStart = html.indexOf('Najczęściej zadawane pytania');
const faqEnd = html.indexOf('Nie masz odpowiedzi na pytanie?');
const faqSection = html.substring(faqStart, faqEnd);

const texts = faqSection.replace(/<[^>]+>/g, '\n').split('\n').map(s => s.trim()).filter(Boolean);
console.log('FAQ section lines:');
texts.forEach(t => console.log('>', t));
