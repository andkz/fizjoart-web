const fs = require('fs');

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

// font-family
const ffMatches = [...html.matchAll(/font-family:\s*([^;}\"]+)/gi)].map(m => m[1].trim());
console.log('Font families:', Array.from(new Set(ffMatches)));

// colors / hex codes
const hexes = [...html.matchAll(/#(?:[0-9a-fA-F]{3}){1,2}\b/g)].map(m => m[0].toLowerCase());
const hexCounts = {};
hexes.forEach(h => hexCounts[h] = (hexCounts[h] || 0) + 1);
const sortedHex = Object.entries(hexCounts).sort((a,b) => b[1] - a[1]);
console.log('Top colors:', sortedHex.slice(0, 15));

// rgb / rgba colors
const rgbMatches = [...html.matchAll(/rgba?\([^)]+\)/g)].map(m => m[0]);
const rgbCounts = {};
rgbMatches.forEach(r => rgbCounts[r] = (rgbCounts[r] || 0) + 1);
const sortedRgb = Object.entries(rgbCounts).sort((a,b) => b[1] - a[1]);
console.log('Top RGB(A) colors:', sortedRgb.slice(0, 15));
