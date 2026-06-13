import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

export default function ProtectedRoute() {
    const token = useAuthStore((state) => state.token);
    const hasHydrated = useAuthStore.persist.hasHydrated();

    if (!hasHydrated) {
        console.log("Auth store is still hydrating...");
        return <div>Loading...</div>;
    }
    console.log("Auth store has hydrated. Token:", token);
    return token
        ? <Outlet />
        : <Navigate to="/login" replace />;
}