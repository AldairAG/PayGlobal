/* eslint-disable react-hooks/exhaustive-deps */
import { use, useEffect, useState } from "react";
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
        loadingDelete,
        errorDelete,
        updateWalletAddress,
        loadingUpdate,
        errorUpdate
    } = useWalletAddress();

    // Estado para solicitudes de retiro
    // Estados de UI
    const [solicitarRetiroHard, setSolicitarRetiro] = useState<SolicitudRetiro[]>([]);
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
            case TipoCrypto.BITCOIN:
                return "BTC";
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
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-black">
                        {t("withdrawal.withdrawal_management")}
                    </h1>
                    <p className="text-gray-600">
                        {t("withdrawal.manage_your_wallets_and_withdrawal_requests")}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Sección: Mis Wallets */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
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
                            <div className="mb-6 p-4 rounded-lg border-2 border-[#F0973C] bg-[#FFF4E6]">
                                <h3 className="font-semibold mb-4">Nueva Wallet</h3>
                                <form onSubmit={walletFormik.handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            {t("withdrawal.wallet_name")}
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={walletFormik.values.nombre}
                                            onChange={walletFormik.handleChange}
                                            onBlur={walletFormik.handleBlur}
                                            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${walletFormik.touched.nombre && walletFormik.errors.nombre ? "border-red-600" : "border-[#F0973C]"
                                                }`}
                                            placeholder={t("withdrawal.main_wallet")}
                                        />
                                        {walletFormik.touched.nombre && walletFormik.errors.nombre && (
                                            <p className="text-sm mt-1 text-red-600">
                                                {walletFormik.errors.nombre}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            {t("withdrawal.crypto_type")}
                                        </label>
                                        <select
                                            name="tipoCrypto"
                                            value={walletFormik.values.tipoCrypto}
                                            onChange={walletFormik.handleChange}
                                            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none border-[#F0973C]"
                                        >
                                            <option value={TipoCrypto.USDT_ERC20}>USDT (ERC-20)</option>
                                            <option value={TipoCrypto.USDT_TRC20}>USDT (TRC-20)</option>
                                            <option value={TipoCrypto.BITCOIN}>Bitcoin</option>
                                            <option value={TipoCrypto.SOLANA}>Solana</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            {t("withdrawal.wallet_address")}
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={walletFormik.values.address}
                                            onChange={walletFormik.handleChange}
                                            onBlur={walletFormik.handleBlur}
                                            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none font-mono text-sm ${walletFormik.touched.address && walletFormik.errors.address ? "border-red-600" : "border-[#F0973C]"
                                                }`}
                                            placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                                        />
                                        {walletFormik.touched.address && walletFormik.errors.address && (
                                            <p className="text-sm mt-1 text-red-600">
                                                {walletFormik.errors.address}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            disabled={loadingCreate}
                                            type="submit"
                                            className="flex-1 py-2 rounded-lg font-semibold transition-all hover:scale-105 bg-[#69AC95] text-white"
                                        >
                                            {t("withdrawal.create_wallet")}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowWalletForm(null);
                                                walletFormik.resetForm();
                                            }}
                                            className="flex-1 py-2 rounded-lg font-semibold border-2 border-black text-black"
                                        >
                                            {t("withdrawal.cancel")}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : showWalletForm == "update" && (
                            <div className="mb-6 p-4 rounded-lg border-2 border-[#F0973C] bg-[#FFF4E6]">
                                <h3 className="font-semibold mb-4">{t("withdrawal.update_wallet")}</h3>
                                <form onSubmit={walletFormik.handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            {t("withdrawal.wallet_name")}
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={walletFormik.values.nombre}
                                            onChange={walletFormik.handleChange}
                                            onBlur={walletFormik.handleBlur}
                                            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${walletFormik.touched.nombre && walletFormik.errors.nombre ? "border-red-600" : "border-[#F0973C]"
                                                }`}
                                            placeholder={t("withdrawal.main_wallet")}
                                        />
                                        {walletFormik.touched.nombre && walletFormik.errors.nombre && (
                                            <p className="text-sm mt-1 text-red-600">
                                                {walletFormik.errors.nombre}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            {t("withdrawal.crypto_type")}
                                        </label>
                                        <select
                                            name="tipoCrypto"
                                            value={walletFormik.values.tipoCrypto}
                                            onChange={walletFormik.handleChange}
                                            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none border-[#F0973C]"
                                        >
                                            <option value={TipoCrypto.USDT_ERC20}>USDT (ERC-20)</option>
                                            <option value={TipoCrypto.USDT_TRC20}>USDT (TRC-20)</option>
                                            <option value={TipoCrypto.BITCOIN}>Bitcoin</option>
                                            <option value={TipoCrypto.SOLANA}>Solana</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            {t("withdrawal.wallet_address")}
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={walletFormik.values.address}
                                            onChange={walletFormik.handleChange}
                                            onBlur={walletFormik.handleBlur}
                                            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none font-mono text-sm ${walletFormik.touched.address && walletFormik.errors.address ? "border-red-600" : "border-[#F0973C]"
                                                }`}
                                            placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                                        />
                                        {walletFormik.touched.address && walletFormik.errors.address && (
                                            <p className="text-sm mt-1 text-red-600">
                                                {walletFormik.errors.address}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            disabled={loadingUpdate}
                                            type="submit"
                                            className="flex-1 py-2 rounded-lg font-semibold transition-all hover:scale-105 bg-[#69AC95] text-white"
                                        >
                                            {t("withdrawal.update_wallet")}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowWalletForm(null);
                                                walletFormik.resetForm();
                                            }}
                                            className="flex-1 py-2 rounded-lg font-semibold border-2 border-black text-black"
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
                                <p className="text-center text-gray-500">{t("withdrawal.loading_wallets")}</p>
                            ) : errorMyWallets ? (
                                <p className="text-center text-red-600">{t("withdrawal.error_loading_wallets")}</p>
                            ) : walletAddresses.length === 0 ? (
                                <p className="text-center text-gray-500">{t("withdrawal.no_wallets_found")}</p>
                            ) : (walletAddresses.map((wallet) => (
                                <div
                                    key={wallet.id}
                                    className="p-4 rounded-lg border-2 transition-all hover:shadow-md border-gray-200 bg-white"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold">{wallet.nombre}</h3>
                                            <p className="text-xs text-[#F0973C]">
                                                {getCryptoSymbol(wallet.tipoCrypto)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#69AC95] text-white">
                                                ${wallet.balanceRetirado.toFixed(2)}
                                            </span>
                                            <button
                                                title={t("withdrawal.edit_wallet")}
                                                className="p-2 rounded-lg transition-all hover:scale-105 bg-blue-500 text-white"
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
                                    <p className="text-xs font-mono text-gray-500 break-all">
                                        {wallet.address}
                                    </p>
                                </div>
                            )))}
                        </div>
                    </div>

                    {/* Sección: Solicitar Retiro */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <ArrowDownToLine size={24} className="text-[#69AC95]" />
                            {t("withdrawal.request_withdrawal")}
                        </h2>

                        <form onSubmit={retiroFormik.handleSubmit} className="space-y-6">

                            {/* Selector 2 */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    {t("withdrawal.**select_the_wallet_address_for_deposit ***")}
                                </label>
                                <select
                                    name="walletId"
                                    value={retiroFormik.values.walletId}
                                    onChange={(e) => {
                                        retiroFormik.handleChange(e);
                                    }}
                                    onBlur={retiroFormik.handleBlur}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${retiroFormik.touched.walletId && retiroFormik.errors.walletId ? "border-red-600" : "border-[#F0973C]"
                                        }`}
                                >
                                    <option value={0}>{t("withdrawal.select_a_wallet")}</option>
                                    {usuario?.wallets.map((wallet) => (
                                        <option key={wallet.id} value={wallet.id}>
                                            {wallet.tipo} - ${wallet.saldo.toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                                {retiroFormik.touched.walletId && retiroFormik.errors.walletId && (
                                    <p className="text-sm mt-1 text-red-600">
                                        {retiroFormik.errors.walletId}
                                    </p>
                                )}
                            </div>
                            {/* PROBLEMA CON LA TRADUCCION AQUI */}   
                            {/* Información de la wallet seleccionada 2 */}
                            {retiroFormik.values.walletId > 0 && (
                                <div className="p-4 rounded-lg bg-[#E6F4F1] border-2 border-[#69AC95]">
                                    {(() => {
                                        const wallet = usuario?.wallets.find(w => w.id === Number(retiroFormik.values.walletId));
                                        return wallet ? (
                                            <>
                                                <p className="text-sm font-semibold mb-2">{t("withdrawal.selected_wallet:")}</p>
                                                <p className="text-xs font-mono text-gray-600 break-all mb-2">{wallet.tipo}</p>
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
                                <label className="block text-sm font-semibold mb-2">
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
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${retiroFormik.touched.addresId && retiroFormik.errors.addresId ? "border-red-600" : "border-[#F0973C]"
                                        }`}
                                >
                                    <option value={0}>{t("withdrawal.select_a_wallet")}</option>
                                    {walletAddresses.map((wallet) => (
                                        <option key={wallet.id} value={wallet.id}>
                                            {wallet.nombre} - {getCryptoSymbol(wallet.tipoCrypto)}
                                        </option>
                                    ))}
                                </select>
                                {retiroFormik.touched.addresId && retiroFormik.errors.addresId && (
                                    <p className="text-sm mt-1 text-red-600">
                                        {retiroFormik.errors.addresId}
                                    </p>
                                )}
                            </div>
                            {/* Información de la wallet seleccionada */}
                            {retiroFormik && retiroFormik.values.addresId > 0 && (
                                <div className="p-4 rounded-lg bg-[#E6F4F1] border-2 border-[#69AC95]">
                                    {(() => {
                                        const wallet = walletAddresses.find(w => w.id === selectedWallet);
                                        return wallet ? (
                                            <>
                                                <p className="text-sm font-semibold mb-2">{t("withdrawal.selected_wallet:")}</p>
                                                <p className="text-xs font-mono text-gray-600 break-all mb-2">{wallet.address}</p>
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
                                <label className="block text-sm font-semibold mb-2">
                                    {t("withdrawal.**amount_to_withdraw ***")}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        name="monto"
                                        value={retiroFormik.values.monto || ""}
                                        onChange={retiroFormik.handleChange}
                                        onBlur={retiroFormik.handleBlur}
                                        className={`w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:outline-none ${retiroFormik.touched.monto && retiroFormik.errors.monto ? "border-red-600" : "border-[#F0973C]"
                                            }`}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                                {retiroFormik.touched.monto && retiroFormik.errors.monto && (
                                    <p className="text-sm mt-1 text-red-600">
                                        {retiroFormik.errors.monto}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={ loadingSolicitarRetiroFondos}
                                className="w-full py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-[#69AC95] text-white"
                            >
                                {t("withdrawal.request_withdrawal")}
                            </button>
                        </form>

                        {/* ERROR AL TRADUCIR */}     
                        {/* Información adicional */}
                        <div className="mt-6 p-4 rounded-lg bg-[#FFF4E5] border border-[#F0973C]">
                            <h3 className="font-semibold text-sm mb-2 text-[#F0973C]">
                                ℹ️ {t("withdrawal.important_information")}
                            </h3>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>• {t("withdrawal.requests_processed_within_24_48_hours")}</li>
                                <li>• {t("withdrawal.minimum_withdrawal_amount:")} $10 USD</li>
                                <li>• {t("withdrawal.network_fees_will_apply")}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Historial de Solicitudes */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
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
                                className="px-3 py-2 border-2 rounded-lg text-sm focus:outline-none border-[#F0973C]"
                            >
                                <option value="">{t("withdrawal.all_statuses")}</option>
                                <option value={EstadoOperacion.PENDIENTE}>{t("withdrawal.pending")}</option>
                                <option value={EstadoOperacion.COMPLETADA}>{t("withdrawal.completed")}</option>
                                <option value={EstadoOperacion.RECHAZADA}>{t("withdrawal.rejected")}</option>
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
                                <tr className="bg-gray-50 border-b-2 border-gray-200">
                                    <th className="px-4 py-3 text-left text-sm font-semibold">{t("withdrawal.id")}</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">{t("withdrawal.wallet")}</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">{t("withdrawal.crypto")}</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold">{t("withdrawal.amount")}</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">{t("withdrawal.date")}</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold">{t("withdrawal.status")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudesPaginadas.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                            {t("withdrawal.no_requests_to_display")}
                                        </td>
                                    </tr>
                                ) : (
                                    solicitudesPaginadas.map((solicitud) => {
                                        const estadoInfo = getEstadoInfo(solicitud.estado);
                                        const IconoEstado = estadoInfo.icon;
                                        return (
                                            <tr key={solicitud.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-4 text-sm font-semibold">#{solicitud.id}</td>
                                                <td className="px-4 py-4 text-xs font-mono text-gray-600 max-w-50 truncate">
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
                                                <td className="px-4 py-4 text-sm text-gray-600">
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
                        <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-gray-200">
                            <p className="text-sm text-gray-600">
                                {t("withdrawal.Showing")} {indexPrimeraSolicitud + 1} - {Math.min(indexUltimaSolicitud, solicitudesFiltradas.length)} {t("withdrawal.of")} {solicitudesFiltradas.length} {t("withdrawal.requests")}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    title={t("withdrawal.previous_page")}
                                    onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                    disabled={paginaActual === 1}
                                    className="p-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-orange-500 text-white"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                                        <button
                                            key={pagina}
                                            onClick={() => setPaginaActual(pagina)}
                                            className={`px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 ${paginaActual === pagina ? "bg-orange-500 text-white" : "bg-gray-200 text-black"
                                                }`}
                                        >
                                            {pagina}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    title={t("withdrawal.next_page")}
                                    onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                    disabled={paginaActual === totalPaginas}
                                    className="p-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-orange-500 text-white"
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