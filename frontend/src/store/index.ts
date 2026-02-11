import { configureStore } from '@reduxjs/toolkit';
import usuarioReducer from './slice/usuarioSlice';
import authReducer from './slice/authSlice';
import { apiBase } from '../service/apiBase';

export const store = configureStore({
    reducer: {
        auth:authReducer,
        usuario: usuarioReducer,
    },
}); 
// Inicializar el token de apiBase desde sessionStorage al cargar la aplicación
apiBase.initializeAuthFromStorage().catch(console.error);

// Suscribirse a cambios de autenticación para sincronizar el token
store.subscribe(() => {
    const state = store.getState();
    if (state.auth.token) {
        apiBase.syncTokenFromRedux();
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch