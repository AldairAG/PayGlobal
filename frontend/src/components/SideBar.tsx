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
} from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom";
import { useUsuario } from "../hooks/usuarioHook";
import { ROUTES } from "../routes/routes";
import { useTranslation } from 'react-i18next';


const SideBar = () => {
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
        { name: t("sidebar.news"), icon: <PiBellRingingDuotone size={22} />, route: ROUTES.USER.NOVEDADES },
        { name: t("sidebar.user_network"), icon: <PiUsersThreeDuotone size={22} />, route: ROUTES.USER.RED_USUARIOS },
        { name: t("sidebar.support"), icon: <PiHeadsetDuotone size={22} />, route: ROUTES.USER.SOPORTE },
    ];

    const handleNavigate = (route: string) => {
        navigate(route);
    };

    return (
        <aside
            className="text-white shrink-0 p-5 pt-4 transition-all duration-300 w-20 sm:w-64 relative z-40 h-full overflow-y-auto"
            style={{ backgroundColor: '#000000' }}
        >
            <ul className="space-y-4">
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => handleNavigate(item.route)}
                        className="group flex items-center gap-4 p-3 rounded-lg cursor-pointer transition"
                    >
                        <span className={`shrink-0 transition-colors duration-150 ${location.pathname === item.route ? 'text-[#F0973C]' : ''}`}>{item.icon}</span>
                        <span className={`hidden sm:inline transition-colors duration-150 ${location.pathname === item.route ? 'text-[#F0973C]' : 'group-hover:text-[#F0973C]'}`}>
                            {item.name}
                        </span>
                    </li>
                ))}

                <li 
                    className="group flex mt-10 items-center gap-4 p-3 rounded-lg cursor-pointer transition"
                    onClick={cerrarSesion}
                >
                    <span className="shrink-0"><PiSignOutDuotone size={22} /></span>
                    <span className="hidden sm:inline group-hover:text-red-500 transition-colors duration-150">
                        {t("sidebar.log_out")}
                    </span>
                </li>
            </ul>
        </aside>
    );
};

export default SideBar;