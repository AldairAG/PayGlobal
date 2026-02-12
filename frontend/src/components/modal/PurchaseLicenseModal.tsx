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
            console.error('Error al solicitar compra de licencia:', error);
        }
    };
    
    // Wallets diferentes para cada tipo de criptomoneda - esto debería venir del backend
    const cryptoWallets = {
        [TipoCrypto.BITCOIN]: {
            address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            name: "Bitcoin (BTC)",
            symbol: "BTC"
        },
        [TipoCrypto.USDT_ERC20]: {
            address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            name: "USDT (ERC-20)",
            symbol: "USDT"
        },
        [TipoCrypto.USDT_TRC20]: {
            address: "TYASr5UV6HEcXatwdFQfmLVUqQQQMUxHLS",
            name: "USDT (TRC-20)",
            symbol: "USDT"
        },
        [TipoCrypto.SOLANA]: {
            address: "7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV",
            name: "Solana (SOL)",
            symbol: "SOL"
        }
    };

    const currentWallet = cryptoWallets[selectedCrypto];
    
    // Generar URL para código QR (usando un servicio de QR público)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currentWallet.address}`;

    if (!open) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentWallet.address);
        alert(t("licenses.address_copied") || "Dirección copiada al portapapeles");
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Botón de cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl mb-6 font-bold text-center">
                    {t("licenses.purchase_title") || "Comprar Licencia"}
                </h2>

                {/* Información de la licencia */}
                <div className="mb-6 bg-gray-50 p-4 rounded">
                    <p className="text-lg font-semibold">{licenseName}</p>
                    <p className="text-2xl font-bold text-green-600">${licenseValue} {currentWallet.symbol}</p>
                    <p className="text-sm text-gray-600 mt-2">
                        {purchaseType === TipoSolicitud.COMPRA_LICENCIA
                            ? (t("licenses.for_yourself") || "Compra para ti")
                            : (t("licenses.for_someone") || "Compra para alguien más")}
                    </p>
                </div>

                {/* Input para username si es compra para otro */}
                {purchaseType === TipoSolicitud.PAGO_DELEGADO && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            {t("licenses.referred_username") || "Username del referido"}
                        </label>
                        <input
                            type="text"
                            value={referredUsername}
                            onChange={(e) => setReferredUsername(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={t("licenses.enter_username") || "Ingrese el username"}
                        />
                    </div>
                )}

                {/* Selector de criptomoneda */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("licenses.crypto_type") || "Selecciona el tipo de criptomoneda"}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(cryptoWallets).map(([key, wallet]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedCrypto(Number(key) as TipoCrypto)}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                    selectedCrypto === Number(key)
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <div className="text-sm font-semibold">{wallet.symbol}</div>
                                <div className="text-xs text-gray-600">{wallet.name}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Código QR */}
                <div className="mb-6 flex justify-center">
                    <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="border-2 border-gray-200 rounded p-2"
                    />
                </div>

                {/* Wallet Address */}
                <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        {t("licenses.wallet_address") || "Dirección de Wallet"} ({currentWallet.name})
                    </p>
                    <div className="flex items-center bg-gray-50 p-3 rounded">
                        <p className="text-sm break-all flex-1 font-mono">{currentWallet.address}</p>
                        <button
                            onClick={copyToClipboard}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                            title={t("licenses.copy") || "Copiar"}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Instrucciones */}
                <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-sm text-yellow-800">
                        {t("licenses.payment_instructions") || 
                        "Realice la transferencia al wallet address mostrado. Una vez confirmada la transacción, su licencia será activada."}
                    </p>
                </div>

                {/* Botón de confirmación */}
                <button
                    onClick={handleConfirmPurchase}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors font-semibold"
                >
                    {t("licenses.close") || "Cerrar"}
                </button>
            </div>
        </div>
    );
}
