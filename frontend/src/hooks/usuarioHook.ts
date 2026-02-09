import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../store';
import {
    registrarThunk,
    loginThunk,
    logout,
} from '../store/slice/usuarioSlice';
import type { RegistroRequestDTO, LoginRequestDTO } from '../type/requestTypes';

/**
 * Hook personalizado para manejo de autenticación (Login y Registro)
 * Proporciona métodos y estados para registrar nuevos usuarios e iniciar sesión
 */
export const useUsuario = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Seleccionar estados del usuario desde Redux
    const usuario = useSelector((state: RootState) => state.usuario.usuario);
    const token = useSelector((state: RootState) => state.usuario.token);
    const isAuthenticated = useSelector((state: RootState) => state.usuario.isAuthenticated);

    // Estados de Registro
    const loadingRegistro = useSelector((state: RootState) => state.usuario.loadingRegistro);
    const errorRegistro = useSelector((state: RootState) => state.usuario.errorRegistro);

    // Estados de Login
    const loadingLogin = useSelector((state: RootState) => state.usuario.loadingLogin);
    const errorLogin = useSelector((state: RootState) => state.usuario.errorLogin);

    /**
     * Función para registrar un nuevo usuario
     * @param registroData - Datos de registro (username, password, email, referenciado)
     * @returns Promise con la respuesta del servidor
     */
    const registrar = async (registroData: RegistroRequestDTO) => {
        try {
            const result = await dispatch(registrarThunk(registroData));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            throw error;
        }
    };

    /**
     * Función para iniciar sesión
     * @param loginData - Credenciales (username, password)
     * @returns Promise con la respuesta del servidor
     */
    const login = async (loginData: LoginRequestDTO) => {
        try {
            const result = await dispatch(loginThunk(loginData));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    };

    /**
     * Función para cerrar sesión
     * Limpia el estado del usuario, token e isAuthenticated
     */
    const cerrarSesion = () => {
        dispatch(logout());
    };

    // Retornar objeto con métodos y estados
    return {
        // Datos del usuario
        usuario,
        token,
        isAuthenticated,

        // Métodos de autenticación
        registrar,
        login,
        cerrarSesion,

        // Estados de Registro
        loadingRegistro,
        errorRegistro,

        // Estados de Login
        loadingLogin,
        errorLogin,
    };
};
