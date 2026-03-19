import { useNavigate } from 'react-router-dom';

import LangSelector from './LangSelector';
import Logo from '../assets/Logo.png';
import { ROUTES } from '../routes/routes';
import { useUsuario } from '../hooks/usuarioHook';
import { useTranslation } from 'react-i18next';

export default function Header() {
    const navigate = useNavigate();
    const { usuario,fotoPerfil,loadingObtenerFotoPerfil } = useUsuario();
    const { t } = useTranslation();


    return (
        <header className="relative z-20 px-6 py-4 border-b border-white/5 backdrop-blur-md bg-black/90">

            {/* DESKTOP: 3 columnas */}
            <div className="hidden md:grid grid-cols-3 items-center">
                <div />
                <div className="flex items-center justify-center">
                    <img
                        src={Logo}
                        alt="PayGlobal Logo"
                        className="h-20 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate(ROUTES.USER.HOME)}
                    />
                </div>
                <div className="flex items-center justify-end gap-4">
                    <LangSelector />
                    <div
                        onClick={() => navigate(ROUTES.USER.PROFILE)}
                        className="flex items-center gap-3 px-4 py-2 rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/5 cursor-pointer transition-all hover:bg-[#69AC95]/10 hover:border-[#69AC95]/40"
                        title="Perfil"
                    >
                        <div className="flex flex-col items-end">
                            <span className="text-white text-sm font-medium leading-tight">
                                {usuario?.nombre || t("header.user")}
                            </span>
                            <span className="text-[#F0973C] text-xs leading-tight opacity-80">
                                {usuario?.username || "usuario"}
                            </span>
                        </div>
                        <div
                            className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden"
                            style={{ background: loadingObtenerFotoPerfil ? 'linear-gradient(to bottom right, #F0973C, #69AC95)' : 'transparent' }}
                        >
                            {loadingObtenerFotoPerfil ? (
                                <div className="w-full h-full bg-gradient-to-r from-[#F0973C] to-[#69AC95] animate-pulse" />
                            ) : fotoPerfil ? (
                                <img src={URL.createObjectURL(fotoPerfil)} alt="Perfil" className="w-full h-full object-cover" />
                            ) : (
                                usuario?.nombre?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MÓVIL: logo arriba centrado, acciones abajo centradas */}
            <div className="flex flex-col items-center gap-3 md:hidden">
                <img
                    src={Logo}
                    alt="PayGlobal Logo"
                    className="h-16 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate(ROUTES.USER.HOME)}
                />
                <div className="flex items-center gap-3">
                    <LangSelector />
                    <div
                        onClick={() => navigate(ROUTES.USER.PROFILE)}
                        className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/5 cursor-pointer transition-all hover:bg-[#69AC95]/10 hover:border-[#69AC95]/40"
                        title="Perfil"
                    >
                        <div className="flex flex-col items-end">
                            <span className="text-white text-sm font-medium leading-tight">
                                {usuario?.nombre || t("header.user")}
                            </span>
                            <span className="text-[#F0973C] text-xs leading-tight opacity-80">
                                {usuario?.username || "usuario"}
                            </span>
                        </div>
                        <div
                            className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-base shadow-lg overflow-hidden"
                            style={{ background: loadingObtenerFotoPerfil ? 'linear-gradient(to bottom right, #F0973C, #69AC95)' : 'transparent' }}
                        >
                            {loadingObtenerFotoPerfil ? (
                                <div className="w-full h-full bg-gradient-to-r from-[#F0973C] to-[#69AC95] animate-pulse" />
                            ) : fotoPerfil ? (
                                <img src={URL.createObjectURL(fotoPerfil)} alt="Perfil" className="w-full h-full object-cover" />
                            ) : (
                                usuario?.nombre?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </header>
    );
}
