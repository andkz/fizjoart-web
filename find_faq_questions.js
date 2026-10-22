import fs from 'fs';

const html = fs.readFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/home.html', 'utf8');

const answers = [
  'Jestem fizjoterapeutą. Pracuję z bólem',
  'Zaczynam od rozmowy, wywiadu i badania. Chcę zrozumieć',
  'Przyjmuję pacjentów w każdym wieku.',
  'Możesz zgłosić się m.in. z bólem kręgosłupa',
  'To subtelna forma pracy z ciałem, wywodząca się z osteopatii.',
  'Tak. Od lat pracuję z dziećmi i młodzieżą.',
  'Przyjmuję w prywatnym gabinecie w Zielonej Górze',
  'Dobieram ją indywidualnie'
];

answers.forEach(ans => {
  const idx = html.indexOf(ans);
  if (idx !== -1) {
    const chunk = html.substring(Math.max(0, idx - 400), idx + 200);
    console.log(`\n=== Chunk for: ${ans} ===`);
    // strip tags to see the question right before it
    const clean = chunk.replace(/<[^>]+>/g, '\n').split('\n').map(s => s.trim()).filter(Boolean);
    console.log(clean.slice(-5).join(' | '));
  }
});
