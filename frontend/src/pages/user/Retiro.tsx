/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Wallet, Plus, ArrowDownToLine, Filter, ChevronLeft, ChevronRight, Calendar, CheckCircle, Clock, XCircle, AlertCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import type { SolicitudRetiro } from "../../type/entityTypes";
import { TipoCrypto, EstadoOperacion, TipoWallets, TipoSolicitud } from "../../type/enum";
import { useWalletAddress } from "../../hooks/useWalletAddress";
import type { CreateWalletAddress } from "../../type/requestTypes";
import { useUsuario } from "../../hooks/usuarioHook";
import { useTranslation } from 'react-i18next';


export const RetiroPage = () => {
    const { t } = useTranslation();

    const { usuario, solicitarRetiro, loadingSolicitarRetiroFondos, errorSolicitarRetiroFondos } = useUsuario();

    const {
        getMyWalletAddresses,
        walletAddresses,
        loadingMyWallets,
        errorMyWallets,
        createWalletAddress,
        loadingCreate,
        errorCreate,
        deleteWalletAddress,
        //loadingDelete,
        //errorDelete,
        updateWalletAddress,
        loadingUpdate,
        errorUpdate
    } = useWalletAddress();

    // Estado para solicitudes de retiro
    // Estados de UI
    const [solicitarRetiroHard] = useState<SolicitudRetiro[]>([]);
    const [showWalletForm, setShowWalletForm] = useState<string | null>(null);
    const [selectedWallet, setSelectedWallet] = useState<number | null>(null);
    const [estadoFiltro, setEstadoFiltro] = useState<string>("");
    const [paginaActual, setPaginaActual] = useState(1);
    const solicitudesPorPagina = 5;

    useEffect(() => {
        getMyWalletAddresses();
    }, []);

    // Validación para nueva wallet
    const walletValidationSchema = Yup.object({
        address: Yup.string()
            .required(t("withdrawal.address_required"))
            .min(26, t("withdrawal.invalid")),
        tipoCrypto: Yup.string()
            .required(t("withdrawal.crypto_required")),
        nombre: Yup.string()
            .required(t("withdrawal.wallet_name_required"))
            .min(3, t("withdrawal.wallet_name_min"))
    });

    // Formik para nueva wallet
    const walletFormik = useFormik({
        initialValues: {
            address: "",
            tipoCrypto: TipoCrypto.USDT_ERC20,
            nombre: ""
        },
        validationSchema: walletValidationSchema,
        onSubmit: (values, { resetForm }) => {
            const nuevaWallet: CreateWalletAddress = {
                address: values.address,
                tipoCrypto: values.tipoCrypto as TipoCrypto,
                nombre: values.nombre
            };

            if (showWalletForm === "crear") {

                createWalletAddress(nuevaWallet).then(() => {
                    resetForm();
                    setShowWalletForm(null);
                    toast.success(t("withdrawal.wallet_created_successfully"));
                }).catch(() => {
                    toast.error(t("withdrawal.error_creating_wallet") + (errorCreate || t("withdrawal.error_unknown")));
                });
            } else if (showWalletForm === "update" && selectedWallet) {
                updateWalletAddress(selectedWallet || 0, nuevaWallet).then(() => {
                    resetForm();
                    setShowWalletForm(null);
                    toast.success(t("withdrawal.wallet_updated_successfully"));
                }).catch(() => {
                    toast.error(t("withdrawal.error_updating_wallet") + (errorUpdate || t("withdrawal.error_unknown")));
                });
            }
        }
    });

    // Validación para retiro
    const retiroValidationSchema = Yup.object({
        walletId: Yup.number()
            .required(t("withdrawal.select_a_wallet"))
            .min(1, t("withdrawal.select_a_wallet")),
        monto: Yup.number()
            .required(t("withdrawal.amount_required"))
            .min(1, t("withdrawal.amount_min"))
    });

    // Formik para retiro
    const retiroFormik = useFormik({
        initialValues: {
            walletId: 0,
            monto: 0,
            addresId: 0
        },
        validationSchema: retiroValidationSchema,
        onSubmit: (values, { resetForm }) => {
            const walletAddress = walletAddresses.find(w => w.id === Number(values.addresId));
            if (!walletAddress) return;

            const wallet = usuario?.wallets.find(w => w.id === Number(retiroFormik.values.walletId));
            const walletTipo=wallet?.tipo == TipoWallets.WALLET_DIVIDENDOS ? TipoSolicitud.SOLICITUD_RETIRO_WALLET_DIVIDENDOS : TipoSolicitud.SOLICITUD_RETIRO_WALLET_COMISIONES;

            solicitarRetiro(values.addresId, values.monto, walletTipo).then(() => {
            resetForm();
            toast.success(t("withdrawal.withdrawal_request_sent"));
            }).catch(() => {
                toast.error(t("withdrawal.error_requesting_withdrawal") + (errorSolicitarRetiroFondos || t("withdrawal.error_unknown")));
            })

    }});

    // Filtrar solicitudes por fecha
    const solicitudesFiltradas = solicitarRetiroHard.filter((sol) => {
        if (estadoFiltro && sol.estado !== estadoFiltro) return false;
        return true;
    });

    // Paginación
    const indexUltimaSolicitud = paginaActual * solicitudesPorPagina;
    const indexPrimeraSolicitud = indexUltimaSolicitud - solicitudesPorPagina;
    const solicitudesPaginadas = solicitudesFiltradas.slice(indexPrimeraSolicitud, indexUltimaSolicitud);
    const totalPaginas = Math.ceil(solicitudesFiltradas.length / solicitudesPorPagina);

    // Obtener icono y color según estado
    const getEstadoInfo = (estado: EstadoOperacion) => {
        switch (estado) {
            case EstadoOperacion.PENDIENTE:
                return { icon: Clock, color: "#F0973C", text: "Pendiente" };
            case EstadoOperacion.COMPLETADA:
                return { icon: CheckCircle, color: "#69AC95", text: "Completada" };
            case EstadoOperacion.RECHAZADA:
                return { icon: XCircle, color: "#BC2020", text: "Rechazada" };
            case EstadoOperacion.APROBADA:
                return { icon: CheckCircle, color: "#69AC95", text: "Aprobada" };
            default:
                return { icon: AlertCircle, color: "#000000", text: "Desconocido" };
        }
    };

    // Obtener símbolo de crypto
    const getCryptoSymbol = (tipo: TipoCrypto): string => {
        switch (tipo) {
            case TipoCrypto.USDT_BEP20:
                return "USDT (BEP-20)";
            case TipoCrypto.USDT_ERC20:
                return "USDT (ERC-20)";
            case TipoCrypto.USDT_TRC20:
                return "USDT (TRC-20)";
            case TipoCrypto.SOLANA:
                return "SOL";
            default:
                return "CRYPTO";
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#000000] text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-[#F0973C]">
                        {t("withdrawal.withdrawal_management")}
                    </h1>
                    <p className="text-white/40">
                        {t("withdrawal.manage_your_wallets_and_withdrawal_requests")}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Sección: Mis Wallets */}
                    <div className="rounded-2xl border border-[#F0973C]/20 bg-[#F0973C]/5 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                <Wallet size={24} className="text-[#F0973C]" />
                                {t("withdrawal.my_wallets")}
                            </h2>
                            <button
                                onClick={() => setShowWalletForm("crear")}
                                className="p-2 rounded-lg transition-all hover:scale-105 bg-[#F0973C]"
                                title={t("withdrawal.new_wallet")}
                            >
                                <Plus size={20} className="text-white" />
                            </button>
                        </div>

                        {/* Formulario Nueva Wallet */}
                        {showWalletForm === "crear" ? (
                            <div className="mb-6 p-4 rounded-xl border border-[#F0973C]/30 bg-[#F0973C]/10">
                                <h3 className="font-semibold mb-4 text-white">Nueva Wallet</h3>
                                <form onSubmit={walletFormik.handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                            {t("withdrawal.wallet_name")}
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={walletFormik.values.nombre}
                                            onChange={walletFormik.handleChange}
                                            onBlur={walletFormik.handleBlur}
                                            className={`w-full px-4 py-2 bg-white/5 border rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 ${walletFormik.touched.nombre && walletFormik.errors.nombre ? "border-red-500" : "border-white/10 focus:border-[#F0973C]/50"}`}
                                            placeholder={t("withdrawal.main_wallet")}
                                        />
                                        {walletFormik.touched.nombre && walletFormik.errors.nombre && (
                                            <p className="text-xs mt-1 text-red-400">
                                                {walletFormik.errors.nombre}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                            {t("withdrawal.crypto_type")}
                                        </label>
                                        <select
                                            name="tipoCrypto"
                                            value={walletFormik.values.tipoCrypto}
                                            onChange={walletFormik.handleChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F0973C]/50"
                                        >
                                            <option value={TipoCrypto.USDT_ERC20} className="bg-[#111]">USDT (ERC-20)</option>
                                            <option value={TipoCrypto.USDT_TRC20} className="bg-[#111]">USDT (TRC-20)</option>
                                            <option value={TipoCrypto.USDT_BEP20} className="bg-[#111]">USDT (BEP-20)</option>
                                            <option value={TipoCrypto.SOLANA} className="bg-[#111]">Solana</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                            {t("withdrawal.wallet_address")}
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={walletFormik.values.address}
                                            onChange={walletFormik.handleChange}
                                            onBlur={walletFormik.handleBlur}
                                            className={`w-full px-4 py-2 bg-white/5 border rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 font-mono text-sm ${walletFormik.touched.address && walletFormik.errors.address ? "border-red-500" : "border-white/10 focus:border-[#F0973C]/50"}`}
                                            placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                                        />
                                        {walletFormik.touched.address && walletFormik.errors.address && (
                                            <p className="text-xs mt-1 text-red-400">
                                                {walletFormik.errors.address}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            disabled={loadingCreate}
                                            type="submit"
                                            className="flex-1 py-2 rounded-xl font-semibold transition-all hover:scale-105 bg-[#69AC95] hover:bg-[#5a9a84] text-black"
                                        >
                                            {t("withdrawal.create_wallet")}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowWalletForm(null);
                                                walletFormik.resetForm();
                                            }}
                                            className="flex-1 py-2 rounded-xl font-semibold border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all"
                                        >
                                            {t("withdrawal.cancel")}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : showWalletForm == "update" && (
                            <div className="mb-6 p-4 rounded-xl border border-[#F0973C]/30 bg-[#F0973C]/10">
                                <h3 className="font-semibold mb-4 text-white">{t("withdrawal.update_wallet")}</h3>
                                <form onSubmit={walletFormik.handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                            {t("withdrawal.wallet_name")}
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={walletFormik.values.nombre}
                                            onChange={walletFormik.handleChange}
                                            onBlur={walletFormik.handleBlur}
                                            className={`w-full px-4 py-2 bg-white/5 border rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 ${walletFormik.touched.nombre && walletFormik.errors.nombre ? "border-red-500" : "border-white/10 focus:border-[#F0973C]/50"}`}
                                            placeholder={t("withdrawal.main_wallet")}
                                        />
                                        {walletFormik.touched.nombre && walletFormik.errors.nombre && (
                                            <p className="text-xs mt-1 text-red-400">
                                                {walletFormik.errors.nombre}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                            {t("withdrawal.crypto_type")}
                                        </label>
                                        <select
                                            name="tipoCrypto"
                                            value={walletFormik.values.tipoCrypto}
                                            onChange={walletFormik.handleChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F0973C]/50"
                                        >
                                            <option value={TipoCrypto.USDT_ERC20} className="bg-[#111]">USDT (ERC-20)</option>
                                            <option value={TipoCrypto.USDT_TRC20} className="bg-[#111]">USDT (TRC-20)</option>
                                            <option value={TipoCrypto.USDT_BEP20} className="bg-[#111]">USDT (BEP-20)</option>
                                            <option value={TipoCrypto.SOLANA} className="bg-[#111]">Solana</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                            {t("withdrawal.wallet_address")}
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={walletFormik.values.address}
                                            onChange={walletFormik.handleChange}
                                            onBlur={walletFormik.handleBlur}
                                            className={`w-full px-4 py-2 bg-white/5 border rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 font-mono text-sm ${walletFormik.touched.address && walletFormik.errors.address ? "border-red-500" : "border-white/10 focus:border-[#F0973C]/50"}`}
                                            placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                                        />
                                        {walletFormik.touched.address && walletFormik.errors.address && (
                                            <p className="text-xs mt-1 text-red-400">
                                                {walletFormik.errors.address}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            disabled={loadingUpdate}
                                            type="submit"
                                            className="flex-1 py-2 rounded-xl font-semibold transition-all hover:scale-105 bg-[#69AC95] hover:bg-[#5a9a84] text-black"
                                        >
                                            {t("withdrawal.update_wallet")}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowWalletForm(null);
                                                walletFormik.resetForm();
                                            }}
                                            className="flex-1 py-2 rounded-xl font-semibold border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all"
                                        >
                                            {t("withdrawal.cancel")}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Lista de Wallets */}
                        <div className="space-y-3 max-h-100 overflow-y-auto">
                            {loadingMyWallets ? (
                                <p className="text-center text-white/40">{t("withdrawal.loading_wallets")}</p>
                            ) : errorMyWallets ? (
                                <p className="text-center text-red-400">{t("withdrawal.error_loading_wallets")}</p>
                            ) : walletAddresses.length === 0 ? (
                                <p className="text-center text-white/40">{t("withdrawal.no_wallets_found")}</p>
                            ) : (walletAddresses.map((wallet) => (
                                <div
                                    key={wallet.id}
                                    className="p-4 rounded-xl border border-[#F0973C]/20 bg-[#F0973C]/5 transition-all hover:border-[#F0973C]/40"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold text-white">{wallet.nombre}</h3>
                                            <p className="text-xs text-[#F0973C]">
                                                {getCryptoSymbol(wallet.tipoCrypto)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#69AC95]/20 border border-[#69AC95]/30 text-[#69AC95]">
                                                ${wallet.balanceRetirado.toFixed(2)}
                                            </span>
                                            <button
                                                title={t("withdrawal.edit_wallet")}
                                                className="p-2 rounded-lg transition-all hover:scale-105 bg-[#69AC95]/10 border border-[#69AC95]/30 text-[#69AC95] hover:bg-[#69AC95]/20"
                                                onClick={() => {
                                                    setSelectedWallet(wallet.id);
                                                    walletFormik.setValues({
                                                        nombre: wallet.nombre,
                                                        tipoCrypto: wallet.tipoCrypto,
                                                        address: wallet.address,
                                                    });
                                                    setShowWalletForm("update");
                                                }}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                title={t("withdrawal.delete_wallet")}
                                                className="p-2 rounded-lg transition-all hover:scale-105 bg-red-500 text-white"
                                                onClick={() => deleteWalletAddress(wallet.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs font-mono text-white/40 break-all">
                                        {wallet.address}
                                    </p>
                                </div>
                            )))}
                        </div>
                    </div>

                    {/* Sección: Solicitar Retiro */}
                    <div className="rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/5 p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                            <ArrowDownToLine size={24} className="text-[#69AC95]" />
                            {t("withdrawal.request_withdrawal")}
                        </h2>

                        <form onSubmit={retiroFormik.handleSubmit} className="space-y-6">

                            {/* Selector 2 */}
                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                    {t("withdrawal.**select_the_wallet_address_for_deposit ***")}
                                </label>
                                <select
                                    name="walletId"
                                    value={retiroFormik.values.walletId}
                                    onChange={(e) => {
                                        retiroFormik.handleChange(e);
                                    }}
                                    onBlur={retiroFormik.handleBlur}
                                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none ${retiroFormik.touched.walletId && retiroFormik.errors.walletId ? "border-red-500" : "border-white/10 focus:border-[#F0973C]/50"}`}
                                >
                                    <option value={0} className="bg-[#111]">{t("withdrawal.select_a_wallet")}</option>
                                    {usuario?.wallets.map((wallet) => (
                                        <option key={wallet.id} value={wallet.id} className="bg-[#111]">
                                            {wallet.tipo} - ${wallet.saldo.toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                                {retiroFormik.touched.walletId && retiroFormik.errors.walletId && (
                                    <p className="text-xs mt-1 text-red-400">
                                        {retiroFormik.errors.walletId}
                                    </p>
                                )}
                            </div>
                            {/* PROBLEMA CON LA TRADUCCION AQUI */}   
                            {/* Información de la wallet seleccionada 2 */}
                            {retiroFormik.values.walletId > 0 && (
                                <div className="p-4 rounded-xl bg-[#69AC95]/10 border border-[#69AC95]/30">
                                    {(() => {
                                        const wallet = usuario?.wallets.find(w => w.id === Number(retiroFormik.values.walletId));
                                        return wallet ? (
                                            <>
                                                <p className="text-sm font-semibold mb-2 text-white">{t("withdrawal.selected_wallet:")}</p>
                                                <p className="text-xs font-mono text-white/50 break-all mb-2">{wallet.tipo}</p>
                                                <p className="text-sm">
                                                    {t("withdrawal.withdrawn_balance:")} <span className="font-bold text-[#69AC95]">
                                                        ${wallet.saldo.toFixed(2)}
                                                    </span>
                                                </p>
                                            </>
                                        ) : null;
                                    })()}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                    {t("withdrawal.**select_wallet ***")}
                                </label>
                                <select
                                    name="addresId"
                                    value={retiroFormik.values.addresId}
                                    onChange={(e) => {
                                        retiroFormik.handleChange(e);
                                        setSelectedWallet(Number(e.target.value));
                                    }}
                                    onBlur={retiroFormik.handleBlur}
                                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none ${retiroFormik.touched.addresId && retiroFormik.errors.addresId ? "border-red-500" : "border-white/10 focus:border-[#F0973C]/50"}`}
                                >
                                    <option value={0} className="bg-[#111]">{t("withdrawal.select_a_wallet")}</option>
                                    {walletAddresses.map((wallet) => (
                                        <option key={wallet.id} value={wallet.id} className="bg-[#111]">
                                            {wallet.nombre} - {getCryptoSymbol(wallet.tipoCrypto)}
                                        </option>
                                    ))}
                                </select>
                                {retiroFormik.touched.addresId && retiroFormik.errors.addresId && (
                                    <p className="text-xs mt-1 text-red-400">
                                        {retiroFormik.errors.addresId}
                                    </p>
                                )}
                            </div>
                            {/* Información de la wallet seleccionada */}
                            {retiroFormik && retiroFormik.values.addresId > 0 && (
                                <div className="p-4 rounded-xl bg-[#69AC95]/10 border border-[#69AC95]/30">
                                    {(() => {
                                        const wallet = walletAddresses.find(w => w.id === selectedWallet);
                                        return wallet ? (
                                            <>
                                                <p className="text-sm font-semibold mb-2 text-white">{t("withdrawal.selected_wallet:")}</p>
                                                <p className="text-xs font-mono text-white/50 break-all mb-2">{wallet.address}</p>
                                                <p className="text-sm">
                                                    {t("withdrawal.withdrawn_balance:")} <span className="font-bold text-[#69AC95]">
                                                        ${wallet.balanceRetirado.toFixed(2)}
                                                    </span>
                                                </p>
                                            </>
                                        ) : null;
                                    })()}
                                </div>
                            )}

                            

                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                    {t("withdrawal.**amount_to_withdraw ***")}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 font-bold">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        name="monto"
                                        value={retiroFormik.values.monto || ""}
                                        onChange={retiroFormik.handleChange}
                                        onBlur={retiroFormik.handleBlur}
                                        className={`w-full pl-8 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/20 focus:outline-none ${retiroFormik.touched.monto && retiroFormik.errors.monto ? "border-red-500" : "border-white/10 focus:border-[#F0973C]/50"}`}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                                {retiroFormik.touched.monto && retiroFormik.errors.monto && (
                                    <p className="text-xs mt-1 text-red-400">
                                        {retiroFormik.errors.monto}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={ loadingSolicitarRetiroFondos}
                                className="w-full py-3 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-[#69AC95] hover:bg-[#5a9a84] text-black"
                            >
                                {t("withdrawal.request_withdrawal")}
                            </button>
                        </form>

                        {/* ERROR AL TRADUCIR */}     
                        {/* Información adicional */}
                        <div className="mt-6 p-4 rounded-xl bg-[#F0973C]/10 border border-[#F0973C]/30">
                            <h3 className="font-semibold text-sm mb-2 text-[#F0973C]">
                                ℹ️ {t("withdrawal.important_information")}
                            </h3>
                            <ul className="text-xs text-white/50 space-y-1">
                                <li>• {t("withdrawal.requests_processed_within_24_48_hours")}</li>
                                <li>• {t("withdrawal.minimum_withdrawal_amount:")} $10 USD</li>
                                <li>• {t("withdrawal.network_fees_will_apply")}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Historial de Solicitudes */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                            <Calendar size={24} className="text-[#F0973C]" />
                            {t("withdrawal.request_history")}
                        </h2>

                        {/* Filtro por estado */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter size={20} className="text-[#F0973C]" />

                            <select
                                value={estadoFiltro}
                                onChange={(e) => {
                                    setEstadoFiltro(e.target.value);
                                    setPaginaActual(1);
                                }}
                                className="px-3 py-2 bg-white/5 border border-[#F0973C]/30 rounded-xl text-white text-sm focus:outline-none focus:border-[#F0973C]/60"
                            >
                                <option value="" className="bg-[#111]">{t("withdrawal.all_statuses")}</option>
                                <option value={EstadoOperacion.PENDIENTE} className="bg-[#111]">{t("withdrawal.pending")}</option>
                                <option value={EstadoOperacion.COMPLETADA} className="bg-[#111]">{t("withdrawal.completed")}</option>
                                <option value={EstadoOperacion.RECHAZADA} className="bg-[#111]">{t("withdrawal.rejected")}</option>
                            </select>

                            {estadoFiltro && (
                                <button
                                    onClick={() => {
                                        setEstadoFiltro("");
                                        setPaginaActual(1);
                                    }}
                                    className="px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 bg-red-600 text-white"
                                >
                                    {t("withdrawal.clear")}
                                </button>
                            )}
                        </div>

                    </div>

                    {/* Tabla de solicitudes */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">{t("withdrawal.id")}</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">{t("withdrawal.wallet")}</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">{t("withdrawal.crypto")}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-white/50 uppercase tracking-wider">{t("withdrawal.amount")}</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">{t("withdrawal.date")}</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-white/50 uppercase tracking-wider">{t("withdrawal.status")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudesPaginadas.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-white/30">
                                            {t("withdrawal.no_requests_to_display")}
                                        </td>
                                    </tr>
                                ) : (
                                    solicitudesPaginadas.map((solicitud) => {
                                        const estadoInfo = getEstadoInfo(solicitud.estado);
                                        const IconoEstado = estadoInfo.icon;
                                        return (
                                            <tr key={solicitud.walletId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-4 text-sm font-semibold text-white">#{solicitud.walletId}</td>
                                                <td className="px-4 py-4 text-xs font-mono text-white/50 max-w-50 truncate">
                                                    {solicitud.walletAddress}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <span className="px-2 py-1 rounded text-xs font-semibold bg-[#F0973C] text-white">
                                                        {getCryptoSymbol(solicitud.tipoCrypto)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-right text-sm font-bold text-[#69AC95]">
                                                    ${solicitud.monto.toFixed(2)}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-white/50">
                                                    {solicitud.fecha.toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <IconoEstado size={16} style={{ color: estadoInfo.color }} />
                                                        <span className="text-sm font-semibold" style={{ color: estadoInfo.color }}>
                                                            {estadoInfo.text}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {totalPaginas > 1 && (
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                            <p className="text-sm text-white/40">
                                {t("withdrawal.Showing")} {indexPrimeraSolicitud + 1} - {Math.min(indexUltimaSolicitud, solicitudesFiltradas.length)} {t("withdrawal.of")} {solicitudesFiltradas.length} {t("withdrawal.requests")}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    title={t("withdrawal.previous_page")}
                                    onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                    disabled={paginaActual === 1}
                                    className="p-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-[#F0973C] text-black hover:bg-[#F0973C]/80"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                                        <button
                                            key={pagina}
                                            onClick={() => setPaginaActual(pagina)}
                                            className={`px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 ${paginaActual === pagina ? "bg-[#F0973C] text-black" : "bg-white/10 text-white/60"}`}
                                        >
                                            {pagina}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    title={t("withdrawal.next_page")}
                                    onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                    disabled={paginaActual === totalPaginas}
                                    className="p-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-[#F0973C] text-black hover:bg-[#F0973C]/80"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}