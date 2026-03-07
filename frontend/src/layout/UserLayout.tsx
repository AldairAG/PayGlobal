/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Fotter from "../components/Fotter";
import { useUsuario } from "../hooks/usuarioHook";
import { useEffect } from "react";


export const UserLayout = () => {
    const { recargarUsuarioPorId, loadingUsuarioSeleccionado, errorUsuarioSeleccionado, usuario } = useUsuario();



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


    return (
        <div className="flex h-screen bg-[#000000] text-white">
            {/* SideBar ocupa toda la altura */}
            <SideBar />

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