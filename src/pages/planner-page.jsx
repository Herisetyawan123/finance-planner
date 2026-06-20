import React, { useCallback } from 'react';
import { useBeforeUnload, useOutletContext, unstable_usePrompt } from 'react-router-dom';
import Card from '../components/cards';
import { fmt, fmtDate } from '../utils/global';
import { useAuthStore } from '../app/store/auth-store';
import { usePlannerPageState } from '../app/hooks/usePlannerPageState';
import PlannerNewItemForm from './planner-page/components/PlannerNewItemForm';
import PlannerItemsTable from './planner-page/components/PlannerItemsTable';
import PlannerSummaryPanel from './planner-page/components/PlannerSummaryPanel';

const bulanNames = [
  '',
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const PerencanaanPage = () => {
  const { data, setData, bulan, setBulan, tahun, setTahun } = useOutletContext();
  const token = useAuthStore((state) => state.token);

  const {
    isLoading,
    isSaving,
    itemForm,
    setItemForm,
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
  } = usePlannerPageState({ data, setData, bulan, tahun, token });

  unstable_usePrompt({
    when: shouldWarn,
    message: promptMessage,
  });

  useBeforeUnload(
    useCallback(
      (event) => {
        if (!shouldWarn) return;
        event.preventDefault();
        event.returnValue = isDirty
          ? 'Anda memiliki perubahan yang belum disimpan. Jika keluar, rencana tidak akan tersimpan.'
          : 'Data hanya tersimpan sementara. Jika keluar, data bisa hilang saat kembali ke web.';
      },
      [shouldWarn, isDirty],
    ),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Perencanaan Bulanan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Susun rencana pendapatan dan pengeluaran untuk bulan ini, lalu konversi ke data riil.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Bulan</label>
            <select
              value={bulan}
              onChange={(e) => setBulan(+e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              {bulanNames.slice(1).map((name, index) => (
                <option key={name} value={index + 1}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Tahun</label>
            <select
              value={tahun}
              onChange={(e) => setTahun(+e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-200">
          Memuat data perencanaan untuk {bulanNames[bulan]} {tahun}...
        </div>
      )}

      <PlannerNewItemForm
        itemForm={itemForm}
        setItemForm={setItemForm}
        saveItem={saveItem}
        monthStart={monthStart}
        monthEnd={monthEnd}
        isLoading={isLoading || isSaving}
      />

      <Card>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Daftar Perencanaan</h2>
        <PlannerItemsTable currentPlans={currentPlans} convertItem={convertItem} removeItem={removeItem} />
      </Card>

      <PlannerSummaryPanel
        summary={summary}
        saveDraft={saveDraft}
        savePlan={savePlan}
        isDirty={isDirty}
        isTempSavedOnly={isTempSavedOnly}
        isLoading={isLoading || isSaving}
      />
    </div>
  );
};

export default PerencanaanPage;
