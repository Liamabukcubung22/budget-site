// Grafik SVG murni — tanpa pustaka, tanpa jaringan.

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const fmtRp = (v) => 'Rp' + Number(v).toLocaleString('id-ID');

// Donat: pangsa pengeluaran per kategori.
export function donutChart({ slices, size = 260 }) {
  const total = slices.reduce((a, s) => a + s.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r * 0.62;
  let angle = -Math.PI / 2;
  let paths = '';
  slices.forEach((s) => {
    const frac = s.value / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    if (frac > 0.005) {
      paths += `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} L${xi1.toFixed(1)},${yi1.toFixed(1)} A${inner},${inner} 0 ${large} 0 ${xi0.toFixed(1)},${yi0.toFixed(1)} Z" fill="${s.color}"><title>${esc(s.label)}: ${fmtRp(s.value)}</title></path>`;
    }
    angle = a1;
  });
  const legend = slices.map((s) => `<li><span class="dot" style="background:${s.color}"></span>${esc(s.label)} — <strong>${fmtRp(s.value)}</strong> (${((s.value / total) * 100).toFixed(1)}%)</li>`).join('');
  return `<div class="donut-wrap">
    <svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Donat pengeluaran per kategori" class="donut">
      ${paths}
      <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" fill="#6b655a">Total keluar</text>
      <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="17" font-weight="700" fill="#1c2420">${fmtRp(total)}</text>
    </svg>
    <ul class="legend">${legend}</ul>
  </div>`;
}

// Bar anggaran vs realisasi per kategori.
export function budgetBars({ rows }) {
  const W = 640;
  const rowH = 52;
  const H = rows.length * rowH + 10;
  const padL = 150;
  const max = Math.max(...rows.map((r) => Math.max(r.budget, r.spent)), 1);
  const barW = W - padL - 90;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Anggaran vs realisasi" class="chart">`;
  rows.forEach((r, i) => {
    const y = 6 + i * rowH;
    const bw = (barW * r.budget) / max;
    const sw = (barW * r.spent) / max;
    const over = r.spent > r.budget;
    s += `<text x="${padL - 8}" y="${y + 12}" text-anchor="end" font-size="12.5" font-weight="600" fill="#1c2420">${esc(r.label)}</text>`;
    s += `<text x="${padL - 8}" y="${y + 28}" text-anchor="end" font-size="11" fill="#6b655a">anggaran ${fmtRp(r.budget)}</text>`;
    s += `<rect x="${padL}" y="${y}" width="${bw}" height="13" rx="3" fill="#d8d2c0"/>`;
    s += `<rect x="${padL}" y="${y + 17}" width="${sw}" height="13" rx="3" fill="${over ? '#b4452f' : r.color}"/>`;
    s += `<text x="${padL + Math.max(bw, sw) + 6}" y="${y + 28}" font-size="12" font-weight="700" fill="${over ? '#b4452f' : '#1c2420'}">${fmtRp(r.spent)}${over ? ' · lewat!' : ''}</text>`;
  });
  s += '</svg>';
  return s;
}

// Bar perbandingan bulanan.
export function monthBars({ points, height = 190, color = '#0e7c6b' }) {
  const W = 640;
  const H = height;
  const padL = 90;
  const padB = 28;
  const padT = 14;
  const max = Math.max(...points.map((p) => p.value));
  const plotH = H - padT - padB;
  const plotW = W - padL - 8;
  const slot = plotW / points.length;
  const barW = Math.min(90, slot * 0.55);
  const y = (v) => padT + plotH - (v / max) * plotH;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik batang bulanan" class="chart">`;
  for (let i = 0; i <= 4; i++) {
    const gv = (max * i) / 4;
    const gy = y(gv);
    s += `<line x1="${padL}" y1="${gy}" x2="${W - 8}" y2="${gy}" stroke="#e7e2d4"/>`;
    s += `<text x="${padL - 6}" y="${gy + 4}" text-anchor="end" font-size="11" fill="#6b655a">${fmtRp(gv)}</text>`;
  }
  points.forEach((p, i) => {
    const cx = padL + slot * i + slot / 2;
    s += `<rect x="${cx - barW / 2}" y="${y(p.value)}" width="${barW}" height="${H - padB - y(p.value)}" rx="3" fill="${color}"/>`;
    s += `<text x="${cx}" y="${y(p.value) - 5}" text-anchor="middle" font-size="12" font-weight="700" fill="#1c2420">${fmtRp(p.value)}</text>`;
    s += `<text x="${cx}" y="${H - 10}" text-anchor="middle" font-size="12" fill="#4a443a">${esc(p.label)}</text>`;
  });
  s += '</svg>';
  return s;
}
