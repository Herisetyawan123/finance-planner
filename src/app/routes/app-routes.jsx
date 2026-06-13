import { Routes, Route } from "react-router-dom";
import { navItems } from "../../constants/navigation";
import ProtectedRoute from "../middlewares/protected-route";
import DashboardLayout from "../../layouts/dashboard-layout";
import AuthPage from "../../pages/auth-page";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
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
      </Route>
      <Route path="/login" element={<AuthPage />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}