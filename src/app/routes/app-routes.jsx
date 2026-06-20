import { navItems } from "../../constants/navigation";
import ProtectedRoute from "../middlewares/protected-route";
import DashboardLayout from "../../layouts/dashboard-layout";
import AuthPage from "../../pages/auth-page";

const dashboardChildren = navItems.map((item) => {
  const Element = item.page;
  return {
    path: item.link,
    element: <Element />,
    id: item.id,
  };
});

const appRoutes = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: dashboardChildren,
      },
    ],
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "*",
    element: <div>Page Not Found</div>,
  },
];

export default appRoutes;