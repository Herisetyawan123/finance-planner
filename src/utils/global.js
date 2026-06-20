export const generateDummyData = () => {
  const categories = ["Makan","Minum","Nongkrong","Belanja","Transportasi","Hiburan","Kesehatan","Lainnya"];
  const wajibCategories = ["Cicilan","Sewa Rumah","Listrik","Air","Internet","BPJS","Asuransi","Pendidikan","Transportasi","Lainnya"];

  const transactions = [];
  for (let m = 0; m < 12; m++) {
    for (let i = 0; i < 8; i++) {
      const d = new Date(2024, m, Math.floor(Math.random()*28)+1);
      transactions.push({
        id: `t-${m}-${i}`,
        tanggal: d.toISOString().split("T")[0],
        kategori: categories[Math.floor(Math.random()*categories.length)],
        deskripsi: ["Makan siang warung","Kopi pagi","Grab ke kantor","Belanja bulanan","Nonton bioskop","Obat apotek","Makan malam","Jajan snack"][i],
        nominal: Math.floor(Math.random()*200000)+10000,
        bulan: m+1, tahun: 2024
      });
    }
  }

  const monthlyPlans = Array.from({length:12}, (_,m) => ({
    bulan: m+1, tahun: 2024,
    gajiUtama: 5000000 + Math.floor(Math.random()*2000000),
    pendapatanTambahan: Math.floor(Math.random()*1000000),
    bonus: m===11 ? 3000000 : 0,
    pendapatanLainnya: Math.floor(Math.random()*500000)
  }));

  const pengeluaranWajib = [
    {id:"w1", nama:"Cicilan Motor", nominal:750000, jatuhTempo:"2024-06-05", status:"Lunas", kategori:"Cicilan"},
    {id:"w2", nama:"Sewa Kos", nominal:1200000, jatuhTempo:"2024-06-01", status:"Lunas", kategori:"Sewa Rumah"},
    {id:"w3", nama:"Listrik PLN", nominal:250000, jatuhTempo:"2024-06-20", status:"Belum", kategori:"Listrik"},
    {id:"w4", nama:"Air PDAM", nominal:85000, jatuhTempo:"2024-06-15", status:"Belum", kategori:"Air"},
    {id:"w5", nama:"Internet Rumah", nominal:300000, jatuhTempo:"2024-06-10", status:"Lunas", kategori:"Internet"},
    {id:"w6", nama:"BPJS Kesehatan", nominal:150000, jatuhTempo:"2024-06-01", status:"Lunas", kategori:"BPJS"},
    {id:"w7", nama:"Asuransi Jiwa", nominal:200000, jatuhTempo:"2024-06-25", status:"Belum", kategori:"Asuransi"},
  ];

  const tabungan = [
    {id:"s1", nama:"Dana Darurat", target:30000000, saldo:12500000, targetTanggal:"2025-12-31"},
    {id:"s2", nama:"Liburan Bali", target:5000000, saldo:3200000, targetTanggal:"2024-12-01"},
    {id:"s3", nama:"Laptop Baru", target:15000000, saldo:8000000, targetTanggal:"2025-06-01"},
    {id:"s4", nama:"DP Rumah", target:100000000, saldo:25000000, targetTanggal:"2027-01-01"},
    {id:"s5", nama:"Pernikahan", target:50000000, saldo:10000000, targetTanggal:"2026-06-01"},
  ];

  const investasi = [
    {id:"i1", jenis:"Reksa Dana", nama:"Reksa Dana Campuran", modal:5000000, nilaiSaatIni:5750000},
    {id:"i2", jenis:"Saham", nama:"BBCA, TLKM, GOTO", modal:3000000, nilaiSaatIni:3480000},
    {id:"i3", jenis:"Emas", nama:"Emas Antam 5gr", modal:2500000, nilaiSaatIni:2900000},
    {id:"i4", jenis:"Deposito", nama:"Deposito BRI 6 Bln", modal:10000000, nilaiSaatIni:10375000},
    {id:"i5", jenis:"Crypto", nama:"Bitcoin, Ethereum", modal:1000000, nilaiSaatIni:780000},
  ];

  const targets = [
    {id:"tg1", nama:"Beli Motor Baru", target:20000000, terkumpul:8000000, deadline:"2025-06-01", prioritas:"Tinggi"},
    {id:"tg2", nama:"Dana Darurat 6 Bulan", target:36000000, terkumpul:12500000, deadline:"2025-12-31", prioritas:"Tinggi"},
    {id:"tg3", nama:"Beli Rumah", target:500000000, terkumpul:25000000, deadline:"2030-01-01", prioritas:"Sedang"},
    {id:"tg4", nama:"Liburan Eropa", target:30000000, terkumpul:5000000, deadline:"2026-07-01", prioritas:"Rendah"},
    {id:"tg5", nama:"Menikah", target:80000000, terkumpul:15000000, deadline:"2026-12-01", prioritas:"Tinggi"},
    {id:"tg6", nama:"Laptop Gaming", target:20000000, terkumpul:12000000, deadline:"2025-03-01", prioritas:"Sedang"},
    {id:"tg7", nama:"Kursus Bahasa", target:5000000, terkumpul:3500000, deadline:"2024-12-01", prioritas:"Sedang"},
    {id:"tg8", nama:"Investasi Saham", target:50000000, terkumpul:8480000, deadline:"2027-01-01", prioritas:"Sedang"},
    {id:"tg9", nama:"Gadget Baru", target:8000000, terkumpul:4000000, deadline:"2024-12-15", prioritas:"Rendah"},
    {id:"tg10", nama:"Kuliah S2", target:150000000, terkumpul:10000000, deadline:"2028-01-01", prioritas:"Rendah"},
  ];

  return { transactions, monthlyPlans, pengeluaranWajib, tabungan, investasi, targets, planningItems: [] };
};
export const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export const fmtShort = (n) => { if(n>=1000000) return `Rp${(n/1000000).toFixed(1)}jt`; if(n>=1000) return `Rp${(n/1000).toFixed(0)}rb`; return `Rp${n}`; };
