import React, { useState } from 'react'
import Card from '../components/cards';
import { fmtShort } from '../utils/global';
import { useOutletContext } from 'react-router-dom';


const LaporanPage = () => {
  const {data} = useOutletContext();
  const [period, setPeriod] = useState("bulanan");
  const bulanNames=["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const summary = data.monthlyPlans.map(p=>{
    const txM=data.transactions.filter(t=>t.bulan===p.bulan&&t.tahun===p.tahun);
    const pemasukan=(p.gajiUtama||0)+(p.pendapatanTambahan||0)+(p.bonus||0)+(p.pendapatanLainnya||0);
    const harian=txM.reduce((s,t)=>s+t.nominal,0);
    const wajib=data.pengeluaranWajib.reduce((s,w)=>s+w.nominal,0);
    return {bulan:p.bulan,tahun:p.tahun,pemasukan,harian,wajib,sisa:pemasukan-wajib-harian};
  });
  const totalP=summary.reduce((s,m)=>s+m.pemasukan,0);
  const totalH=summary.reduce((s,m)=>s+m.harian,0);
  const totalW=summary.reduce((s,m)=>s+m.wajib,0);
  const totalS=summary.reduce((s,m)=>s+m.sisa,0);
  const exportCSV=()=>{
    const rows=[["Bulan","Tahun","Pemasukan","Wajib","Harian","Sisa"],...summary.map(m=>[bulanNames[m.bulan],m.tahun,m.pemasukan,m.wajib,m.harian,m.sisa])];
    const csv=rows.map(r=>r.join(",")).join("\n");
    const a=document.createElement("a"); a.href=`data:text/csv,${encodeURIComponent(csv)}`; a.download="laporan-keuangan.csv"; a.click();
  };
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Laporan</h1>
        <button onClick={exportCSV} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-2 rounded-xl transition-colors">↓ Export CSV</button>
      </div>
      <div className="flex gap-2">
        {["harian","mingguan","bulanan","tahunan"].map(p=>(
          <button key={p} onClick={()=>setPeriod(p)} className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors ${period===p?"bg-emerald-500 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>{p}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card><div className="text-xs text-gray-500">Total Pemasukan</div><div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{fmtShort(totalP)}</div></Card>
        <Card><div className="text-xs text-gray-500">Total Pengeluaran</div><div className="text-lg font-bold text-red-500 mt-1">{fmtShort(totalH+totalW)}</div></Card>
        <Card><div className="text-xs text-gray-500">Total Tabungan</div><div className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-1">{fmtShort(data.tabungan.reduce((s,t)=>s+t.saldo,0))}</div></Card>
        <Card><div className="text-xs text-gray-500">Net Cash Flow</div><div className={`text-lg font-bold mt-1 ${totalS>=0?"text-emerald-600 dark:text-emerald-400":"text-red-500"}`}>{fmtShort(Math.abs(totalS))}</div></Card>
      </div>
      <Card>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Laporan Bulanan</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gray-100 dark:border-gray-700">{["Bulan","Pemasukan","Wajib","Harian","Sisa"].map(h=><th key={h} className="text-left py-2 px-2 text-gray-400 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {summary.map(m=>(
                <tr key={`${m.bulan}-${m.tahun}`} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="py-2 px-2 text-gray-700 dark:text-gray-300 font-medium">{bulanNames[m.bulan]}</td>
                  <td className="py-2 px-2 text-emerald-600 dark:text-emerald-400">{fmtShort(m.pemasukan)}</td>
                  <td className="py-2 px-2 text-blue-600 dark:text-blue-400">{fmtShort(m.wajib)}</td>
                  <td className="py-2 px-2 text-amber-600 dark:text-amber-400">{fmtShort(m.harian)}</td>
                  <td className={`py-2 px-2 font-semibold ${m.sisa>=0?"text-emerald-600 dark:text-emerald-400":"text-red-500"}`}>{fmtShort(Math.abs(m.sisa))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};


export default LaporanPage;
