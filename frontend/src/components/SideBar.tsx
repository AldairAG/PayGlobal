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
    PiCompassToolBold,
    PiCurrencyBtcDuotone,
} from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom";
import { useUsuario } from "../hooks/usuarioHook";
import { ROUTES } from "../routes/routes";
import { useTranslation } from 'react-i18next';


const SideBar = () => {
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
        { name: t("sidebar.news"), icon: <PiBellRingingDuotone size={22} />, route: ROUTES.USER.NEWS_REPORTS, requiresLicense: true },
        /*{ name: t("sidebar.internal_transfers"), icon: <PiArrowsLeftRightDuotone size={22} />, route: ROUTES.USER.TRANSFERENCIA_INTERNA, requiresLicense: true },*/        
        { name: t("sidebar.tools"), icon: <PiCompassToolBold size={22} />, route: ROUTES.USER.TOOLS, requiresLicense: true },
        { name: "BTC mining loading...", icon: <PiCurrencyBtcDuotone size={22} />, route: "#", requiresLicense: true, disabled: true },
        { name: t("sidebar.user_network"), icon: <PiUsersThreeDuotone size={22} />, route: ROUTES.USER.RED_USUARIOS, requiresLicense: true },
        { name: t("sidebar.support"), icon: <PiHeadsetDuotone size={22} />, route: ROUTES.USER.SOPORTE, requiresLicense: true },
    ];

    const handleNavigate = (route: string, requiresLicense: boolean) => {
        // Solo permitir navegación si no requiere licencia o si tiene licencia activa
        if (!requiresLicense || tieneLicenciaActiva) {
            navigate(route);
        }
    };

    return (
        <aside
            className="hidden sm:flex flex-col text-white shrink-0 p-5 pt-4 transition-all duration-300 sm:w-64 relative z-40 h-full overflow-y-auto"
            style={{ backgroundColor: '#000000' }}
        >
            <ul className="space-y-4">
                {menuItems.map((item, index) => {
                    const isDisabled = item.requiresLicense && !tieneLicenciaActiva || item.disabled;
                    return (
                        <li
                            key={index}
                            onClick={() => !item.disabled && handleNavigate(item.route, item.requiresLicense)}
                            className={`group flex items-center gap-4 p-3 rounded-lg transition ${
                                isDisabled 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'cursor-pointer'
                            }`}
                        >
                            <span className={`shrink-0 p-2 rounded-full border-2 border-[#F0973C] transition-colors duration-150 ${
                                location.pathname === item.route ? 'text-[#F0973C] bg-[#F0973C]/10' : 
                                isDisabled ? 'text-gray-500' : 'group-hover:text-[#F0973C]'
                            }`}>{item.icon}</span>
                            <span className={`hidden sm:inline transition-colors duration-150 ${
                                location.pathname === item.route ? 'text-[#F0973C]' : 
                                isDisabled ? 'text-gray-500' : 'group-hover:text-[#F0973C]'
                            }`}>
                                {item.name}
                            </span>
                        </li>
                    );
                })}

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