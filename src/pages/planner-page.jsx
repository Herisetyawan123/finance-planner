import React, { useEffect, useState } from 'react'
import Card from '../components/cards';
import { fmt } from '../utils/global';
import { useOutletContext } from 'react-router-dom';

const bulanNames = ["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const PerencanaanPage = () => {
    const {
      data,
      setData,
      bulan,
      setBulan,
      tahun,
      setTahun,
    } = useOutletContext();

    const plan = data.monthlyPlans.find(p => p.bulan === bulan && p.tahun === tahun) || { gajiUtama: 0, pendapatanTambahan: 0, bonus: 0, pendapatanLainnya: 0 };
    const [form, setForm] = useState(plan);
    const [itemForm, setItemForm] = useState({
      type: 'Pengeluaran',
      title: '',
      amount: '',
      target: 'Pengeluaran Wajib',
      date: new Date().toISOString().slice(0, 10),
    });

    useEffect(() => {
        const p = data.monthlyPlans.find(p => p.bulan === bulan && p.tahun === tahun) || {
            gajiUtama:0,
            pendapatanTambahan:0,
            bonus:0,
            pendapatanLainnya:0
        };
        setForm(p);
    }, [bulan, tahun, data]);

    const planningItems = data.planningItems || [];
    const currentPlans = planningItems.filter(item => item.bulan === bulan && item.tahun === tahun);
    const totalPlannedIncome = currentPlans.filter(item => item.type === 'Pemasukan').reduce((sum, item) => sum + item.amount, 0);
    const totalPlannedExpense = currentPlans.filter(item => item.type === 'Pengeluaran').reduce((sum, item) => sum + item.amount, 0);
    const planBalance = totalPlannedIncome - totalPlannedExpense;
    const totalPlan = (+form.gajiUtama||0)+(+form.pendapatanTambahan||0)+(+form.bonus||0)+(+form.pendapatanLainnya||0);

    const savePlan = () => {
      const newPlans = data.monthlyPlans.filter(p => !(p.bulan === bulan && p.tahun === tahun));
      setData(d => ({ ...d, monthlyPlans: [...newPlans, { ...form, bulan, tahun }] }));
      alert('Data perencanaan berhasil disimpan!');
    };

    const saveItem = () => {
      if (itemForm.target !== 'Pendapatan Utama' && !itemForm.title.trim()) {
        alert('Masukkan judul rencana.');
        return;
      }
      if (!itemForm.amount || Number(itemForm.amount) <= 0) {
        alert('Masukkan nominal rencana yang valid.');
        return;
      }
      const item = {
        id: `plan-${Date.now()}`,
        ...itemForm,
        title: itemForm.target === 'Pendapatan Utama' ? 'Gaji Utama' : itemForm.title,
        amount: Number(itemForm.amount),
        bulan,
        tahun,
      };
      setData(d => ({ ...d, planningItems: [item, ...(d.planningItems || [])] }));
      setItemForm({ type: 'Pengeluaran', title: '', amount: '', target: 'Pengeluaran Wajib', date: new Date().toISOString().slice(0, 10) });
    };

    const removeItem = (id) => {
      setData(d => ({ ...d, planningItems: (d.planningItems || []).filter(item => item.id !== id) }));
    };

    const convertItem = (item) => {
      if (item.type === 'Pengeluaran') {
        if (item.target === 'Pengeluaran Wajib') {
          const newWajib = [
            {
              id: `wajib-${Date.now()}`,
              nama: item.title,
              nominal: item.amount,
              jatuhTempo: item.date,
              status: 'Belum',
              kategori: item.title,
            },
            ...(data.pengeluaranWajib || []),
          ];
          setData(d => ({ ...d, pengeluaranWajib: newWajib, planningItems: (d.planningItems || []).filter(i => i.id !== item.id) }));
        } else {
          const newTx = [
            {
              id: `tx-${Date.now()}`,
              tanggal: item.date,
              kategori: item.title,
              deskripsi: item.target,
              nominal: item.amount,
              bulan: item.bulan,
              tahun: item.tahun,
            },
            ...(data.transactions || []),
          ];
          setData(d => ({ ...d, transactions: newTx, planningItems: (d.planningItems || []).filter(i => i.id !== item.id) }));
        }
      } else {
        const existing = data.monthlyPlans.find(p => p.bulan === item.bulan && p.tahun === item.tahun);
        const newPlan = existing
          ? {
              ...existing,
              gajiUtama: item.target === 'Pendapatan Utama'
                ? (existing.gajiUtama || 0) + item.amount
                : (existing.pendapatanLainnya || 0) + item.amount,
            }
          : {
              bulan: item.bulan,
              tahun: item.tahun,
              gajiUtama: item.target === 'Pendapatan Utama' ? item.amount : 0,
              pendapatanTambahan: 0,
              bonus: 0,
              pendapatanLainnya: item.target === 'Pendapatan Utama' ? 0 : item.amount,
            };
        const newPlans = data.monthlyPlans.filter(p => !(p.bulan === item.bulan && p.tahun === item.tahun));
        setData(d => ({ ...d, monthlyPlans: [...newPlans, newPlan], planningItems: (d.planningItems || []).filter(i => i.id !== item.id) }));
      }
    };

    return (
        <div className="space-y-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Perencanaan Bulanan</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Susun rencana pendapatan dan pengeluaran untuk bulan ini, lalu konversi ke data riil.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Bulan</label>
                <select value={bulan} onChange={e => setBulan(+e.target.value)} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                    {bulanNames.slice(1).map((name, index) => (
                      <option key={name} value={index + 1}>{name}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Tahun</label>
                <select value={tahun} onChange={e => setTahun(+e.target.value)} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                    {[2024, 2025, 2026, 2027].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Rencana Pendapatan</div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-3">{fmt(totalPlannedIncome)}</div>
            </Card>
            <Card>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Rencana Pengeluaran</div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-3">{fmt(totalPlannedExpense)}</div>
            </Card>
            <Card>
              <div className="text-sm text-gray-500 dark:text-gray-400">Sisa Rencana</div>
              <div className={`text-3xl font-bold mt-3 ${planBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{fmt(planBalance)}</div>
            </Card>
          </div>

          <Card>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Buat Rencana Baru</h2>
            <div className="grid gap-4 lg:grid-cols-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Jenis</label>
                <select value={itemForm.type} onChange={e => {
                    const type = e.target.value;
                    setItemForm(prev => ({
                      ...prev,
                      type,
                      target: type === 'Pemasukan' ? 'Pendapatan Lainnya' : 'Pengeluaran Wajib',
                      title: type === 'Pemasukan' && prev.target === 'Pendapatan Utama' ? 'Gaji Utama' : prev.title,
                    }));
                  }} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                  <option value="Pengeluaran">Pengeluaran</option>
                  <option value="Pemasukan">Pemasukan</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Judul Rencana</label>
                <input type="text" value={itemForm.title} onChange={e => setItemForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Contoh: Listrik, Freelance" className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white" disabled={itemForm.target === 'Pendapatan Utama'} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Nominal</label>
                <input type="number" value={itemForm.amount} onChange={e => setItemForm(prev => ({ ...prev, amount: e.target.value }))} placeholder="0" className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Tanggal Rencana</label>
                <input type="date" value={itemForm.date} onChange={e => setItemForm(prev => ({ ...prev, date: e.target.value }))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2 mt-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Target Konversi</label>
                <select value={itemForm.target} onChange={e => {
                    const target = e.target.value;
                    setItemForm(prev => ({
                      ...prev,
                      target,
                      title: target === 'Pendapatan Utama' ? 'Gaji Utama' : prev.title === 'Gaji Utama' ? '' : prev.title,
                    }));
                  }} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                  {itemForm.type === 'Pengeluaran' ? (
                    <>
                      <option value="Pengeluaran Wajib">Pengeluaran Wajib</option>
                      <option value="Pengeluaran Harian">Pengeluaran Harian</option>
                    </>
                  ) : (
                    <>
                      <option value="Pendapatan Utama">Pendapatan Utama</option>
                      <option value="Pendapatan Lainnya">Pendapatan Lainnya</option>
                    </>
                  )}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={saveItem} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 rounded-xl transition-colors text-sm">Tambah Rencana</button>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Daftar Perencanaan</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-3 py-3">Tanggal</th>
                    <th className="px-3 py-3">Judul</th>
                    <th className="px-3 py-3">Tipe</th>
                    <th className="px-3 py-3">Target</th>
                    <th className="px-3 py-3 text-right">Nominal</th>
                    <th className="px-3 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentPlans.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">Belum ada rencana untuk bulan ini.</td>
                    </tr>
                  ) : (
                    currentPlans.map((item) => (
                      <tr key={item.id}>
                        <td className="px-3 py-3">{item.date}</td>
                        <td className="px-3 py-3">{item.title}</td>
                        <td className="px-3 py-3">{item.type}</td>
                        <td className="px-3 py-3">{item.target}</td>
                        <td className="px-3 py-3 text-right font-semibold">{fmt(item.amount)}</td>
                        <td className="px-3 py-3 space-x-2">
                          <button onClick={() => convertItem(item)} className="text-emerald-600 hover:text-emerald-800 text-xs">Konversi</button>
                          <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-xs">Hapus</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Ringkasan Perencanaan</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Total Rencana Pendapatan</span>
                <span>{fmt(totalPlannedIncome)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Total Rencana Pengeluaran</span>
                <span>{fmt(totalPlannedExpense)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-semibold text-gray-900 dark:text-white">
                <span>Sisa Rencana</span>
                <span>{fmt(planBalance)}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Data perencanaan ini bisa dikonversi menjadi pengeluaran wajib, pengeluaran harian, atau pendapatan lainnya.</div>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Perencanaan Bulanan Saat Ini</h2>
            <div className="grid gap-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300"><span>Gaji Utama</span><span>{fmt(form.gajiUtama)}</span></div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300"><span>Pendapatan Tambahan</span><span>{fmt(form.pendapatanTambahan)}</span></div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300"><span>Bonus</span><span>{fmt(form.bonus)}</span></div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300"><span>Pendapatan Lainnya</span><span>{fmt(form.pendapatanLainnya)}</span></div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-semibold text-gray-900 dark:text-white"><span>Total Perencanaan</span><span>{fmt(totalPlan)}</span></div>
              <button onClick={savePlan} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-xl transition-colors text-sm">Simpan Perencanaan Bulanan</button>
            </div>
          </Card>
        </div>
    );
};

export default PerencanaanPage;
