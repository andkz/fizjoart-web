import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

// find nav variants
const navMatches = [...html.matchAll(/data-framer-name="(Desktop|Phone|Tablet)"/g)].map(m => m[0]);
console.log('Framer responsive breakpoint variants found:', navMatches);

// check how FAQ is structured
const faqMatches = [...html.matchAll(/data-framer-name="(Closed|Open)"/g)].map(m => m[0]);
console.log('FAQ variants found in static HTML:', faqMatches);
