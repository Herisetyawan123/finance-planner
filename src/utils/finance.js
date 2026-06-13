export function calculateRemainingFunds(data, bulan, tahun)
{
    const plan = data.monthlyPlans.find(p=>p.bulan===bulan&&p.tahun===tahun)||data.monthlyPlans[data.monthlyPlans.length-1];
    const totalP = (plan?.gajiUtama||0)+(plan?.pendapatanTambahan||0)+(plan?.bonus||0)+(plan?.pendapatanLainnya||0);
    const txBulan = data.transactions.filter(t=>t.bulan===bulan&&t.tahun===tahun);
    const totalH = txBulan.reduce((s,t)=>s+t.nominal,0);
    const totalW = data.pengeluaranWajib.reduce((s,w)=>s+w.nominal,0);
    const sisaDana = totalP-totalW-totalH;
    return {
        sisaDana,
        totalH,
        totalP,
        totalW
    }
}