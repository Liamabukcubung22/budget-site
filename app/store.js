// Penyimpanan dan hitungan DompetKeluarga.
// Data tinggal di localStorage peramban — tidak ada server, tidak ada akun.
// Tombol "Muat ulang contoh" mengembalikan data contoh dari data.js.

import { SEED, CATEGORIES, RULE_503020 } from './data.js';

const KEY = 'dompetkeluarga-v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && Array.isArray(s.transactions) && s.budgets && s.goals) return s;
    }
  } catch (e) { /* data rusak: pakai contoh */ }
  return structuredClone(SEED);
}

export function saveState(s) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function resetState() {
  localStorage.removeItem(KEY);
  return structuredClone(SEED);
}

export function catOf(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: '#718096' };
}

export function monthTx(state, month) {
  return state.transactions.filter((t) => t.month === month);
}

export function incomeOf(state, month) {
  return monthTx(state, month).filter((t) => t.cat === 'income').reduce((a, t) => a + t.amount, 0);
}

export function spentByCat(state, month) {
  const out = {};
  monthTx(state, month).filter((t) => t.cat !== 'income').forEach((t) => { out[t.cat] = (out[t.cat] || 0) + t.amount; });
  return out;
}

export function totalSpent(state, month) {
  return Object.values(spentByCat(state, month)).reduce((a, v) => a + v, 0);
}

export function totalBudget(state) {
  return Object.values(state.budgets).reduce((a, v) => a + v, 0);
}

export function rule503020(state, month) {
  const spent = spentByCat(state, month);
  const income = incomeOf(state, month) || state.household.income;
  const sum = (ids) => ids.reduce((a, id) => a + (spent[id] || 0), 0);
  return {
    needs: { spent: sum(RULE_503020.needs), target: 0.5 * income },
    wants: { spent: sum(RULE_503020.wants), target: 0.3 * income },
    savings: { spent: sum(RULE_503020.savings), target: 0.2 * income },
    income,
  };
}

export const fmtRp = (v) => 'Rp' + Number(v).toLocaleString('id-ID');
export const fmtDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][m - 1]} ${y}`;
};
