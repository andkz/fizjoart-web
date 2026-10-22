import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/_kontakt.html', 'utf8');

const formMatch = html.match(/<form[\s\S]*?<\/form>/i);
if (formMatch) {
  console.log('Form tag found:');
  console.log(formMatch[0].substring(0, 500));
} else {
  console.log('No form tag found, checking inputs:');
  const inputs = [...html.matchAll(/<input[^>]*>/gi)].map(m => m[0]);
  console.log('Inputs found:', inputs);
}
