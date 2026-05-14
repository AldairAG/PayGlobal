/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Fotter from "../components/Fotter";
import Menu from "../components/modal/Menu";
import { useUsuario } from "../hooks/usuarioHook";
import { useEffect, useRef, useState } from "react";
import { PiListDuotone } from "react-icons/pi";
import { ROUTES } from "../routes/routes";

const INACTIVIDAD_MS = 2 * 60 * 1000; // 2 minutos

export const UserLayout = () => {
    const { recargarUsuarioPorId, loadingUsuarioSeleccionado, errorUsuarioSeleccionado, usuario, obtenerFotoPerfil, cerrarSesion } = useUsuario();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // --- Lógica de inactividad ---
    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            cerrarSesion(); // Usa exactamente la misma función que el botón
        }, INACTIVIDAD_MS);
    };

    useEffect(() => {
        const eventos: (keyof WindowEventMap)[] = [
            "mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"
        ];

        eventos.forEach(e => window.addEventListener(e, resetTimer));
        resetTimer(); // Inicia el timer al montar

        return () => {
            eventos.forEach(e => window.removeEventListener(e, resetTimer));
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);
    // --- Fin lógica de inactividad ---

    useEffect(() => {
        if (usuario) {
            if (usuario.licencia.precio === 0) {
                navigate(ROUTES.USER.LICENCIAS);
            }
            recargarUsuarioPorId(usuario.id);
            obtenerFotoPerfil(usuario.fotoPerfilName || "");
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
            <SideBar />

            <button
                className="sm:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#F0973C] text-white shadow-lg shadow-[#F0973C]/40 active:scale-95 transition-transform duration-150"
                onClick={() => setMenuOpen(true)}
            >
                <PiListDuotone size={26} />
            </button>

            {menuOpen && <Menu onClose={() => setMenuOpen(false)} />}

            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
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