export const defaultPlan = {
  gajiUtama: 0,
  pendapatanTambahan: 0,
  bonus: 0,
  pendapatanLainnya: 0,
};

export const normalizeBackendPlan = (response, month, year) => {
  const payload = response.data || response || {};
  const sourcePlan = payload.plan || payload.monthly_plan || payload.monthlyPlan || payload || {};

  return {
    bulan: month,
    tahun: year,
    gajiUtama:
      Number(sourcePlan.primary_income ?? sourcePlan.primaryIncome ?? sourcePlan.gajiUtama ?? sourcePlan.gaji_utama ?? 0) || 0,
    pendapatanTambahan:
      Number(sourcePlan.other_income_total ?? sourcePlan.otherIncomeTotal ?? sourcePlan.pendapatanTambahan ?? sourcePlan.pendapatan_tambahan ?? 0) || 0,
    bonus: Number(sourcePlan.bonus ?? 0) || 0,
    pendapatanLainnya:
      Number(sourcePlan.other_income_total ?? sourcePlan.otherIncomeTotal ?? sourcePlan.pendapatanLainnya ?? sourcePlan.pendapatan_lainnya ?? 0) || 0,
  };
};

export const normalizeBackendItem = (item, defaultMonth, defaultYear) => {
  const month = Number(item.month ?? item.bulan ?? defaultMonth) || defaultMonth;
  const year = Number(item.year ?? item.tahun ?? defaultYear) || defaultYear;

  const type = item.type === 'expense'
    ? 'Pengeluaran'
    : item.type === 'saving'
    ? 'Tabungan'
    : item.type === 'investment'
    ? 'Investasi'
    : 'Pemasukan';

  const target = item.type === 'expense'
    ? item.target_conversion === 'expense'
      ? 'Pengeluaran Wajib'
      : 'Pengeluaran Harian'
    : item.type === 'saving'
    ? 'Tabungan'
    : item.type === 'investment'
    ? 'Investasi'
    : item.target_conversion === 'main_income'
    ? 'Pendapatan Utama'
    : 'Pendapatan Lainnya';

  return {
    id: item.id ?? item._id ?? undefined,
    tempId: item.id ? undefined : item.tempId ?? undefined,
    type,
    target,
    title: item.title || item.name || '',
    amount: Number(item.amount ?? item.nominal ?? item.value) || 0,
    date: item.date || item.tanggal || `${year}-${String(month).padStart(2, '0')}-01`,
    bulan: month,
    tahun: year,
  };
};

export const mapFrontendItemToApi = (item) => ({
  ...(item.id ? { id: item.id } : {}),
  date: item.date,
  type: item.type === 'Pengeluaran' ? 'expense' : item.type === 'Tabungan' ? 'saving' : item.type === 'Investasi' ? 'investment' : 'income',
  title: item.title,
  amount: Number(item.amount) || 0,
  target_conversion:
    item.type === 'Pengeluaran'
      ? 'expense'
      : item.type === 'Tabungan'
      ? 'investment'
      : item.type === 'Investasi'
      ? 'investment'
      : item.target === 'Pendapatan Utama'
      ? 'main_income'
      : 'other_income',
  month: Number(item.bulan),
  year: Number(item.tahun),
});

export const calculatePlannerSummary = (planningItems) => {
  const totalPlannedExpense = planningItems
    .filter((item) => item.type === 'Pengeluaran')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalSavings = planningItems
    .filter((item) => item.type === 'Tabungan')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalInvestments = planningItems
    .filter((item) => item.type === 'Investasi')
    .reduce((sum, item) => sum + item.amount, 0);

  const plannedMainIncome = planningItems
    .filter((item) => item.type === 'Pemasukan' && item.target === 'Pendapatan Utama')
    .reduce((sum, item) => sum + item.amount, 0);

  const plannedOtherIncome = planningItems
    .filter((item) => item.type === 'Pemasukan' && item.target === 'Pendapatan Lainnya')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalGajiUtamaSummary = plannedMainIncome;
  const totalPendapatanTambahanSummary = plannedOtherIncome;
  const planBalance = totalGajiUtamaSummary + totalPendapatanTambahanSummary - totalPlannedExpense - totalSavings - totalInvestments;

  return {
    totalPlannedExpense,
    totalSavings,
    totalInvestments,
    plannedMainIncome,
    plannedOtherIncome,
    totalGajiUtamaSummary,
    totalPendapatanTambahanSummary,
    planBalance,
  };
};
