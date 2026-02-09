import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useUsuario } from "../../hooks/usuarioHook";

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    const { login, loadingLogin, errorLogin } = useUsuario();

    if (!open) return null;

    const isEmailComplete = email.trim().length > 0;
    const isPasswordComplete = password.trim().length > 0;
    const totalFields = 2;
    const completedFields = (isEmailComplete ? 1 : 0) + (isPasswordComplete ? 1 : 0);
    const progressPercentage = (completedFields / totalFields) * 100;

    const handleLogin = async () => {
        setLocalError(null);

        if (!email || !password) {
            setLocalError(t("landing.fill_fields") || "Complete los campos");
            return;
        }

        try {
            // el backend espera `username` en LoginRequestDTO; usamos el email como username aquí
            await login({ username: email, password });
            onClose();
        } catch (err) {
            console.error('Login fallido', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-15 flex justify-center items-center">
            <div className="relative bg-white p-6 rounded shadow w-80">
                {/* Barra de progreso - Top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t" style={{ overflow: "hidden" }}>
                    <div
                        className="h-full transition-all duration-500"
                        style={{
                            width: `${progressPercentage}%`,
                            backgroundColor: progressPercentage === 100 ? "#69AC95" : "#F0973C",
                        }}
                    />
                </div>

                {/* Barra de progreso - Right */}
                <div className="absolute top-0 right-0 bottom-0 w-1 bg-gray-200" style={{ overflow: "hidden" }}>
                    <div
                        className="w-full transition-all duration-500"
                        style={{
                            height: `${progressPercentage}%`,
                            backgroundColor: progressPercentage === 100 ? "#69AC95" : "#F0973C",
                        }}
                    />
                </div>

                {/* Barra de progreso - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b" style={{ overflow: "hidden" }}>
                    <div
                        className="h-full transition-all duration-500"
                        style={{
                            marginLeft: "auto",
                            width: `${progressPercentage}%`,
                            backgroundColor: progressPercentage === 100 ? "#69AC95" : "#F0973C",
                        }}
                    />
                </div>

                {/* Barra de progreso - Left */}
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-gray-200" style={{ overflow: "hidden" }}>
                    <div
                        className="w-full transition-all duration-500"
                        style={{
                            marginTop: "auto",
                            height: `${progressPercentage}%`,
                            backgroundColor: progressPercentage === 100 ? "#69AC95" : "#F0973C",
                        }}
                    />
                </div>

                <h2 className="text-xl mb-6 font-bold">{t("landing.login")}</h2>

                {/* Campo Email */}
                <div className="mb-4">
                    <div className="flex items-center">
                        <input
                            className="flex-1 p-2 border rounded outline-none focus:border-orange-500"
                            placeholder={t("landing.email")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {isEmailComplete && (
                            <span className="ml-2 text-2xl" style={{ color: "#69AC95" }}>
                                ✓
                            </span>
                        )}
                    </div>
                </div>

                {/* Campo Password */}
                <div className="mb-6">
                    <div className="flex items-center">
                        <input
                            className="flex-1 p-2 border rounded outline-none focus:border-orange-500"
                            placeholder={t("landing.password")}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {isPasswordComplete && (
                            <span className="ml-2 text-2xl" style={{ color: "#69AC95" }}>
                                ✓
                            </span>
                        )}
                    </div>
                </div>

                {localError && <div className="text-sm text-red-600 mb-2">{localError}</div>}
                {errorLogin && <div className="text-sm text-red-600 mb-2">{errorLogin}</div>}

                <button
                    className="w-full text-white py-2 rounded mb-2 transition-colors"
                    style={{ backgroundColor: "#F0973C" }}
                    onClick={handleLogin}
                    disabled={loadingLogin}
                >
                    {loadingLogin ? t("landing.logging_in") ?? "Iniciando..." : t("landing.login")}
                </button>
                <button
                    className="w-full py-2 rounded transition-colors"
                    style={{ backgroundColor: "#E5E7EB", color: "#333" }}
                    onClick={onClose}
                >
                    {t("landing.close")}
                </button>
            </div>
        </div>
    );
}