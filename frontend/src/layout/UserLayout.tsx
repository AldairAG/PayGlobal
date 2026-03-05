/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet, useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Fotter from "../components/Fotter";
import { ROUTES } from "../routes/routes";
import { Home, ChevronRight } from "lucide-react";
import { useUsuario } from "../hooks/usuarioHook";
import { useEffect } from "react";


export const UserLayout = () => {
    const location = useLocation();
    const { recargarUsuarioPorId, loadingUsuarioSeleccionado, errorUsuarioSeleccionado, usuario } = useUsuario();

    // Mapeo de rutas a nombres legibles
    const routeNames: { [key: string]: string } = {
        [ROUTES.USER.HOME]: 'Home',
        [ROUTES.USER.LICENCIAS]: 'Licencias',
        [ROUTES.USER.RETIRO]: 'Retirar',
        [ROUTES.USER.HISTORIAL]: 'Reportes',
        [ROUTES.USER.TRANSFERENCIA_INTERNA]: 'Transferencias Internas',
        [ROUTES.USER.PROFILE]: 'Perfil',
        [ROUTES.USER.SOPORTE]: 'Soporte',
    };

    useEffect(() => {
        if (usuario) {
            recargarUsuarioPorId(usuario.id);
        }
    }, []);

    if (loadingUsuarioSeleccionado) {
        return <div className="flex h-screen items-center justify-center bg-[#000000] text-white/50 text-sm uppercase tracking-widest">Cargando...</div>;
    }

    if (errorUsuarioSeleccionado) {
        return <div className="flex h-screen items-center justify-center bg-[#000000] text-red-400 text-sm">Error: {errorUsuarioSeleccionado}</div>;
    }

    const currentPageName = routeNames[location.pathname] || 'Página';

    return (
        <div className="flex h-screen bg-[#000000] text-white">
            {/* SideBar ocupa toda la altura */}
            <SideBar />

            {/* Columna derecha: Header + Contenido*/}
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />

                {/* Breadcrumb */}
                <div className="px-6 py-3 border-b border-white/5 bg-black/60 backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-2 text-sm">
                        <Link
                            to={ROUTES.USER.HOME}
                            className="flex items-center text-[#69AC95] hover:text-[#69AC95]/70 transition-colors"
                        >
                            <Home size={16} />
                        </Link>
                        {location.pathname !== ROUTES.USER.HOME && (
                            <>
                                <ChevronRight size={16} className="text-white/20" />
                                <span className="font-medium text-white/50 uppercase tracking-wider text-xs">
                                    {currentPageName}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto">
                    <Outlet />

                    <div className="block">
                        <Fotter />
                    </div>
                </main>




            </div>

        </div>
    );
}