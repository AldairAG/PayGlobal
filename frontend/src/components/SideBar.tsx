import { Home, BadgeCheck, Wallet, FileChartColumn, Repeat, User, Headphones, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUsuario } from "../hooks/usuarioHook";
import { ROUTES } from "../routes/routes";

const SideBar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { usuario } = useUsuario();

    const menuItems = [
        { name: "Home", icon: <Home size={20} />, route: ROUTES.USER.HOME },
        { name: "Licencias", icon: <BadgeCheck size={20} />, route: ROUTES.USER.LICENCIAS },
        { name: "Retirar", icon: <Wallet size={20} />, route: ROUTES.USER.RETIRO },
        { name: "Reportes", icon: <FileChartColumn size={20} />, route: ROUTES.USER.HISTORIAL },
        { name: "Transferencias internas", icon: <Repeat size={20} />, route: ROUTES.USER.TRANSFERENCIA_INTERNA },
        { name: "Perfil", icon: <User size={20} />, route: ROUTES.USER.PROFILE },
        { name: "Soporte", icon: <Headphones size={20} />, route: ROUTES.USER.SOPORTE },
    ];

    return (
        <aside
            className={`text-white shrink-0 p-5 pt-4 transition-all duration-300 
                ${open ? "w-64" : "w-20"} relative z-40 h-full overflow-y-auto`}
            style={{ backgroundColor: '#000000' }}
        >
            {/* Botón toggle arriba del sidebar */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-center p-2 mb-6 rounded-lg transition"
                style={{ backgroundColor: '#1a1a1a' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
            >
                {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>

            {/* Botón de perfil */}
            <div
                onClick={() => navigate(ROUTES.USER.PROFILE)}
                className="flex items-center gap-3 mb-10 cursor-pointer group"
                title="Ir al perfil"
            >
                <div className="w-10 h-10 shrink-0 rounded-full transition-all duration-200 
                               flex items-center justify-center text-white font-bold text-lg shadow-lg"
                     style={{ background: 'linear-gradient(to bottom right, #F0973C, #69AC95)' }}>
                    {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
                </div>
                {open && <span className="text-base font-semibold truncate">{usuario?.nombre || 'Perfil'}</span>}
            </div>

            <ul className="space-y-4">
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => navigate(item.route)}
                        className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition"
                        style={{ 
                            backgroundColor: location.pathname === item.route ? '#69AC95' : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                            if (location.pathname !== item.route) {
                                e.currentTarget.style.backgroundColor = '#2a2a2a';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (location.pathname !== item.route) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }
                        }}
                    >
                        <span className="shrink-0">{item.icon}</span>
                        {open && <span>{item.name}</span>}
                    </li>
                ))}

                <li 
                    className="flex mt-10 items-center gap-4 p-3 rounded-lg cursor-pointer transition"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BC2020'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <span className="shrink-0"><LogOut size={20} /></span>
                    {open && <span>Cerrar sesión</span>}
                </li>
            </ul>
        </aside>
    );
};

export default SideBar;