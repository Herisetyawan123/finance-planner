import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";
import { authService } from "../services/auth-service";

export default function ProtectedRoute() {
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);
    const hasHydrated = useAuthStore.persist.hasHydrated();
    const [isChecking, setIsChecking] = useState(true);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        let active = true;

        if (!hasHydrated) {
            return;
        }

        if (!token) {
            setIsChecking(false);
            setIsValid(false);
            return;
        }

        authService
            .checkToken(token)
            .then(() => {
                if (active) {
                    setIsValid(true);
                }
            })
            .catch(() => {
                if (active) {
                    logout();
                    setIsValid(false);
                }
            })
            .finally(() => {
                if (active) {
                    setIsChecking(false);
                }
            });

        return () => {
            active = false;
        };
    }, [hasHydrated, token, logout]);

    if (!hasHydrated || isChecking) {
        return <div>Loading...</div>;
    }

    return token && isValid ? <Outlet /> : <Navigate to="/login" replace />;
}