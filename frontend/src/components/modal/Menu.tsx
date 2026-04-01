import {
    PiHouseDuotone,
    PiUserDuotone,
    PiChartBarDuotone,
    PiSealCheckDuotone,
    PiWalletDuotone,
    PiBellRingingDuotone,
    PiUsersThreeDuotone,
    PiHeadsetDuotone,
    PiSignOutDuotone,
    PiXDuotone,
} from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom";
import { useUsuario } from "../../hooks/usuarioHook";
import { ROUTES } from "../../routes/routes";
import { useTranslation } from "react-i18next";

interface MenuProps {
    onClose: () => void;
}

const Menu = ({ onClose }: MenuProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { cerrarSesion, usuario } = useUsuario();

    // Verificar si el usuario tiene licencia activa
    const tieneLicenciaActiva = usuario?.licencia?.precio && usuario.licencia.precio > 0;

    const menuItems = [
        { name: t("sidebar.home"), icon: <PiHouseDuotone size={22} />, route: ROUTES.USER.HOME, requiresLicense: true },
        { name: t("sidebar.profile"), icon: <PiUserDuotone size={22} />, route: ROUTES.USER.PROFILE, requiresLicense: true },
        { name: t("sidebar.reports"), icon: <PiChartBarDuotone size={22} />, route: ROUTES.USER.HISTORIAL, requiresLicense: true },
        { name: t("sidebar.licenses"), icon: <PiSealCheckDuotone size={22} />, route: ROUTES.USER.LICENCIAS, requiresLicense: false },
        { name: t("sidebar.withdrawal"), icon: <PiWalletDuotone size={22} />, route: ROUTES.USER.RETIRO, requiresLicense: true },
        /* { name: t("sidebar.internal_transfers"), icon: <PiArrowsLeftRightDuotone size={22} />, route: ROUTES.USER.TRANSFERENCIA_INTERNA, requiresLicense: true }, */
        { name: t("sidebar.news"), icon: <PiBellRingingDuotone size={22} />, route: ROUTES.USER.NEWS_REPORTS, requiresLicense: true },
        { name: t("sidebar.user_network"), icon: <PiUsersThreeDuotone size={22} />, route: ROUTES.USER.RED_USUARIOS, requiresLicense: true },
        { name: t("sidebar.support"), icon: <PiHeadsetDuotone size={22} />, route: ROUTES.USER.SOPORTE, requiresLicense: true },
    ];

    const handleNavigate = (route: string, requiresLicense: boolean) => {
        // Solo permitir navegación si no requiere licencia o si tiene licencia activa
        if (!requiresLicense || tieneLicenciaActiva) {
            navigate(route);
            onClose();
        }
    };

    const handleLogout = () => {
        cerrarSesion();
        onClose();
    };

    return (
        /* Overlay */
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70"
            onClick={onClose}
        >
            {/* Panel */}
            <div
                className="w-full max-w-sm rounded-t-2xl text-white p-6 pb-8 animate-slide-up flex flex-col"
                style={{ backgroundColor: '#111111', maxHeight: '85dvh' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header del modal */}
                <div className="flex items-center justify-between mb-6 shrink-0">
                    <span className="text-[#F0973C] font-semibold text-lg">{t("sidebar.menu")}</span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full border-2 border-[#F0973C] text-white hover:text-[#F0973C] transition-colors duration-150"
                    >
                        <PiXDuotone size={20} />
                    </button>
                </div>

                <ul className="space-y-2 overflow-y-auto">
                    {menuItems.map((item, index) => {
                        const isDisabled = item.requiresLicense && !tieneLicenciaActiva;
                        return (
                            <li
                                key={index}
                                onClick={() => handleNavigate(item.route, item.requiresLicense)}
                                className={`group flex items-center gap-4 p-3 rounded-lg transition ${
                                    isDisabled 
                                        ? 'opacity-50 cursor-not-allowed' 
                                        : 'cursor-pointer'
                                }`}
                            >
                                <span
                                    className={`shrink-0 p-2 rounded-full border-2 border-[#F0973C] transition-colors duration-150 ${
                                        location.pathname === item.route
                                            ? "text-[#F0973C] bg-[#F0973C]/10"
                                            : isDisabled 
                                                ? 'text-gray-500' 
                                                : "group-hover:text-[#F0973C]"
                                    }`}
                                >
                                    {item.icon}
                                </span>
                                <span
                                    className={`transition-colors duration-150 ${
                                        location.pathname === item.route
                                            ? "text-[#F0973C]"
                                            : isDisabled 
                                                ? 'text-gray-500' 
                                                : "group-hover:text-[#F0973C]"
                                    }`}
                                >
                                    {item.name}
                                </span>
                            </li>
                        );
                    })}

                    <li
                        className="group flex items-center gap-4 p-3 mt-4 rounded-lg cursor-pointer transition"
                        onClick={handleLogout}
                    >
                        <span className="shrink-0 p-2 rounded-full border-2 border-red-500 transition-colors duration-150 group-hover:text-red-500">
                            <PiSignOutDuotone size={22} />
                        </span>
                        <span className="group-hover:text-red-500 transition-colors duration-150">
                            {t("sidebar.log_out")}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Menu;
