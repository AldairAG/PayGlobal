import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import type { AppDispatch, RootState } from '../store';
import type { RegistroRequestDTO, LoginRequestDTO } from '../type/requestTypes';
import type { Usuario } from '../type/entityTypes';
import { logout } from '../store/slice/authSlice';
import { registro, login as loginThunk } from '../store/slice/authSlice';
import { setUsuario, solicitarCompraLicenciaThunk } from '../store/slice/usuarioSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routes';
import { usuarioService } from '../service/usuarioService';
import { TipoCrypto, TipoSolicitud } from '../type/enum';

interface JwtPayload {
    sub: string;
    rol?: string;
    exp: number;
    iat: number;
}

/**
 * Hook personalizado para manejo de autenticación (Login y Registro)
 * Proporciona métodos y estados para registrar nuevos usuarios e iniciar sesión
 */
export const useUsuario = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    // Seleccionar estados del usuario desde Redux
    const usuario = useSelector((state: RootState) => state.usuario.usuario);
    const token = useSelector((state: RootState) => state.auth.token);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

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
            const result = await dispatch(registro(registroData));
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

            if (result.payload && typeof result.payload === 'object' && 'usuario' in result.payload) {
                dispatch(setUsuario((result.payload as { usuario: Usuario }).usuario)); // Guardar datos del usuario en el estado
            }

            const ruta = obtenerRutaSegunRol();
            navigate(ruta); // Redirigir según el rol del usuario

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

    /**
     * Función para obtener el rol del usuario desde el token JWT
     * @returns El rol del usuario o null si no hay token o es inválido
     */
    const obtenerRolDesdeToken = (): string | null => {
        if (!token) return null;

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            return decoded.rol || null;
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return null;
        }
    };

    /**
     * Función para obtener la ruta de redirección según el rol del usuario
     * @returns La ruta correspondiente al rol del usuario
     */
    const obtenerRutaSegunRol = (): string => {
        const rol = obtenerRolDesdeToken();

        switch (rol) {
            case 'ROLE_ADMIN':
                return ROUTES.ADMIN.DASHBOARD;
            case 'ROLE_USUARIO':
                return ROUTES.USER.HOME;
            default:
                return ROUTES.LANDING;
        }
    };

    const solicitarCompraLicencia = async (tipoCrypto: TipoCrypto, tipoLicencia: string, tipoSolicitud: TipoSolicitud) => {
        try {
            const result = await dispatch(solicitarCompraLicenciaThunk({tipoCrypto, tipoLicencia, tipoSolicitud}));
        } catch (error) {
            console.error('Error al solicitar compra de licencia:', error);
        }
    }

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


        //Metodos de usuario
        solicitarCompraLicencia
    };
};
