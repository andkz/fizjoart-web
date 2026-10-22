import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

['cgnev8uqbNMguN20WWWYKBU6TTc', '1ujSFNRJBJoj0Exg89xwCSpoLY', 'ed20cAGCLeZHDCtWUAJaQqSchTk'].forEach(id => {
  const idx = html.indexOf(id);
  if (idx !== -1) {
    console.log(`=== ${id} ===`);
    console.log(html.substring(Math.max(0, idx - 100), idx + 200));
  }
});
