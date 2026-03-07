import { useTranslation } from "react-i18next";
import { useState } from "react";
import { TipoCrypto, TipoSolicitud } from "../../type/enum";
import { useUsuario } from "../../hooks/usuarioHook";
import { getLicenseImage } from "../../helpers/imgHelpers";
import imgBNB from "../../assets/BNB-Smart.png";
import imgETH from "../../assets/ETHEREUM.png";
import imgSOL from "../../assets/SOLANA.png";
import imgTRON from "../../assets/TRON.png";


interface PurchaseLicenseModalProps {
    open: boolean;
    onClose: () => void;
    licenseName: string;
    licenseValue: number;
    purchaseType: TipoSolicitud.COMPRA_LICENCIA | TipoSolicitud.PAGO_DELEGADO;
}

export default function PurchaseLicenseModal({ 
    open, 
    onClose, 
    licenseName, 
    licenseValue, 
    purchaseType 
}: PurchaseLicenseModalProps) {
    const { t } = useTranslation();
    const [referredUsername, setReferredUsername] = useState("");
    const [selectedCrypto, setSelectedCrypto] = useState<TipoCrypto>(TipoCrypto.USDT_BEP20);
    const { solicitarCompraLicencia } = useUsuario(); 

    const handleConfirmPurchase = async () => {
        try {
            await solicitarCompraLicencia(selectedCrypto, licenseName, purchaseType);
            onClose();
        } catch (error) {
            console.error(t("licenses.error_requesting_license_purchase"), error);
        }
    };
    
    // Wallets diferentes para cada tipo de criptomoneda - esto debería venir del backend
    const cryptoWallets = {
        [TipoCrypto.USDT_BEP20]: {
            address: "0x3bBe92e195E58b1762009aAb264F83aB0F676FA3",
            name: "USDT Red: BNB Smart Chain",
            symbol: "USDT",
            tipo: TipoCrypto.USDT_BEP20,
            img: imgBNB,
            logo: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/bnb.png"
        },
        [TipoCrypto.SOLANA]: {
            address: "EKhvoLfMW65dPHB2dany39bc7AppmqmzDnsfsLE7JGCT",
            name: "USDT Red: Solana",
            symbol: "USDT",
            tipo: TipoCrypto.SOLANA,
            img: imgSOL,
            logo: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/sol.png"
        },
        [TipoCrypto.USDT_TRC20]: {
            address: "TY9vjjLCp1HsoHNhDWGEyL2f4JciojfKRL",
            name: "USDT Red: TRON",
            symbol: "USDT",
            tipo: TipoCrypto.USDT_TRC20,
            img: imgTRON,
            logo: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/trx.png"
        },
        [TipoCrypto.USDT_ERC20]: {
            address: "0x3bBe92e195E58b1762009aAb264F83aB0F676FA3",
            name: "USDT Red: Ethereum",
            symbol: "USDT",
            tipo: TipoCrypto.USDT_ERC20,
            img: imgETH,
            logo: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/eth.png"
        },
    };

    const currentWallet = cryptoWallets[selectedCrypto];
    const BACKOFFICE_COMMISSION = 49.95;
    const totalAmount = licenseValue + BACKOFFICE_COMMISSION;

    if (!open) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentWallet.address);
        alert(t("licenses.address_copied"));
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
            <div className="absolute inset-0 bg-black opacity-80 z-51"></div>
            <div className="relative bg-[#0d0d0d] border border-white/10 rounded-2xl max-w-3xl w-full z-52 max-h-[90vh] flex flex-col overflow-y-auto">

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
                    <h2 className="text-2xl font-bold text-[#F0973C]">
                        {t("licenses.purchase_license")}
                    </h2>
                </div>

                {/* CUERPO: dos columnas */}
                <div className="flex flex-col md:flex-row gap-0 px-8 pb-4">

                    {/* COLUMNA IZQUIERDA: Licencia + QR */}
                    <div className="md:w-1/2 flex flex-col gap-4 pr-0 md:pr-6">

                        {/* Info de licencia */}
                        <div className="rounded-xl border border-[#69AC95]/20 bg-[#69AC95]/5 p-4 flex items-center gap-4">
                            <img
                                src={getLicenseImage(licenseName)}
                                alt={licenseName}
                                className="w-16 h-16 object-contain shrink-0"
                            />
                            <div className="flex-1">
                                <p className="text-xs text-white/40 mb-2">{licenseName}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-white/50">{t("licenses.license_cost")}:</span>
                                    <span className="text-xs font-semibold text-white">${licenseValue} {currentWallet.symbol}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-white/50">{t("licenses.backoffice_commission")}:</span>
                                    <span className="text-xs font-semibold text-[#F0973C]">+${BACKOFFICE_COMMISSION} {currentWallet.symbol}</span>
                                </div>
                                <div className="border-t border-[#69AC95]/20 mt-2 pt-2 flex items-center justify-between">
                                    <span className="text-xs font-bold text-white">{t("licenses.total_to_deposit")}:</span>
                                    <span className="text-lg font-black text-[#69AC95]">${totalAmount} {currentWallet.symbol}</span>
                                </div>
                            </div>
                        </div>

                        {/* QR / Imagen de la red */}
                        <div className="flex-1 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] p-4">
                            <img
                                src={currentWallet.img}
                                alt={currentWallet.name}
                                className="w-full max-w-[220px] object-contain rounded-xl"
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
                                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 ${
                                            selectedCrypto === wallet.tipo
                                                ? 'border-[#F0973C] bg-[#F0973C]/10 text-[#F0973C]'
                                                : 'border-white/10 bg-white/5 text-white/70 hover:border-[#F0973C]/40 hover:bg-[#F0973C]/5'
                                        }`}
                                    >
                                        {/* Icono doble: USDT + red */}
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

                    </div>
                </div>

                {/* FOOTER: Instrucciones + Botón cerrar */}
                <div className="flex flex-col md:flex-row items-center gap-4 px-8 pb-8 pt-2">
                    <div className="flex-1 border-l-4 border-[#F0973C]/60 bg-[#F0973C]/5 p-4 rounded-r-xl">
                        <p className="text-sm text-[#F0973C]/80">
                            {t("licenses.transfer_instructions")}
                        </p>
                    </div>
                    <button
                        onClick={handleConfirmPurchase}
                        className="md:w-36 w-full bg-[#F0973C] text-black py-3 px-6 rounded-xl hover:bg-[#F0973C]/90 transition-colors font-bold shrink-0"
                    >
                        {t("licenses.close")}
                    </button>
                </div>

            </div>
        </div>
    );
}
