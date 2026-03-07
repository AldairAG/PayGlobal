import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "react-toastify";
import { useUsuario } from "../../hooks/usuarioHook";
import Logo from "../../assets/Logo.png";

const countryCodes = [
    { code: "+1", country: "Estados Unidos / Canadá", flag: "🇺🇸" },
    { code: "+52", country: "México", flag: "🇲🇽" },
    { code: "+34", country: "España", flag: "🇪🇸" },
    { code: "+54", country: "Argentina", flag: "🇦🇷" },
    { code: "+55", country: "Brasil", flag: "🇧🇷" },
    { code: "+56", country: "Chile", flag: "🇨🇱" },
    { code: "+57", country: "Colombia", flag: "🇨🇴" },
    { code: "+51", country: "Perú", flag: "🇵🇪" },
    { code: "+58", country: "Venezuela", flag: "🇻🇪" },
    { code: "+593", country: "Ecuador", flag: "🇪🇨" },
    { code: "+591", country: "Bolivia", flag: "🇧🇴" },
    { code: "+595", country: "Paraguay", flag: "🇵🇾" },
    { code: "+598", country: "Uruguay", flag: "🇺🇾" },
    { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
    { code: "+507", country: "Panamá", flag: "🇵🇦" },
    { code: "+503", country: "El Salvador", flag: "🇸🇻" },
    { code: "+502", country: "Guatemala", flag: "🇬🇹" },
    { code: "+504", country: "Honduras", flag: "🇭🇳" },
    { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
    { code: "+53", country: "Cuba", flag: "🇨🇺" },
    { code: "+1-809", country: "República Dominicana", flag: "🇩🇴" },
    { code: "+509", country: "Haití", flag: "🇭🇹" },
    { code: "+44", country: "Reino Unido", flag: "🇬🇧" },
    { code: "+33", country: "Francia", flag: "🇫🇷" },
    { code: "+49", country: "Alemania", flag: "🇩🇪" },
    { code: "+39", country: "Italia", flag: "🇮🇹" },
    { code: "+351", country: "Portugal", flag: "🇵🇹" },
    { code: "+41", country: "Suiza", flag: "🇨🇭" },
    { code: "+31", country: "Países Bajos", flag: "🇳🇱" },
    { code: "+32", country: "Bélgica", flag: "🇧🇪" },
    { code: "+46", country: "Suecia", flag: "🇸🇪" },
    { code: "+47", country: "Noruega", flag: "🇳🇴" },
    { code: "+45", country: "Dinamarca", flag: "🇩🇰" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+81", country: "Japón", flag: "🇯🇵" },
    { code: "+82", country: "Corea del Sur", flag: "🇰🇷" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+64", country: "Nueva Zelanda", flag: "🇳🇿" },
];

interface RegisterModalProps {
    open: boolean;
    onClose: () => void;
    refCode?: string;
}

export default function RegisterModal({ open, onClose, refCode }: RegisterModalProps) {
    const { t } = useTranslation();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneCode, setPhoneCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [referenced, setReferenced] = useState(refCode ?? "");
    const [localError, setLocalError] = useState<string | null>(null);

    const { registrar, loadingRegistro, errorRegistro } = useUsuario();

    if (!open) return null;

    const isUsernameComplete = username.trim().length > 0;
    const isEmailComplete = email.trim().length > 0;
    const isPhoneCodeComplete = phoneCode.trim().length > 0;
    const isPhoneNumberComplete = phoneNumber.trim().length > 0;
    const isReferencedComplete = referenced.trim().length > 0;
    const isPasswordComplete = password.trim().length > 0;
    const isConfirmPasswordComplete = confirmPassword.trim().length > 0;
    const totalFields = 5;
    const completedFields =
        (isEmailComplete ? 1 : 0) + (isPhoneCodeComplete ? 1 : 0) + (isPhoneNumberComplete ? 1 : 0) + (isPasswordComplete ? 1 : 0) + (isConfirmPasswordComplete ? 1 : 0);
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
            await registrar({ username, password, email, referenciado: referenced,telefono: phoneCode + phoneNumber });
            toast.success(t("landing.register_success") || "¡Registro exitoso! Ya puedes iniciar sesión.");
            onClose();
            // Limpiar campos
            setUsername("");
            setEmail("");
            setPhoneCode("");
            setPhoneNumber("");
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
        <div className="z-50 fixed inset-0 bg-opacity-15 flex justify-center items-center">
            <div className="absolute inset-0 bg-black opacity-50"></div>
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

                {/* Campo Código de País y Teléfono */}
                <div className="mb-4">
                    <div className="flex items-center">
                        <select
                            className="text-zinc-950 p-2 border rounded outline-none focus:border-orange-500 cursor-pointer w-20 mr-2"
                            value={phoneCode}
                            onChange={(e) => setPhoneCode(e.target.value)}
                        >
                            <option value="">{t("landing.code") || "Lada"}</option>
                            {countryCodes.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.flag} {country.code}
                                </option>
                            ))}
                        </select>
                        <input
                            className="text-zinc-950 flex-1 p-2 border rounded outline-none focus:border-orange-500 w-20"
                            placeholder={t("landing.phone_number") || "Número de teléfono"}
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        {isPhoneCodeComplete && isPhoneNumberComplete && (
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
                            disabled={true} // Deshabilitar si viene un código de referencia prellenado
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