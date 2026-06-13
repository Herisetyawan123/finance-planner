import React, { useState } from 'react'
import Card from '../components/cards';
import { fmt } from '../utils/global';
import Badge from '../components/badge';
import { useOutletContext } from 'react-router-dom';

const PengeluaranWajibPage = () => {
    const {
      data,
      setData
    } = useOutletContext();

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({nama:"",nominal:"",jatuhTempo:"",status:"Belum",kategori:"Cicilan"});
    const kategoriList=["Cicilan","Sewa Rumah","Listrik","Air","Internet","BPJS","Asuransi","Pendidikan","Transportasi","Lainnya"];
    const add=()=>{
      if(!form.nama||!form.nominal) return;
      setData(d=>({...d,pengeluaranWajib:[...d.pengeluaranWajib,{...form,id:`w${Date.now()}`,nominal:+form.nominal}]}));
      setForm({nama:"",nominal:"",jatuhTempo:"",status:"Belum",kategori:"Cicilan"}); setShowForm(false);
    };
    const toggleStatus=(id)=>setData(d=>({...d,pengeluaranWajib:d.pengeluaranWajib.map(w=>w.id===id?{...w,status:w.status==="Lunas"?"Belum":"Lunas"}:w)}));
    const remove=(id)=>setData(d=>({...d,pengeluaranWajib:d.pengeluaranWajib.filter(w=>w.id!==id)}));
    const total=data.pengeluaranWajib.reduce((s,w)=>s+w.nominal,0);
    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pengeluaran Wajib</h1>
          <button onClick={()=>setShowForm(!showForm)} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-2 rounded-xl transition-colors">+ Tambah</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card><div className="text-xs text-gray-500">Total Wajib</div><div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{fmt(total)}</div></Card>
          <Card><div className="text-xs text-gray-500">Belum Lunas</div><div className="text-xl font-bold text-red-500 mt-1">{data.pengeluaranWajib.filter(w=>w.status==="Belum").length} item</div></Card>
        </div>
        {showForm && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Form Pengeluaran Wajib</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-gray-500 block mb-1">Nama</label><input value={form.nama} onChange={e=>setForm(f=>({...f,nama:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white" placeholder="Nama tagihan"/></div>
              <div><label className="text-xs text-gray-500 block mb-1">Nominal</label><input type="number" value={form.nominal} onChange={e=>setForm(f=>({...f,nominal:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white" placeholder="0"/></div>
              <div><label className="text-xs text-gray-500 block mb-1">Jatuh Tempo</label><input type="date" value={form.jatuhTempo} onChange={e=>setForm(f=>({...f,jatuhTempo:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/></div>
              <div><label className="text-xs text-gray-500 block mb-1">Kategori</label>
                <select value={form.kategori} onChange={e=>setForm(f=>({...f,kategori:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                  {kategoriList.map(k=><option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div><label className="text-xs text-gray-500 block mb-1">Status</label>
                <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                  <option value="Belum">Belum Lunas</option><option value="Lunas">Lunas</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={add} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-2 rounded-xl transition-colors">Simpan</button>
              <button onClick={()=>setShowForm(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm py-2 rounded-xl transition-colors">Batal</button>
            </div>
          </Card>
        )}
        <Card>
          <div className="space-y-2">
            {data.pengeluaranWajib.map(w=>(
              <div key={w.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{w.nama}</span>
                    <Badge label={w.kategori} color="blue"/>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{w.jatuhTempo ? `Jatuh tempo: ${w.jatuhTempo}` : "Tidak ada jatuh tempo"}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{fmt(w.nominal)}</div>
                  <button onClick={()=>toggleStatus(w.id)} className={`text-xs px-2 py-0.5 rounded-full mt-0.5 transition-colors ${w.status==="Lunas"?"bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300":"bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}`}>{w.status==="Lunas"?"✓ Lunas":"Belum Lunas"}</button>
                </div>
                <button onClick={()=>remove(w.id)} className="text-gray-400 hover:text-red-500 transition-colors text-sm">✕</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
};

export default PengeluaranWajibPage;
