# DompetKeluarga — Anggaran Rumah Tangga

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Liamabukcubung22/budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Liamabukcubung22/budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

DompetKeluarga adalah kalkulator dan perencana anggaran rumah tangga yang benar-benar berfungsi: catat pemasukan dan pengeluaran, atur batas tiap kategori, pantau aturan 50/30/20, kejar tujuan tabungan, dan lihat laporan tiga bulan — semuanya tersimpan di peramban, tanpa akun dan tanpa server.

## Run it

```sh
node serve.ts
# lalu buka http://localhost:8080
```

## Isi

- `app/` — situsnya: `index.html`, `style.css`, `main.js` (router + kontrol), `views.js` (halaman), `charts.js` (donat + bar SVG), `store.js` (state localStorage + hitungan), `data.js` (data contoh + kategori).
- `screenshots/` — 4 tangkapan layar asli dari situs yang berjalan (dasbor, anggaran, transaksi, dasbor ponsel).
- `main.ts` — program penyerahan: menyalin `app/` dan `screenshots/` ke `/output` dan menulis `dossier.json`.
- `vendor/makefun-frontend.ts` — salinan kit yang tidak diubah.

Halaman: Beranda (ringkasan bulan + donat pengeluaran + tambah transaksi), Anggaran (edit batas kategori + anggaran vs realisasi + 50/30/20), Transaksi (cari/filter/hapus + unduh CSV), Tujuan (setor + buat tujuan baru), Laporan (perbandingan tiga bulan), Panduan (6 langkah + acuan UMP DKI Jakarta 2024). Semua kontrol berfungsi dan langsung mengubah hitungan.

---

<sub>Entered on [make.fun](https://make.fun/?ref=jxspwz52&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
