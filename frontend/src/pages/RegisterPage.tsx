import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { UserPlus, Mail, Phone, Lock, User, ArrowLeft, Users, Eye, EyeOff } from "lucide-react";
import { useUsuario } from "../hooks/usuarioHook";
import LangSelector from "../components/LangSelector";
import LogoA from "../assets/LogoA.png";
import { ROUTES } from "../routes/routes";

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

export default function RegisterPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { ref } = useParams();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneCode, setPhoneCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [referenced, setReferenced] = useState(ref ?? "");
    const [localError, setLocalError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { registrar, loadingRegistro, errorRegistro } = useUsuario();

    const sanitizeNoSpaces = (value: string) => value.replace(/\s+/g, "");
    const containsSpaces = (value: string) => /\s/.test(value);

    const isUsernameComplete = username.trim().length > 0;
    const isEmailComplete = email.trim().length > 0;
    const isPhoneCodeComplete = phoneCode.trim().length > 0;
    const isPhoneNumberComplete = phoneNumber.trim().length > 0;
    const isReferencedComplete = referenced.trim().length > 0;
    const isPasswordComplete = password.trim().length > 0;
    const isConfirmPasswordComplete = confirmPassword.trim().length > 0;
    const totalFields = 6;
    const completedFields =
        (isUsernameComplete ? 1 : 0) +
        (isEmailComplete ? 1 : 0) +
        (isPhoneCodeComplete && isPhoneNumberComplete ? 1 : 0) +
        (isReferencedComplete ? 1 : 0) +
        (isPasswordComplete ? 1 : 0) +
        (isConfirmPasswordComplete ? 1 : 0);
    const progressPercentage = (completedFields / totalFields) * 100;

    const handleRegister = async () => {
        setLocalError(null);

        if (!username.trim() || !email.trim() || !password.trim()) {
            toast.error(t("landing.fill_all_fields") || "Por favor, completa todos los campos obligatorios.");
            return;
        }

        if (
            containsSpaces(username) ||
            containsSpaces(email) ||
            containsSpaces(phoneNumber) ||
            containsSpaces(referenced) ||
            containsSpaces(password) ||
            containsSpaces(confirmPassword)
        ) {
            const noSpacesError = t("landing.no_spaces_allowed") || "No se permiten espacios en los campos.";
            setLocalError(noSpacesError);
            toast.error(noSpacesError);
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
            await registrar({
                username,
                password,
                email,
                referenciado: referenced,
                telefono: phoneCode + phoneNumber,
            });
            toast.success(t("landing.register_success") || "¡Registro exitoso! Ya puedes iniciar sesión.");
            
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
        <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden relative font-['DM_Sans']">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
                .fade-up { animation: fadeInUp 0.8s ease forwards; }
                .delay-100 { animation-delay: 0.1s; opacity: 0; }
                .delay-200 { animation-delay: 0.2s; opacity: 0; }
                .delay-300 { animation-delay: 0.3s; opacity: 0; }
                .grid-bg {
                    background-image:
                        linear-gradient(rgba(105,172,149,0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(105,172,149,0.06) 1px, transparent 1px);
                    background-size: 50px 50px;
                }
                .register-lang-selector select {
                    background: rgba(105, 172, 149, 0.1);
                    border: 1px solid rgba(105, 172, 149, 0.3);
                    color: #69AC95;
                    padding: 0.5rem 2rem 0.5rem 0.75rem;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2369AC95' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 0.5rem center;
                    background-size: 1rem;
                }
                .register-lang-selector select:hover {
                    background: rgba(105, 172, 149, 0.15);
                    border-color: rgba(105, 172, 149, 0.5);
                    box-shadow: 0 0 0 3px rgba(105, 172, 149, 0.1);
                }
                .register-lang-selector select:focus {
                    outline: none;
                    background: rgba(105, 172, 149, 0.15);
                    border-color: #69AC95;
                    box-shadow: 0 0 0 3px rgba(105, 172, 149, 0.2);
                }
                .register-lang-selector select option {
                    background: #1a1a1a;
                    color: white;
                    padding: 0.5rem;
                }
            `}</style>

            {/* Background effects */}
            <div className="fixed inset-0 grid-bg pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-200 h-125 rounded-full pointer-events-none pulse-glow bg-[radial-gradient(ellipse,rgba(105,172,149,0.08)_0%,transparent_70%)]" />

            {/* NAV */}
            <nav className="relative z-40 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5 backdrop-blur-md bg-black/40">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(ROUTES.LANDING)}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-semibold">{t("landing.back")}</span>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <img src={LogoA} alt="PayGlobal Logo" className="h-8" />
                </div>

                <div className="register-lang-selector">
                    <LangSelector />
                </div>
            </nav>

            {/* REGISTER FORM */}
            <section className="relative z-10 px-6 py-20 max-w-2xl mx-auto">
                <div className="fade-up">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#69AC95]/30 bg-[#69AC95]/10 mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#69AC95] pulse-glow" />
                            <span className="text-[#69AC95] text-xs font-semibold uppercase tracking-widest">{t("landing.join_us")}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black mb-3 font-['Playfair_Display']">
                            {t("landing.register")}
                        </h1>
                        <p className="text-white/50 text-sm">
                            {t("landing.create_account_desc")}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="relative bg-linear-to-br from-white/5 to-white/2 rounded-2xl border border-white/10 p-8 backdrop-blur-sm delay-100 fade-up">
                        {/* Progress Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 rounded-t-2xl overflow-hidden">
                            <div
                                className="h-full transition-all duration-500"
                                style={{
                                    width: `${progressPercentage}%`,
                                    backgroundColor: progressPercentage === 100 ? "#69AC95" : "#F0973C",
                                }}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Username */}
                            <div>
                                <label className="text-white/70 text-sm font-semibold mb-2 flex items-center gap-2">
                                    <User size={16} className="text-[#69AC95]" />
                                    {t("landing.username")}
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 outline-none focus:border-[#69AC95] focus:ring-2 focus:ring-[#69AC95]/20 transition-all"
                                        placeholder={t("landing.username")}
                                        value={username}
                                        onChange={(e) => setUsername(sanitizeNoSpaces(e.target.value))}
                                    />
                                    {isUsernameComplete && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#69AC95] text-xl">
                                            ✓
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-white/70 text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Mail size={16} className="text-[#69AC95]" />
                                    {t("landing.email")}
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 outline-none focus:border-[#69AC95] focus:ring-2 focus:ring-[#69AC95]/20 transition-all"
                                        placeholder={t("landing.email")}
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(sanitizeNoSpaces(e.target.value))}
                                    />
                                    {isEmailComplete && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#69AC95] text-xl">
                                            ✓
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="mt-6">
                            <label className="text-white/70 text-sm font-semibold mb-2 flex items-center gap-2">
                                <Phone size={16} className="text-[#69AC95]" />
                                {t("landing.phone")}
                            </label>
                            <div className="flex gap-2">
                                <div className="relative w-32">
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-3 text-white outline-none focus:border-[#69AC95] focus:ring-2 focus:ring-[#69AC95]/20 transition-all appearance-none cursor-pointer"
                                        value={phoneCode}
                                        onChange={(e) => setPhoneCode(e.target.value)}
                                    >
                                        <option value="" className="bg-[#1a1a1a]">{t("landing.code") || "Código"}</option>
                                        {countryCodes.map((country) => (
                                            <option key={country.code} value={country.code} className="bg-[#1a1a1a]">
                                                {country.flag} {country.code}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 outline-none focus:border-[#69AC95] focus:ring-2 focus:ring-[#69AC95]/20 transition-all"
                                        placeholder={t("landing.phone_number") || "Número de teléfono"}
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(sanitizeNoSpaces(e.target.value))}
                                    />
                                    {isPhoneCodeComplete && isPhoneNumberComplete && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#69AC95] text-xl">
                                            ✓
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Referenced */}
                        <div className="mt-6">
                            <label className="text-white/70 text-sm font-semibold mb-2 flex items-center gap-2">
                                <Users size={16} className="text-[#69AC95]" />
                                {t("landing.referenced")}
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 outline-none focus:border-[#69AC95] focus:ring-2 focus:ring-[#69AC95]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder={t("landing.referenced")}
                                    value={referenced}
                                    onChange={(e) => setReferenced(sanitizeNoSpaces(e.target.value))}
                                    disabled={!!ref}
                                />
                                {isReferencedComplete && (
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#69AC95] text-xl">
                                        ✓
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            {/* Password */}
                            <div>
                                <label className="text-white/70 text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Lock size={16} className="text-[#69AC95]" />
                                    {t("landing.password")}
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 pr-20 text-white placeholder-white/30 outline-none focus:border-[#69AC95] focus:ring-2 focus:ring-[#69AC95]/20 transition-all"
                                        placeholder={t("landing.password")}
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(sanitizeNoSpaces(e.target.value))}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    {isPasswordComplete && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#69AC95] text-xl">
                                            ✓
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="text-white/70 text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Lock size={16} className="text-[#69AC95]" />
                                    {t("landing.confirm_password")}
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 pr-20 text-white placeholder-white/30 outline-none focus:border-[#69AC95] focus:ring-2 focus:ring-[#69AC95]/20 transition-all"
                                        placeholder={t("landing.confirm_password")}
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(sanitizeNoSpaces(e.target.value))}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    {isConfirmPasswordComplete && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#69AC95] text-xl">
                                            ✓
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {(localError || errorRegistro) && (
                            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {localError || errorRegistro}
                            </div>
                        )}

                        {/* Register Button */}
                        <button
                            className="w-full mt-8 group relative px-8 py-4 rounded-xl font-bold text-black text-sm uppercase tracking-wide overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#69AC95]/30 bg-linear-to-br from-[#69AC95] to-[#5a9a82] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            onClick={handleRegister}
                            disabled={loadingRegistro}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <UserPlus size={18} />
                                {loadingRegistro ? t("landing.registering") ?? "Registrando..." : t("landing.register")}
                            </span>
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                        </button>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-white/30 text-xs uppercase">{t("landing.or")}</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-white/50 text-sm mb-3">
                                {t("landing.already_have_account")}
                            </p>
                            <button
                                onClick={() => navigate(ROUTES.LOGIN)}
                                className="text-[#F0973C] hover:text-[#e8841f] font-semibold text-sm hover:underline transition-colors"
                            >
                                {t("landing.login")} →
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
