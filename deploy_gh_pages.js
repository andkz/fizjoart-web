import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

console.log('🚀 Step 1: Building site for GitHub Pages (BASE_PATH=/fizjoart-web)...');
process.env.BASE_PATH = '/fizjoart-web';
execSync('node generate_exact_site.js', { stdio: 'inherit' });

console.log('📦 Step 2: Deploying dist to gh-pages branch...');
const commands = [
  'git init',
  'git checkout -B gh-pages',
  'git add -A',
  'git commit -m "deploy: update GitHub Pages"',
  'git remote add origin https://github.com/andkz/fizjoart-web.git',
  'git push origin gh-pages --force'
];

try {
  execSync(commands.join(' && '), { cwd: distDir, stdio: 'inherit' });
  console.log('✅ Successfully pushed to gh-pages branch!');
} finally {
  const gitFolder = path.join(distDir, '.git');
  if (fs.existsSync(gitFolder)) {
    fs.rmSync(gitFolder, { recursive: true, force: true });
  }
}

console.log('🔄 Step 3: Rebuilding local dist for standard local/root preview...');
delete process.env.BASE_PATH;
execSync('node generate_exact_site.js', { stdio: 'inherit' });

console.log('🎉 GitHub Pages deployment finished!');
