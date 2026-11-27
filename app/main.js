// DompetKeluarga — router hash dan semua kontrol interaktif.
//   #/            dasbor (pilih bulan, tambah transaksi, muat ulang contoh)
//   #/anggaran    batas kategori + aturan 50/30/20
//   #/transaksi   cari/filter/hapus transaksi + CSV
//   #/tujuan      setor ke tujuan + buat tujuan baru
//   #/laporan     ringkasan tiga bulan
//   #/panduan     panduan anggaran
// window.__shotReady bernilai true setelah halaman selesai dirender.

import { MONTHS } from './data.js';
import { loadState, saveState, resetState } from './store.js';
import { home, anggaran, transaksi, tujuan, laporan, panduan, missing } from './views.js';

const app = document.getElementById('app');
const ui = { month: '2026-11', q: '', cat: 'semua' };
let state = loadState();

function render() {
  window.__shotReady = false;
  const hash = location.hash || '#/';
  const route = hash.replace(/^#\/?/, '').split('/')[0] || 'home';
  const pages = { home, anggaran, transaksi, tujuan, laporan, panduan };
  const titles = {
    home: 'DompetKeluarga', anggaran: 'Anggaran Bulanan', transaksi: 'Transaksi',
    tujuan: 'Tujuan Tabungan', laporan: 'Laporan', panduan: 'Panduan Anggaran',
  };
  const fn = pages[route];
  document.title = fn ? `${titles[route]} | DompetKeluarga` : `Tidak ditemukan | DompetKeluarga`;
  app.innerHTML = fn ? fn(state, ui) : missing();
  document.querySelectorAll('header nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#/${route === 'home' ? '' : route}`);
  });
  bind();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function bind() {
  // Pilih bulan (ada di beberapa halaman).
  document.querySelectorAll('#month-select').forEach((sel) => sel.addEventListener('change', () => { ui.month = sel.value; render(); }));

  // Muat ulang data contoh.
  const reset = document.getElementById('reset-demo');
  if (reset) reset.addEventListener('click', () => { state = resetState(); ui.month = '2026-11'; ui.q = ''; ui.cat = 'semua'; render(); });

  // Ubah batas anggaran: simpan otomatis.
  document.querySelectorAll('[data-budget]').forEach((input) => input.addEventListener('change', () => {
    const v = Math.max(0, Number(input.value) || 0);
    state.budgets[input.dataset.budget] = v;
    saveState(state);
    render();
  }));

  // Tambah transaksi.
  document.querySelectorAll('#add-form').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const date = String(fd.get('date'));
    const tx = {
      id: 't' + Date.now().toString(36),
      month: date.slice(0, 7),
      date,
      desc: String(fd.get('desc')).trim(),
      cat: String(fd.get('cat')),
      amount: Math.max(0, Math.round(Number(fd.get('amount')) || 0)),
    };
    if (!tx.desc || !tx.amount) return;
    state.transactions.push(tx);
    saveState(state);
    ui.month = MONTHS.some((m) => m.id === tx.month) ? tx.month : ui.month;
    render();
  }));

  // Hapus transaksi.
  document.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
    state.transactions = state.transactions.filter((t) => t.id !== b.dataset.del);
    saveState(state);
    render();
  }));

  // Cari + filter transaksi.
  const q = document.getElementById('tx-q');
  if (q) q.addEventListener('input', () => { ui.q = q.value; render(); const again = document.getElementById('tx-q'); if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); } });
  const cat = document.getElementById('tx-cat');
  if (cat) cat.addEventListener('change', () => { ui.cat = cat.value; render(); });

  // Setor ke tujuan.
  document.querySelectorAll('.goal-form').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = Math.max(0, Math.round(Number(new FormData(form).get('amount')) || 0));
    const goal = state.goals.find((g) => g.id === form.dataset.goal);
    if (!goal || !amount) return;
    goal.saved += amount;
    state.transactions.push({
      id: 't' + Date.now().toString(36), month: ui.month, date: ui.month + '-27',
      desc: 'Setoran: ' + goal.name, cat: 'tabungan', amount,
    });
    saveState(state);
    render();
  }));

  // Buat tujuan baru.
  const goalNew = document.getElementById('goal-new');
  if (goalNew) goalNew.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(goalNew);
    const name = String(fd.get('name')).trim();
    const target = Math.max(0, Math.round(Number(fd.get('target')) || 0));
    if (!name || !target) return;
    state.goals.push({ id: 'g' + Date.now().toString(36), name, target, saved: 0 });
    saveState(state);
    render();
  });

  // Unduh CSV.
  document.querySelectorAll('[data-csv]').forEach((b) => b.addEventListener('click', () => {
    const bytes = Uint8Array.from(atob(b.dataset.csv), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = b.dataset.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }));
}

window.addEventListener('hashchange', render);
render();
