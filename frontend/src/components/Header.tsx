import { useNavigate } from 'react-router-dom';

import LangSelector from './LangSelector';
import Logo from '../assets/Logo.png';
import { ROUTES } from '../routes/routes';
import { useUsuario } from '../hooks/usuarioHook';

export default function Header() {
    const navigate = useNavigate();
    const { usuario } = useUsuario();


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
                    className="w-10 h-10 shrink-0 rounded-full cursor-pointer flex items-center justify-center text-white font-bold text-lg shadow-lg hover:opacity-80 transition-opacity"
                    style={{ background: 'linear-gradient(to bottom right, #F0973C, #69AC95)' }}
                    title="Perfil"
                >
                    {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
                </div>
            </div>
        </header>
    );
}
