import { useNavigate } from 'react-router-dom';

import LangSelector from './LangSelector';
import Logo from '../assets/Logo.png';
import { ROUTES } from '../routes/routes';
import { useUsuario } from '../hooks/usuarioHook';
import { useTranslation } from 'react-i18next';

export default function Header() {
    const navigate = useNavigate();
    const { usuario } = useUsuario();
    const { t } = useTranslation();


    return (
        <header className="relative z-20 px-6 py-4 grid grid-cols-3 items-center border-b border-white/5 backdrop-blur-md bg-black/90">
            {/* Columna izquierda (reservada) */}
            <div />

            {/* Logo central */}
            <div className="flex items-center justify-center">
                <img
                    src={Logo}
                    alt="PayGlobal Logo"
                    className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity hidden md:block"
                    onClick={() => navigate(ROUTES.USER.HOME)}
                />
            </div>

            {/* Sección derecha: selector de idioma + avatar */}
            <div className="flex items-center justify-end gap-4">
                <LangSelector />
                <div
                    onClick={() => navigate(ROUTES.USER.PROFILE)}
                    className="flex items-center gap-3 px-4 py-2 rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/5 cursor-pointer transition-all hover:bg-[#69AC95]/10 hover:border-[#69AC95]/40"
                    title="Perfil"
                >
                    <div className="flex flex-col items-end">
                        <span className="text-white text-sm font-medium leading-tight hidden sm:block">
                            {usuario?.nombre || t("header.user")}
                        </span>
                        <span className="text-[#F0973C] text-xs leading-tight hidden sm:block opacity-80">
                            @{usuario?.username || "usuario"}
                        </span>
                    </div>
                    <div
                        className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                        style={{ background: 'linear-gradient(to bottom right, #F0973C, #69AC95)' }}
                    >
                        {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
}
