// DompetKeluarga — data contoh keluarga yang bisa diedit sepenuhnya.
// Semua angka di bawah ini adalah DATA CONTOH yang tersimpan di localStorage
// dan dapat diubah, ditambah, atau dihapus oleh pengguna. Bukan data nyata
// sebuah keluarga tertentu. Satu-satunya angka acuan luar: UMP DKI Jakarta
// 2024 Rp5.067.381 (Pemprov DKI Jakarta) — dikutip di halaman panduan.

export const META = {
  siteName: 'DompetKeluarga',
  tagline: 'Anggaran rumah tangga, akhirnya beres.',
  updated: '27 November 2026',
};

export const CATEGORIES = [
  { id: 'makan', label: 'Makan & Belanja', color: '#0e7c6b', icon: 'M' },
  { id: 'tempat-tinggal', label: 'Tempat Tinggal', color: '#2b6cb0', icon: 'T' },
  { id: 'transport', label: 'Transport', color: '#b7791f', icon: 'T' },
  { id: 'tagihan', label: 'Tagihan & Utilitas', color: '#6b46c1', icon: 'T' },
  { id: 'kesehatan', label: 'Kesehatan', color: '#c53030', icon: 'K' },
  { id: 'pendidikan', label: 'Pendidikan', color: '#2c7a7b', icon: 'P' },
  { id: 'hiburan', label: 'Hiburan & Gaya Hidup', color: '#d53f8c', icon: 'H' },
  { id: 'tabungan', label: 'Tabungan & Investasi', color: '#276749', icon: 'T' },
  { id: 'lainnya', label: 'Lainnya', color: '#718096', icon: 'L' },
];

export const MONTHS = [
  { id: '2026-09', label: 'September 2026' },
  { id: '2026-10', label: 'Oktober 2026' },
  { id: '2026-11', label: 'November 2026' },
];

export const SEED = {
  household: { name: 'Keluarga Budi', members: 4, income: 8500000, note: 'Gaji pokok + tunjangan, per bulan' },
  budgets: {
    makan: 2200000, 'tempat-tinggal': 1500000, transport: 900000, tagihan: 800000,
    kesehatan: 400000, pendidikan: 700000, hiburan: 500000, tabungan: 1200000, lainnya: 300000,
  },
  goals: [
    { id: 'g1', name: 'Dana darurat 3 bulan', target: 12000000, saved: 7400000 },
    { id: 'g2', name: 'Liburan keluarga ke Yogyakarta', target: 6000000, saved: 2350000 },
    { id: 'g3', name: 'Laptop baru untuk anak', target: 7500000, saved: 1200000 },
  ],
  transactions: [
    { id: 't1', month: '2026-11', date: '2026-11-01', desc: 'Gaji November', cat: 'income', amount: 8500000 },
    { id: 't2', month: '2026-11', date: '2026-11-02', desc: 'Belanja mingguan pasar', cat: 'makan', amount: 385000 },
    { id: 't3', month: '2026-11', date: '2026-11-03', desc: 'Bensin motor', cat: 'transport', amount: 120000 },
    { id: 't4', month: '2026-11', date: '2026-11-05', desc: 'Listrik PLN', cat: 'tagihan', amount: 412000 },
    { id: 't5', month: '2026-11', date: '2026-11-07', desc: 'SPP sekolah anak', cat: 'pendidikan', amount: 650000 },
    { id: 't6', month: '2026-11', date: '2026-11-09', desc: 'Belanja bulanan supermarket', cat: 'makan', amount: 745000 },
    { id: 't7', month: '2026-11', date: '2026-11-10', desc: 'Cicilan KPR', cat: 'tempat-tinggal', amount: 1500000 },
    { id: 't8', month: '2026-11', date: '2026-11-12', desc: 'Internet rumah', cat: 'tagihan', amount: 299000 },
    { id: 't9', month: '2026-11', date: '2026-11-14', desc: 'Dokter gigi anak', cat: 'kesehatan', amount: 250000 },
    { id: 't10', month: '2026-11', date: '2026-11-16', desc: 'Makan di luar akhir pekan', cat: 'hiburan', amount: 185000 },
    { id: 't11', month: '2026-11', date: '2026-11-18', desc: 'Ojek online seminggu', cat: 'transport', amount: 210000 },
    { id: 't12', month: '2026-11', date: '2026-11-20', desc: 'Setoran tabungan rutin', cat: 'tabungan', amount: 1200000 },
    { id: 't13', month: '2026-11', date: '2026-11-22', desc: 'Beli buku & alat tulis', cat: 'pendidikan', amount: 95000 },
    { id: 't14', month: '2026-11', date: '2026-11-25', desc: 'Air galon + gas', cat: 'tagihan', amount: 87000 },
    { id: 't15', month: '2026-10', date: '2026-10-01', desc: 'Gaji Oktober', cat: 'income', amount: 8500000 },
    { id: 't16', month: '2026-10', date: '2026-10-04', desc: 'Belanja mingguan pasar', cat: 'makan', amount: 410000 },
    { id: 't17', month: '2026-10', date: '2026-10-06', desc: 'Bensin motor', cat: 'transport', amount: 135000 },
    { id: 't18', month: '2026-10', date: '2026-10-08', desc: 'Listrik PLN', cat: 'tagihan', amount: 398000 },
    { id: 't19', month: '2026-10', date: '2026-10-10', desc: 'Cicilan KPR', cat: 'tempat-tinggal', amount: 1500000 },
    { id: 't20', month: '2026-10', date: '2026-10-12', desc: 'SPP sekolah anak', cat: 'pendidikan', amount: 650000 },
    { id: 't21', month: '2026-10', date: '2026-10-15', desc: 'Nonton bioskop keluarga', cat: 'hiburan', amount: 220000 },
    { id: 't22', month: '2026-10', date: '2026-10-18', desc: 'Setoran tabungan rutin', cat: 'tabungan', amount: 1200000 },
    { id: 't23', month: '2026-10', date: '2026-10-20', desc: 'Servis motor', cat: 'transport', amount: 340000 },
    { id: 't24', month: '2026-10', date: '2026-10-24', desc: 'Belanja bulanan supermarket', cat: 'makan', amount: 812000 },
    { id: 't25', month: '2026-09', date: '2026-09-01', desc: 'Gaji September', cat: 'income', amount: 8500000 },
    { id: 't26', month: '2026-09', date: '2026-09-03', desc: 'Belanja mingguan pasar', cat: 'makan', amount: 395000 },
    { id: 't27', month: '2026-09', date: '2026-09-05', desc: 'Listrik PLN', cat: 'tagihan', amount: 405000 },
    { id: 't28', month: '2026-09', date: '2026-09-07', desc: 'Cicilan KPR', cat: 'tempat-tinggal', amount: 1500000 },
    { id: 't29', month: '2026-09', date: '2026-09-10', desc: 'SPP sekolah anak', cat: 'pendidikan', amount: 650000 },
    { id: 't30', month: '2026-09', date: '2026-09-14', desc: 'Setoran tabungan rutin', cat: 'tabungan', amount: 1200000 },
    { id: 't31', month: '2026-09', date: '2026-09-16', desc: 'Beli sepatu sekolah', cat: 'pendidikan', amount: 320000 },
    { id: 't32', month: '2026-09', date: '2026-09-20', desc: 'Belanja bulanan supermarket', cat: 'makan', amount: 780000 },
    { id: 't33', month: '2026-09', date: '2026-09-23', desc: 'Bensin + ojek online', cat: 'transport', amount: 295000 },
  ],
};

// Aturan 50/30/20: kebutuhan 50%, keinginan 30%, tabungan 20%.
export const RULE_503020 = {
  needs: ['makan', 'tempat-tinggal', 'transport', 'tagihan', 'kesehatan', 'pendidikan'],
  wants: ['hiburan', 'lainnya'],
  savings: ['tabungan'],
};

export const GUIDE = {
  umpDki2024: 5067381,
  umpSource: 'Pemprov DKI Jakarta — UMP 2024 Rp5.067.381',
};
