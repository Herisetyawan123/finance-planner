import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/dashboard-layout";
import DashboardPage from "../pages/dashboard-page";
import PengeluaranWajibPage from "../pages/mandatory-expense-page";
import PerencanaanPage from "../pages/planner-page";
import { navItems } from "../constants/navigation";

export default function AppRoutes() {
  return (
    <Routes>

      <Route element={<DashboardLayout />}>
        {
          navItems.map((item) => {
            const Element = item.page;
            return (
              <Route
                key={item.id}
                path={item.link}
                element={<Element />}
              />
            );
          })
        }
      </Route>
    </Routes>
  );
}