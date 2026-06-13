import React, { useState } from 'react'
import Card from '../components/cards';
import { fmt } from '../utils/global';
import { useOutletContext } from 'react-router-dom';
import Badge from '../components/badge';

const PengeluaranHarianPage = () => {
  const {
    bulan,
    tahun,
    data,
    setData,
  } = useOutletContext();
  const categories=["Makan","Minum","Nongkrong","Belanja","Transportasi","Hiburan","Kesehatan","Lainnya"];
  const catEmoji={Makan:"🍽️",Minum:"☕",Nongkrong:"🫂",Belanja:"🛍️",Transportasi:"🚗",Hiburan:"🎬",Kesehatan:"💊",Lainnya:"📦"};
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({tanggal:new Date().toISOString().split("T")[0],kategori:"Makan",deskripsi:"",nominal:""});
  const [filterKat, setFilterKat] = useState(""); const [search, setSearch] = useState(""); const [filterDate, setFilterDate] = useState("");
  const add=()=>{ if(!form.deskripsi||!form.nominal) return; const d=new Date(form.tanggal); setData(prev=>({...prev,transactions:[...prev.transactions,{...form,id:`t${Date.now()}`,nominal:+form.nominal,bulan:d.getMonth()+1,tahun:d.getFullYear()}]})); setForm({tanggal:new Date().toISOString().split("T")[0],kategori:"Makan",deskripsi:"",nominal:""}); setShowForm(false); };
  const txBulan = data.transactions.filter(t=>t.bulan===bulan&&t.tahun===tahun);
  const filtered = txBulan.filter(t=>(filterKat?t.kategori===filterKat:true)&&(search?t.deskripsi.toLowerCase().includes(search.toLowerCase()):true)&&(filterDate?t.tanggal===filterDate:true));
  const total = filtered.reduce((s,t)=>s+t.nominal,0);
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pengeluaran Harian</h1>
        <button onClick={()=>setShowForm(!showForm)} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-2 rounded-xl transition-colors">+ Transaksi</button>
      </div>
      {showForm && (
        <Card>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500 block mb-1">Tanggal</label><input type="date" value={form.tanggal} onChange={e=>setForm(f=>({...f,tanggal:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/></div>
            <div><label className="text-xs text-gray-500 block mb-1">Kategori</label><select value={form.kategori} onChange={e=>setForm(f=>({...f,kategori:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white">{categories.map(c=><option key={c} value={c}>{catEmoji[c]} {c}</option>)}</select></div>
            <div className="col-span-2"><label className="text-xs text-gray-500 block mb-1">Deskripsi</label><input value={form.deskripsi} onChange={e=>setForm(f=>({...f,deskripsi:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white" placeholder="Keterangan transaksi"/></div>
            <div className="col-span-2"><label className="text-xs text-gray-500 block mb-1">Nominal</label><input type="number" value={form.nominal} onChange={e=>setForm(f=>({...f,nominal:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white" placeholder="0"/></div>
          </div>
          <div className="flex gap-2 mt-3"><button onClick={add} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-2 rounded-xl">Simpan</button><button onClick={()=>setShowForm(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm py-2 rounded-xl">Batal</button></div>
        </Card>
      )}
      <Card>
        <div className="flex flex-wrap gap-2 mb-3">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Cari transaksi..." className="flex-1 min-w-0 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/>
          <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/>
          <select value={filterKat} onChange={e=>setFilterKat(e.target.value)} className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
            <option value="">Semua Kategori</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex justify-between items-center mb-3 p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
          <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">Total {filtered.length} transaksi</span>
          <span className="text-sm font-bold text-amber-700 dark:text-amber-300">{fmt(total)}</span>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.length===0 && <p className="text-center text-gray-400 text-sm py-8">Belum ada transaksi</p>}
          {filtered.sort((a,b)=>b.tanggal.localeCompare(a.tanggal)).map(t=>(
            <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <span className="text-xl">{catEmoji[t.kategori]||"📦"}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{t.deskripsi}</div>
                <div className="text-xs text-gray-400">{t.tanggal} · <Badge label={t.kategori} color="yellow"/></div>
              </div>
              <div className="text-sm font-semibold text-red-500">-{fmt(t.nominal)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PengeluaranHarianPage;
