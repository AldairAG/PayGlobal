import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "react-toastify";
import { useUsuario } from "../../hooks/usuarioHook";
import Logo from "../../assets/Logo.png";


interface RegisterModalProps {
    open: boolean;
    onClose: () => void;
}

export default function RegisterModal({ open, onClose }: RegisterModalProps) {
    const { t } = useTranslation();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [referenced, setReferenced] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    const { registrar, loadingRegistro, errorRegistro } = useUsuario();

    if (!open) return null;

    const isUsernameComplete = username.trim().length > 0;
    const isEmailComplete = email.trim().length > 0;
    const isReferencedComplete = referenced.trim().length > 0;
    const isPasswordComplete = password.trim().length > 0;
    const isConfirmPasswordComplete = confirmPassword.trim().length > 0;
    const totalFields = 3;
    const completedFields =
        (isEmailComplete ? 1 : 0) + (isPasswordComplete ? 1 : 0) + (isConfirmPasswordComplete ? 1 : 0);
    const progressPercentage = (completedFields / totalFields) * 100;

    const handleRegister = async () => {
        setLocalError(null);

        // Validaciones básicas
        if (!username.trim() || !email.trim() || !password.trim()) {
            toast.error(t("landing.fill_all_fields") || "Por favor, completa todos los campos obligatorios.");
            return;
        }

        if (password !== confirmPassword) {
            const errorMsg = t("landing.passwords_mismatch") || "Las contraseñas no coinciden";
            setLocalError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        if (password.length < 6) {
            toast.error(t("landing.password_min_length") || "La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            await registrar({ username, password, email, referenciado: referenced });
            toast.success(t("landing.register_success") || "¡Registro exitoso! Ya puedes iniciar sesión.");
            onClose();
            // Limpiar campos
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setReferenced("");
        } catch (err) {
            console.error('Registro fallido', err);
            if (errorRegistro) {
                toast.error(errorRegistro);
            } else {
                toast.error(t("landing.register_error") || "No se pudo completar el registro. Inténtalo de nuevo.");
            }
        }
    };

    return (
        <div className="z-50 fixed inset-0 bg-black bg-opacity-15 flex justify-center items-center">
            <div className="relative bg-white p-6 rounded shadow w-80">
                {/* Barra de progreso - Top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t overflow-hidden">
                    <div
                        className="h-full transition-all duration-500"
                        style={{
                            width: `${progressPercentage}%`,
                            backgroundColor: progressPercentage === 100 ? "#69AC95" : "#F0973C",
                        }}
                    />
                </div>

                {/* Barra de progreso - Right */}
                <div className="absolute top-0 right-0 bottom-0 w-1 bg-gray-200 overflow-hidden">
                    <div
                        className="w-full transition-all duration-500"
                        style={{
                            height: `${progressPercentage}%`,
                            backgroundColor: progressPercentage === 100 ? "#69AC95" : "#F0973C",
                        }}
                    />
                </div>

                {/* Barra de progreso - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b overflow-hidden">
                    <div
                        className="h-full transition-all duration-500 ml-auto"
                        style={{
                            width: `${progressPercentage}%`,
                            backgroundColor: progressPercentage === 100 ? "#69AC95" : "#F0973C",
                        }}
                    />
                </div>

                {/* Barra de progreso - Left */}
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-gray-200 overflow-hidden">
                    <div
                        className="w-full transition-all duration-500 mt-auto"
                        style={{
                            height: `${progressPercentage}%`,
                            backgroundColor: progressPercentage === 100 ? "#69AC95" : "#F0973C",
                        }}
                    />
                </div>

                <div className="flex items-center justify-center m-0 p-0">
                    <img
                        src={Logo}
                        alt="PayGlobal Logo"
                        className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                    />
                </div>

                <h2 className="text-xl text-zinc-950 mb-6 font-bold text-center">{t("landing.register")}</h2>

                <div className="mb-4">
                    <div className="flex items-center">
                        <input
                            className="text-zinc-950 flex-1 p-2 border rounded outline-none focus:border-orange-500"
                            placeholder={t("landing.username")}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {isUsernameComplete && (
                            <span className="ml-2 text-2xl text-[#69AC95]">
                                ✓
                            </span>
                        )}
                    </div>
                </div>

                {/* Campo Email */}
                <div className="mb-4">
                    <div className="flex items-center">
                        <input
                            className="text-zinc-950 flex-1 p-2 border rounded outline-none focus:border-orange-500"
                            placeholder={t("landing.email")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {isEmailComplete && (
                            <span className="ml-2 text-2xl text-[#69AC95]">
                                ✓
                            </span>
                        )}
                    </div>
                </div>

                {/* Campo Referenciado */}
                <div className="mb-4">
                    <div className="flex items-center">
                        <input
                            className="text-zinc-950 flex-1 p-2 border rounded outline-none focus:border-orange-500"
                            placeholder={t("landing.referenced")}
                            value={referenced}
                            onChange={(e) => setReferenced(e.target.value)}
                        />
                        {isReferencedComplete && (
                            <span className="ml-2 text-2xl text-[#69AC95]">
                                ✓
                            </span>
                        )}
                    </div>
                </div>

                {/* Campo Password */}
                <div className="mb-4">
                    <div className="flex items-center">
                        <input
                            className="text-zinc-950 flex-1 p-2 border rounded outline-none focus:border-orange-500"
                            placeholder={t("landing.password")}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {isPasswordComplete && (
                            <span className="ml-2 text-2xl text-[#69AC95]">
                                ✓
                            </span>
                        )}
                    </div>
                </div>

                {/* Campo Confirm Password */}
                <div className="mb-6">
                    <div className="flex items-center">
                        <input
                            className="text-zinc-950 flex-1 p-2 border rounded outline-none focus:border-orange-500"
                            placeholder={t("landing.confirm_password")}
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {isConfirmPasswordComplete && (
                            <span className="ml-2 text-2xl text-[#69AC95]">
                                ✓
                            </span>
                        )}
                    </div>
                </div>

                {localError && <div className="text-sm text-red-600 mb-2">{localError}</div>}
                {errorRegistro && <div className="text-sm text-red-600 mb-2">{errorRegistro}</div>}

                <button
                    className="w-full text-white py-2 rounded mb-2 transition-colors bg-[#69AC95] hover:bg-[#5a9a82] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleRegister}
                    disabled={loadingRegistro}
                >
                    {loadingRegistro ? t("landing.registering") ?? "Registrando..." : t("landing.register")}
                </button>
                <button
                    className="w-full py-2 rounded transition-colors bg-[#E5E7EB] text-[#333] hover:bg-gray-300"
                    onClick={onClose}
                >
                    {t("landing.close")}
                </button>
            </div>
        </div>
    );
}