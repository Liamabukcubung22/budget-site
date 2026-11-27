// DompetKeluarga — program penyerahan (Node 22, pustaka standar saja).
// Situsnya adalah folder app/ di samping file ini: berkas statis yang dibuka
// browser di app/index.html (modul ES, CSS, tanpa build step), seluruh isinya
// dari berkasnya sendiri — tidak ada yang dimuat lewat jaringan. Data keluarga
// tinggal di localStorage peramban; program ini hanya menyerahkan berkasnya.
//
// Program ini menyerahkan entri: menyalin app/ dan screenshots/ ke /output
// lalu menulis /output/dossier.json — ringkasan yang dibaca juri (tangkapan
// layar, berkas dan byte pada pemuatan pertama, dan sumbernya) — dengan
// pustaka make.fun yang di-vendor. vendor/makefun-frontend.ts harus tetap
// persis seperti yang dikirim kit: scorer membangun ulang dossier dengan
// salinannya sendiri dan membandingkan keduanya byte demi byte.
//
// Uji lokal dengan `node serve.ts`, lalu buka http://localhost:8080.
// Di luar kontainer grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Batas scorer (reference/gate.json): hanya text_max_bytes yang membentuk
// byte; sisanya menolak entri yang akan ditolak scorer (lebih dari 4
// screenshot atau satu di atas 256 KiB; lebih dari 993 berkas dan direktori
// di app/ atau 16 MiB berkas app/: app/ dihitung di samping batas 1000 entri
// /output sendiri, screenshots/ dan dossier.json-nya).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
