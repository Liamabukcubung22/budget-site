// Mengambil 4 screenshot entri dari aplikasi yang sedang berjalan.
// Menyajikan app/ di :18745, membuka tiap rute di shots.json dengan Chromium
// headless (playwright-core + binary Chromium yang sudah ada di mesin),
// menunggu window.__shotReady, lalu menyimpan JPEG.
// Pemakaian: node shot.mjs   (dijalankan dari root repo)
// Catatan: aplikasi ini tidak memuat apa pun lewat jaringan, jadi tidak
// perlu proxy. Ini perkakas pengujian saja — bukan bagian dari entri.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('/tmp/pwcore/node_modules/playwright-core');
const CHROME = '/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome';

const shots = JSON.parse(readFileSync('./shots.json', 'utf8'));
const server = spawn('node', ['serve.ts', '--port', '18745'], { stdio: 'pipe' });
await new Promise((r) => setTimeout(r, 1500));
const probe = await fetch('http://localhost:18745/').then((r) => r.text()).catch(() => '');
if (!probe.includes('DompetKeluarga')) {
  server.kill();
  throw new Error('port 18745 is not serving our app; refusing to screenshot. Probe head: ' + probe.slice(0, 120));
}

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
const errors = [];
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: s.viewport });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(s.file + ': ' + m.text()); });
  page.on('pageerror', (e) => errors.push(s.file + ' pageerror: ' + e.message));
  await page.goto('http://localhost:18745/' + s.path, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__shotReady === true, null, { timeout: 30000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: './screenshots/' + s.file, type: 'jpeg', quality: 80 });
  console.log('shot', s.file, s.path, 'errors so far:', errors.length);
  await ctx.close();
}
console.log('console errors:', JSON.stringify(errors, null, 2));
await browser.close();
server.kill();
