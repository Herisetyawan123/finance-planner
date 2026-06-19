import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Swal from "sweetalert2";

import { useAuthStore } from "../app/store/auth-store";
import { authService } from "../app/services/auth-service";
import {
    loginSchema,
    registerSchema,
} from "../app/schemas/auth-schema";

export default function AuthPage() {
    const navigate = useNavigate();

    const loginStore = useAuthStore(
        (state) => state.login
    );
    const token = useAuthStore((state) => state.token);

    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        if (token) {
            navigate("/", { replace: true });
        }
    }, [token, navigate]);

    const loginForm = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const registerForm = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const form = isLogin
        ? loginForm
        : registerForm;

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (data) => {
        try {
            if (isLogin) {
                const response =
                    await authService.login(
                        data.email,
                        data.password
                    );

                console.log(response);

                if (!response?.token) {
                    throw new Error(
                        "Login gagal: token tidak diterima dari server"
                    );
                }

                loginStore(
                    response.user,
                    response.token
                );

                loginForm.reset();

                navigate("/", { replace: true });
            } else {
                await authService.register({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                });

                await Swal.fire({
                    icon: "success",
                    title: "Registrasi Berhasil",
                    text: "Silakan login menggunakan akun Anda.",
                    confirmButtonColor: "#10b981",
                });

                setIsLogin(true);

                loginForm.reset({
                    email: data.email,
                    password: "",
                });

                registerForm.reset();
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: isLogin
                    ? "Login Gagal"
                    : "Registrasi Gagal",

                text:
                    err.message ||
                    "Terjadi kesalahan",

                confirmButtonColor: "#10b981",
            });
        }
    };

    const onError = (errors) => {
        const firstError =
            Object.values(errors)[0];

        if (!firstError) return;

        Swal.fire({
            icon: "error",
            title: "Validasi Gagal",
            text: firstError.message,
            confirmButtonColor: "#10b981",
        });
    };

    const handleToggleMode = () => {
        loginForm.reset();
        registerForm.reset();

        setIsLogin((prev) => !prev);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isLogin
                            ? "Masuk"
                            : "Daftar"}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        {isLogin
                            ? "Masuk ke akun Anda"
                            : "Buat akun baru"}
                    </p>
                </div>

                <form
                    className="space-y-4"
                    onSubmit={handleSubmit(
                        onSubmit,
                        onError
                    )}
                >

                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Nama Lengkap
                            </label>

                            <input
                                type="text"
                                placeholder="Masukkan nama lengkap"
                                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                {...register("name")}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Masukkan email"
                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            {...register("email")}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Masukkan password"
                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            {...register("password")}
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Konfirmasi Password
                            </label>

                            <input
                                type="password"
                                placeholder="Konfirmasi password"
                                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                {...register(
                                    "confirmPassword"
                                )}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting
                            ? "Memproses..."
                            : isLogin
                            ? "Masuk"
                            : "Daftar"}
                    </button>

                </form>

                <div className="mt-6 text-center text-sm">
                    {isLogin ? (
                        <>
                            Belum punya akun?{" "}

                            <button
                                type="button"
                                onClick={
                                    handleToggleMode
                                }
                                className="text-emerald-600 font-medium hover:underline"
                            >
                                Daftar
                            </button>
                        </>
                    ) : (
                        <>
                            Sudah punya akun?{" "}

                            <button
                                type="button"
                                onClick={
                                    handleToggleMode
                                }
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