import React, { useEffect, useMemo, useState } from 'react';
import Card from '../components/cards';
import { fmt, fmtShort, bulanNames } from '../utils/global';

const STORAGE_KEY = 'finance_planner_income';

const loadIncomeStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { primary: {}, entries: [] };
  } catch {
    return { primary: {}, entries: [] };
  }
};

const saveIncomeStorage = (value) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
};

export default function IncomePage() {
  const today = new Date();
  const [bulan, setBulan] = useState(today.getMonth() + 1);
  const [tahun, setTahun] = useState(today.getFullYear());
  const [primaryValue, setPrimaryValue] = useState('');
  const [additional, setAdditional] = useState({ title: '', amount: '', date: today.toISOString().slice(0, 10) });
  const [primaryIncomes, setPrimaryIncomes] = useState({});
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const stored = loadIncomeStorage();
    setPrimaryIncomes(stored.primary || {});
    setEntries(stored.entries || []);
  }, []);

  useEffect(() => {
    const key = `${bulan}-${tahun}`;
    setPrimaryValue(primaryIncomes[key] ?? '');
  }, [bulan, tahun, primaryIncomes]);

  const currentKey = `${bulan}-${tahun}`;
  const currentPrimary = Number(primaryIncomes[currentKey] || 0);
  const monthlyAdditional = useMemo(
    () => entries.filter((item) => item.bulan === bulan && item.tahun === tahun),
    [entries, bulan, tahun]
  );

  const monthlyTotal = currentPrimary + monthlyAdditional.reduce((sum, item) => sum + item.amount, 0);

  const allRows = useMemo(() => {
    const primaryRows = Object.entries(primaryIncomes).map(([key, amount]) => {
      const [b, y] = key.split('-').map(Number);
      return {
        id: `primary-${key}`,
        type: 'Gaji Utama',
        title: 'Gaji Utama Bulanan',
        amount,
        date: `${y}-${String(b).padStart(2, '0')}-01`,
        bulan: b,
        tahun: y,
        deletable: false,
      };
    });
    return [...primaryRows, ...entries].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [primaryIncomes, entries]);

  const handleSavePrimary = () => {
    const value = Number(primaryValue || 0);
    const updatedPrimary = { ...primaryIncomes, [currentKey]: value };
    setPrimaryIncomes(updatedPrimary);
    saveIncomeStorage({ primary: updatedPrimary, entries });
    alert('Gaji Utama berhasil disimpan.');
  };

  const handleAddAdditional = () => {
    if (!additional.title.trim()) {
      alert('Masukkan judul pendapatan tambahan.');
      return;
    }
    if (!additional.amount || Number(additional.amount) <= 0) {
      alert('Masukkan nominal pendapatan tambahan yang valid.');
      return;
    }
    const tanggal = additional.date || today.toISOString().slice(0, 10);
    const tanggalObj = new Date(tanggal);
    const newEntry = {
      id: `inc-${Date.now()}`,
      title: additional.title.trim(),
      type: 'Pendapatan Tambahan',
      amount: Number(additional.amount),
      date: tanggal,
      bulan: tanggalObj.getMonth() + 1,
      tahun: tanggalObj.getFullYear(),
      deletable: true,
    };
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    saveIncomeStorage({ primary: primaryIncomes, entries: updatedEntries });
    setAdditional({ title: '', amount: '', date: tanggal });
  };

  const handleDeleteEntry = (id) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
    saveIncomeStorage({ primary: primaryIncomes, entries: updatedEntries });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pemasukan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola gaji utama bulanan dan sumber pemasukan tambahan.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Bulan</label>
            <select value={bulan} onChange={(e) => setBulan(Number(e.target.value))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
              {bulanNames.map((name, index) => (
                <option key={name} value={index + 1}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Tahun</label>
            <select value={tahun} onChange={(e) => setTahun(Number(e.target.value))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Card>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Gaji Utama Bulanan</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Simpan hanya sekali untuk bulan yang dipilih.</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Nominal Gaji Utama</label>
                <input
                  type="number"
                  value={primaryValue}
                  onChange={(e) => setPrimaryValue(e.target.value)}
                  placeholder="0"
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
              <button onClick={handleSavePrimary} className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-xl transition-colors text-sm px-4">Simpan Gaji Utama</button>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 dark:border-emerald-700 p-4 bg-emerald-50 dark:bg-emerald-900/30">
            <div className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] font-semibold mb-2">Ringkasan Bulanan</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">Untuk {bulanNames[bulan - 1]} {tahun}</div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Gaji Utama</span>
                <span>{fmt(currentPrimary)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Tambahan Bulan Ini</span>
                <span>{fmt(monthlyAdditional.reduce((sum, item) => sum + item.amount, 0))}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-semibold text-gray-900 dark:text-white">
                <span>Total Pemasukan</span>
                <span>{fmt(monthlyTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Tambah Pendapatan Tambahan</h2>
        <div className="grid gap-3 lg:grid-cols-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Judul Sumber</label>
            <input
              type="text"
              value={additional.title}
              onChange={(e) => setAdditional((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Contoh: Freelance, Jualan, Bonus"
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Nominal</label>
            <input
              type="number"
              value={additional.amount}
              onChange={(e) => setAdditional((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder="0"
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Tanggal</label>
            <input
              type="date"
              value={additional.date}
              onChange={(e) => setAdditional((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
        </div>
        <button onClick={handleAddAdditional} className="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 rounded-xl transition-colors text-sm w-full">Tambah Pendapatan</button>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Tabel Income</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-3 py-3">Tanggal</th>
                <th className="px-3 py-3">Sumber</th>
                <th className="px-3 py-3">Tipe</th>
                <th className="px-3 py-3 text-right">Nominal</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {allRows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">Belum ada data pemasukan.</td>
                </tr>
              ) : (
                allRows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-3 py-3">{row.date}</td>
                    <td className="px-3 py-3">{row.title}</td>
                    <td className="px-3 py-3">{row.type}</td>
                    <td className="px-3 py-3 text-right font-semibold">{fmt(row.amount)}</td>
                    <td className="px-3 py-3 text-right">
                      {row.deletable && (
                        <button
                          onClick={() => handleDeleteEntry(row.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >Hapus</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
