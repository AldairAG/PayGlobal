import { User, Mail, Phone, Globe, Calendar, Shield, Award, CreditCard, CheckCircle, AlertCircle, Wallet as WalletIcon, Coins, Copy, Check, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";

const COUNTRIES = [
    { code: "dz", name: "Argelia", flag: "https://flagcdn.com/w40/dz.png" },
    { code: "sa", name: "Arabia Saudita", flag: "https://flagcdn.com/w40/sa.png" },
    { code: "ar", name: "Argentina", flag: "https://flagcdn.com/w40/ar.png" },
    { code: "au", name: "Australia", flag: "https://flagcdn.com/w40/au.png" },
    { code: "be", name: "Bélgica", flag: "https://flagcdn.com/w40/be.png" },
    { code: "bo", name: "Bolivia", flag: "https://flagcdn.com/w40/bo.png" },
    { code: "br", name: "Brasil", flag: "https://flagcdn.com/w40/br.png" },
    { code: "ca", name: "Canadá", flag: "https://flagcdn.com/w40/ca.png" },
    { code: "cl", name: "Chile", flag: "https://flagcdn.com/w40/cl.png" },
    { code: "co", name: "Colombia", flag: "https://flagcdn.com/w40/co.png" },
    { code: "cr", name: "Costa Rica", flag: "https://flagcdn.com/w40/cr.png" },
    { code: "cu", name: "Cuba", flag: "https://flagcdn.com/w40/cu.png" },
    { code: "do", name: "República Dominicana", flag: "https://flagcdn.com/w40/do.png" },
    { code: "ec", name: "Ecuador", flag: "https://flagcdn.com/w40/ec.png" },
    { code: "eg", name: "Egipto", flag: "https://flagcdn.com/w40/eg.png" },
    { code: "sv", name: "El Salvador", flag: "https://flagcdn.com/w40/sv.png" },
    { code: "ae", name: "Emiratos Árabes Unidos", flag: "https://flagcdn.com/w40/ae.png" },
    { code: "es", name: "España", flag: "https://flagcdn.com/w40/es.png" },
    { code: "us", name: "Estados Unidos", flag: "https://flagcdn.com/w40/us.png" },
    { code: "fr", name: "Francia", flag: "https://flagcdn.com/w40/fr.png" },
    { code: "gt", name: "Guatemala", flag: "https://flagcdn.com/w40/gt.png" },
    { code: "hn", name: "Honduras", flag: "https://flagcdn.com/w40/hn.png" },
    { code: "iq", name: "Irak", flag: "https://flagcdn.com/w40/iq.png" },
    { code: "jo", name: "Jordania", flag: "https://flagcdn.com/w40/jo.png" },
    { code: "kw", name: "Kuwait", flag: "https://flagcdn.com/w40/kw.png" },
    { code: "lb", name: "Líbano", flag: "https://flagcdn.com/w40/lb.png" },
    { code: "ma", name: "Marruecos", flag: "https://flagcdn.com/w40/ma.png" },
    { code: "mx", name: "México", flag: "https://flagcdn.com/w40/mx.png" },
    { code: "ni", name: "Nicaragua", flag: "https://flagcdn.com/w40/ni.png" },
    { code: "pa", name: "Panamá", flag: "https://flagcdn.com/w40/pa.png" },
    { code: "py", name: "Paraguay", flag: "https://flagcdn.com/w40/py.png" },
    { code: "pe", name: "Perú", flag: "https://flagcdn.com/w40/pe.png" },
    { code: "pt", name: "Portugal", flag: "https://flagcdn.com/w40/pt.png" },
    { code: "gb", name: "Reino Unido", flag: "https://flagcdn.com/w40/gb.png" },
    { code: "ch", name: "Suiza", flag: "https://flagcdn.com/w40/ch.png" },
    { code: "tn", name: "Túnez", flag: "https://flagcdn.com/w40/tn.png" },
    { code: "uy", name: "Uruguay", flag: "https://flagcdn.com/w40/uy.png" },
    { code: "ve", name: "Venezuela", flag: "https://flagcdn.com/w40/ve.png" },
];
import { useUsuario } from "../../hooks/usuarioHook";
import { useTranslation } from 'react-i18next';
import { KycDocuments } from "../../components/KycDocuments";
import { ProfilePhoto } from "../../components/ProfilePhoto";
import { TipoWallets } from "../../type/enum";

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
    const [copied, setCopied] = useState(false);

    const inviteUrl = `https://payglobal.vip/${usuario?.username ?? ''}`;
    // const inviteUrl = `http://localhost:5173/${usuario?.username ?? ''}`;

    const handleCopyInvite = () => {
        navigator.clipboard.writeText(inviteUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

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
                            <ProfilePhoto fotoPerfil={usuario?.fotoPerfil} />
                            <h2 className="text-2xl font-bold text-white mt-4">
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

                    {/* Tarjeta de Enlace de Referido */}
                    <div className="rounded-2xl overflow-hidden border border-[#69AC95]/30 bg-linear-to-br from-[#69AC95]/10 via-black/0 to-[#F0973C]/10">
                        <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#69AC95] to-[#F0973C] flex items-center justify-center shadow-lg shadow-[#69AC95]/20">
                                <UserPlus size={22} className="text-black" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">{t('home.invite_members')}</p>
                                <p className="text-white/40 text-xs mt-0.5">{t('home.invite_share_text')}</p>
                            </div>
                        </div>

                        <div className="mx-4 mb-4 rounded-xl bg-black/40 border border-white/5 px-3 py-2 flex items-center gap-2">
                            <span className="flex-1 text-[10px] text-[#69AC95]/80 font-mono truncate">{inviteUrl}</span>
                            <button
                                onClick={handleCopyInvite}
                                className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    copied
                                        ? 'bg-[#69AC95] text-black'
                                        : 'bg-[#F0973C]/20 text-[#F0973C] hover:bg-[#F0973C]/30'
                                }`}
                            >
                                {copied ? <Check size={12} /> : <Copy size={12} />}
                                {copied ? t('home.copied') : t('home.copy_invite_link')}
                            </button>
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
                                    <div className="relative">
                                        <select
                                            name="pais"
                                            value={formData.pais}
                                            onChange={(e) => setFormData(prev => ({ ...prev, pais: e.target.value }))}
                                            className="w-full py-3 pr-8 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#69AC95]/50 focus:ring-1 focus:ring-[#69AC95]/20 transition-colors appearance-none cursor-pointer"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.05)', paddingLeft: formData.pais ? '2.5rem' : '1rem' }}
                                        >
                                            <option value="" style={{ backgroundColor: '#0d0d0d' }} className="text-white/40">{t("profile.select_country")}</option>
                                            {COUNTRIES.map(c => (
                                                <option key={c.code} value={c.name} style={{ backgroundColor: '#0d0d0d' }} className="text-white">
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                            <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                        {formData.pais && (
                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                <img
                                                    src={COUNTRIES.find(c => c.name === formData.pais)?.flag}
                                                    alt={formData.pais}
                                                    className="w-5 h-3.5 object-cover rounded-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
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
                                            wallet.tipo === TipoWallets.WALLET_DIVIDENDOS
                                                ? 'border-[#69AC95]/20 bg-[#69AC95]/5'
                                                : 'border-[#F0973C]/20 bg-[#F0973C]/5'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                wallet.tipo === TipoWallets.WALLET_DIVIDENDOS ? 'bg-[#69AC95]/20' : 'bg-[#F0973C]/20'
                                            }`}>
                                                {wallet.tipo === TipoWallets.WALLET_DIVIDENDOS ? (
                                                    <WalletIcon size={16} className="text-[#69AC95]" />
                                                ) : (
                                                    <Coins size={16} className="text-[#F0973C]" />
                                                )}
                                            </div>
                                            <h4 className="font-bold text-white/80 text-sm">
                                                {wallet.tipo === TipoWallets.WALLET_DIVIDENDOS ? t("profile.dividends_wallet") : t("profile.commissions_wallet")}
                                            </h4>
                                        </div>
                                        <p className={`text-2xl font-bold ${wallet.tipo === TipoWallets.WALLET_DIVIDENDOS ? 'text-[#69AC95]' : 'text-[#F0973C]'}`}>
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