import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/_kontakt.html', 'utf8');

const formMatch = html.match(/<form[\s\S]*?<\/form>/i);
if (formMatch) {
  const formHtml = formMatch[0];
  const inputs = [...formHtml.matchAll(/<(?:input|textarea|button)[^>]*>/gi)].map(m => m[0]);
  console.log('Form elements:');
  inputs.forEach(el => console.log(el));
}
