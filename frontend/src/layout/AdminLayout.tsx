import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LayoutDashboard, Users, ShieldCheck, CreditCard, LogOut } from "lucide-react";
import logo from '../assets/Logo.png';
import { ROUTES } from "../routes/routes";
import { logout } from "../store/slice/authSlice";

const menuOptions = {
    dashboard: {name: 'Dashboard', ruta: ROUTES.ADMIN.DASHBOARD, Icon: LayoutDashboard},
    users: {name: 'Explorador de usuarios', ruta: ROUTES.ADMIN.USERS_EXPLORER, Icon: Users},
    kyc: {name: 'KYC', ruta: ROUTES.ADMIN.GESTION_KYC, Icon: ShieldCheck},
    pagos: {name: 'Gestión de Pagos', ruta: ROUTES.ADMIN.GESTION_PAGOS, Icon: CreditCard},  
}

export const AdminLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate(ROUTES.LANDING);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-[280px] bg-gray-800 text-white flex flex-col shadow-lg">
                {/* Logo Section */}
                <div className="px-5 py-6 border-b border-white/10 flex items-center justify-center">
                    <img src={logo} alt="PayGlobal Logo" className="h-[50px]" />
                </div>

                {/* Menu Options */}
                <nav className="flex-1 py-5">
                    {Object.entries(menuOptions).map(([key, option]) => {
                        const isActive = location.pathname === option.ruta;
                        const IconComponent = option.Icon;
                        return (
                            <NavLink
                                key={key}
                                to={option.ruta}
                                className={`
                                    flex items-center px-6 py-3.5 text-[15px] no-underline transition-all duration-200
                                    ${isActive 
                                        ? 'text-[#69AC95] bg-[#69AC95]/10 font-semibold border-l-4 border-[#69AC95]' 
                                        : 'text-gray-300 font-normal border-l-4 border-transparent hover:bg-white/5 hover:text-white'
                                    }
                                `}
                            >
                                <IconComponent size={20} className="mr-3" />
                                <span>{option.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="px-5 py-5 border-t border-white/10 text-center text-gray-400 text-[13px]">
                    Panel de Administración
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white px-8 py-4 shadow-sm flex justify-between items-center">
                    <div>
                        <h1 className="m-0 text-2xl font-semibold text-gray-800">
                            Panel de Administración
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Gestiona tu plataforma PayGlobal
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-200"
                    >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}