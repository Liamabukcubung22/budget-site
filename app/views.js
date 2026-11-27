// Tampilan tiap halaman DompetKeluarga. Semua angka dihitung dari state
// (localStorage) — tambah, ubah, atau hapus transaksi dan seluruh halaman
// ikut berubah.

import { CATEGORIES, MONTHS, GUIDE } from './data.js';
import { catOf, monthTx, incomeOf, spentByCat, totalSpent, totalBudget, rule503020, fmtRp, fmtDate } from './store.js';
import { donutChart, budgetBars, monthBars } from './charts.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

function monthLabel(id) {
  return (MONTHS.find((m) => m.id === id) || {}).label || id;
}

function monthPicker(current) {
  return `<label class="month-pick">Bulan
    <select id="month-select">${MONTHS.map((m) => `<option value="${m.id}" ${m.id === current ? 'selected' : ''}>${m.label}</option>`).join('')}</select>
  </label>`;
}

function txTable(rows) {
  if (!rows.length) return '<p class="empty">Belum ada transaksi di bulan ini. Tambahkan lewat formulir di bawah.</p>';
  return `<table><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th><th></th></tr></thead>
  <tbody>${rows.map((t) => `<tr>
    <td>${fmtDate(t.date)}</td><td>${esc(t.desc)}</td>
    <td>${t.cat === 'income' ? 'Pemasukan' : esc(catOf(t.cat).label)}</td>
    <td class="num ${t.cat === 'income' ? 'in' : 'out'}">${t.cat === 'income' ? '+' : '−'}${fmtRp(t.amount)}</td>
    <td class="num"><button type="button" class="mini-btn" data-del="${t.id}" aria-label="Hapus ${esc(t.desc)}">Hapus</button></td>
  </tr>`).join('')}</tbody></table>`;
}

function addForm() {
  return `<form id="add-form" class="add-form">
    <h3>Tambah transaksi</h3>
    <div class="form-grid">
      <label>Tanggal<input type="date" name="date" value="2026-11-27" required></label>
      <label>Keterangan<input type="text" name="desc" placeholder="Misalnya: Belanja sayur" required maxlength="80"></label>
      <label>Kategori<select name="cat">${CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join('')}<option value="income">Pemasukan</option></select></label>
      <label>Jumlah (Rp)<input type="number" name="amount" min="1000" step="500" placeholder="50000" required></label>
    </div>
    <button class="btn" type="submit">Simpan transaksi</button>
    <p class="form-note">Transaksi tersimpan di peramban ini saja dan langsung mengubah semua hitungan.</p>
  </form>`;
}

export function home(state, ui) {
  const month = ui.month;
  const income = incomeOf(state, month);
  const spent = spentByCat(state, month);
  const total = totalSpent(state, month);
  const remain = income - total;
  const slices = CATEGORIES.filter((c) => spent[c.id]).map((c) => ({ label: c.label, value: spent[c.id], color: c.color }));
  const recent = monthTx(state, month).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const savingRate = income ? Math.round(((income - total) / income) * 100) : 0;
  return `
  <section class="hero">
    <p class="eyebrow">Anggaran ${esc(monthLabel(month))} · ${esc(state.household.name)}</p>
    <h1>Uang keluar <em>${fmtRp(total)}</em> dari ${fmtRp(income)}.</h1>
    <p class="lede">Sisa ${fmtRp(remain)} (${savingRate}% dari pemasukan) belum terpakai. Di bawah ini ke mana perginya, kategori demi kategori.</p>
    <div class="toolbar">${monthPicker(month)}
      <button class="btn ghost" type="button" id="reset-demo">Muat ulang data contoh</button>
    </div>
  </section>
  <section>
    <div class="kpi-grid">
      <div class="kpi"><span class="kpi-label">Pemasukan</span><span class="kpi-value">${fmtRp(income)}</span><span class="kpi-meta">${esc(monthLabel(month))}</span></div>
      <div class="kpi"><span class="kpi-label">Pengeluaran</span><span class="kpi-value">${fmtRp(total)}</span><span class="kpi-meta">${Object.keys(spent).length} kategori terpakai</span></div>
      <div class="kpi"><span class="kpi-label">Sisa</span><span class="kpi-value ${remain < 0 ? 'neg' : ''}">${fmtRp(remain)}</span><span class="kpi-meta">${remain < 0 ? 'Pengeluaran melebihi pemasukan bulan ini.' : 'Aman — masih dalam anggaran.'}</span></div>
      <div class="kpi"><span class="kpi-label">Tingkat menabung</span><span class="kpi-value">${savingRate}%</span><span class="kpi-meta">Target aturan 50/30/20: 20%</span></div>
    </div>
  </section>
  <section class="duo">
    <article class="panel"><h2>Ke mana uang pergi</h2>
      ${slices.length ? donutChart({ slices }) : '<p class="empty">Belum ada pengeluaran bulan ini.</p>'}
    </article>
    <article class="panel"><h2>Transaksi terakhir</h2>
      ${txTable(recent)}
      <p><a class="btn-link" href="#/transaksi">Lihat semua transaksi &rarr;</a></p>
    </article>
  </section>
  <section>${addForm()}</section>`;
}

export function anggaran(state, ui) {
  const month = ui.month;
  const spent = spentByCat(state, month);
  const income = state.household.income;
  const rows = CATEGORIES.map((c) => ({ label: c.label, color: c.color, budget: state.budgets[c.id] || 0, spent: spent[c.id] || 0 }));
  const rule = rule503020(state, month);
  const pct = (spentV, target) => Math.round((spentV / target) * 100);
  const ruleRow = (label, group, targetPct) => `<tr><td>${label} (target ${targetPct}%)</td><td class="num">${fmtRp(group.spent)}</td><td class="num">${fmtRp(group.target)}</td><td class="num">${pct(group.spent, group.target)}%</td></tr>`;
  return `
  <p class="crumb"><a href="#/">&larr; Beranda</a></p>
  <h1>Anggaran bulanan</h1>
  <p class="lede">Atur batas tiap kategori. Total anggaran saat ini <strong>${fmtRp(totalBudget(state))}</strong> dari pemasukan <strong>${fmtRp(income)}</strong> per bulan. Geser atau ketik angka baru — grafik dan aturan 50/30/20 langsung berubah.</p>
  <section>
    <h2>Batas per kategori</h2>
    <div class="budget-edit">
      ${CATEGORIES.map((c) => `<label class="budget-row"><span class="dot" style="background:${c.color}"></span>${c.label}
        <span class="budget-input">Rp <input type="number" data-budget="${c.id}" value="${state.budgets[c.id] || 0}" min="0" step="50000"></span>
      </label>`).join('')}
    </div>
    <p class="form-note">Angka tersimpan otomatis saat Anda mengubahnya.</p>
  </section>
  <section>
    <h2>Anggaran vs realisasi — ${esc(monthLabel(month))}</h2>
    <div class="toolbar">${monthPicker(month)}</div>
    ${budgetBars({ rows })}
    <p class="panel-sub">Bar abu-abu = anggaran, bar berwarna = realisasi. Bar merah berarti kategori itu lewat anggaran.</p>
  </section>
  <section>
    <h2>Aturan 50/30/20</h2>
    <p>Kebutuhan 50% · Keinginan 30% · Tabungan 20% dari pemasukan ${fmtRp(rule.income)}.</p>
    <table><thead><tr><th>Kelompok</th><th class="num">Realisasi</th><th class="num">Target</th><th class="num">Tercapai</th></tr></thead>
    <tbody>
      ${ruleRow('Kebutuhan', rule.needs, 50)}
      ${ruleRow('Keinginan', rule.wants, 30)}
      ${ruleRow('Tabungan', rule.savings, 20)}
    </tbody></table>
    <p class="panel-sub">${rule.savings.spent >= rule.savings.target ? 'Tabungan bulan ini sudah mencapai target 20%.' : `Tabungan masih ${fmtRp(rule.savings.target - rule.savings.spent)} di bawah target 20%.`}</p>
  </section>`;
}

export function transaksi(state, ui) {
  const month = ui.month;
  const q = (ui.q || '').toLowerCase();
  const cat = ui.cat || 'semua';
  let rows = monthTx(state, month).slice().sort((a, b) => b.date.localeCompare(a.date));
  if (q) rows = rows.filter((t) => t.desc.toLowerCase().includes(q));
  if (cat !== 'semua') rows = rows.filter((t) => t.cat === cat);
  const total = rows.filter((t) => t.cat !== 'income').reduce((a, t) => a + t.amount, 0);
  const csv = ['Tanggal;Keterangan;Kategori;Jumlah (Rp)', ...rows.map((t) => [t.date, t.desc, t.cat === 'income' ? 'Pemasukan' : catOf(t.cat).label, String(t.amount)].join(';'))].join('\n');
  return `
  <p class="crumb"><a href="#/">&larr; Beranda</a></p>
  <h1>Transaksi</h1>
  <p class="lede">${rows.length} transaksi di ${esc(monthLabel(month))} · total keluar ${fmtRp(total)}.</p>
  <div class="toolbar">${monthPicker(month)}
    <input id="tx-q" type="search" placeholder="Cari keterangan…" value="${esc(ui.q || '')}" autocomplete="off">
    <select id="tx-cat" aria-label="Filter kategori">
      <option value="semua">Semua kategori</option>
      ${CATEGORIES.map((c) => `<option value="${c.id}" ${cat === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}
      <option value="income" ${cat === 'income' ? 'selected' : ''}>Pemasukan</option>
    </select>
    <button class="btn" type="button" data-csv="${btoa(unescape(encodeURIComponent(csv)))}" data-filename="transaksi-${month}.csv">Unduh CSV</button>
  </div>
  ${txTable(rows)}
  <section>${addForm()}</section>`;
}

export function tujuan(state) {
  return `
  <p class="crumb"><a href="#/">&larr; Beranda</a></p>
  <h1>Tujuan tabungan</h1>
  <p class="lede">Tiga tujuan keluarga — setiap setoran mendekatkan ke target. Tambah setoran atau buat tujuan baru.</p>
  <div class="goals">
    ${state.goals.map((g) => {
      const p = Math.min(100, Math.round((g.saved / g.target) * 100));
      return `<article class="panel goal">
        <h2>${esc(g.name)}</h2>
        <p class="goal-nums"><strong>${fmtRp(g.saved)}</strong> dari ${fmtRp(g.target)} · <strong>${p}%</strong></p>
        <div class="progress" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><span style="width:${p}%"></span></div>
        <p class="panel-sub">Kurang ${fmtRp(Math.max(0, g.target - g.saved))} lagi.</p>
        <form class="goal-form" data-goal="${g.id}">
          <label>Tambah setoran (Rp) <input type="number" name="amount" min="1000" step="1000" placeholder="100000" required></label>
          <button class="btn" type="submit">Setor</button>
        </form>
      </article>`;
    }).join('')}
  </div>
  <section>
    <form id="goal-new" class="add-form">
      <h3>Buat tujuan baru</h3>
      <div class="form-grid">
        <label>Nama tujuan<input type="text" name="name" placeholder="Misalnya: DP rumah" required maxlength="60"></label>
        <label>Target (Rp)<input type="number" name="target" min="10000" step="10000" placeholder="10000000" required></label>
      </div>
      <button class="btn" type="submit">Buat tujuan</button>
    </form>
  </section>`;
}

export function laporan(state) {
  const pts = MONTHS.map((m) => ({ label: m.label.replace(' 2026', ''), value: totalSpent(state, m.id) }));
  const inc = MONTHS.map((m) => ({ label: m.label.replace(' 2026', ''), value: incomeOf(state, m.id) }));
  const rows = MONTHS.map((m) => {
    const spent = totalSpent(state, m.id);
    const income = incomeOf(state, m.id);
    const spentBy = spentByCat(state, m.id);
    const top = Object.entries(spentBy).sort((a, b) => b[1] - a[1])[0];
    return { month: m.label, income, spent, remain: income - spent, top: top ? catOf(top[0]).label : '—', topVal: top ? top[1] : 0 };
  });
  const avgSpent = Math.round(rows.reduce((a, r) => a + r.spent, 0) / rows.length);
  const trend = rows[2].spent - rows[0].spent;
  return `
  <p class="crumb"><a href="#/">&larr; Beranda</a></p>
  <h1>Laporan tiga bulan</h1>
  <p class="lede">Rata-rata pengeluaran ${fmtRp(avgSpent)} per bulan. ${trend > 0 ? `Pengeluaran naik ${fmtRp(trend)} dari September ke November.` : `Pengeluaran turun ${fmtRp(-trend)} dari September ke November.`}</p>
  <section>
    <h2>Pengeluaran per bulan</h2>
    ${monthBars({ points: pts })}
  </section>
  <section>
    <h2>Ringkasan</h2>
    <table><thead><tr><th>Bulan</th><th class="num">Pemasukan</th><th class="num">Pengeluaran</th><th class="num">Sisa</th><th>Kategori terbesar</th></tr></thead>
    <tbody>${rows.map((r) => `<tr><td>${r.month}</td><td class="num">${fmtRp(r.income)}</td><td class="num">${fmtRp(r.spent)}</td><td class="num">${fmtRp(r.remain)}</td><td>${esc(r.top)} (${fmtRp(r.topVal)})</td></tr>`).join('')}</tbody></table>
  </section>
  <section>
    <h2>Yang bisa dilakukan</h2>
    <ul>
      <li><strong>Makan</strong> selalu jadi kategori terbesar — belanja mingguan di pasar tradisional biasanya lebih murah daripada supermarket untuk sayur dan lauk harian.</li>
      <li><strong>Tagihan</strong> stabil di kisaran ${fmtRp(700000)}–${fmtRp(800000)}; hemat listrik 10% saja mengembalikan sekitar ${fmtRp(40000)} per bulan.</li>
      <li><strong>Tabungan</strong> ${fmtRp(state.budgets.tabungan)} per bulan berarti dana darurat 3 bulan (${fmtRp(12000000)}) tercapai dalam ${Math.ceil(12000000 / state.budgets.tabungan)} bulan bila konsisten.</li>
    </ul>
  </section>`;
}

export function panduan() {
  return `
  <p class="crumb"><a href="#/">&larr; Beranda</a></p>
  <h1>Panduan anggaran rumah tangga</h1>
  <p class="lede">Lima langkah yang dipakai situs ini — tanpa jargon, langsung bisa dicoba.</p>
  <section>
    <h2>1. Catat dulu, atur kemudian</h2>
    <p>Sebelum memangkas apa pun, catat semua pengeluaran selama satu bulan penuh. Kebanyakan keluarga kaget melihat pos “makan di luar” dan “jajan” setelah dijumlahkan. Di situs ini, semua transaksi tercatat di halaman <a href="#/transaksi">Transaksi</a>.</p>
    <h2>2. Pakai aturan 50/30/20</h2>
    <p>Bagi pemasukan menjadi tiga: <strong>50% kebutuhan</strong> (makan, tempat tinggal, transport, tagihan, kesehatan, pendidikan), <strong>30% keinginan</strong> (hiburan, gaya hidup), dan <strong>20% tabungan</strong>. Halaman <a href="#/anggaran">Anggaran</a> menghitung posisi Anda terhadap aturan ini secara otomatis.</p>
    <h2>3. Bayar diri sendiri dulu</h2>
    <p>Pindahkan tabungan di awal bulan — begitu gaji masuk — bukan dari sisa akhir bulan. Setoran rutin Rp1.200.000 per bulan dari gaji Rp8.500.000 sama dengan 14% pemasukan; menaikannya ke 20% berarti Rp1.700.000.</p>
    <h2>4. Dana darurat sebelum yang lain</h2>
    <p>Target pertama: dana darurat 3 bulan pengeluaran. Untuk keluarga contoh di situs ini, itu sekitar Rp12.000.000. Baru setelah itu bicara liburan atau barang besar — lihat <a href="#/tujuan">Tujuan tabungan</a>.</p>
    <h2>5. Bandingkan dengan upah acuan</h2>
    <p>Sebagai gambaran, UMP DKI Jakarta 2024 adalah Rp5.067.381 per bulan (Pemprov DKI Jakarta). Bila pemasukan keluarga di bawah angka itu, prioritasnya adalah menutup kebutuhan pokok dulu — aturan 50/30/20 bisa dilonggarkan ke 70/20/10 sampai pemasukan naik.</p>
    <h2>6. Tinjau tiap bulan</h2>
    <p>Anggaran yang tidak ditinjau akan bocor. Luangkan 15 menit di awal bulan: buka <a href="#/laporan">Laporan</a>, lihat kategori yang lewat anggaran, lalu sesuaikan batas bulan berikutnya.</p>
  </section>
  <section>
    <h2>Catatan data</h2>
    <p>Semua angka keluarga di situs ini adalah <strong>data contoh</strong> yang tersimpan di peramban Anda dan bisa diubah atau dihapus kapan saja — situs ini tidak mengirim data ke mana pun. Satu-satunya angka acuan luar adalah UMP DKI Jakarta 2024 di atas.</p>
  </section>`;
}

export function missing() {
  return `<h1>Halaman tidak ditemukan</h1><p>Tidak ada halaman di alamat ini. <a href="#/">Kembali ke beranda</a>.</p>`;
}
