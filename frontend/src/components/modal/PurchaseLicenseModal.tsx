import { useTranslation } from "react-i18next";
import { useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";
import { TipoCrypto, TipoSolicitud } from "../../type/enum";
import { useUsuario } from "../../hooks/usuarioHook";
import { getLicenseImage } from "../../helpers/imgHelpers";
import imgBNB from "../../assets/BNB-Smart.png";
import imgETH from "../../assets/ETHEREUM.png";
import imgSOL from "../../assets/SOLANA.png";
import imgTRON from "../../assets/TRON.png";

interface PromoOption {
    name: string;
    value: number;
}

interface PurchaseLicenseModalProps {
    open: boolean;
    onClose: () => void;
    licenseName: string;
    licenseValue: number;
    purchaseType: TipoSolicitud.COMPRA_LICENCIA | TipoSolicitud.PAGO_DELEGADO | TipoSolicitud.COMPRA_LICENCIA_MINERIA| TipoSolicitud.COMPRA_LICENCIA_PROMOCIONAL| TipoSolicitud.COMPRA_LICENCIA_CON_WALLET_PAYGLOBAL;
    isPromotional?: boolean;
    promoOptions?: PromoOption[];
}

export default function PurchaseLicenseModal({
    open,
    onClose,
    licenseName,
    licenseValue,
    purchaseType,
    isPromotional = false,
    promoOptions = []
}: PurchaseLicenseModalProps) {
    const { t } = useTranslation();
    const [referredUsername, setReferredUsername] = useState("");
    const [selectedCrypto, setSelectedCrypto] = useState<TipoCrypto>(TipoCrypto.USDT_BEP20);
    const [selectedPromoLicenseName, setSelectedPromoLicenseName] = useState<string>(licenseName);
    const [selectedPromoLicenseValue, setSelectedPromoLicenseValue] = useState<number>(licenseValue);
    const [purchaseResult, setPurchaseResult] = useState<"success" | "error" | null>(null);
    const [showPayglobalConfirmModal, setShowPayglobalConfirmModal] = useState(false);
    const { solicitarCompraLicencia, loadingSolicitarCompraLicencia } = useUsuario();

    const handleConfirmPurchase = async (usePayglobalWallet = false) => {
        setPurchaseResult(null);
        const promise = solicitarCompraLicencia(selectedCrypto, selectedPromoLicenseName, usePayglobalWallet ? TipoSolicitud.COMPRA_LICENCIA_CON_WALLET_PAYGLOBAL : purchaseType);
        toast.promise(
            promise,
            {
                pending: t("licenses.processing_purchase"),
                success: {
                    render: t("licenses.purchase_requested_successfully"),
                    autoClose: 5000,
                },
                error: {
                    render: t("licenses.error_requesting_license_purchase"),
                    autoClose: 5000,
                },
            },
            { autoClose: false }
        );
        try {
            await promise;
            setPurchaseResult("success");
        } catch (error) {
            console.error(t("licenses.error_requesting_license_purchase"), error);
            setPurchaseResult("error");
        }
    };

    const handlePromoSelection = (event: ChangeEvent<HTMLSelectElement>) => {
        const [name, value] = event.target.value.split("|");
        setSelectedPromoLicenseName(name);
        setSelectedPromoLicenseValue(Number(value));
    };

    // Wallets diferentes para cada tipo de criptomoneda - esto debería venir del backend
    const cryptoWallets = {
        [TipoCrypto.USDT_BEP20]: {
            address: "0x3bBe92e195E58b1762009aAb264F83aB0F676FA3",
            name: "USDT Network: BNB SMART CHAIN",
            symbol: "USDT",
            tipo: TipoCrypto.USDT_BEP20,
            img: imgBNB,
            logo: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/bnb.png"
        },
        [TipoCrypto.SOLANA]: {
            address: "EKhvoLfMW65dPHB2dany39bc7AppmqmzDnsfsLE7JGCT",
            name: "USDT Network: SOLANA",
            symbol: "USDT",
            tipo: TipoCrypto.SOLANA,
            img: imgSOL,
            logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
        },
        [TipoCrypto.USDT_TRC20]: {
            address: "TY9vjjLCp1HsoHNhDWGEyL2f4JciojfKRL",
            name: "USDT Network: TRON",
            symbol: "USDT",
            tipo: TipoCrypto.USDT_TRC20,
            img: imgTRON,
            logo: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/trx.png"
        },
        [TipoCrypto.USDT_ERC20]: {
            address: "0x3bBe92e195E58b1762009aAb264F83aB0F676FA3",
            name: "USDT Network: ETHEREUM",
            symbol: "USDT",
            tipo: TipoCrypto.USDT_ERC20,
            img: imgETH,
            logo: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/eth.png"
        },
    };

    const currentWallet = cryptoWallets[selectedCrypto];
    const BACKOFFICE_COMMISSION = 15;
    const activeLicenseName = isPromotional ? selectedPromoLicenseName : licenseName;
    const activeLicenseValue = isPromotional ? selectedPromoLicenseValue : licenseValue;
    const totalAmount = activeLicenseValue + BACKOFFICE_COMMISSION;
    const dailyYield = Number((activeLicenseValue * 0.03).toFixed(2));
    const productiveDays = 260;
    const estimatedProfit = Number((dailyYield * productiveDays).toFixed(2));
    const finalTotal = Number((activeLicenseValue + estimatedProfit).toFixed(2));

    if (!open) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentWallet.address);
        alert(t("licenses.address_copied"));
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
            <div className="absolute inset-0 bg-black opacity-80 z-51"></div>
            <div className="relative bg-[#0d0d0d] border border-yellow-300/20 rounded-4xl max-w-4xl w-full z-52 max-h-[90vh] flex flex-col overflow-y-auto shadow-[0_40px_120px_rgba(255,204,79,0.18)]">

                {/* Botón de cerrar */}
                <button
                    onClick={onClose}
                    aria-label="Cerrar"
                    className="absolute top-4 right-4 text-white/40 hover:text-white z-10 bg-white/5 hover:bg-white/10 rounded-full p-1 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* TÍTULO - full width */}
                <div className="px-8 pt-8 pb-4 text-center">
                    <p className="text-sm uppercase tracking-[0.32em] font-semibold text-yellow-300 mb-2">
                        {isPromotional ? "Oferta Premium" : t("licenses.purchase_license")}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-black text-white">
                        {isPromotional ? "Licencia Promocional" : t("licenses.purchase_license")}
                    </h2>
                    {isPromotional && (
                        <p className="mt-3 text-sm text-white/60 max-w-2xl mx-auto">
                            Selecciona un monto y descubre el rendimiento diario del 3% en días hábiles durante 12 meses.
                        </p>
                    )}
                </div>

                {/* CUERPO: dos columnas */}
                <div className="flex flex-col md:flex-row gap-0 px-8 pb-4">

                    {/* COLUMNA IZQUIERDA: Licencia + QR */}
                    <div className="md:w-1/2 flex flex-col gap-4 pr-0 md:pr-6">

                        {/* Info de licencia */}
                        <div className="rounded-2xl border border-yellow-300/20 bg-[#1a170d] p-5 flex items-center gap-4">
                            <img
                                src={getLicenseImage(activeLicenseName)}
                                alt={activeLicenseName}
                                className="w-16 h-16 object-contain shrink-0"
                            />
                            <div className="flex-1">
                                <p className="text-xs text-white/40 mb-2">{isPromotional ? "Licencia Promocional" : licenseName}</p>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="rounded-full border border-yellow-300/30 bg-yellow-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] font-semibold text-yellow-200">
                                        3% diario
                                    </span>
                                    {isPromotional && (
                                        <span className="text-xs text-white/50">Solo días hábiles</span>
                                    )}
                                </div>
                                <div className="grid gap-2 text-sm text-white/70">
                                    <div className="flex items-center justify-between">
                                        <span>Precio seleccionado</span>
                                        <span className="font-semibold text-white">${activeLicenseValue} {currentWallet.symbol}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Comisión backoffice</span>
                                        <span className="font-semibold text-yellow-300">+${BACKOFFICE_COMMISSION} {currentWallet.symbol}</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                                        <span className="font-bold text-white">Total a depositar</span>
                                        <span className="font-black text-[#69AC95]">${totalAmount} {currentWallet.symbol}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Promo selector y resumen */}
                        {isPromotional && promoOptions.length > 0 && (
                            <div className="rounded-2xl border border-yellow-300/20 bg-[#13100b] p-5 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                        Elige el monto promocional
                                    </label>
                                    <select
                                        value={`${selectedPromoLicenseName}|${selectedPromoLicenseValue}`}
                                        onChange={handlePromoSelection}
                                        className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-yellow-300"
                                    >
                                        {promoOptions.map((option) => (
                                            <option key={option.name} value={`${option.name}|${option.value}`}>
                                                {option.name} — ${option.value} USDT
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="flex items-center justify-between text-sm text-white/60 mb-3">
                                        <span>Rendimiento diario</span>
                                        <span className="font-semibold text-white">3%</span>
                                    </div>
                                    <div className="grid gap-3 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span>Precio seleccionado</span>
                                            <span className="font-semibold text-white">${activeLicenseValue} USDT</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Rendimiento diario</span>
                                            <span className="font-semibold text-white">${dailyYield.toFixed(2)} USDT</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Días productivos</span>
                                            <span className="font-semibold text-white">{productiveDays}</span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-white/10 pt-3">
                                            <span>Ganancia estimada (12 meses)</span>
                                            <span className="font-semibold text-yellow-300">${estimatedProfit.toFixed(2)} USDT</span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-white/10 pt-3">
                                            <span className="font-bold">Total final</span>
                                            <span className="font-bold text-[#69AC95]">${finalTotal.toFixed(2)} USDT</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* QR / Imagen de la red */}
                        <div className="flex-1 flex items-center justify-center rounded-xl border border-white/10 bg-white/2 p-4">
                            <img
                                src={currentWallet.img}
                                alt={currentWallet.name}
                                className="w-full max-w-55 object-contain rounded-xl"
                            />
                        </div>

                    </div>

                    {/* COLUMNA DERECHA: Selector cripto + Wallet address */}
                    <div className="md:w-1/2 flex flex-col gap-4 pl-0 md:pl-6 md:border-l border-white/10 mt-4 md:mt-0">

                        {/* Input para username si es pago delegado */}
                        {purchaseType === TipoSolicitud.PAGO_DELEGADO && (
                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                    {t("licenses.referred_username")}
                                </label>
                                <input
                                    type="text"
                                    value={referredUsername}
                                    onChange={(e) => setReferredUsername(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/5 border border-[#F0973C]/40 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-[#F0973C]/70 transition-all"
                                    placeholder={t("licenses.enter_username")}
                                />
                            </div>
                        )}

                        {/* Selector de criptomoneda */}
                        <div>
                            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                {t("licenses.select_crypto_type")}
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(cryptoWallets).map(([key, wallet]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedCrypto(wallet.tipo)}
                                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 ${selectedCrypto === wallet.tipo
                                            ? 'border-[#F0973C] bg-[#F0973C]/10 text-[#F0973C]'
                                            : 'border-white/10 bg-white/5 text-white/70 hover:border-[#F0973C]/40 hover:bg-[#F0973C]/5'
                                            }`}
                                    >
                                        <div className="relative w-14 h-14">
                                            <img
                                                src="https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdt.png"
                                                alt="USDT"
                                                className="w-14 h-14 rounded-full object-contain"
                                            />
                                            <img
                                                src={wallet.logo}
                                                alt={wallet.name}
                                                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full object-contain bg-[#0d0d0d] border-2 border-[#0d0d0d]"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm font-semibold">{wallet.symbol}</div>
                                            <div className="text-xs opacity-60 leading-tight">{wallet.name}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Wallet Address */}
                        <div>
                            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                {t("licenses.wallet_address")} ({currentWallet.name})
                            </p>
                            <div className="flex items-center bg-white/5 border border-white/10 p-3 rounded-xl">
                                <p className="text-sm break-all flex-1 font-mono text-white/80">{currentWallet.address}</p>
                                <button
                                    onClick={copyToClipboard}
                                    className="ml-2 shrink-0 text-[#F0973C] hover:text-[#F0973C]/70 transition-colors"
                                    title={t("licenses.copy")}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={() => setShowPayglobalConfirmModal(true)}
                                className="w-full rounded-2xl bg-[#69AC95] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#8be2ae]"
                            >
                                {t("licenses.pay_with_payglobal")}
                            </button>
                        </div>

                    </div>
                </div>

                {/* FOOTER: Estado de transacción + Botón comprar */}
                <div className="flex flex-col md:flex-row items-stretch gap-4 px-8 pb-8 pt-2">

                    {/* MITAD IZQUIERDA: Estado automático de transacción */}
                    <div className="flex-1 flex flex-col justify-center gap-2">
                        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">
                            {t("licenses.transaction_status")}
                        </p>
                        {purchaseResult === null && !loadingSolicitarCompraLicencia && (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5">
                                <div className="w-4 h-4 rounded-full border-2 border-white/20 shrink-0" />
                                <span className="text-sm text-white/40">{t("licenses.transaction_pending")}</span>
                            </div>
                        )}
                        {loadingSolicitarCompraLicencia && (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#69AC95]/40 bg-[#69AC95]/5">
                                <svg className="w-4 h-4 animate-spin text-[#69AC95] shrink-0" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                <span className="text-sm text-[#69AC95] font-semibold">{t("licenses.processing_purchase")}</span>
                            </div>
                        )}
                        {purchaseResult === "success" && (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#F0973C] bg-[#F0973C]/10">
                                <svg className="w-4 h-4 text-[#F0973C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm text-[#F0973C] font-semibold">{t("licenses.transaction_processed")}</span>
                            </div>
                        )}
                        {purchaseResult === "error" && (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500 bg-red-500/10">
                                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-sm text-red-400 font-semibold">{t("licenses.transaction_failed")}</span>
                            </div>
                        )}
                    </div>

                    {/* MITAD DERECHA: Botón comprar */}
                    <div className="flex-1 flex items-end">
                        <button
                            onClick={() => handleConfirmPurchase()}
                            disabled={loadingSolicitarCompraLicencia || purchaseResult !== null}
                            className={`w-full py-3 px-6 rounded-xl transition-colors font-bold disabled:cursor-not-allowed ${purchaseResult !== null
                                ? 'bg-white/10 text-white/30'
                                : 'bg-[#F0973C] text-black hover:bg-[#F0973C]/90 disabled:opacity-50'
                                }`}
                        >
                            {loadingSolicitarCompraLicencia
                                ? t("licenses.processing_purchase")
                                : purchaseResult !== null
                                    ? t("licenses.close")
                                    : isPromotional
                                        ? "Confirmar compra"
                                        : t("licenses.close")}
                        </button>
                    </div>

                </div>

                {showPayglobalConfirmModal && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 px-4 py-6">
                        <div className="relative w-full max-w-xl rounded-4xl border border-white/10 bg-[#111111] p-6 shadow-[0_35px_120px_rgba(0,0,0,0.5)]">
                            <button
                                onClick={() => setShowPayglobalConfirmModal(false)}
                                className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
                            >
                                ✕
                            </button>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#69AC95]/15 text-[#69AC95]">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.35em] text-[#69AC95]">{t("licenses.confirm_payglobal_purchase_title")}</p>
                                        <h2 className="text-2xl font-bold text-white">{t("licenses.confirm_payglobal_purchase_description")}</h2>
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <p className="text-sm text-white/50">{t("licenses.license_to_purchase")}</p>
                                        <p className="mt-2 text-lg font-semibold text-white">{activeLicenseName}</p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <p className="text-sm text-white/50">{t("licenses.total_cost")}</p>
                                        <p className="mt-2 text-lg font-semibold text-white">${activeLicenseValue} {currentWallet.symbol}</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                                    <p>{t("licenses.confirm_payglobal_purchase_description")}</p>
                                </div>
                                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                    <button
                                        onClick={() => setShowPayglobalConfirmModal(false)}
                                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                    >
                                        {t("wallet_payglobal.cancel")}
                                    </button>
                                    <button
                                        onClick={async () => {
                                            setShowPayglobalConfirmModal(false);
                                            await handleConfirmPurchase(true);
                                        }}
                                        className="rounded-2xl bg-[#69AC95] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#8be2ae]"
                                    >
                                        {t("licenses.confirm_purchase")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
