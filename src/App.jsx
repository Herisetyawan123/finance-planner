import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./app/routes/app-routes";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}