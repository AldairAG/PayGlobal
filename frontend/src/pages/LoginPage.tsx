import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LogIn, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useUsuario } from "../hooks/usuarioHook";
import { useState } from "react";
import LangSelector from "../components/LangSelector";
import LogoA from "../assets/LogoA.png";
import { ROUTES } from "../routes/routes";

export default function LoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login, loadingLogin, errorLogin } = useUsuario();
    const [showPassword, setShowPassword] = useState(false);

    const noSpacesError = t("landing.no_spaces_allowed") || "No se permiten espacios en este campo.";

    const validationSchema = Yup.object({
        username: Yup.string()
            .required(t("landing.fill_fields") || "Complete este campo")
            .matches(/^\S+$/, noSpacesError),
        password: Yup.string()
            .required(t("landing.fill_fields") || "Complete este campo")
            .min(6, t("landing.password_min_length") || "Mínimo 6 caracteres")
            .matches(/^\S+$/, noSpacesError),
    });

    const sanitizeNoSpaces = (value: string) => value.replace(/\s+/g, "");

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await login({ username: values.username, password: values.password });
                toast.success(t("landing.login_success") || "¡Inicio de sesión exitoso!");
                formik.resetForm();
            } catch (err) {
                console.error('Login fallido', err);
                if (errorLogin) {
                    toast.error(errorLogin);
                } else {
                    toast.error(t("landing.login_error") || "No se pudo iniciar sesión. Verifica tus credenciales.");
                }
            }
        },
    });

    const isUsernameComplete = formik.values.username.trim().length > 0;
    const isPasswordComplete = formik.values.password.trim().length > 0;
    const totalFields = 2;
    const completedFields = (isUsernameComplete ? 1 : 0) + (isPasswordComplete ? 1 : 0);
    const progressPercentage = (completedFields / totalFields) * 100;

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
                        linear-gradient(rgba(240,151,60,0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(240,151,60,0.06) 1px, transparent 1px);
                    background-size: 50px 50px;
                }
                .login-lang-selector select {
                    background: rgba(240, 151, 60, 0.1);
                    border: 1px solid rgba(240, 151, 60, 0.3);
                    color: #F0973C;
                    padding: 0.5rem 2rem 0.5rem 0.75rem;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23F0973C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 0.5rem center;
                    background-size: 1rem;
                }
                .login-lang-selector select:hover {
                    background: rgba(240, 151, 60, 0.15);
                    border-color: rgba(240, 151, 60, 0.5);
                    box-shadow: 0 0 0 3px rgba(240, 151, 60, 0.1);
                }
                .login-lang-selector select:focus {
                    outline: none;
                    background: rgba(240, 151, 60, 0.15);
                    border-color: #F0973C;
                    box-shadow: 0 0 0 3px rgba(240, 151, 60, 0.2);
                }
                .login-lang-selector select option {
                    background: #1a1a1a;
                    color: white;
                    padding: 0.5rem;
                }
            `}</style>

            {/* Background effects */}
            <div className="fixed inset-0 grid-bg pointer-events-none" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-200 h-125 rounded-full pointer-events-none pulse-glow bg-[radial-gradient(ellipse,rgba(240,151,60,0.08)_0%,transparent_70%)]" />

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

                <div className="login-lang-selector">
                    <LangSelector />
                </div>
            </nav>

            {/* LOGIN FORM */}
            <section className="relative z-10 px-6 py-20 max-w-md mx-auto">
                <div className="fade-up">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F0973C]/30 bg-[#F0973C]/10 mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#F0973C] pulse-glow" />
                            <span className="text-[#F0973C] text-xs font-semibold uppercase tracking-widest">{t("landing.welcome_back")}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black mb-3 font-['Playfair_Display']">
                            {t("landing.login")}
                        </h1>
                        <p className="text-white/50 text-sm">
                            {t("landing.enter_credentials")}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="relative bg-gradient-to-br from-white/5 to-white/2 rounded-2xl border border-white/10 p-8 backdrop-blur-sm delay-100 fade-up">
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

                        {/* Username */}
                        <div className="mb-6">
                            <label className="block text-white/70 text-sm font-semibold mb-2 flex items-center gap-2">
                                <User size={16} className="text-[#F0973C]" />
                                {t("landing.username")}
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 outline-none focus:border-[#F0973C] focus:ring-2 focus:ring-[#F0973C]/20 transition-all"
                                    placeholder={t("landing.username") || "Username"}
                                    name="username"
                                    value={formik.values.username}
                                    onChange={(e) => formik.setFieldValue("username", sanitizeNoSpaces(e.target.value))}
                                    onBlur={formik.handleBlur}
                                />
                                {isUsernameComplete && (
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#69AC95] text-xl">
                                        ✓
                                    </span>
                                )}
                            </div>
                            {formik.touched.username && formik.errors.username && (
                                <div className="text-sm text-red-400 mt-2">{formik.errors.username}</div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mb-6">
                            <label className="block text-white/70 text-sm font-semibold mb-2 flex items-center gap-2">
                                <Lock size={16} className="text-[#F0973C]" />
                                {t("landing.password")}
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 pr-20 text-white placeholder-white/30 outline-none focus:border-[#F0973C] focus:ring-2 focus:ring-[#F0973C]/20 transition-all"
                                    placeholder={t("landing.password")}
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formik.values.password}
                                    onChange={(e) => formik.setFieldValue("password", sanitizeNoSpaces(e.target.value))}
                                    onBlur={formik.handleBlur}
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
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-sm text-red-400 mt-2">{formik.errors.password}</div>
                            )}
                        </div>

                        {errorLogin && (
                            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {errorLogin}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            className="w-full group relative px-8 py-4 rounded-xl font-bold text-black text-sm uppercase tracking-wide overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#F0973C]/30 bg-linear-to-br from-[#F0973C] to-[#e8841f] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            onClick={() => {
                                if (Object.keys(formik.errors).length > 0) {
                                    toast.error(t("landing.fill_all_fields") || "Por favor, completa todos los campos correctamente.");
                                }
                                formik.handleSubmit();
                            }}
                            disabled={loadingLogin}
                            type="button"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <LogIn size={18} />
                                {loadingLogin ? t("landing.logging_in") ?? "Iniciando..." : t("landing.login")}
                            </span>
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                        </button>

                        {/* Forgot Password */}
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                className="text-sm text-[#F0973C] hover:text-[#e8841f] hover:underline transition-colors"
                                onClick={() => navigate(ROUTES.RECUPERAR_PASSWORD)}
                            >
                                {t("landing.forgot_password")}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-white/30 text-xs uppercase">{t("landing.or")}</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Register Link */}
                        <div className="text-center">
                            <p className="text-white/50 text-sm mb-3">
                                {t("landing.dont_have_account")}
                            </p>
                            <button
                                onClick={() => navigate(ROUTES.REGISTER)}
                                className="text-[#69AC95] hover:text-[#5a9a82] font-semibold text-sm hover:underline transition-colors"
                            >
                                {t("landing.create_account")} →
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
