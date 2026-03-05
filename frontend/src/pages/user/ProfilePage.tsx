import { User, Mail, Phone, Globe, Calendar, Shield, Award, CreditCard, CheckCircle, AlertCircle, Wallet as WalletIcon, Coins } from "lucide-react";
import { useState, useEffect } from "react";
import { useUsuario } from "../../hooks/usuarioHook";
import { useTranslation } from 'react-i18next';
import { KycDocuments } from "../../components/KycDocuments";

export const ProfilePage = () => {
    const { t } = useTranslation();
    const { usuario, editarPerfil, loadingEditarPerfil, errorEditarPerfil } = useUsuario();
    
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
        pais: ""
    });
    
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Cargar datos del usuario cuando esté disponible
    useEffect(() => {
        if (usuario) {
            setFormData({
                nombre: usuario.nombre || "",
                apellido: usuario.apellido || "",
                telefono: usuario.telefono || "",
                pais: usuario.pais || ""
            });
        }
    }, [usuario]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar mensajes al editar
        if (successMessage) setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        
        try {
            await editarPerfil(formData);
            setSuccessMessage(t("profile.profile_updated_successfully"));
            // Limpiar mensaje después de 5 segundos
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (error) {
            console.error(t("profile.error_editing_profile") + ':', error);
        }
    };

    // Formatear fecha
    const formatearFecha = (fecha: Date | undefined) => {
        if (!fecha) return "N/A";
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white p-6 space-y-6">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#F0973C]">{t("profile.my_profile")}</h1>
                    <p className="text-white/40 mt-1 text-sm">{t("profile.manage_your_personal_information")}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna izquierda */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Tarjeta de Avatar */}
                    <div className="rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/5 p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 rounded-full flex items-center justify-center text-white mb-4 bg-[#69AC95]/20 border border-[#69AC95]/30">
                                <User size={64} className="text-[#69AC95]" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">
                                {usuario?.nombre && usuario?.apellido
                                    ? `${usuario.nombre} ${usuario.apellido}`
                                    : usuario?.username || "Usuario"}
                            </h2>
                            <p className="text-white/40 text-sm mt-1">@{usuario?.username || "usuario"}</p>

                            {/* Estado de verificación */}
                            <div className={`flex items-center gap-2 mt-4 px-4 py-2 rounded-full border ${
                                usuario?.verificado
                                    ? 'bg-[#69AC95]/10 border-[#69AC95]/30'
                                    : 'bg-[#F0973C]/10 border-[#F0973C]/30'
                            }`}>
                                <Shield size={16} className={usuario?.verificado ? "text-[#69AC95]" : "text-[#F0973C]"} />
                                <span className={`text-sm font-semibold ${
                                    usuario?.verificado ? "text-[#69AC95]" : "text-[#F0973C]"
                                }`}>
                                    {usuario?.verificado ? "Verificado" : "No Verificado"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de Rango */}
                    <div className="rounded-2xl border border-[#F0973C]/20 bg-[#F0973C]/5 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <Award size={24} className="text-[#F0973C]" />
                            <h3 className="text-lg font-bold text-white/80">{t("profile.current_rank")}</h3>
                        </div>
                        <p className="text-2xl font-bold text-[#69AC95]">
                            {usuario?.rango || t("profile.no_rank")}
                        </p>
                    </div>

                    {/* Tarjeta de Licencia */}
                    <div className="rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/5 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <CreditCard size={24} className="text-[#69AC95]" />
                            <h3 className="text-lg font-bold text-white/80">{t("profile.license")}</h3>
                        </div>
                        <p className="text-2xl font-bold text-[#F0973C]">
                            {usuario?.licencia?.nombre || t("profile.no_license")}
                        </p>
                        <p className="text-sm text-white/40 mt-1">
                            {t("profile.value")}: ${usuario?.licencia?.precio?.toFixed(2) || "0.00"} USDT
                        </p>
                        <div className="mt-3 pt-3 border-t border-white/5">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/40">{t("profile.status")}:</span>
                                <span className={`font-semibold ${usuario?.licencia?.activo ? "text-[#69AC95]" : "text-red-400"}`}>
                                    {usuario?.licencia?.activo ? t("profile.active") : t("profile.inactive")}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-white/40">{t("profile.accumulated")}:</span>
                                <span className="font-semibold text-white">
                                    ${usuario?.licencia?.saldoAcumulado?.toFixed(2) || "0.00"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna derecha */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Información Personal (Editable) */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                        <h3 className="text-xl font-bold text-white mb-6">{t("profile.personal_information")}</h3>

                        {successMessage && (
                            <div className="mb-4 p-4 bg-[#69AC95]/10 border border-[#69AC95]/30 rounded-xl flex items-center gap-3">
                                <CheckCircle size={20} className="text-[#69AC95]" />
                                <span className="text-sm font-medium text-[#69AC95]">{successMessage}</span>
                            </div>
                        )}

                        {errorEditarPerfil && (
                            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                                <AlertCircle size={20} className="text-red-400" />
                                <span className="text-sm font-medium text-red-400">{errorEditarPerfil}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                        {t("profile.name")}
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-[#69AC95]/50 focus:ring-1 focus:ring-[#69AC95]/20 transition-colors"
                                        placeholder={t("profile.enter_name")}
                                    />
                                </div>

                                {/* Apellido */}
                                <div>
                                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                        {t("profile.last_name")}
                                    </label>
                                    <input
                                        type="text"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-[#69AC95]/50 focus:ring-1 focus:ring-[#69AC95]/20 transition-colors"
                                        placeholder={t("profile.enter_last_name")}
                                    />
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                        <Phone size={14} />
                                        {t("profile.phone")}
                                    </label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-[#69AC95]/50 focus:ring-1 focus:ring-[#69AC95]/20 transition-colors"
                                        placeholder="+1234567890"
                                    />
                                </div>

                                {/* País */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                        <Globe size={14} />
                                        {t("profile.country")}
                                    </label>
                                    <input
                                        type="text"
                                        name="pais"
                                        value={formData.pais}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-[#69AC95]/50 focus:ring-1 focus:ring-[#69AC95]/20 transition-colors"
                                        placeholder={t("profile.enter_country")}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={loadingEditarPerfil}
                                    className="px-8 py-3 rounded-xl font-bold text-black bg-[#69AC95] hover:bg-[#5a9a84] transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#69AC95]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {loadingEditarPerfil ? t("profile.saving") : t("profile.save_changes")}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Información de Cuenta (No editable) */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                        <h3 className="text-xl font-bold text-white mb-6">{t("profile.account_information")}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* ID */}
                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                    {t("profile.user_id")}
                                </label>
                                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60">
                                    #{usuario?.id || "N/A"}
                                </div>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                    <User size={14} />
                                    {t("profile.username")}
                                </label>
                                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60">
                                    {usuario?.username || "N/A"}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                    <Mail size={14} />
                                    {t("profile.email")}
                                </label>
                                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60">
                                    {usuario?.email || "N/A"}
                                </div>
                            </div>

                            {/* Referenciado por */}
                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                    {t("profile.referred_by")}
                                </label>
                                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60">
                                    @{usuario?.referenciado || "N/A"}
                                </div>
                            </div>

                            {/* Fecha de Registro */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                    <Calendar size={14} />
                                    {t("profile.registration_date")}
                                </label>
                                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60">
                                    {formatearFecha(usuario?.fechaRegistro)}
                                </div>
                            </div>

                            {/* Estado de cuenta */}
                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                    {t("profile.account_status")}
                                </label>
                                <div className={`px-4 py-3 border rounded-xl ${
                                    usuario?.activo
                                        ? 'bg-[#69AC95]/10 border-[#69AC95]/30'
                                        : 'bg-red-500/10 border-red-500/30'
                                }`}>
                                    <span className={`font-semibold ${usuario?.activo ? 'text-[#69AC95]' : 'text-red-400'}`}>
                                        {usuario?.activo ? t("profile.active") : t("profile.inactive")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resumen de Wallets */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                        <h3 className="text-xl font-bold text-white mb-6">{t("profile.my_wallets")}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {usuario?.wallets && usuario.wallets.length > 0 ? (
                                usuario.wallets.map((wallet) => (
                                    <div
                                        key={wallet.id}
                                        className={`p-4 rounded-xl border ${
                                            wallet.codigo === 0
                                                ? 'border-[#69AC95]/20 bg-[#69AC95]/5'
                                                : 'border-[#F0973C]/20 bg-[#F0973C]/5'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                wallet.codigo === 0 ? 'bg-[#69AC95]/20' : 'bg-[#F0973C]/20'
                                            }`}>
                                                {wallet.codigo === 0 ? (
                                                    <WalletIcon size={16} className="text-[#69AC95]" />
                                                ) : (
                                                    <Coins size={16} className="text-[#F0973C]" />
                                                )}
                                            </div>
                                            <h4 className="font-bold text-white/80 text-sm">
                                                {wallet.codigo === 0 ? t("profile.dividends_wallet") : t("profile.commissions_wallet")}
                                            </h4>
                                        </div>
                                        <p className={`text-2xl font-bold ${wallet.codigo === 0 ? 'text-[#69AC95]' : 'text-[#F0973C]'}`}>
                                            $ {wallet.saldo?.toFixed(2) || "0.00"}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="col-span-2 text-center text-white/30 py-4">No hay wallets disponibles</p>
                            )}
                        </div>
                    </div>

                    {/* Resumen de Bonos */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                        <h3 className="text-xl font-bold text-white mb-6">{t("profile.my_bonuses")}</h3>

                        <div className="space-y-3">
                            {usuario?.bonos && usuario.bonos.length > 0 ? (
                                usuario.bonos.map((bono) => (
                                    <div key={bono.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
                                        <span className="text-sm font-semibold text-white/70">
                                            {bono.nombre}
                                        </span>
                                        <span className="text-lg font-bold text-[#69AC95]">
                                            ${bono.acumulado?.toFixed(2) || "0.00"}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-white/30 py-4">{t("profile.no_bonuses_available")}</p>
                            )}
                        </div>
                    </div>

                    {/* Documentos KYC */}
                    {usuario?.id && <KycDocuments usuarioId={usuario.id} />}
                </div>
            </div>
        </div>
    );
}