import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LICENCIAS } from "../../type/entityTypes";
import PurchaseLicenseModal from "../../components/modal/PurchaseLicenseModal";
import { TipoSolicitud } from "../../type/enum";
import { getLicenseImage } from "../../helpers/imgHelpers";

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
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {t("licenses.available_licenses")}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {t("licenses.choose_the_license_that_best_suits_your_needs") }
                    </p>
                </div>
                
                {/* Grid de licencias */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Object.entries(LICENCIAS).map(([key, license]) => (
                        <div 
                            key={key}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-400 hover:-translate-y-2"
                        >
                            {/* Imagen de la licencia */}
                            <div className="relative overflow-hidden bg-linear-to-br from-blue-50 to-purple-50 p-4">
                                <img 
                                    src={getLicenseImage(license.name)} 
                                    alt={license.name}
                                    className="w-full h-auto object-contain transform group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                                    <span className="text-xs font-semibold text-gray-700">USD</span>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="p-4 space-y-2">
                                {/* Botón Comprar para mí */}
                                <button
                                    onClick={() => handlePurchase(license.name, license.value, TipoSolicitud.COMPRA_LICENCIA)}
                                    className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    <span className="text-sm">{t("licenses.purchase_for_myself") }</span>
                                </button>

                                {/* Botón Comprar para alguien más */}
                                <button
                                    onClick={() => handlePurchase(license.name, license.value, TipoSolicitud.PAGO_DELEGADO)}
                                    className="w-full bg-linear-to-r from-green-600 to-green-700 text-white py-2.5 px-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <span className="text-sm">{t("licenses.purchase_for_others") }</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Información adicional */}
                <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-blue-900">
                            {t("licenses.important_information") }
                        </h3>
                    </div>
                    <p className="text-blue-800 text-sm">
                        {t("licenses.info_text") }
                    </p>
                </div>
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