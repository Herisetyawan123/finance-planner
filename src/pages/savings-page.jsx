import React, { useState } from 'react'
import Card from '../components/cards';
import ProgressBar from '../components/bars/progress-bar';
import Badge from '../components/badge';
import { fmt } from '../utils/global';
import { fmtShort } from '../utils/global';
import { useOutletContext } from 'react-router-dom';

const TabunganPage = () => {
  const {data, setData} = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({nama:"",target:"",saldo:"",targetTanggal:""});
  const add=()=>{ if(!form.nama||!form.target) return; setData(d=>({...d,tabungan:[...d.tabungan,{...form,id:`s${Date.now()}`,target:+form.target,saldo:+form.saldo}]})); setForm({nama:"",target:"",saldo:"",targetTanggal:""}); setShowForm(false); };
  const addSaldo=(id,amt)=>setData(d=>({...d,tabungan:d.tabungan.map(s=>s.id===id?{...s,saldo:s.saldo+(+amt)}:s)}));
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tabungan</h1>
        <button onClick={()=>setShowForm(!showForm)} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-2 rounded-xl transition-colors">+ Tambah</button>
      </div>
      {showForm && (
        <Card>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="text-xs text-gray-500 block mb-1">Nama Tabungan</label><input value={form.nama} onChange={e=>setForm(f=>({...f,nama:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/></div>
            <div><label className="text-xs text-gray-500 block mb-1">Target Nominal</label><input type="number" value={form.target} onChange={e=>setForm(f=>({...f,target:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/></div>
            <div><label className="text-xs text-gray-500 block mb-1">Saldo Saat Ini</label><input type="number" value={form.saldo} onChange={e=>setForm(f=>({...f,saldo:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/></div>
            <div className="col-span-2"><label className="text-xs text-gray-500 block mb-1">Target Tanggal</label><input type="date" value={form.targetTanggal} onChange={e=>setForm(f=>({...f,targetTanggal:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/></div>
          </div>
          <div className="flex gap-2 mt-3"><button onClick={add} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-2 rounded-xl">Simpan</button><button onClick={()=>setShowForm(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm py-2 rounded-xl">Batal</button></div>
        </Card>
      )}
      <div className="grid grid-cols-1 gap-4">
        {data.tabungan.map(s=>{
          const pct=Math.round((s.saldo/s.target)*100);
          const kurang = s.target-s.saldo;
          const targetDate = s.targetTanggal ? new Date(s.targetTanggal) : null;
          const daysLeft = targetDate ? Math.max(0,Math.ceil((targetDate-new Date())/(1000*60*60*24))) : null;
          const bulanLeft = daysLeft ? Math.ceil(daysLeft/30) : null;
          const perBulan = bulanLeft>0 ? Math.ceil(kurang/bulanLeft) : 0;
          return (
            <Card key={s.id}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">🏦 {s.nama}</div>
                  {s.targetTanggal && <div className="text-xs text-gray-400 mt-0.5">Target: {s.targetTanggal}</div>}
                </div>
                <Badge label={`${pct}%`} color={pct>=100?"emerald":pct>=50?"blue":"yellow"}/>
              </div>
              <ProgressBar value={pct} color={pct>=100?"#10b981":pct>=50?"#3b82f6":"#f59e0b"} className="mb-2"/>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-center"><div className="text-xs text-gray-400">Terkumpul</div><div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{fmtShort(s.saldo)}</div></div>
                <div className="text-center"><div className="text-xs text-gray-400">Target</div><div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{fmtShort(s.target)}</div></div>
                <div className="text-center"><div className="text-xs text-gray-400">Kurang</div><div className="text-sm font-semibold text-red-500">{fmtShort(kurang)}</div></div>
              </div>
              {bulanLeft>0 && <div className="text-xs text-gray-400 text-center mt-2">~{fmt(perBulan)}/bulan · {bulanLeft} bulan lagi</div>}
              <div className="flex gap-1 mt-3">
                {[50000,100000,500000].map(amt=>(
                  <button key={amt} onClick={()=>addSaldo(s.id,amt)} className="flex-1 text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700 rounded-lg py-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">+{fmtShort(amt)}</button>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

}

export default TabunganPage;
