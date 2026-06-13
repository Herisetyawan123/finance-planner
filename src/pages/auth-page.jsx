import { useState } from "react";
import { useAuthStore } from "../app/store/auth-store";
import { authService } from "../app/services/auth-service";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const loginStore = useAuthStore(
    (state) => state.login
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form with data:", {
            name,
            email,
            password,
            confirmPassword,
        });

        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                const response =
                    await authService.login(
                    email,
                    password
                    );
                loginStore(
                    response.user,
                    response.token
                );

                navigate("/");
            } else {
                await authService.register({
                    name,
                    email,
                    password,
                });
                console.log("Registration successful, now logging in...");

                alert(
                    "Registrasi berhasil. Silakan login."
                );

                setIsLogin(true);

                setName("");
                setPassword("");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

        console.log("Form submission completed");
        console.log(error ? "Error: " + error : "No errors");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

            <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
                {isLogin ? "Masuk" : "Daftar"}
            </h1>

            <p className="text-gray-500 mt-2">
                {isLogin
                ? "Masuk ke akun Anda"
                : "Buat akun baru"}
            </p>
            </div>

            <form className="space-y-4">

            {!isLogin && (
                <div>
                <label className="block text-sm font-medium mb-2">
                    Nama Lengkap
                </label>

                <input
                    type="text"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Masukkan nama lengkap"
                    value={name}
                    onChange={(e) =>
                    setName(e.target.value)
                    }
                />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-2">
                Email
                </label>

                <input
                type="email"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                Password
                </label>

                <input
                type="password"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
                />
            </div>

            {!isLogin && (
                <div>
                <label className="block text-sm font-medium mb-2">
                    Konfirmasi Password
                </label>

                <input
                    type="password"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Konfirmasi password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(e.target.value)
                    }
                />
                </div>
            )}

            <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition"
                onClick={handleSubmit}
                disabled={loading}
            >
                {isLogin ? "Masuk" : "Daftar"}
            </button>
            </form>

            <div className="mt-6 text-center text-sm">
            {isLogin ? (
                <>
                Belum punya akun?{" "}
                <button
                    onClick={() => setIsLogin(false)}
                    className="text-emerald-600 font-medium hover:underline"
                >
                    Daftar
                </button>
                </>
            ) : (
                <>
                Sudah punya akun?{" "}
                <button
                    onClick={() => setIsLogin(true)}
                    className="text-emerald-600 font-medium hover:underline"
                >
                    Masuk
                </button>
                </>
            )}
            </div>

        </div>
        </div>
    );
}