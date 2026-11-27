// Server statis kecil — hanya untuk pengujian lokal (bukan bagian dari entri):
// menyajikan app/ di http://localhost:8080 (atau --port <n>).
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('./app', import.meta.url)));
const port = Number(process.argv[process.argv.indexOf('--port') + 1]) || 8080;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

createServer((req, res) => {
  let pathname = new URL(req.url, 'http://x').pathname;
  if (pathname === '/') pathname = '/index.html';
  const path = normalize(join(root, decodeURIComponent(pathname)));
  if (!path.startsWith(root) || !existsSync(path) || !statSync(path).isFile()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
  createReadStream(path).pipe(res);
}).listen(port, () => console.log('serving app/ on http://localhost:' + port));
