import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { LICENCIAS } from "../../type/entityTypes";
import PurchaseLicenseModal from "../../components/modal/PurchaseLicenseModal";
import { TipoSolicitud } from "../../type/enum";
import { getLicenseImage } from "../../helpers/imgHelpers";

const BACKOFFICE_COMMISSION = 49.95;

export const LicenciasPage = () => {
    const { t } = useTranslation();
    const usuario = useSelector((state: RootState) => state.usuario.usuario);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState<{
        name: string;
        value: number;
        type: TipoSolicitud.COMPRA_LICENCIA | TipoSolicitud.PAGO_DELEGADO;
    } | null>(null);

    // Obtener el valor de la licencia actual del usuario
    const userLicenseValue = usuario?.licencia?.precio || 0;

    // Función para verificar si una licencia está deshabilitada
    const isLicenseDisabled = (licenseValue: number) => {
        return licenseValue <= userLicenseValue;
    };

    const handlePurchase = (name: string, value: number, type: TipoSolicitud.COMPRA_LICENCIA | TipoSolicitud.PAGO_DELEGADO) => {
        setSelectedLicense({ name, value, type });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedLicense(null);
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white px-4 py-8">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#F0973C]">
                        {t("licenses.available_licenses")}
                    </h1>
                    <p className="text-white/50 text-lg">
                        {t("licenses.choose_the_license_that_best_suits_your_needs")}
                    </p>
                </div>

                {/* Grid de licencias */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Object.entries(LICENCIAS).map(([key, license]) => {
                        const disabled = isLicenseDisabled(license.value);
                        return (
                            <div
                                key={key}
                                className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                                    disabled 
                                        ? 'border-gray-600/20 bg-gray-800/20 opacity-60 cursor-not-allowed' 
                                        : 'border-[#F0973C]/20 bg-[#F0973C]/5 hover:bg-[#F0973C]/10 hover:border-[#F0973C]/40 hover:-translate-y-2'
                                }`}
                            >
                                {/* Imagen de la licencia */}
                                <div className={`relative overflow-hidden p-4 ${
                                    disabled 
                                        ? 'bg-gradient-to-br from-gray-700/10 to-gray-600/10' 
                                        : 'bg-gradient-to-br from-[#F0973C]/10 to-[#69AC95]/10'
                                }`}>
                                    <img
                                        src={getLicenseImage(license.name)}
                                        alt={license.name}
                                        className={`w-full h-auto object-contain transition-transform duration-300 ${
                                            disabled ? 'grayscale opacity-50' : 'transform group-hover:scale-110'
                                        }`}
                                    />
                                    <div className={`absolute top-2 right-2 backdrop-blur-sm px-3 py-1 rounded-full border ${
                                        disabled 
                                            ? 'bg-gray-700/60 border-gray-500/30' 
                                            : 'bg-black/60 border-[#F0973C]/30'
                                    }`}>
                                        <span className={`text-xs font-semibold ${
                                            disabled ? 'text-gray-400' : 'text-[#F0973C]'
                                        }`}>USDT</span>
                                    </div>
                                </div>

                                {/* Precio y comisión */}
                                <div className="px-4 pb-2 space-y-1">
                                    <div className={`flex justify-between text-xs ${
                                        disabled ? 'text-gray-500' : 'text-white/40'
                                    }`}>
                                        <span>{t("licenses.license_cost")}</span>
                                        <span>${license.value} USDT</span>
                                    </div>
                                    <div className={`flex justify-between text-xs ${
                                        disabled ? 'text-gray-500' : 'text-[#F0973C]/70'
                                    }`}>
                                        <span>{t("licenses.backoffice_commission")}</span>
                                        <span>+${BACKOFFICE_COMMISSION} USDT</span>
                                    </div>
                                    <div className={`flex justify-between text-sm font-bold border-t pt-1 ${
                                        disabled ? 'border-gray-700/30 text-gray-500' : 'border-white/10'
                                    }`}>
                                        <span className={disabled ? 'text-gray-500' : 'text-white/80'}>
                                            {t("licenses.total_to_deposit")}
                                        </span>
                                        <span className={disabled ? 'text-gray-500' : 'text-[#69AC95]'}>
                                            ${license.value + BACKOFFICE_COMMISSION} USDT
                                        </span>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="p-4 space-y-2">
                                    {/* Botón Comprar para mí */}
                                    <button
                                        onClick={() => !disabled && handlePurchase(license.name, license.value, TipoSolicitud.COMPRA_LICENCIA)}
                                        disabled={disabled}
                                        className={`w-full font-bold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center ${
                                            disabled
                                                ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                                : 'bg-[#F0973C] hover:bg-[#e8841f] text-black hover:scale-105 hover:shadow-lg hover:shadow-[#F0973C]/20'
                                        }`}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <span className="text-sm">{t("licenses.purchase_for_myself")}</span>
                                    </button>

                                    {/* Botón Comprar para alguien más - deshabilitado temporalmente */}
                                    {/* <button
                                        onClick={() => handlePurchase(license.name, license.value, TipoSolicitud.PAGO_DELEGADO)}
                                        className="w-full border border-[#69AC95]/40 bg-[#69AC95]/10 hover:bg-[#69AC95]/20 text-[#69AC95] font-bold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center hover:scale-105"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <span className="text-sm">{t("licenses.purchase_for_others")}</span>
                                    </button> */}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Información adicional */}
                <div className="mt-12 border border-[#69AC95]/20 bg-[#69AC95]/5 rounded-2xl p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-[#69AC95] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-[#69AC95]">
                            {t("licenses.important_information")}
                        </h3>
                    </div>
                    <p className="text-white/50 text-sm">
                        {t("licenses.info_text")}
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
