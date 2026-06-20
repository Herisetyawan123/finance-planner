import React, { useState } from 'react'
import { fmt } from '../../utils/global';
import ProgressBar from '../bars/progress-bar';
import { navItems } from '../../constants/navigation';
import { NavLink } from 'react-router-dom';

function Sidebar({
        activePage,
        bulan,
        tahun,
        sidebarOpen,
        sisaDana,
        totalP,
        totalW,
        totalH,
        darkMode,
        notifCount,
        dashboardSummary,
        summaryLoading,
        setActivePage,
        setDarkMode,
        setSidebarOpen
    }) {

  const bulanNames =[
        "",
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ];
    
    return (
        <aside className={`fixed top-0 left-0 h-full z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col transition-transform duration-300 ${sidebarOpen?"translate-x-0":"-translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">₽</div>
            <div>
                <div className="font-bold text-gray-900 dark:text-white text-sm">Finance Planner</div>
                <div className="text-xs text-gray-400">{bulanNames[bulan]} {tahun}</div>
            </div>
            </div>
        </div>
        <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <div className="text-xs text-gray-400 mb-1 px-2">Sisa Dana Bulan Ini</div>
            <div className={`text-lg font-bold px-2 ${sisaDana>=0?"text-emerald-600 dark:text-emerald-400":"text-red-500"}`}>{fmt(Math.abs(sisaDana))}</div>
            <ProgressBar value={totalP>0?Math.min(100,((totalW+totalH)/totalP)*100):0} color="#10b981" className="mt-2 mx-2"/>
            {dashboardSummary && !summaryLoading && (
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 px-2 space-y-1">
                <div>Pendapatan: {fmt(dashboardSummary.income)}</div>
                <div>Tabungan: {fmt(dashboardSummary.saving)}</div>
                <div>Investasi: {fmt(dashboardSummary.investment)}</div>
              </div>
            )}
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
            {navItems.map(item => {
                const Icon = item.icon;
                return (
                    <NavLink
                        key={item.id}
                        to={item.link}
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-0.5 transition-all ${
                                isActive
                                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                            }`
                        }
                    >
                        <span>
                            <Icon size={20} />
                        </span>

                        <span>{item.label}</span>

                        {item.id === "wajib" && notifCount > 0 && (
                            <span className="ml-auto text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                                {notifCount}
                            </span>
                        )}
                    </NavLink>
                    
                );
            })}
        </nav>
        <div className="p-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-sm font-bold text-emerald-600 dark:text-emerald-400">A</div>
            <div className="flex-1 min-w-0"><div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">Andi Pratama</div><div className="text-xs text-gray-400">Premium</div></div>
            <button onClick={()=>setDarkMode(d=>!d)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">{darkMode?"☀️":"🌙"}</button>
            </div>
        </div>
        </aside>
    )
}

export default Sidebar
