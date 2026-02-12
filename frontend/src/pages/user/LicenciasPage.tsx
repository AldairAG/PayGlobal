import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LICENCIAS } from "../../type/entityTypes";
import PurchaseLicenseModal from "../../components/modal/PurchaseLicenseModal";
import { TipoSolicitud } from "../../type/enum";

export const LicenciasPage = () => {
    const { t } = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState<{
        name: string;
        value: number;
        type: TipoSolicitud.COMPRA_LICENCIA | TipoSolicitud.PAGO_DELEGADO;
    } | null>(null);

    const handlePurchase = (name: string, value: number, type: TipoSolicitud.COMPRA_LICENCIA | TipoSolicitud.PAGO_DELEGADO) => {
        setSelectedLicense({ name, value, type });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedLicense(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
                {t("licenses.title") || "Licencias Disponibles"}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(LICENCIAS).map(([key, license]) => (
                    <div 
                        key={key}
                        className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200"
                    >
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {license.name}
                            </h3>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-green-600">
                                    ${license.value}
                                </span>
                                <span className="ml-2 text-gray-600">USDT</span>
                            </div>
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <p className="text-sm text-gray-600 mb-4">
                                {t("licenses.select_option") || "Selecciona una opción de compra"}
                            </p>
                            
                            <div className="space-y-3">
                                {/* Botón Comprar para mí */}
                                <button
                                    onClick={() => handlePurchase(license.name, license.value, TipoSolicitud.COMPRA_LICENCIA)}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    {t("licenses.buy_for_me") || "Comprar"}
                                </button>

                                {/* Botón Comprar para alguien más */}
                                <button
                                    onClick={() => handlePurchase(license.name, license.value, TipoSolicitud.PAGO_DELEGADO)}
                                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    {t("licenses.buy_for_other") || "Comprar para alguien más"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de compra */}
            {selectedLicense && (
                <PurchaseLicenseModal
                    open={modalOpen}
                    onClose={closeModal}
                    licenseName={selectedLicense.name}
                    licenseValue={selectedLicense.value}
                    purchaseType={selectedLicense.type}
                />
            )}
        </div>
    );
}