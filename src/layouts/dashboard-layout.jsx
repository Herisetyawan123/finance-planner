import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layouts/sidebar";
import Header from "../components/layouts/header";

import { generateDummyData } from "../utils/global";
import { calculateRemainingFunds } from "../utils/finance";
import { useAuthStore } from "../app/store/auth-store";
import { dashboardService } from "../app/services/dashboard-service";

export default function DashboardLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  const [data, setData] = useState(generateDummyData());

  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [bulan, setBulan] = useState(
    new Date().getMonth() + 1
  );

  const [tahun, setTahun] = useState(
    new Date().getFullYear()
  );

  const token = useAuthStore((state) => state.token);

  const {
    sisaDana,
    totalH,
    totalP,
    totalW,
  } = calculateRemainingFunds(data, bulan, tahun);

  const notifCount = data.pengeluaranWajib.filter(
    (w) => w.status === "Belum"
  ).length;

  useEffect(() => {
    let active = true;

    if (!token) {
      setDashboardSummary(null);
      setSummaryLoading(false);
      return;
    }

    setSummaryLoading(true);
    dashboardService
      .getSummary(token)
      .then((summary) => {
        if (!active) return;
        setDashboardSummary(summary);
      })
      .catch((error) => {
        console.error("Failed to load dashboard summary", error);
        if (active) {
          setDashboardSummary(null);
        }
      })
      .finally(() => {
        if (active) {
          setSummaryLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          bulan={bulan}
          tahun={tahun}
          sidebarOpen={sidebarOpen}
          sisaDana={dashboardSummary?.remainingBalance ?? sisaDana}
          activePage={activePage}
          notifCount={notifCount}
          totalH={dashboardSummary?.dailyExpense ?? totalH}
          totalP={dashboardSummary?.income ?? totalP}
          totalW={dashboardSummary?.mandatoryExpense ?? totalW}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setSidebarOpen={setSidebarOpen}
          setActivePage={setActivePage}
          dashboardSummary={dashboardSummary}
          summaryLoading={summaryLoading}
        />

        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          <Header
            notifCount={notifCount}
            setSidebarOpen={setSidebarOpen}
            sisaDana={dashboardSummary?.remainingBalance ?? sisaDana}
            dashboardSummary={dashboardSummary}
          />

          <main className="flex-1 p-4 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <Outlet
                context={{
                  data,
                  setData,
                  bulan,
                  setBulan,
                  tahun,
                  setTahun,
                  darkMode,
                  setDarkMode,
                  dashboardSummary,
                  summaryLoading,
                }}
              />
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}