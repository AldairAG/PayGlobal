import { configureStore } from '@reduxjs/toolkit';
import usuarioReducer from './slice/usuarioSlice';
import authReducer from './slice/authSlice';

export const store = configureStore({
    reducer: {
        auth:authReducer,
        usuario: usuarioReducer,
    },
}); 
// Importar apiBase dinámicamente para evitar dependencia circular
(async () => {
    try {
        const module = await import('../service/apiBase');
        const { apiBase } = module;

        // Inyectar el store en apiBase
        apiBase.setStore(store);

        // Inicializar el token de apiBase desde sessionStorage al cargar la aplicación
        apiBase.initializeAuthFromStorage().catch(console.error);

        // Suscribirse a cambios de autenticación para sincronizar el token
        store.subscribe(() => {
            const state = store.getState();
            if (state.auth.token) {
                apiBase.syncTokenFromRedux();
            }
        });
    } catch (error) {
        console.error('Error al inicializar apiBase dinámicamente:', error);
    }
})();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch