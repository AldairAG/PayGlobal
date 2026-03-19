import {
    PiHouseDuotone,
    PiUserDuotone,
    PiChartBarDuotone,
    PiSealCheckDuotone,
    PiWalletDuotone,
    PiArrowsLeftRightDuotone,
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
    const { cerrarSesion } = useUsuario();

    const menuItems = [
        { name: t("sidebar.home"), icon: <PiHouseDuotone size={22} />, route: ROUTES.USER.HOME },
        { name: t("sidebar.profile"), icon: <PiUserDuotone size={22} />, route: ROUTES.USER.PROFILE },
        { name: t("sidebar.reports"), icon: <PiChartBarDuotone size={22} />, route: ROUTES.USER.HISTORIAL },
        { name: t("sidebar.licenses"), icon: <PiSealCheckDuotone size={22} />, route: ROUTES.USER.LICENCIAS },
        { name: t("sidebar.withdrawal"), icon: <PiWalletDuotone size={22} />, route: ROUTES.USER.RETIRO },
        { name: t("sidebar.internal_transfers"), icon: <PiArrowsLeftRightDuotone size={22} />, route: ROUTES.USER.TRANSFERENCIA_INTERNA },
        { name: t("sidebar.news"), icon: <PiBellRingingDuotone size={22} />, route: ROUTES.USER.NEWS_REPORTS },
        { name: t("sidebar.user_network"), icon: <PiUsersThreeDuotone size={22} />, route: ROUTES.USER.RED_USUARIOS },
        { name: t("sidebar.support"), icon: <PiHeadsetDuotone size={22} />, route: ROUTES.USER.SOPORTE },
    ];

    const handleNavigate = (route: string) => {
        navigate(route);
        onClose();
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
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => handleNavigate(item.route)}
                            className="group flex items-center gap-4 p-3 rounded-lg cursor-pointer transition"
                        >
                            <span
                                className={`shrink-0 p-2 rounded-full border-2 border-[#F0973C] transition-colors duration-150 ${
                                    location.pathname === item.route
                                        ? "text-[#F0973C] bg-[#F0973C]/10"
                                        : "group-hover:text-[#F0973C]"
                                }`}
                            >
                                {item.icon}
                            </span>
                            <span
                                className={`transition-colors duration-150 ${
                                    location.pathname === item.route
                                        ? "text-[#F0973C]"
                                        : "group-hover:text-[#F0973C]"
                                }`}
                            >
                                {item.name}
                            </span>
                        </li>
                    ))}

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
