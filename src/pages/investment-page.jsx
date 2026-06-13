import React, { useState } from 'react'
import MiniAreaChart from '../components/charts/mini-area-chart';
import Card from '../components/cards';
import Badge from '../components/badge';
import { fmtShort } from '../utils/global';
import { useOutletContext } from 'react-router-dom';
import { typesOfEmojis } from '../constants/type-emojis';

const InvestasiPage = () => {
    const {data, setData} = useOutletContext();

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        jenis:"Reksa Dana",
        nama:"",
        modal:"",
        nilaiSaatIni:""
      });
    const add = () => { 
      if(!form.nama||!form.modal) return; 
      setData( d => (
        {
          ...d,
          investasi: [ 
            ...d.investasi,   
            {
              ...form,id:`i${Date.now()}`,
              modal:+form.modal,
              nilaiSaatIni:+form.nilaiSaatIni
            }
          ]
        }
      )); 
      setForm({
        jenis:"Reksa Dana",
        nama:"",
        modal:"",
        nilaiSaatIni:""
      }); 
      setShowForm(false); 
    };
    const totalModal=data.investasi.reduce((s,i)=>s+i.modal,0);
    const totalNilai=data.investasi.reduce((s,i)=>s+i.nilaiSaatIni,0);
    const totalReturn=totalNilai-totalModal;
    const returnPct=totalModal>0?((totalReturn/totalModal)*100).toFixed(1):0;
    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h1 
            className="text-2xl font-bold text-gray-900 dark:text-white">
              Investasi
          </h1>
          <button 
            onClick={()=>setShowForm(!showForm)} 
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-2 rounded-xl transition-colors">
              + Tambah
            </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Card>
              <div className="text-xs text-gray-500">
                Total Modal
              </div>
              <div className="text-lg font-bold text-gray-800 dark:text-gray-200 mt-1">
                {fmtShort(totalModal)}
              </div>
          </Card>
          <Card>
              <div className="text-xs text-gray-500">Nilai Saat Ini</div>
              <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400 mt-1">
                {fmtShort(totalNilai)}
              </div>
          </Card>
          <Card>
              <div className="text-xs text-gray-500">Return</div>
              <div className={`text-lg font-bold mt-1 ${totalReturn>=0 ? 
                "text-emerald-600 dark:text-emerald-400":"text-red-500"}`}>
                {totalReturn>=0?"+":""}{returnPct}%
              </div>
          </Card>
        </div>
        {showForm && (
          <Card>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-500 block mb-1">Jenis</label>
                <select value={form.jenis} onChange={e=>setForm(f=>({...f,jenis:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                  {["Saham","Reksa Dana","Emas","Crypto","Deposito","Obligasi"].map(j=><option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div><label className="text-xs text-gray-500 block mb-1">Nama</label><input value={form.nama} onChange={e=>setForm(f=>({...f,nama:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/></div>
              <div><label className="text-xs text-gray-500 block mb-1">Modal Awal</label><input type="number" value={form.modal} onChange={e=>setForm(f=>({...f,modal:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/></div>
              <div><label className="text-xs text-gray-500 block mb-1">Nilai Saat Ini</label><input type="number" value={form.nilaiSaatIni} onChange={e=>setForm(f=>({...f,nilaiSaatIni:e.target.value}))} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"/></div>
            </div>
            <div className="flex gap-2 mt-3"><button onClick={add} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-2 rounded-xl">Simpan</button><button onClick={()=>setShowForm(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm py-2 rounded-xl">Batal</button></div>
          </Card>
        )}
        <div className="grid grid-cols-1 gap-3">
          {data.investasi.map(inv=>{
            const ret=inv.nilaiSaatIni-inv.modal; const pct=inv.modal>0?((ret/inv.modal)*100).toFixed(1):0;
            const grow=[inv.modal*0.8,inv.modal*0.9,inv.modal,inv.modal*1.05,inv.modal*1.1,inv.nilaiSaatIni];
            return (
              <Card key={inv.id} className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200">{typesOfEmojis[inv.jenis]||"📊"} {inv.nama}</div>
                    <Badge label={inv.jenis} color="blue"/>
                  </div>
                  <Badge label={`${ret>=0?"+":""}${pct}%`} color={ret>=0?"emerald":"red"}/>
                </div>
                <MiniAreaChart data={grow} color={ret>=0?"#10b981":"#ef4444"}/>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><div className="text-xs text-gray-400">Modal</div><div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{fmtShort(inv.modal)}</div></div>
                  <div><div className="text-xs text-gray-400">Nilai</div><div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">{fmtShort(inv.nilaiSaatIni)}</div></div>
                  <div><div className="text-xs text-gray-400">Return</div><div className={`text-xs font-semibold ${ret>=0?"text-emerald-600 dark:text-emerald-400":"text-red-500"}`}>{ret>=0?"+":""}{fmtShort(Math.abs(ret))}</div></div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
};

export default InvestasiPage;
