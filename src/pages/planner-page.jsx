import React, { useEffect, useState } from 'react'
import Card from '../components/cards';
import { fmt } from '../utils/global';
import { useOutletContext } from 'react-router-dom';

// ===================== PERENCANAAN BULANAN =====================
const PerencanaanPage = () => {
    const {
    data,
    setData,
    bulan,
    setBulan,
    tahun,
    setTahun,
    } = useOutletContext();

    const plan = data.monthlyPlans.find(p=>p.bulan===bulan&&p.tahun===tahun) || {gajiUtama:0,pendapatanTambahan:0,bonus:0,pendapatanLainnya:0};
    const [form, setForm] = useState(plan);
    useEffect(() => { 
        const p = data.monthlyPlans.find(p => p.bulan === bulan && p.tahun === tahun)|| {
            gajiUtama:0,
            pendapatanTambahan:0,
            bonus:0,
            pendapatanLainnya:0
        }; 
        setForm(p); 
    },[bulan,tahun,data]);
    const total=(+form.gajiUtama||0)+(+form.pendapatanTambahan||0)+(+form.bonus||0)+(+form.pendapatanLainnya||0);
    const bulanNames=["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    const save=()=>{ const newPlans=data.monthlyPlans.filter(p=>!(p.bulan===bulan&&p.tahun===tahun)); setData(d=>({...d,monthlyPlans:[...newPlans,{...form,bulan,tahun}]})); alert("Data tersimpan!"); };
    return (
        <div className="space-y-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Perencanaan Bulanan</h1>
        <Card>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Input Pendapatan</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
                <label className="text-xs text-gray-500 block mb-1">Bulan</label>
                <select value={bulan} onChange={e=>setBulan(+e.target.value)} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                {bulanNames.slice(1).map((_,i)=><option key={i+1} value={i+1}>{bulanNames[i+1]}</option>)}
                </select>
            </div>
            <div>
                <label className="text-xs text-gray-500 block mb-1">Tahun</label>
                <select value={tahun} onChange={e=>setTahun(+e.target.value)} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                {[2023,2024,2025].map(y=><option key={y} value={y}>{y}</option>)}
                </select>
            </div>
            </div>
            {[["gajiUtama","Gaji Utama","💼"],["pendapatanTambahan","Pendapatan Tambahan","🔧"],["bonus","Bonus","🎁"],["pendapatanLainnya","Pendapatan Lainnya","💡"]].map(([field,label,icon])=>(
            <div key={field} className="mb-3">
                <label className="text-xs text-gray-500 block mb-1">{icon} {label}</label>
                <input type="number" value={form[field]||""} onChange={e=>setForm(f=>({...f,[field]:+e.target.value}))} placeholder="0" className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/>
            </div>
            ))}
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-700">
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Total Pemasukan Bulanan</div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{fmt(total)}</div>
            </div>
            <button onClick={save} className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-xl transition-colors text-sm">Simpan Perencanaan</button>
        </Card>
        <Card>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">Histori 12 Bulan</h2>
            <div className="space-y-2">
            {data.monthlyPlans.map(p=>{
                const t=(p.gajiUtama||0)+(p.pendapatanTambahan||0)+(p.bonus||0)+(p.pendapatanLainnya||0);
                return (
                <div key={`${p.bulan}-${p.tahun}`} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{bulanNames[p.bulan]} {p.tahun}</span>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{fmt(t)}</span>
                </div>
                );
            })}
            </div>
        </Card>
        </div>
    );
};

export default PerencanaanPage;
