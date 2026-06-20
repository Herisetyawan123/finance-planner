import React, { useState } from 'react'
import Card from '../components/cards';
import Badge from '../components/badge';
import { useOutletContext } from 'react-router-dom';
import { bulanNames } from '../utils/global';


// ===================== KALENDER =====================
const KalenderPage = () => {
  const { data } = useOutletContext();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const daysInMonth = new Date(year,month+1,0).getDate();
  const firstDay = new Date(year,month,1).getDay();
  const events = {};
  data.pengeluaranWajib.forEach(w=>{ if(w.jatuhTempo){const d=parseInt(w.jatuhTempo.split("-")[2]); if(!events[d]) events[d]=[]; events[d].push({type:"tagihan",label:w.nama,color:"#ef4444"});}});
  data.tabungan.forEach(s=>{ if(s.targetTanggal){const dt=new Date(s.targetTanggal); if(dt.getFullYear()===year&&dt.getMonth()===month){const d=dt.getDate(); if(!events[d]) events[d]=[]; events[d].push({type:"tabungan",label:s.nama,color:"#10b981"});}}});
  const today = new Date();
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kalender Keuangan</h1>
        <div className="flex items-center gap-2">
          <button onClick={()=>{if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1);}} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">←</button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-28 text-center">{bulanNames[month]} {year}</span>
          <button onClick={()=>{if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1);}} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">→</button>
        </div>
      </div>
      <Card>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map(d=><div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array(firstDay).fill(null).map((_,i)=><div key={`e-${i}`}/>)}
          {Array(daysInMonth).fill(null).map((_,i)=>{
            const day=i+1; const isToday=today.getDate()===day&&today.getMonth()===month&&today.getFullYear()===year;
            const dayEvents=events[day]||[];
            return (
              <div key={day} className={`relative min-h-14 p-1 rounded-lg text-center border transition-colors ${isToday?"bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700":"border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}>
                <div className={`text-xs font-medium mb-0.5 ${isToday?"text-emerald-600 dark:text-emerald-400":"text-gray-700 dark:text-gray-300"}`}>{day}</div>
                {dayEvents.slice(0,2).map((ev,ei)=>(
                  <div key={ei} className="text-xs px-1 py-0.5 rounded text-white truncate mb-0.5" style={{background:ev.color,fontSize:"9px"}}>{ev.label}</div>
                ))}
                {dayEvents.length>2 && <div className="text-xs text-gray-400" style={{fontSize:"9px"}}>+{dayEvents.length-2}</div>}
              </div>
            );
          })}
        </div>
      </Card>
      <Card>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Kejadian Bulan Ini</h2>
        <div className="space-y-2">
          {Object.entries(events).sort((a,b)=>+a[0]-+b[0]).map(([day,evs])=>evs.map((ev,i)=>(
            <div key={`${day}-${i}`} className="flex items-center gap-3 text-sm">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background:ev.color}}>{day}</span>
              <span className="text-gray-700 dark:text-gray-300">{ev.label}</span>
              <Badge label={ev.type==="tagihan"?"Tagihan":"Tabungan"} color={ev.type==="tagihan"?"red":"emerald"}/>
            </div>
          )))}
        </div>
      </Card>
    </div>
  );
};

export default KalenderPage;
