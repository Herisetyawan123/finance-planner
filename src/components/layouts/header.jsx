import React from 'react'
import { fmt } from '../../utils/global'
import { navItems } from '../../constants/navigation'
import { Bell } from 'lucide-react'

const Header = ({
  activePage,
  setSidebarOpen,
  notifCount,
  sisaDana
}) => {
  return (
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
        <button onClick={()=>setSidebarOpen(o=>!o)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">☰</button>
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{navItems.find(n=>n.id===activePage)?.label||"Dashboard"}</div>
        </div>
        <div className="flex items-center gap-2">
          {notifCount>0 && (
            <div className="relative cursor-pointer">
              <span className="text-gray-500 dark:text-gray-400 text-lg">
                <Bell size={25} />
              </span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{notifCount}</span>
            </div>
          )}
          <div className="hidden sm:flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-lg px-2 py-1">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Sisa: {fmt(Math.max(0,sisaDana))}</span>
          </div>
        </div>
      </header>
  )
}

export default Header
