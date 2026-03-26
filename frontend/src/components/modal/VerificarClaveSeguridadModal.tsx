import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useUsuario } from "../../hooks/usuarioHook";
import { useState } from "react";
import { Eye, EyeOff, Shield, AlertTriangle } from "lucide-react";

interface VerificarClaveSeguridadModalProps {
    open: boolean;
    onClose: () => void;
    onVerified: () => void;
}

export default function VerificarClaveSeguridadModal({ open, onClose, onVerified }: VerificarClaveSeguridadModalProps) {
    const { verificarClaveSeguridad, loadingVerificarClaveSeguridad } = useUsuario();
    const [showClave, setShowClave] = useState(false);
    const [intentosFallidos, setIntentosFallidos] = useState(0);

    const validationSchema = Yup.object({
        claveSeguridad: Yup.string()
            .required("La clave de seguridad es obligatoria")
            .matches(/^\d{6}$/, "La clave debe ser de 6 dígitos"),
    });

    const formik = useFormik({
        initialValues: {
            claveSeguridad: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const result = await verificarClaveSeguridad(values.claveSeguridad);
                if (result.data === true) {
                    toast.success("Clave verificada correctamente");
                    formik.resetForm();
                    setIntentosFallidos(0);
                    onVerified();
                    onClose();
                } else {
                    setIntentosFallidos(prev => prev + 1);
                    toast.error("Clave de seguridad incorrecta");
                    formik.setFieldValue('claveSeguridad', '');
                    
                    if (intentosFallidos >= 2) {
                        toast.error("Demasiados intentos fallidos. Por favor, inténtelo más tarde.");
                        setTimeout(() => {
                            onClose();
                            setIntentosFallidos(0);
                        }, 2000);
                    }
                }
            } catch (err) {
                setIntentosFallidos(prev => prev + 1);
                console.error('Error al verificar clave de seguridad', err);
                toast.error("Clave de seguridad incorrecta");
                formik.setFieldValue('claveSeguridad', '');
                
                if (intentosFallidos >= 2) {
                    toast.error("Demasiados intentos fallidos. Por favor, inténtelo más tarde.");
                    setTimeout(() => {
                        onClose();
                        setIntentosFallidos(0);
                    }, 2000);
                }
            }
        },
    });

    if (!open) return null;

    const isClaveComplete = formik.values.claveSeguridad.length === 6;
    const progressPercentage = isClaveComplete ? 100 : (formik.values.claveSeguridad.length / 6) * 100;

    return (
        <div className="fixed z-50 inset-0 flex justify-center items-center">
            <div className="absolute inset-0 bg-black opacity-70" onClick={onClose}></div>
            <div className="relative bg-linear-to-br from-gray-900 to-black border border-[#F0973C]/30 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                {/* Barra de progreso - Top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 rounded-t overflow-hidden">
                    <div
                        className="h-full transition-all duration-500"
                        style={{
                            width: `${progressPercentage}%`,
                            backgroundColor: progressPercentage === 100 ? "#69AC95" : "#F0973C",
                        }}
                    />
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <Shield className="text-[#F0973C]" size={28} />
                        <h2 className="text-2xl font-bold text-white">Verificar Clave de Seguridad</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white transition-colors"
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                            <p className="text-sm text-yellow-300">
                                🔐 Por favor, ingrese su clave de seguridad de 6 dígitos para autorizar este retiro de fondos.
                            </p>
                        </div>
                        
                        {intentosFallidos > 0 && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                                <AlertTriangle className="text-red-400" size={20} />
                                <p className="text-sm text-red-300">
                                    Intentos fallidos: {intentosFallidos}/3
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="claveSeguridad" className="block text-sm font-semibold text-gray-300 mb-2">
                            Clave de Seguridad
                        </label>
                        <div className="relative">
                            <input
                                id="claveSeguridad"
                                name="claveSeguridad"
                                type={showClave ? "text" : "password"}
                                maxLength={6}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.claveSeguridad}
                                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                                    formik.touched.claveSeguridad && formik.errors.claveSeguridad 
                                        ? "border-red-500 focus:ring-red-500" 
                                        : "border-gray-700 focus:ring-[#F0973C]"
                                }`}
                                placeholder="000000"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowClave(!showClave)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showClave ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {formik.touched.claveSeguridad && formik.errors.claveSeguridad && (
                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                <span>⚠️</span> {formik.errors.claveSeguridad}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-gray-300 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors font-semibold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loadingVerificarClaveSeguridad || !formik.isValid || intentosFallidos >= 3}
                            className="px-6 py-3 text-black bg-[#69AC95] rounded-xl hover:bg-[#5a9b84] disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all font-semibold"
                        >
                            {loadingVerificarClaveSeguridad ? "Verificando..." : "Verificar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
