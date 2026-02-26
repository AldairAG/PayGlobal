import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useUsuario } from "../../hooks/usuarioHook";
import Logo from "../../assets/Logo.png";


interface LoginModalProps {
    open: boolean;
    onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
    const { t } = useTranslation();
    const { login, loadingLogin, errorLogin } = useUsuario();

    const validationSchema = Yup.object({
        username: Yup.string()
            .required(t("landing.fill_fields") || "Complete este campo"),
        password: Yup.string()
            .required(t("landing.fill_fields") || "Complete este campo")
            .min(6, t("landing.password_min_length") || "Mínimo 6 caracteres"),
    });

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
                onClose();
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

    if (!open) return null;

    const isUsernameComplete = formik.values.username.trim().length > 0;
    const isPasswordComplete = formik.values.password.trim().length > 0;
    const totalFields = 2;
    const completedFields = (isUsernameComplete ? 1 : 0) + (isPasswordComplete ? 1 : 0);
    const progressPercentage = (completedFields / totalFields) * 100;

    return (
        <div className="fixed z-50 inset-0 bg-opacity-15 flex justify-center items-center">
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

                <h2 className="text-xl text-zinc-950 mb-6 font-bold text-center">{t("landing.login")}</h2>

                {/* Campo Username */}
                <div className="mb-4">
                    <div className="flex items-center">
                        <input
                            className="text-zinc-950 flex-1 p-2 border rounded outline-none focus:border-orange-500"
                            placeholder={t("landing.username") || "Username"}
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {isUsernameComplete && (
                            <span className="ml-2 text-2xl text-[#69AC95]">
                                ✓
                            </span>
                        )}
                    </div>
                    {formik.touched.username && formik.errors.username && (
                        <div className="text-sm text-red-600 mt-1">{formik.errors.username}</div>
                    )}
                </div>

                {/* Campo Password */}
                <div className="mb-6">
                    <div className="flex items-center">
                        <input
                            className="text-zinc-950 flex-1 p-2 border rounded outline-none focus:border-orange-500"
                            placeholder={t("landing.password")}
                            type="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {isPasswordComplete && (
                            <span className="ml-2 text-2xl text-[#69AC95]">
                                ✓
                            </span>
                        )}
                    </div>
                    {formik.touched.password && formik.errors.password && (
                        <div className="text-sm text-red-600 mt-1">{formik.errors.password}</div>
                    )}
                </div>

                {errorLogin && <div className="text-sm text-red-600 mb-2">{errorLogin}</div>}

                <button
                    className="w-full text-white py-2 rounded mb-2 transition-colors bg-[#F0973C] hover:bg-[#d9863a] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                        if (Object.keys(formik.errors).length > 0) {
                            toast.error(t("landing.fill_all_fields") || "Por favor, completa todos los campos correctamente.");
                        }
                        formik.handleSubmit();
                    }}
                    disabled={loadingLogin}
                    type="button"
                >
                    {loadingLogin ? t("landing.logging_in") ?? "Iniciando..." : t("landing.login")}
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