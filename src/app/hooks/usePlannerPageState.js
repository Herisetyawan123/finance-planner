import { useCallback, useEffect, useMemo, useState } from 'react';
import { plannerService } from '../../app/services/planner-service';
import {
  calculatePlannerSummary,
  defaultPlan,
  mapFrontendItemToApi,
  normalizeBackendItem,
  normalizeBackendPlan,
} from '../../app/utils/planner-utils';
import { loadPlannerStorage, savePlannerStorage } from '../../app/utils/planner-storage';
import { bulanNames } from '../../utils/global';

const defaultItemForm = {
  type: 'Pengeluaran',
  title: '',
  amount: '',
  target: 'Pengeluaran Wajib',
  date: new Date().toISOString().slice(0, 10),
};

export const usePlannerPageState = ({ data, setData, bulan, tahun, token }) => {
  const [planningItems, setPlanningItems] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultPlan);
  const [itemForm, setItemForm] = useState(defaultItemForm);
  const [savedDraft, setSavedDraft] = useState('');
  const [savedBackend, setSavedBackend] = useState('');

  useEffect(() => {
    const currentPlan = data.monthlyPlans.find((p) => p.bulan === bulan && p.tahun === tahun) || defaultPlan;
    setForm((prev) => (prev === currentPlan ? prev : currentPlan));
  }, [bulan, tahun, data.monthlyPlans]);

  useEffect(() => {
    const monthLabel = String(bulan).padStart(2, '0');
    const monthStart = `${tahun}-${monthLabel}-01`;
    const monthEnd = `${tahun}-${monthLabel}-${String(new Date(tahun, bulan, 0).getDate()).padStart(2, '0')}`;

    if (!itemForm.date || itemForm.date < monthStart || itemForm.date > monthEnd) {
      setItemForm((prev) => ({ ...prev, date: monthStart }));
    }
  }, [bulan, tahun, itemForm.date]);

  useEffect(() => {
    const controller = new AbortController();
    const loadMonthlyPlan = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await plannerService.getMonthlyPlan(token, bulan, tahun, {
          signal: controller.signal,
        });

        await new Promise((resolve) => setTimeout(resolve, 500));

        const fetchedPlan = normalizeBackendPlan(response, bulan, tahun);
        const rawItems = response.planning_items || response.planningItems || response.items || [];
        const fetchedItems = rawItems.map((item) => normalizeBackendItem(item, bulan, tahun));

        setForm(fetchedPlan);
        setPlanningItems(fetchedItems);
        setData((d) => {
          const existingPlan = d.monthlyPlans.find((p) => p.bulan === bulan && p.tahun === tahun);
          const planChanged =
            !existingPlan ||
            existingPlan.gajiUtama !== fetchedPlan.gajiUtama ||
            existingPlan.pendapatanTambahan !== fetchedPlan.pendapatanTambahan ||
            existingPlan.bonus !== fetchedPlan.bonus ||
            existingPlan.pendapatanLainnya !== fetchedPlan.pendapatanLainnya;

          if (!planChanged) return d;

          return {
            ...d,
            monthlyPlans: [
              ...d.monthlyPlans.filter((p) => !(p.bulan === bulan && p.tahun === tahun)),
              fetchedPlan,
            ],
          };
        });

        const fetchedSnapshot = JSON.stringify({ plan: fetchedPlan, items: fetchedItems });
        savePlannerStorage(bulan, tahun, fetchedSnapshot, { draft: true, backend: true });
        setSavedDraft(fetchedSnapshot);
        setSavedBackend(fetchedSnapshot);
      } catch (error) {
        if (error.name !== 'AbortError') {
          alert(error.message || 'Gagal memuat data perencanaan.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadMonthlyPlan();
    return () => controller.abort();
  }, [token, bulan, tahun, setData]);

  useEffect(() => {
    try {
      const { draft, backend } = loadPlannerStorage(bulan, tahun);

      if (draft) {
        setSavedDraft(draft);
      } else {
        setSavedDraft(JSON.stringify({ plan: form, items: planningItems.filter((item) => item.bulan === bulan && item.tahun === tahun) }));
      }

      if (backend) {
        setSavedBackend(backend);
      } else {
        setSavedBackend('');
      }
    } catch (error) {
      setSavedDraft(JSON.stringify({ plan: form, items: planningItems.filter((item) => item.bulan === bulan && item.tahun === tahun) }));
      setSavedBackend('');
    }
  }, [bulan, tahun]);

  const monthLabel = String(bulan).padStart(2, '0');
  const monthStart = `${tahun}-${monthLabel}-01`;
  const monthEnd = `${tahun}-${monthLabel}-${String(new Date(tahun, bulan, 0).getDate()).padStart(2, '0')}`;

  const currentPlans = planningItems.filter((item) => item.bulan === bulan && item.tahun === tahun);
  const summary = useMemo(() => calculatePlannerSummary(currentPlans), [currentPlans]);
  const currentSnapshot = JSON.stringify({ plan: form, items: currentPlans });

  const isDirty = savedDraft !== '' && savedDraft !== currentSnapshot;
  const isTempSavedOnly = savedDraft !== '' && savedDraft === currentSnapshot && savedBackend !== currentSnapshot;
  const shouldWarn = isDirty || isTempSavedOnly;
  const promptMessage = isDirty
    ? 'Anda memiliki perubahan yang belum disimpan secara lokal. Keluar tanpa menyimpan?'
    : 'Data hanya tersimpan sementara secara lokal dan belum disimpan ke backend. Keluar sekarang dapat membuat data hilang saat kembali ke web.';

  const saveDraft = useCallback(() => {
    try {
      savePlannerStorage(bulan, tahun, currentSnapshot, { draft: true, backend: false });
      setSavedDraft(currentSnapshot);
      alert('Rencana berhasil disimpan sementara secara lokal.');
    } catch (error) {
      alert('Gagal menyimpan draft lokal.');
    }
  }, [bulan, tahun, currentSnapshot]);

  const savePlan = useCallback(async () => {
    if (!token) {
      alert('Token tidak tersedia. Silakan login ulang.');
      return;
    }

    if (currentPlans.length === 0) {
      alert('Tambahkan setidaknya satu item perencanaan sebelum menyimpan.');
      return;
    }

    setSaving(true);
    try {
      const newPlans = data.monthlyPlans.filter((p) => !(p.bulan === bulan && p.tahun === tahun));
      const updatedMonthlyPlans = [...newPlans, { ...form, bulan, tahun }];
      setData((d) => ({ ...d, monthlyPlans: updatedMonthlyPlans }));

      const payload = {
        month: Number(bulan),
        year: Number(tahun),
        primary_income: Number(summary.totalGajiUtamaSummary),
        other_income_total: Number(summary.totalPendapatanTambahanSummary),
        total_expenses: Number(summary.totalPlannedExpense),
        total_savings: Number(summary.totalSavings),
        total_investments: Number(summary.totalInvestments),
        remaining_plan: Number(summary.planBalance),
        notes: form.notes || `Rencana ${bulanNames[bulan - 1]} ${tahun}`,
        planning_items: currentPlans.map(mapFrontendItemToApi),
      };

      const saveResponse = await plannerService.savePlan(token, payload);
      const responseData = saveResponse.data || saveResponse || {};
      const returnedItems = responseData.planning_items || responseData.planningItems || responseData.items || null;

      if (Array.isArray(returnedItems)) {
        const backendItems = returnedItems.map((item) => normalizeBackendItem(item, bulan, tahun));
        setPlanningItems((items) => [
          ...items.filter((i) => !(i.bulan === bulan && i.tahun === tahun)),
          ...backendItems,
        ]);
      }

      const savedSnapshot = JSON.stringify({ plan: form, items: currentPlans });
      savePlannerStorage(bulan, tahun, savedSnapshot, { draft: true, backend: true });
      setSavedDraft(savedSnapshot);
      setSavedBackend(savedSnapshot);
      alert('Data perencanaan berhasil disimpan ke backend.');
    } catch (error) {
      alert(error.message || 'Gagal menyimpan data ke backend.');
    } finally {
      setSaving(false);
    }
  }, [token, currentPlans, data.monthlyPlans, form, bulan, tahun, setData, summary]);

  const saveItem = useCallback(() => {
    if (itemForm.target !== 'Pendapatan Utama' && !itemForm.title.trim()) {
      alert('Masukkan judul rencana.');
      return;
    }

    if (!itemForm.amount || Number(itemForm.amount) <= 0) {
      alert('Masukkan nominal rencana yang valid.');
      return;
    }

    const item = {
      tempId: `temp-${Date.now()}`,
      ...itemForm,
      title: itemForm.target === 'Pendapatan Utama' ? 'Gaji Utama' : itemForm.title,
      amount: Number(itemForm.amount),
      bulan,
      tahun,
    };

    setPlanningItems((items) => [item, ...items]);
    setItemForm(defaultItemForm);
  }, [itemForm, bulan, tahun]);

  const removeItem = useCallback((id) => {
    setPlanningItems((items) => items.filter((item) => item.id !== id && item.tempId !== id));
  }, []);

  const convertItem = useCallback(
    (item) => {
      if (item.id) {
        alert('Item ini sudah tersimpan di backend dan tidak bisa dikonversi langsung.');
        return;
      }

      if (item.type === 'Pengeluaran') {
        if (item.target === 'Pengeluaran Wajib') {
          const newWajib = [
            {
              id: `wajib-${Date.now()}`,
              nama: item.title,
              nominal: item.amount,
              jatuhTempo: item.date,
              status: 'Belum',
              kategori: item.title,
            },
            ...(data.pengeluaranWajib || []),
          ];
          setData((d) => ({
            ...d,
            pengeluaranWajib: newWajib,
          }));
        } else {
          const newTx = [
            {
              id: `tx-${Date.now()}`,
              tanggal: item.date,
              kategori: item.title,
              deskripsi: item.target,
              nominal: item.amount,
              bulan: item.bulan,
              tahun: item.tahun,
            },
            ...(data.transactions || []),
          ];
          setData((d) => ({
            ...d,
            transactions: newTx,
          }));
        }
      } else if (item.type === 'Pemasukan') {
        const existing = data.monthlyPlans.find((p) => p.bulan === item.bulan && p.tahun === item.tahun);
        const newPlan = existing
          ? {
              ...existing,
              gajiUtama: item.target === 'Pendapatan Utama' ? (existing.gajiUtama || 0) + item.amount : existing.gajiUtama || 0,
              pendapatanLainnya:
                item.target === 'Pendapatan Lainnya' ? (existing.pendapatanLainnya || 0) + item.amount : existing.pendapatanLainnya || 0,
            }
          : {
              bulan: item.bulan,
              tahun: item.tahun,
              gajiUtama: item.target === 'Pendapatan Utama' ? item.amount : 0,
              pendapatanTambahan: 0,
              bonus: 0,
              pendapatanLainnya: item.target === 'Pendapatan Lainnya' ? item.amount : 0,
            };
        const newPlans = data.monthlyPlans.filter((p) => !(p.bulan === item.bulan && p.tahun === item.tahun));
        setData((d) => ({ ...d, monthlyPlans: [...newPlans, newPlan] }));
      } else if (item.type === 'Tabungan') {
        const newSavings = [
          {
            id: `s-${Date.now()}`,
            nama: item.title,
            target: item.amount,
            saldo: 0,
            targetTanggal: item.date,
          },
          ...(data.tabungan || []),
        ];
        setData((d) => ({ ...d, tabungan: newSavings }));
      } else if (item.type === 'Investasi') {
        const newInvest = [
          {
            id: `i-${Date.now()}`,
            jenis: item.title,
            nama: item.title,
            modal: item.amount,
            nilaiSaatIni: item.amount,
          },
          ...(data.investasi || []),
        ];
        setData((d) => ({ ...d, investasi: newInvest }));
      }

      setPlanningItems((items) => items.filter((i) => i.id !== item.id && i.tempId !== item.tempId));
    },
    [data, setData],
  );

  return {
    planningItems,
    isLoading,
    isSaving,
    form,
    itemForm,
    setItemForm,
    monthLabel,
    monthStart,
    monthEnd,
    currentPlans,
    summary,
    isDirty,
    isTempSavedOnly,
    shouldWarn,
    promptMessage,
    saveDraft,
    savePlan,
    saveItem,
    removeItem,
    convertItem,
  };
};
