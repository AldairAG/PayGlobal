import { useTranslation } from "react-i18next";
import { useState } from "react";
import { TipoCrypto, TipoSolicitud } from "../../type/enum";
import { useUsuario } from "../../hooks/usuarioHook";


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
    const [selectedCrypto, setSelectedCrypto] = useState<TipoCrypto>(TipoCrypto.USDT_TRC20);
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
        [TipoCrypto.BITCOIN]: {
            address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            name: "Bitcoin (BTC)",
            symbol: "BTC",
            tipo:TipoCrypto.BITCOIN 
        },
        [TipoCrypto.USDT_ERC20]: {
            address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            name: "USDT (ERC-20)",
            symbol: "USDT",
            tipo:TipoCrypto.USDT_ERC20
        },
        [TipoCrypto.USDT_TRC20]: {
            address: "TYASr5UV6HEcXatwdFQfmLVUqQQQMUxHLS",
            name: "USDT (TRC-20)",
            symbol: "USDT",
            tipo:TipoCrypto.USDT_TRC20
        },
        [TipoCrypto.SOLANA]: {
            address: "7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV",
            name: "Solana (SOL)",
            symbol: "SOL",
            tipo:TipoCrypto.SOLANA
        }
    };

    const currentWallet = cryptoWallets[selectedCrypto];
    
    // Generar URL para código QR (usando un servicio de QR público)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currentWallet.address}`;

    if (!open) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentWallet.address);
        alert(t("licenses.address_copied"));
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
            <div className="absolute inset-0 bg-black opacity-80 z-51"></div>
            <div className="relative bg-[#0d0d0d] border border-white/10 rounded-2xl max-w-md w-full z-52 max-h-[90vh] flex flex-col">
                {/* Botón de cerrar - fijo en la parte superior */}
                <button
                    onClick={onClose}
                    aria-label="Cerrar"
                    className="absolute top-4 right-4 text-white/40 hover:text-white z-10 bg-white/5 hover:bg-white/10 rounded-full p-1 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Contenedor con scroll */}
                <div className="overflow-y-auto p-8">
                    <h2 className="text-2xl mb-6 font-bold text-center pr-8 text-[#F0973C]">
                        {t("licenses.purchase_license")}
                    </h2>

                {/* Información de la licencia */}
                <div className="mb-6 rounded-xl border border-[#69AC95]/20 bg-[#69AC95]/5 p-4">
                    <p className="text-lg font-semibold text-white">{licenseName}</p>
                    <p className="text-2xl font-bold text-[#69AC95]">${licenseValue} {currentWallet.symbol}</p>
                    <p className="text-sm text-white/50 mt-2">
                        {purchaseType === TipoSolicitud.COMPRA_LICENCIA
                            ? (t("licenses.purchase_for_myself") )
                            : (t("licenses.purchase_for_others") )}
                    </p>
                </div>

                {/* Input para username si es compra para otro */}
                {purchaseType === TipoSolicitud.PAGO_DELEGADO && (
                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                {t("licenses.referred_username") }
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
                <div className="mb-6">
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                        {t("licenses.select_crypto_type")}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(cryptoWallets).map(([key, wallet]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedCrypto(wallet.tipo)}
                                className={`p-3 rounded-xl border transition-all ${
                                    selectedCrypto === wallet.tipo
                                        ? 'border-[#F0973C] bg-[#F0973C]/10 text-[#F0973C]'
                                        : 'border-white/10 bg-white/5 text-white/70 hover:border-[#F0973C]/40 hover:bg-[#F0973C]/5'
                                }`}
                            >
                                <div className="text-sm font-semibold">{wallet.symbol}</div>
                                <div className="text-xs opacity-60">{wallet.name}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Código QR */}
                <div className="mb-6 flex justify-center">
                    <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="border border-white/10 rounded-xl p-2 bg-white"
                    />
                </div>

                {/* Wallet Address */}
                <div className="mb-6">
                    <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                            {t("licenses.wallet_address")} ({currentWallet.name})
                    </p>
                    <div className="flex items-center bg-white/5 border border-white/10 p-3 rounded-xl">
                        <p className="text-sm break-all flex-1 font-mono text-white/80">{currentWallet.address}</p>
                        <button
                            onClick={copyToClipboard}
                            className="ml-2 text-[#F0973C] hover:text-[#F0973C]/70 transition-colors"
                            title={t("licenses.copy")}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Instrucciones */}
                <div className="mb-6 border-l-4 border-[#F0973C]/60 bg-[#F0973C]/5 p-4 rounded-r-xl">
                    <p className="text-sm text-[#F0973C]/80">
                        {t("licenses.transfer_instructions")}
                    </p>
                </div>

                    {/* Botón de confirmación */}
                    <button
                        onClick={handleConfirmPurchase}
                        className="w-full bg-[#F0973C] text-black py-3 rounded-xl hover:bg-[#F0973C]/90 transition-colors font-bold"
                    >
                        {t("licenses.close")}
                    </button>
                </div>
            </div>
        </div>
    );
}
