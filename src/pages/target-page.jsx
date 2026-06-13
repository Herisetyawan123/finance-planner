import React, { useState } from 'react'
import ProgressBar from '../components/bars/progress-bar';
import Badge from '../components/badge';
import Card from '../components/cards';
import { fmt, fmtShort } from '../utils/global';
import { useOutletContext } from 'react-router-dom';

const TargetPage = () => {
  const {data, setData} = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({nama:"",target:"",terkumpul:"",deadline:"",prioritas:"Sedang"});
  const add=()=>{ if(!form.nama||!form.target) return; setData(d=>({...d,targets:[...d.targets,{...form,id:`tg${Date.now()}`,target:+form.target,terkumpul:+form.terkumpul}]})); setForm({nama:"",target:"",terkumpul:"",deadline:"",prioritas:"Sedang"}); setShowForm(false); };
  const prioColor={Tinggi:"red",Sedang:"yellow",Rendah:"blue"};
  const targetEmoji=["🏠","🏍️","✈️","💍","🎓","💻","🏋️","🎯"];
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Target Keuangan</h1>
        <button onClick={()=>setShowForm(!showForm)} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-2 rounded-xl transition-colors">+ Target</button>
      </div>
      {showForm && (
        <Card>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="text-xs text-gray-500 block mb-1">Nama Target</label><input value={form.nama} onChange={e=>setForm(f=>({...f,nama:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/></div>
            <div><label className="text-xs text-gray-500 block mb-1">Dana Target</label><input type="number" value={form.target} onChange={e=>setForm(f=>({...f,target:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/></div>
            <div><label className="text-xs text-gray-500 block mb-1">Sudah Terkumpul</label><input type="number" value={form.terkumpul} onChange={e=>setForm(f=>({...f,terkumpul:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/></div>
            <div><label className="text-xs text-gray-500 block mb-1">Deadline</label><input type="date" value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/></div>
            <div><label className="text-xs text-gray-500 block mb-1">Prioritas</label><select value={form.prioritas} onChange={e=>setForm(f=>({...f,prioritas:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"><option value="Tinggi">Tinggi</option><option value="Sedang">Sedang</option><option value="Rendah">Rendah</option></select></div>
          </div>
          <div className="flex gap-2 mt-3"><button onClick={add} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-2 rounded-xl">Simpan</button><button onClick={()=>setShowForm(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm py-2 rounded-xl">Batal</button></div>
        </Card>
      )}
      <div className="grid grid-cols-1 gap-3">
        {data.targets.map((tg,idx)=>{
          const pct=Math.round((tg.terkumpul/tg.target)*100);
          const kurang=tg.target-tg.terkumpul;
          const daysLeft=tg.deadline?Math.max(0,Math.ceil((new Date(tg.deadline)-new Date())/(1000*60*60*24))):null;
          return (
            <Card key={tg.id}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{targetEmoji[idx%targetEmoji.length]}</span>
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{tg.nama}</div>
                    {tg.deadline && <div className="text-xs text-gray-400">Deadline: {tg.deadline} {daysLeft!==null&&`(${daysLeft} hari lagi)`}</div>}
                  </div>
                </div>
                <Badge label={tg.prioritas} color={prioColor[tg.prioritas]||"gray"}/>
              </div>
              <ProgressBar value={pct} color={pct>=100?"#10b981":pct>=50?"#3b82f6":"#f59e0b"} className="mb-2"/>
              <div className="flex justify-between text-xs text-gray-500">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">{fmtShort(tg.terkumpul)} terkumpul</span>
                <span className="font-medium">{pct}%</span>
                <span className="text-gray-800 dark:text-gray-200 font-medium">{fmtShort(tg.target)} target</span>
              </div>
              {kurang>0 && <div className="text-xs text-gray-400 mt-1 text-center">Kurang: {fmt(kurang)}{daysLeft>0 && ` · Butuh ~${fmt(Math.ceil(kurang/Math.max(1,Math.ceil(daysLeft/30))))} /bulan`}</div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TargetPage;
