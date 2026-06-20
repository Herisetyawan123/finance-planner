import React from 'react';
import Card from '../../../components/cards';

const PlannerNewItemForm = ({ itemForm, setItemForm, saveItem, monthStart, monthEnd, isLoading }) => {
  return (
    <Card>
      <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Buat Rencana Baru</h2>
      <div className="grid gap-4 lg:grid-cols-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Jenis</label>
          <select
            value={itemForm.type}
            onChange={(e) => {
              const type = e.target.value;
              setItemForm((prev) => ({
                ...prev,
                type,
                target: type === 'Pemasukan'
                  ? 'Pendapatan Lainnya'
                  : type === 'Tabungan'
                  ? 'Tabungan'
                  : type === 'Investasi'
                  ? 'Investasi'
                  : 'Pengeluaran Wajib',
                title: type === 'Pemasukan' && prev.target === 'Pendapatan Utama' ? 'Gaji Utama' : prev.title,
              }));
            }}
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="Pengeluaran">Pengeluaran</option>
            <option value="Pemasukan">Pemasukan</option>
            <option value="Tabungan">Tabungan</option>
            <option value="Investasi">Investasi</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Judul Rencana</label>
          <input
            type="text"
            value={itemForm.title}
            onChange={(e) => setItemForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Contoh: Listrik, Freelance"
            disabled={itemForm.target === 'Pendapatan Utama'}
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Nominal</label>
          <input
            type="number"
            value={itemForm.amount}
            onChange={(e) => setItemForm((prev) => ({ ...prev, amount: e.target.value }))}
            placeholder="0"
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Tanggal Rencana</label>
          <input
            type="date"
            value={itemForm.date}
            min={monthStart}
            max={monthEnd}
            onChange={(e) => setItemForm((prev) => ({ ...prev, date: e.target.value }))}
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mt-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Target Konversi</label>
          <select
            value={itemForm.target}
            onChange={(e) => {
              const target = e.target.value;
              setItemForm((prev) => ({
                ...prev,
                target,
                title: target === 'Pendapatan Utama' ? 'Gaji Utama' : prev.title === 'Gaji Utama' ? '' : prev.title,
              }));
            }}
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            {itemForm.type === 'Pengeluaran' ? (
              <>
                <option value="Pengeluaran Wajib">Pengeluaran Wajib</option>
                <option value="Pengeluaran Harian">Pengeluaran Harian</option>
              </>
            ) : itemForm.type === 'Pemasukan' ? (
              <>
                <option value="Pendapatan Utama">Pendapatan Utama</option>
                <option value="Pendapatan Lainnya">Pendapatan Lainnya</option>
              </>
            ) : itemForm.type === 'Tabungan' ? (
              <>
                <option value="Tabungan">Tabungan</option>
              </>
            ) : (
              <>
                <option value="Investasi">Investasi</option>
              </>
            )}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={saveItem}
            disabled={isLoading}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-400 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
          >
            Tambah Rencana
          </button>
        </div>
      </div>
    </Card>
  );
};

export default PlannerNewItemForm;
