import { useNavigate } from 'react-router-dom';

import LangSelector from './LangSelector';
import LogoA from '../assets/LogoA.png';
import { ROUTES } from '../routes/routes';

export default function Header() {
    const navigate = useNavigate();


    return (
        <header className="relative z-20 px-6 py-4 grid grid-cols-3 items-center border-b border-white/5 backdrop-blur-md bg-black/90">
            {/* Columna izquierda (reservada) */}
            <div />

            {/* Logo central */}
            <div className="flex items-center justify-center">
                <img
                    src={LogoA}
                    alt="PayGlobal Logo"
                    className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity hidden md:block"
                    onClick={() => navigate(ROUTES.USER.HOME)}
                />
            </div>

            {/* Sección derecha: selector de idioma */}
            <div className="flex items-center justify-end">
                <LangSelector />
            </div>
        </header>
    );
}
