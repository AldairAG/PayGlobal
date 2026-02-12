import { Outlet, useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Fotter from "../components/Fotter";
import { ROUTES } from "../routes/routes";
import { Home, ChevronRight } from "lucide-react";


export const UserLayout = () => {
    const location = useLocation();

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

    const currentPageName = routeNames[location.pathname] || 'Página';

    return (
        <div className="flex h-screen ">
            {/* SideBar ocupa toda la altura */}
            <SideBar />

            {/* Columna derecha: Header + Contenido*/}
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />

                {/* Breadcrumb */}
                <div className="px-6 py-3 border-b" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                    <div className="flex items-center justify-center space-x-2 text-sm">
                        <Link
                            to={ROUTES.USER.HOME}
                            className="flex items-center hover:opacity-70 transition"
                            style={{ color: '#69AC95' }}
                        >
                            <Home size={16} />
                        </Link>
                        {location.pathname !== ROUTES.USER.HOME && (
                            <>
                                <ChevronRight size={16} style={{ color: '#9ca3af' }} />
                                <span className="font-medium" style={{ color: '#374151' }}>
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