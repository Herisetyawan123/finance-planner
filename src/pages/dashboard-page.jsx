import React from 'react';
import "../components/cards/summary-card";
import SummaryCard from '../components/cards/summary-card';
import Card from '../components/cards';
import BarChart from '../components/charts/bar-chart';
import { fmt, fmtShort } from '../utils/global';
import { useOutletContext } from 'react-router-dom';

export default function DashboardPage() {
  const {
    data,
    bulan,
    tahun,
  } = useOutletContext();

  const plan = data.monthlyPlans.find(p=>p.bulan===bulan&&p.tahun===tahun)||data.monthlyPlans[data.monthlyPlans.length-1];
  const totalPemasukan = (plan?.gajiUtama||0)+(plan?.pendapatanTambahan||0)+(plan?.bonus||0)+(plan?.pendapatanLainnya||0);
  const txBulan = data.transactions.filter(t=>t.bulan===bulan&&t.tahun===tahun);
  const totalHarian = txBulan.reduce((s,t)=>s+t.nominal,0);
  const totalWajib = data.pengeluaranWajib.reduce((s,w)=>s+w.nominal,0);
  const totalTabungan = data.tabungan.reduce((s,t)=>s+t.saldo,0);
  const totalInvestasi = data.investasi.reduce((s,i)=>s+i.nilaiSaatIni,0);
  const sisaDana = totalPemasukan - totalWajib - totalHarian;
  const today = new Date(); const endOfMonth = new Date(tahun,bulan,0); const sisa = Math.max(1,Math.ceil((endOfMonth-today)/(1000*60*60*24)));
  const budgetHarian = Math.floor(Math.max(0,sisaDana)/sisa);

  const cashflowData = data.monthlyPlans.slice(-6).map(p=>{
    const txM = data.transactions.filter(t=>t.bulan===p.bulan&&t.tahun===p.tahun);
    const out = txM.reduce((s,t)=>s+t.nominal,0)+data.pengeluaranWajib.reduce((s,w)=>s+w.nominal,0);
    return {label:["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][p.bulan-1], value:(p.gajiUtama+p.pendapatanTambahan+p.bonus+p.pendapatanLainnya)-out};
  });

  const katDist = {};
  txBulan.forEach(t=>{katDist[t.kategori]=(katDist[t.kategori]||0)+t.nominal;});
  const pieData = Object.entries(katDist).map(([label,value])=>({label,value}));

  const notifs = [];
  if(budgetHarian < 50000) {
    notifs.push({
        type:"warning",
        msg:`Budget harian hanya ${fmt(budgetHarian)} — perhatikan pengeluaran!`}
    );
    data.pengeluaranWajib.filter(w=>w.status==="Belum").forEach(w=>notifs.push({
        type:"info",
        msg:`Tagihan ${w.nama} belum lunas (${w.nominal>0?fmt(w.nominal):""})`
    }))
  };

  const healthScore = Math.min(100, Math.max(0, Math.round(
    (sisaDana/totalPemasukan)*40 + (totalTabungan>0?20:0) + (totalInvestasi>0?20:0) + (budgetHarian>50000?20:10)
  )));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Keuangan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Ringkasan bulan {["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"][bulan]} {tahun}</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl px-3 py-2">
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Health Score</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{healthScore}</span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400">/100</span>
        </div>
      </div>

      {notifs.length > 0 && (
        <div className="space-y-2">
          {notifs.slice(0,3).map((n,i)=>(
            <div key={i} className={`flex items-center gap-2 p-3 rounded-xl text-sm ${n.type==="warning"?"bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300":"bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300"}`}>
              <span>{n.type==="warning"?"⚠️":"ℹ️"}</span>
              {n.msg}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <SummaryCard title="Total Pemasukan" value={totalPemasukan} color="#10b981" icon="💰" mini={[3,4,3.5,5,4.8,5.2].map(x=>x*1000000)}/>
        <SummaryCard title="Pengeluaran Wajib" value={totalWajib} color="#3b82f6" icon="📋" mini={[2.8,2.9,3,2.9,3.1,3].map(x=>x*1000000)}/>
        <SummaryCard title="Pengeluaran Harian" value={totalHarian} color="#f59e0b" icon="🛒" mini={txBulan.slice(0,6).map(t=>t.nominal)}/>
        <SummaryCard title="Total Tabungan" value={totalTabungan} color="#8b5cf6" icon="🏦" mini={[5,8,10,12,14,12.5].map(x=>x*1000000)}/>
        <SummaryCard title="Total Investasi" value={totalInvestasi} color="#06b6d4" icon="📈" mini={[15,16,17,18,20,23].map(x=>x*1000000)}/>
        <Card className="flex flex-col justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Sisa Dana</span>
          <div className={`text-xl font-bold ${sisaDana>=0?"text-emerald-600 dark:text-emerald-400":"text-red-500"}`}>{fmtShort(Math.abs(sisaDana))}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Budget harian: <span className="font-semibold text-gray-800 dark:text-gray-200">{fmtShort(budgetHarian)}</span></div>
          <div className="text-xs text-gray-400">Sisa {sisa} hari bulan ini</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">📊 Cash Flow 6 Bulan</h3>
          <BarChart data={cashflowData} color="#10b981"/>
          <div className="text-xs text-gray-400 text-center mt-1">Sisa dana per bulan</div>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🥧 Distribusi Pengeluaran</h3>
          {pieData.length>0 ? <PieChart data={pieData}/> : <p className="text-xs text-gray-400 text-center py-8">Belum ada transaksi bulan ini</p>}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <div className="text-xs text-gray-500 mb-1">Safe Spending Per Day</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(budgetHarian)}</div>
          <div className="text-xs text-gray-400 mt-1">per hari hingga akhir bulan</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-500 mb-1">Prediksi Akhir Bulan</div>
          <div className={`text-2xl font-bold ${sisaDana-totalHarian>=0?"text-emerald-600 dark:text-emerald-400":"text-red-500"}`}>{fmtShort(Math.max(0,sisaDana))}</div>
          <div className="text-xs text-gray-400 mt-1">estimasi tersisa</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-500 mb-1">Estimasi Tabungan</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{fmtShort(Math.floor(sisaDana*0.2))}</div>
          <div className="text-xs text-gray-400 mt-1">20% dari sisa dana</div>
        </Card>
      </div>
    </div>
  );
}
