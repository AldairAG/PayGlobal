import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import LangSelector from "../../components/LangSelector";
import LogoA from "../../assets/LogoA.png";
import LogoV from "../../assets/LogoV.png";
import { ROUTES } from "../../routes/routes";

const RecuperarPassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const steps = [
        { number: 1, title: t("recovery.step_email"), icon: Mail },
        { number: 2, title: t("recovery.step_code"), icon: KeyRound },
        { number: 3, title: t("recovery.step_password"), icon: Lock },
    ];

    // Step 1: Email form
    const emailFormik = useFormik({
        initialValues: { email: "" },
        validationSchema: Yup.object({
            email: Yup.string()
                .email(t("recovery.invalid_email") || "Correo inválido")
                .required(t("recovery.fill_fields") || "Complete este campo"),
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                // TODO: Llamar al servicio para enviar código al email
                setEmail(values.email);
                toast.success(t("recovery.code_sent") || "Código enviado a tu correo");
                setCurrentStep(2);
            } catch (_err) {
                toast.error(t("recovery.send_error") || "Error al enviar el código");
            } finally {
                setIsLoading(false);
            }
        },
    });

    // Step 2: Code verification form
    const codeFormik = useFormik({
        initialValues: { code: "" },
        validationSchema: Yup.object({
            code: Yup.string()
                .required(t("recovery.fill_fields") || "Complete este campo")
                .min(6, t("recovery.code_min_length") || "El código debe tener 6 caracteres")
                .max(6, t("recovery.code_max_length") || "El código debe tener 6 caracteres"),
        }),
        onSubmit: async (_values) => {
            setIsLoading(true);
            try {
                // TODO: Llamar al servicio para verificar código
                toast.success(t("recovery.code_verified") || "Código verificado");
                setCurrentStep(3);
            } catch (_err) {
                toast.error(t("recovery.invalid_code") || "Código inválido");
            } finally {
                setIsLoading(false);
            }
        },
    });

    // Step 3: New password form
    const passwordFormik = useFormik({
        initialValues: { password: "", confirmPassword: "" },
        validationSchema: Yup.object({
            password: Yup.string()
                .required(t("recovery.fill_fields") || "Complete este campo")
                .min(6, t("landing.password_min_length") || "Mínimo 6 caracteres"),
            confirmPassword: Yup.string()
                .required(t("recovery.fill_fields") || "Complete este campo")
                .oneOf([Yup.ref("password")], t("landing.passwords_mismatch") || "Las contraseñas no coinciden"),
        }),
        onSubmit: async (_values) => {
            setIsLoading(true);
            try {
                // TODO: Llamar al servicio para cambiar contraseña
                toast.success(t("recovery.password_changed") || "Contraseña actualizada exitosamente");
                navigate(ROUTES.LANDING);
            } catch (_err) {
                toast.error(t("recovery.change_error") || "Error al cambiar la contraseña");
            } finally {
                setIsLoading(false);
            }
        },
    });

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <form onSubmit={emailFormik.handleSubmit} className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F0973C]/20 flex items-center justify-center">
                                <Mail size={32} className="text-[#F0973C]" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">{t("recovery.enter_email")}</h2>
                            <p className="text-white/60 text-sm">{t("recovery.email_description")}</p>
                        </div>

                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder={t("landing.email") || "Correo electrónico"}
                                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#F0973C] transition-colors"
                                value={emailFormik.values.email}
                                onChange={emailFormik.handleChange}
                                onBlur={emailFormik.handleBlur}
                            />
                            {emailFormik.touched.email && emailFormik.errors.email && (
                                <p className="text-[#BC2020] text-sm mt-2">{emailFormik.errors.email}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl font-bold text-black transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#F0973C]/20 bg-linear-to-br from-[#F0973C] to-[#e8841f] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? t("recovery.sending") : t("recovery.send_code")}
                        </button>
                    </form>
                );

            case 2:
                return (
                    <form onSubmit={codeFormik.handleSubmit} className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#69AC95]/20 flex items-center justify-center">
                                <KeyRound size={32} className="text-[#69AC95]" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">{t("recovery.enter_code")}</h2>
                            <p className="text-white/60 text-sm">
                                {t("recovery.code_description")} <span className="text-[#F0973C]">{email}</span>
                            </p>
                        </div>

                        <div>
                            <input
                                type="text"
                                name="code"
                                placeholder={t("recovery.code_placeholder") || "Código de 6 dígitos"}
                                maxLength={6}
                                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#69AC95] transition-colors text-center text-2xl tracking-[0.5em] font-mono"
                                value={codeFormik.values.code}
                                onChange={codeFormik.handleChange}
                                onBlur={codeFormik.handleBlur}
                            />
                            {codeFormik.touched.code && codeFormik.errors.code && (
                                <p className="text-[#BC2020] text-sm mt-2">{codeFormik.errors.code}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl font-bold text-black transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#69AC95]/20 bg-linear-to-br from-[#69AC95] to-[#5a9a84] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? t("recovery.verifying") : t("recovery.verify_code")}
                        </button>

                        <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="w-full py-3 rounded-xl font-semibold text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            {t("recovery.back")}
                        </button>
                    </form>
                );

            case 3:
                return (
                    <form onSubmit={passwordFormik.handleSubmit} className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F0973C]/20 flex items-center justify-center">
                                <Lock size={32} className="text-[#F0973C]" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">{t("recovery.new_password")}</h2>
                            <p className="text-white/60 text-sm">{t("recovery.password_description")}</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder={t("landing.password") || "Nueva contraseña"}
                                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#F0973C] transition-colors"
                                    value={passwordFormik.values.password}
                                    onChange={passwordFormik.handleChange}
                                    onBlur={passwordFormik.handleBlur}
                                />
                                {passwordFormik.touched.password && passwordFormik.errors.password && (
                                    <p className="text-[#BC2020] text-sm mt-2">{passwordFormik.errors.password}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder={t("landing.confirm_password") || "Confirmar contraseña"}
                                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#F0973C] transition-colors"
                                    value={passwordFormik.values.confirmPassword}
                                    onChange={passwordFormik.handleChange}
                                    onBlur={passwordFormik.handleBlur}
                                />
                                {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                                    <p className="text-[#BC2020] text-sm mt-2">{passwordFormik.errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl font-bold text-black transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#F0973C]/20 bg-linear-to-br from-[#F0973C] to-[#e8841f] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? t("recovery.changing") : t("recovery.change_password")}
                        </button>

                        <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="w-full py-3 rounded-xl font-semibold text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            {t("recovery.back")}
                        </button>
                    </form>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white flex flex-col font-['DM_Sans']">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

                .grid-bg {
                    background-image:
                        linear-gradient(rgba(240,151,60,0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(240,151,60,0.06) 1px, transparent 1px);
                    background-size: 50px 50px;
                }
                .landing-lang-selector select {
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
                .landing-lang-selector select:hover {
                    background: rgba(240, 151, 60, 0.15);
                    border-color: rgba(240, 151, 60, 0.5);
                    box-shadow: 0 0 0 3px rgba(240, 151, 60, 0.1);
                }
                .landing-lang-selector select:focus {
                    outline: none;
                    background: rgba(240, 151, 60, 0.15);
                    border-color: #F0973C;
                    box-shadow: 0 0 0 3px rgba(240, 151, 60, 0.2);
                }
                .landing-lang-selector select option {
                    background: #1a1a1a;
                    color: white;
                    padding: 0.5rem;
                }
            `}</style>

            {/* Background effects */}
            <div className="fixed inset-0 grid-bg pointer-events-none" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-200 h-125 rounded-full pointer-events-none bg-[radial-gradient(ellipse,rgba(240,151,60,0.08)_0%,transparent_70%)]" />
            <div className="fixed bottom-0 left-0 w-100 h-100 rounded-full pointer-events-none bg-[radial-gradient(ellipse,rgba(105,172,149,0.05)_0%,transparent_70%)]" />

            {/* Header */}
            <nav className="relative z-40 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5 backdrop-blur-md bg-black/40">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(ROUTES.LANDING)}>
                    <img src={LogoA} alt="PayGlobal Logo" className="h-8" />
                </div>
                <div className="landing-lang-selector">
                    <LangSelector />
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
                <div className="w-full max-w-md">
                    {/* Stepper */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between relative">
                            {/* Progress line background */}
                            <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/10" />
                            {/* Progress line active */}
                            <div
                                className="absolute top-6 left-0 h-0.5 bg-linear-to-r from-[#F0973C] to-[#69AC95] transition-all duration-500"
                                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                            />

                            {steps.map((step) => {
                                const Icon = step.icon;
                                const isActive = currentStep === step.number;
                                const isCompleted = currentStep > step.number;

                                return (
                                    <div key={step.number} className="flex flex-col items-center relative z-10">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                isCompleted
                                                    ? "bg-[#69AC95] text-white"
                                                    : isActive
                                                    ? "bg-[#F0973C] text-black"
                                                    : "bg-white/10 text-white/40"
                                            }`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle size={24} />
                                            ) : (
                                                <Icon size={20} />
                                            )}
                                        </div>
                                        <span
                                            className={`mt-3 text-xs font-semibold transition-colors ${
                                                isActive ? "text-[#F0973C]" : isCompleted ? "text-[#69AC95]" : "text-white/40"
                                            }`}
                                        >
                                            {step.title}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                        {renderStepContent()}
                    </div>

                    {/* Back to login link */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate(ROUTES.LANDING)}
                            className="text-sm text-white/60 hover:text-[#F0973C] transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            <ArrowLeft size={16} />
                            {t("recovery.back_to_login")}
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 px-6 md:px-12 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <img src={LogoV} alt="PAYGLOBAL Logo" className="h-5" />
                </div>
                <p className="text-white/20 text-xs text-center">
                    {t("landing.2025_PAYGLOBAL")}
                </p>
                <div className="flex gap-4 text-white/30 text-xs">
                    <a href="#" className="hover:text-white/60 transition-colors">{t("landing.terms")}</a>
                    <a href="#" className="hover:text-white/60 transition-colors">{t("landing.privacy")}</a>
                    <a href="#" className="hover:text-white/60 transition-colors">{t("landing.contact")}</a>
                </div>
            </footer>
        </div>
    );
};

export default RecuperarPassword;
