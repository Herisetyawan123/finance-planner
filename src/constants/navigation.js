import {
  LayoutDashboard,
  CalendarRange,
  CircleDollarSign,
  Receipt,
  ShoppingCart,
  PiggyBank,
  TrendingUp,
  Target,
  CalendarDays,
  FileText,
  Bot,
  Settings,
} from "lucide-react";
import DashboardPage from "../pages/dashboard-page";
import PengaturanPage from "../pages/setting-page";
import AIPage from "../pages/ai-page";
import LaporanPage from "../pages/report-page";
import KalenderPage from "../pages/calender-page";
import TargetPage from "../pages/target-page";
import InvestasiPage from "../pages/investment-page";
import TabunganPage from "../pages/savings-page";
import PengeluaranHarianPage from "../pages/daily-expense-page";
import PengeluaranWajibPage from "../pages/mandatory-expense-page";
import PerencanaanPage from "../pages/planner-page";

export const navItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    link: "/",
    page: DashboardPage
  },
  {
    id: "planning",
    icon: CalendarRange,
    label: "Perencanaan Bulanan",
    link: "/planning",
    page: PerencanaanPage
  },
  {
    id: "income",
    icon: CircleDollarSign,
    label: "Pemasukan",
    link: "/income",
    page: PerencanaanPage
  },
  {
    id: "wajib",
    icon: Receipt,
    label: "Pengeluaran Wajib",
    link: "/mandatory-expense",
    page: PengeluaranWajibPage
  },
  {
    id: "harian",
    icon: ShoppingCart,
    label: "Pengeluaran Harian",
    link: "/daily-expense",
    page: PengeluaranHarianPage
  },
  {
    id: "tabungan",
    icon: PiggyBank,
    label: "Tabungan",
    link: "/savings",
    page: TabunganPage,
  },
  {
    id: "investasi",
    icon: TrendingUp,
    label: "Investasi",
    link: "/investment",
    page: InvestasiPage
  },
  {
    id: "target",
    icon: Target,
    label: "Target Keuangan",
    link: "/target-finance",
    page: TargetPage,
  },
  {
    id: "kalender",
    icon: CalendarDays,
    label: "Kalender Keuangan",
    link: "/calender-finance",
    page: KalenderPage,
  },
  {
    id: "laporan",
    icon: FileText,
    label: "Laporan",
    link: "/reports",
    page: LaporanPage,
  },
  {
    id: "ai",
    icon: Bot,
    label: "Analisis AI",
    link: "/analysis-ai",
    page: AIPage,
  },
  {
    id: "settings",
    icon: Settings,
    label: "Pengaturan",
    link: "/settings",
    page: PengaturanPage
  },
];