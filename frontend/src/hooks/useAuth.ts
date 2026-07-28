import { useCallback, useEffect, useRef, useState } from 'react';
import { useUsuario } from './usuarioHook';

const INACTIVITY_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutos
const AUTO_LOGOUT_TIMEOUT_MS = 30 * 1000; // 30 segundos

export const useAuth = () => {
    const {
        usuario,
        loadingUsuarioSeleccionado,
        errorUsuarioSeleccionado,
        recargarUsuarioPorId,
        obtenerFotoPerfil,
        cerrarSesion,
        isAuthenticated,
    } = useUsuario();

    const [showInactivityModal, setShowInactivityModal] = useState(false);
    const idleTimerRef = useRef<number | null>(null);
    const logoutTimerRef = useRef<number | null>(null);

    const clearIdleTimer = useCallback(() => {
        if (idleTimerRef.current !== null) {
            window.clearTimeout(idleTimerRef.current);
            idleTimerRef.current = null;
        }
    }, []);

    const clearLogoutTimer = useCallback(() => {
        if (logoutTimerRef.current !== null) {
            window.clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    }, []);

    const clearTimers = useCallback(() => {
        clearIdleTimer();
        clearLogoutTimer();
    }, [clearIdleTimer, clearLogoutTimer]);

    const logout = useCallback(() => {
        clearTimers();
        setShowInactivityModal(false);
        cerrarSesion();
    }, [clearTimers, cerrarSesion]);

    const startLogoutTimer = useCallback(() => {
        clearLogoutTimer();
        logoutTimerRef.current = window.setTimeout(() => {
            logout();
        }, AUTO_LOGOUT_TIMEOUT_MS);
    }, [clearLogoutTimer, logout]);

    const showModal = useCallback(() => {
        setShowInactivityModal(true);
        startLogoutTimer();
    }, [startLogoutTimer]);

    const resetIdleTimer = useCallback(() => {
        clearTimers();
        setShowInactivityModal(false);

        if (!isAuthenticated) {
            return;
        }

        idleTimerRef.current = window.setTimeout(() => {
            showModal();
        }, INACTIVITY_TIMEOUT_MS);
    }, [clearTimers, isAuthenticated, showModal]);

    const handleActivity = useCallback(() => {
        if (!isAuthenticated) {
            return;
        }

        resetIdleTimer();
    }, [isAuthenticated, resetIdleTimer]);

    const continueSession = useCallback(() => {
        resetIdleTimer();
    }, [resetIdleTimer]);

    useEffect(() => {
        if (!isAuthenticated) {
            clearTimers();
            setShowInactivityModal(false);
            return;
        }

        resetIdleTimer();

        const events: Array<keyof WindowEventMap> = [
            'mousemove',
            'mousedown',
            'keydown',
            'scroll',
            'touchstart',
            'touchmove',
        ];

        events.forEach((eventName) => {
            window.addEventListener(eventName, handleActivity, { passive: true });
        });

        return () => {
            events.forEach((eventName) => {
                window.removeEventListener(eventName, handleActivity);
            });
            clearTimers();
        };
    }, [clearTimers, handleActivity, isAuthenticated, resetIdleTimer]);

    return {
        usuario,
        loadingUsuarioSeleccionado,
        errorUsuarioSeleccionado,
        recargarUsuarioPorId,
        obtenerFotoPerfil,
        showInactivityModal,
        continueSession,
        logout,
        isAuthenticated,
    };
};
