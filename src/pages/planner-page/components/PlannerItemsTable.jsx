import React from 'react';
import { fmt, fmtDate } from '../../../utils/global';

const PlannerItemsTable = ({ currentPlans, convertItem, removeItem }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
        <thead className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
          <tr>
            <th className="px-3 py-3">Tanggal</th>
            <th className="px-3 py-3">Judul</th>
            <th className="px-3 py-3">Tipe</th>
            <th className="px-3 py-3">Target</th>
            <th className="px-3 py-3 text-right">Nominal</th>
            <th className="px-3 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {currentPlans.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">Belum ada rencana untuk bulan ini.</td>
            </tr>
          ) : (
            currentPlans.map((item) => (
              <tr key={item.id || item.tempId}>
                <td className="px-3 py-3">{fmtDate(item.date)}</td>
                <td className="px-3 py-3">{item.title}</td>
                <td className="px-3 py-3">{item.type}</td>
                <td className="px-3 py-3">{item.target}</td>
                <td className="px-3 py-3 text-right font-semibold">{fmt(item.amount)}</td>
                <td className="px-3 py-3 space-x-2">
                  <button
                    onClick={() => convertItem(item)}
                    disabled={Boolean(item.id)}
                    className={`text-xs ${item.id ? 'text-gray-400 cursor-not-allowed' : 'text-emerald-600 hover:text-emerald-800'}`}
                  >
                    Konversi
                  </button>
                  <button
                    onClick={() => removeItem(item.id || item.tempId)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PlannerItemsTable;
