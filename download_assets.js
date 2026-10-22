const fs = require('fs');
const path = require('path');
const https = require('https');

const summaryFile = 'c:/Users/kamil/Documents/antigravity/fizjoart-web/_scraped/summary.json';
const targetDir = 'c:/Users/kamil/Documents/antigravity/fizjoart-web/public/images';

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const summary = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));
const images = summary.images;

console.log(`Starting download of ${images.length} images...`);

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`Failed to download ${url}: status code ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  const urlToLocalMap = {};

  for (let i = 0; i < images.length; i++) {
    const url = images[i];
    const filename = path.basename(url);
    // ensure extension
    const ext = path.extname(filename) || '.jpg';
    const cleanName = filename.includes('.') ? filename : `${filename}${ext}`;
    const dest = path.join(targetDir, cleanName);

    try {
      console.log(`[${i+1}/${images.length}] Downloading ${url} -> ${cleanName}`);
      await downloadFile(url, dest);
      urlToLocalMap[url] = `/images/${cleanName}`;
    } catch (e) {
      console.error(`Error downloading ${url}:`, e.message);
    }
  }

  // Also copy Artur Bania's compressed photos from C:\Users\kamil\Desktop\Clients\artur bania\images compressed
  const arturDir = 'C:/Users/kamil/Desktop/Clients/artur bania/images compressed';
  if (fs.existsSync(arturDir)) {
    const files = fs.readdirSync(arturDir);
    console.log(`Copying ${files.length} Artur photos from client directory...`);
    for (const file of files) {
      fs.copyFileSync(path.join(arturDir, file), path.join(targetDir, file));
      console.log(`Copied ${file}`);
    }
  }

  fs.writeFileSync('c:/Users/kamil/Documents/antigravity/fizjoart-web/asset_map.json', JSON.stringify(urlToLocalMap, null, 2), 'utf8');
  console.log('Finished downloading and mapping all assets.');
}

run().catch(console.error);
