/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Fotter from "../components/Fotter";
import Menu from "../components/modal/Menu";
import { useUsuario } from "../hooks/usuarioHook";
import { useEffect, useState } from "react";
import { PiListDuotone } from "react-icons/pi";
import { ROUTES } from "../routes/routes";


export const UserLayout = () => {
    const { recargarUsuarioPorId, loadingUsuarioSeleccionado, errorUsuarioSeleccionado, usuario,obtenerFotoPerfil } = useUsuario();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (usuario) {
            if(usuario.licencia.precio === 0){
                navigate(ROUTES.USER.LICENCIAS);
            }
            recargarUsuarioPorId(usuario.id);
            obtenerFotoPerfil(usuario.fotoPerfilName||"");
        }
    }, []);

    if (loadingUsuarioSeleccionado) {
        return <div className="flex h-screen items-center justify-center bg-[#000000] text-white/50 text-sm uppercase tracking-widest">Cargando...</div>;
    }

    if (errorUsuarioSeleccionado) {
        return <div className="flex h-screen items-center justify-center bg-[#000000] text-red-400 text-sm">Error: {errorUsuarioSeleccionado}</div>;
    }


    return (
        <div className="flex h-screen bg-[#000000] text-white">
            {/* SideBar ocupa toda la altura */}
            <SideBar />

            {/* Burbuja flotante solo en móvil */}
            <button
                className="sm:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#F0973C] text-white shadow-lg shadow-[#F0973C]/40 active:scale-95 transition-transform duration-150"
                onClick={() => setMenuOpen(true)}
            >
                <PiListDuotone size={26} />
            </button>

            {menuOpen && <Menu onClose={() => setMenuOpen(false)} />}

            {/* Columna derecha: Header + Contenido*/}
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />

                {/* Breadcrumb */}
                

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