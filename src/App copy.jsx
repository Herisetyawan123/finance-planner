import { useState, useEffect, useMemo } from "react";
import PieChart from "./components/charts/pie-chart";
import ProgressBar from "./components/bars/progress-bar";
import { fmt, generateDummyData } from "./utils/global";
import Sidebar from "./components/layouts/sidebar";
import Header from "./components/layouts/header";
import { calculateRemainingFunds } from "./utils/finance";
import { Outlet } from "react-router-dom";

const EMERALD = "#10b981"; const EMERALD_DARK = "#059669"; const EMERALD_LIGHT = "#d1fae5";

// ===================== ICONS =====================
const icons = {
  dashboard: "📊", planning: "📅", income: "💰", expense: "💸", daily: "🛒",
  saving: "🏦", invest: "📈", target: "🎯", calendar: "📆", report: "📋",
  ai: "🤖", settings: "⚙️", menu: "☰", close: "✕", sun: "☀️", moon: "🌙",
  bell: "🔔", plus: "+", check: "✓", warning: "⚠️", info: "ℹ️", trend: "📉"
};

// ===================== MAIN APP =====================
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(generateDummyData());
  const [bulan, setBulan] = useState(new Date().getMonth()+1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const {
    sisaDana,
    totalH,
    totalP,
    totalW
  } = calculateRemainingFunds(data, bulan, tahun);
  const notifCount = data.pengeluaranWajib.filter(w=>w.status==="Belum").length;

  const renderPage=()=>{
    switch(activePage){
      case "dashboard": return <DashboardPage data={data} bulan={bulan} tahun={tahun}/>;
      case "planning": return <PerencanaanPage data={data} setData={setData} bulan={bulan} setBulan={setBulan} tahun={tahun} setTahun={setTahun}/>;
      case "income": return <PerencanaanPage data={data} setData={setData} bulan={bulan} setBulan={setBulan} tahun={tahun} setTahun={setTahun}/>;
      case "wajib": return <PengeluaranWajibPage data={data} setData={setData}/>;
      case "harian": return <PengeluaranHarianPage data={data} setData={setData} bulan={bulan} tahun={tahun}/>;
      case "tabungan": return <TabunganPage data={data} setData={setData}/>;
      case "investasi": return <InvestasiPage data={data} setData={setData}/>;
      case "target": return <TargetPage data={data} setData={setData}/>;
      case "kalender": return <KalenderPage data={data}/>;
      case "laporan": return <LaporanPage data={data}/>;
      case "ai": return <AIPage data={data} bulan={bulan} tahun={tahun}/>;
      case "settings": return <PengaturanPage darkMode={darkMode} setDarkMode={setDarkMode}/>;
      default: return <DashboardPage data={data} bulan={bulan} tahun={tahun}/>;
    }
  };

  return (
    <div className={darkMode?"dark":""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex font-sans">
        {/* Mobile Overlay */}
        {
          sidebarOpen && 
            <div 
              className="fixed inset-0 bg-black/40 z-20 lg:hidden" 
              onClick={() => setSidebarOpen(false)}
            />
        }
        <Sidebar 
          activePage={activePage}
          bulan={bulan}
          tahun={tahun}
          sidebarOpen={sidebarOpen}
          sisaDana={sisaDana}
          notifCount={notifCount}
          totalH={totalH}
          totalP={totalP}
          totalW={totalW}
          darkMode={darkMode}
          setSidebarOpen={setSidebarOpen}
          setActivePage={setActivePage}
          setDarkMode={setActivePage}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          {/* Top Bar */}
          <Header 
            activePage={activePage}
            notifCount={notifCount}
            setSidebarOpen={setSidebarOpen}
            sisaDana={sisaDana}
          />

          {/* Page Content */}
          <main className="flex-1 p-4 overflow-auto">
            <div className="max-w-4xl mx-auto">
              {renderPage()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}