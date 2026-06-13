import React from 'react'
import Card from '../components/cards';
import { fmt } from '../utils/global';
import ProgressBar from '../components/bars/progress-bar';
import Badge from '../components/badge';
import { useOutletContext } from 'react-router-dom';


// ===================== AI ANALYSIS =====================
const AIPage = () => {
  const { data, bulan, tahun } = useOutletContext();
  const plan = data.monthlyPlans.find(p=>p.bulan===bulan&&p.tahun===tahun)||data.monthlyPlans[data.monthlyPlans.length-1];
  const totalPemasukan=(plan?.gajiUtama||0)+(plan?.pendapatanTambahan||0)+(plan?.bonus||0)+(plan?.pendapatanLainnya||0);
  const txBulan=data.transactions.filter(t=>t.bulan===bulan&&t.tahun===tahun);
  const totalHarian=txBulan.reduce((s,t)=>s+t.nominal,0);
  const totalWajib=data.pengeluaranWajib.reduce((s,w)=>s+w.nominal,0);
  const sisaDana=totalPemasukan-totalWajib-totalHarian;
  const today=new Date(); const endOfMonth=new Date(tahun,bulan,0); const sisa=Math.max(1,Math.ceil((endOfMonth-today)/(1000*60*60*24)));
  const budgetHarian=Math.floor(Math.max(0,sisaDana)/sisa);
  const totalInvestasi=data.investasi.reduce((s,i)=>s+i.nilaiSaatIni,0);
  const totalTabungan=data.tabungan.reduce((s,t)=>s+t.saldo,0);
  const healthScore=Math.min(100,Math.max(0,Math.round((sisaDana/totalPemasukan)*40+(totalTabungan>0?20:0)+(totalInvestasi>0?20:0)+(budgetHarian>50000?20:10))));
  const scoreColor=healthScore>=75?"text-emerald-600 dark:text-emerald-400":healthScore>=50?"text-yellow-600 dark:text-yellow-400":"text-red-500";
  const scoreLabel=healthScore>=75?"Sehat 💚":healthScore>=50?"Cukup 🟡":"Perlu Perhatian 🔴";
  const riskLevel=sisaDana<0?"Tinggi":sisaDana<totalPemasukan*0.1?"Sedang":"Rendah";
  const riskColor={"Tinggi":"text-red-500","Sedang":"text-yellow-600 dark:text-yellow-400","Rendah":"text-emerald-600 dark:text-emerald-400"};
  const pengeluaranRatio=totalPemasukan>0?((totalWajib+totalHarian)/totalPemasukan)*100:0;
  const insights = [
    `Pendapatan bulan ini sebesar ${fmt(totalPemasukan)}.`,
    `Pengeluaran wajib ${fmt(totalWajib)} (${totalPemasukan>0?((totalWajib/totalPemasukan)*100).toFixed(0):0}% dari pemasukan).`,
    `Pengeluaran harian ${fmt(totalHarian)} dari total transaksi bulan ini.`,
    sisaDana>0 ? `Sisa dana ${fmt(sisaDana)} — masih aman untuk ${sisa} hari ke depan.` : `⚠️ Sisa dana negatif! Kurangi pengeluaran segera.`,
    `Budget harian aman: ${fmt(budgetHarian)}/hari hingga akhir bulan.`,
    `Alokasikan 20% dari sisa dana (${fmt(Math.floor(sisaDana*0.2))}) untuk dana darurat.`,
    pengeluaranRatio>80 ? "⚠️ Rasio pengeluaran melebihi 80% — coba kurangi pengeluaran tidak perlu." : "✅ Rasio pengeluaran masih dalam batas aman.",
    totalInvestasi>0 ? `Portfolio investasi senilai ${fmt(totalInvestasi)} — pertahankan konsistensi.` : "💡 Belum ada investasi. Mulai dengan Reksa Dana minimal Rp100.000.",
  ];
  const recommendations = [
    {icon:"💡", title:"Optimalkan Budget", desc:`Kurangi pengeluaran kategori terbesar hingga 10-15% untuk meningkatkan tabungan.`},
    {icon:"🏦", title:"Dana Darurat", desc:`Pastikan dana darurat minimal 6x pengeluaran bulanan (${fmt((totalWajib+totalHarian)*6)}).`},
    {icon:"📈", title:"Mulai Investasi", desc:"Alokasikan minimal 10% dari pemasukan untuk investasi jangka panjang."},
    {icon:"🎯", title:"Review Target", desc:"Prioritaskan target keuangan dengan deadline terdekat dan butuh upaya paling besar."},
  ];
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🤖 Analisis AI Keuangan</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="text-center">
          <div className="text-xs text-gray-500 mb-1">Health Score</div>
          <div className={`text-4xl font-bold ${scoreColor}`}>{healthScore}</div>
          <div className="text-xs mt-1 text-gray-500">{scoreLabel}</div>
          <ProgressBar value={healthScore} color={healthScore>=75?"#10b981":healthScore>=50?"#f59e0b":"#ef4444"} className="mt-2"/>
        </Card>
        <Card className="text-center">
          <div className="text-xs text-gray-500 mb-1">Risk Level</div>
          <div className={`text-2xl font-bold ${riskColor[riskLevel]}`}>{riskLevel}</div>
          <div className="text-xs mt-1 text-gray-500">risiko keuangan</div>
        </Card>
        <Card className="text-center">
          <div className="text-xs text-gray-500 mb-1">Saving Opportunity</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{fmt(Math.floor(sisaDana*0.2))}</div>
          <div className="text-xs mt-1 text-gray-500">potensi tabungan</div>
        </Card>
        <Card className="text-center">
          <div className="text-xs text-gray-500 mb-1">Pengeluaran Rasio</div>
          <div className={`text-2xl font-bold ${pengeluaranRatio>80?"text-red-500":pengeluaranRatio>60?"text-yellow-600 dark:text-yellow-400":"text-emerald-600 dark:text-emerald-400"}`}>{pengeluaranRatio.toFixed(0)}%</div>
          <div className="text-xs mt-1 text-gray-500">dari pemasukan</div>
        </Card>
      </div>
      <Card>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">💬 Insight Otomatis</h2>
        <div className="space-y-2">
          {insights.map((ins,i)=>(
            <div key={i} className="flex items-start gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="text-emerald-500 mt-0.5 flex-shrink-0">→</span>
              <p className="text-sm text-gray-700 dark:text-gray-300">{ins}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">🎯 Rekomendasi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendations.map((r,i)=>(
            <div key={i} className="p-3 border border-emerald-100 dark:border-emerald-800/50 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/20">
              <div className="flex items-center gap-2 mb-1"><span>{r.icon}</span><div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{r.title}</div></div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{r.desc}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">⚠️ Peringatan Pengeluaran</h2>
        {data.pengeluaranWajib.filter(w=>w.status==="Belum").length > 0 ? (
          <div className="space-y-2">
            {data.pengeluaranWajib.filter(w=>w.status==="Belum").map(w=>(
              <div key={w.id} className="flex items-center gap-2 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-xl">
                <span>🔴</span>
                <div className="flex-1 text-sm text-red-700 dark:text-red-300">{w.nama} — {fmt(w.nominal)} belum terbayar</div>
                {w.jatuhTempo && <Badge label={`Jatuh tempo: ${w.jatuhTempo}`} color="red"/>}
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-emerald-600 dark:text-emerald-400 text-center py-4">✅ Semua tagihan sudah lunas bulan ini!</p>}
      </Card>
    </div>
  );
};

export default AIPage;
