import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUsuario } from '../hooks/usuarioHook';
import LangSelector from './LangSelector';
import LogoB from '../assets/LogoB.png';
import { ROUTES } from '../routes/routes';

export default function Header() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { usuario } = useUsuario();

    const ultimoBono = usuario?.bonos?.length || 0 > 0 
        ? usuario?.bonos.reduce((max: { acumulado: number }, bono: { acumulado: number }) => bono.acumulado > max.acumulado ? bono : max, usuario.bonos[0]).acumulado 
        : 0;

    const ultimoDividendo = usuario?.licencia?.saldoAcumulado || 0;

    return (
        <header className="relative z-20 px-6 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-black/90">
            {/* Información: Licencia, Dividendo, Bono */}
            <div className="flex items-center space-x-3 text-sm">
                {/* Licencia */}
                {usuario?.licencia && (
                    <div className="flex flex-col items-center px-4 py-2 rounded-xl border border-[#69AC95]/30 bg-[#69AC95]/10">
                        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{t("header.license")}</span>
                        <span className="font-bold text-[#69AC95]">{usuario.licencia.nombre}</span>
                    </div>
                )}

            </div>

            {/* Logo central */}
            <div className="hidden md:flex items-center justify-center">
                <img
                    src={LogoB}
                    alt="PayGlobal Logo"
                    className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate(ROUTES.USER.HOME)}
                />
            </div>

            {/* Sección derecha: selector de idioma */}
            <div className="flex items-center space-x-4">
                <LangSelector />
            </div>
        </header>
    );
}
