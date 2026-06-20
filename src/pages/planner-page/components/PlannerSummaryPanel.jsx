import React from 'react';
import Card from '../../../components/cards';
import { fmt } from '../../../utils/global';

const PlannerSummaryPanel = ({ summary, saveDraft, savePlan, isDirty, isTempSavedOnly, isLoading }) => {
  return (
    <>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Rencana Pendapatan</div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-3">{fmt(summary.totalGajiUtamaSummary + summary.totalPendapatanTambahanSummary)}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Rencana Pengeluaran</div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-3">{fmt(summary.totalPlannedExpense)}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 dark:text-gray-400">Sisa Rencana</div>
          <div className={`text-3xl font-bold mt-3 ${summary.planBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{fmt(summary.planBalance)}</div>
        </Card>
      </div>

      <Card>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Ringkasan Perencanaan</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Gaji Utama</span>
            <span>{fmt(summary.totalGajiUtamaSummary)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Pendapatan Tambahan</span>
            <span>{fmt(summary.totalPendapatanTambahanSummary)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Pengeluaran Total</span>
            <span>{fmt(summary.totalPlannedExpense)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Total Tabungan</span>
            <span>{fmt(summary.totalSavings)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Total Investasi</span>
            <span>{fmt(summary.totalInvestments)}</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-semibold text-gray-900 dark:text-white">
            <span>Sisa Rencana</span>
            <span>{fmt(summary.planBalance)}</span>
          </div>
          <div className="flex flex-col gap-3 pt-3">
            <button
              onClick={saveDraft}
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-400 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
            >
              Simpan Sementara
            </button>
            <button
              onClick={savePlan}
              disabled={isLoading}
              className="w-full bg-sky-500 hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-400 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
            >
              Simpan Rencana
            </button>
          </div>
          {isDirty ? (
            <div className="text-xs text-amber-600 dark:text-amber-400">Perubahan belum disimpan secara lokal. Klik "Simpan Sementara" untuk menyimpan di browser.</div>
          ) : isTempSavedOnly ? (
            <div className="text-xs text-amber-600 dark:text-amber-400">Rencana tersimpan sementara secara lokal tetapi belum disimpan ke backend. Jika keluar, data bisa hilang saat kembali ke web.</div>
          ) : null}
          <div className="text-xs text-gray-500 dark:text-gray-400">Data perencanaan ini bisa dikonversi menjadi pengeluaran wajib, pengeluaran harian, tabungan, atau investasi.</div>
        </div>
      </Card>
    </>
  );
};

export default PlannerSummaryPanel;
