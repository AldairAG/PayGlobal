import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useUsuario } from "../../hooks/usuarioHook";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface GuardarClaveSeguridadModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function GuardarClaveSeguridadModal({ open, onClose, onSuccess }: GuardarClaveSeguridadModalProps) {
    const { guardarClaveSeguridad, loadingGuardarClaveSeguridad } = useUsuario();
    const [showClave, setShowClave] = useState(false);

    const validationSchema = Yup.object({
        claveSeguridad: Yup.string()
            .required("La clave de seguridad es obligatoria")
            .matches(/^\d{6}$/, "La clave debe ser de 6 dígitos"),
        confirmarClave: Yup.string()
            .required("Debe confirmar la clave de seguridad")
            .oneOf([Yup.ref('claveSeguridad')], "Las claves no coinciden"),
    });

    const formik = useFormik({
        initialValues: {
            claveSeguridad: "",
            confirmarClave: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await guardarClaveSeguridad(values.claveSeguridad);
                toast.success("Clave de seguridad guardada correctamente");
                formik.resetForm();
                onClose();
                if (onSuccess) {
                    onSuccess();
                }
            } catch (err) {
                console.error('Error al guardar clave de seguridad', err);
                toast.error("No se pudo guardar la clave de seguridad");
            }
        },
    });

    if (!open) return null;

    const isClaveComplete = formik.values.claveSeguridad.length === 6;
    const isConfirmarComplete = formik.values.confirmarClave.length === 6;
    const totalFields = 2;
    const completedFields = (isClaveComplete ? 1 : 0) + (isConfirmarComplete ? 1 : 0);
    const progressPercentage = (completedFields / totalFields) * 100;

    return (
        <div className="fixed z-50 inset-0 flex justify-center items-center">
            <div className="absolute inset-0 bg-black opacity-70" onClick={onClose}></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-black border border-[#F0973C]/30 p-8 rounded-2xl shadow-2xl w-full max-w-md">
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
                        <Lock className="text-[#F0973C]" size={28} />
                        <h2 className="text-2xl font-bold text-white">Configurar Clave de Seguridad</h2>
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
                    <div className="space-y-2 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-sm text-blue-300">
                            ℹ️ La clave de seguridad es un código de 6 dígitos que se solicitará cada vez que realices un retiro de fondos.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="claveSeguridad" className="block text-sm font-semibold text-gray-300 mb-2">
                            Clave de Seguridad (6 dígitos)
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

                    <div>
                        <label htmlFor="confirmarClave" className="block text-sm font-semibold text-gray-300 mb-2">
                            Confirmar Clave
                        </label>
                        <input
                            id="confirmarClave"
                            name="confirmarClave"
                            type={showClave ? "text" : "password"}
                            maxLength={6}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmarClave}
                            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                                formik.touched.confirmarClave && formik.errors.confirmarClave 
                                    ? "border-red-500 focus:ring-red-500" 
                                    : "border-gray-700 focus:ring-[#F0973C]"
                            }`}
                            placeholder="000000"
                        />
                        {formik.touched.confirmarClave && formik.errors.confirmarClave && (
                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                <span>⚠️</span> {formik.errors.confirmarClave}
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
                            disabled={loadingGuardarClaveSeguridad || !formik.isValid}
                            className="px-6 py-3 text-black bg-[#69AC95] rounded-xl hover:bg-[#5a9b84] disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all font-semibold"
                        >
                            {loadingGuardarClaveSeguridad ? "Guardando..." : "Guardar Clave"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
