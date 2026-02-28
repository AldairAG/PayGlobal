import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUsuario } from '../hooks/usuarioHook';
import LangSelector from './LangSelector';
import Logo from '../assets/Logo.png';
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
        <header className="shadow-md px-6 py-4 flex items-center justify-between border-b" 
                style={{ backgroundColor: '#FFFFFF', borderColor: '#e5e7eb' }}>
            {/* Informaci\u00f3n: Licencia, Dividendo, Bono */}
            <div className="flex items-center space-x-6 text-sm">
                {/* Licencia */}
                {usuario?.licencia && (
                    <div className="flex flex-col items-center px-4 py-2 rounded-lg border" 
                         style={{ backgroundColor: '#e8f5f1', borderColor: '#69AC95' }}>
                        <span className="font-medium" style={{ color: '#4a5568' }}>{t("header.license")}</span>
                        <span className="font-bold" style={{ color: '#69AC95' }}>{usuario.licencia.nombre}</span>
                    </div>
                )}

                {/* Último dividendo */}
                <div className="flex flex-col items-center px-4 py-2 rounded-lg border" 
                     style={{ backgroundColor: '#e8f5f1', borderColor: '#69AC95' }}>
                    <span className="font-medium" style={{ color: '#4a5568' }}>{t("header.last_dividend")}</span>
                    <span className="font-bold" style={{ color: '#69AC95' }}>${ultimoDividendo.toFixed(2)}</span>
                </div>

                {/* Último bono */}
                <div className="flex flex-col items-center px-4 py-2 rounded-lg border" 
                     style={{ backgroundColor: '#fef3e8', borderColor: '#F0973C' }}>
                    <span className="font-medium" style={{ color: '#4a5568' }}>{t("header.last_bonus")}</span>
                    <span className="font-bold" style={{ color: '#F0973C' }}>${(ultimoBono||0).toFixed(2)}</span>
                </div>

                
            </div>
            <div className="flex items-center justify-center m-0 p-0">
                <img
                    src={Logo}
                    alt="PayGlobal Logo"
                    className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate(ROUTES.USER.HOME)}
                />
            </div>

            {/* Sección derecha: Logo y selector de idioma */}
            <div className="flex items-center space-x-4">
                {/* Selector de idioma */}
                <LangSelector />                
            </div>
        </header>
    );
}
