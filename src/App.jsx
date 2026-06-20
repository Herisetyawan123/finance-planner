import { createBrowserRouter, RouterProvider } from "react-router-dom";
import appRoutes from "./app/routes/app-routes";

const router = createBrowserRouter(appRoutes);

export default function App() {
  return <RouterProvider router={router} />;
}