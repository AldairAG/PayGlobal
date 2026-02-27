import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import type { AppDispatch, RootState } from '../store';
import type { RegistroRequestDTO, LoginRequestDTO, EditarPerfilRequestDTO } from '../type/requestTypes';
import { logout } from '../store/slice/authSlice';
import { registro, login as loginThunk } from '../store/slice/authSlice';
import { obtenerSolicitudesThunk, obtenerTodosLosUsuariosThunk, rechazarSolicitudThunk, setUsuario, solicitarCompraLicenciaThunk, aprobarCompraLicenciaThunk, editarPerfilThunk, obtenerUsuarioPorIdThunk, obtenerUsuariosEnRedThunk, solicitarRetiroFondosThunk, setUsuarioEnRed, transferenciaEntreUsuariosThunk, editarUsuarioAdminThunk, setUsuarioSeleccionado } from '../store/slice/usuarioSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routes';
import { TipoCrypto, TipoSolicitud, TipoWallets } from '../type/enum';
import type { Usuario } from '../type/entityTypes';

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

    const usuarioEnRed = useSelector((state: RootState) => state.usuario.usuarioEnRed);

    // Estados de Registro
    const loadingRegistro = useSelector((state: RootState) => state.usuario.loadingRegistro);
    const errorRegistro = useSelector((state: RootState) => state.usuario.errorRegistro);

    // Estados de Login
    const loadingLogin = useSelector((state: RootState) => state.usuario.loadingLogin);
    const errorLogin = useSelector((state: RootState) => state.usuario.errorLogin);

    // Estados de solicitudes pendientes
    const solicitudes = useSelector((state: RootState) => state.usuario.solicitudes);
    const loadingSolicitudes = useSelector((state: RootState) => state.usuario.loadingSolicitudes);
    const errorSolicitudes = useSelector((state: RootState) => state.usuario.errorSolicitudes);

    // Estados de usuarios
    const usuarios = useSelector((state: RootState) => state.usuario.usuarios);
    const loadingUsuarios = useSelector((state: RootState) => state.usuario.loadingUsuarios);
    const errorUsuarios = useSelector((state: RootState) => state.usuario.errorUsuarios);

    // Estados de aprobar solicitud
    const loadingAprobarSolicitud = useSelector((state: RootState) => state.usuario.loadingAprobarCompraLicencia);
    const errorAprobarSolicitud = useSelector((state: RootState) => state.usuario.errorAprobarCompraLicencia);

    // Estados de rechazar solicitud
    const loadingRechazarSolicitud = useSelector((state: RootState) => state.usuario.loadingRechazarSolicitud);
    const errorRechazarSolicitud = useSelector((state: RootState) => state.usuario.errorRechazarSolicitud);

    // Estados de retiro de fondos
    const loadingSolicitarRetiroFondos = useSelector((state: RootState) => state.usuario.loadingSolicitarRetiroFondos);
    const errorSolicitarRetiroFondos = useSelector((state: RootState) => state.usuario.errorSolicitarRetiroFondos);

    // Estados de Editar Perfil
    const loadingEditarPerfil = useSelector((state: RootState) => state.usuario.loadingEditarPerfil);
    const errorEditarPerfil = useSelector((state: RootState) => state.usuario.errorEditarPerfil);

    // Estado de usuario seleccionado (para admin)
    const usuarioSeleccionado = useSelector((state: RootState) => state.usuario.usuarioSeleccionado);
    const loadingUsuarioSeleccionado = useSelector((state: RootState) => state.usuario.loadingUsuarioSeleccionado);
    const errorUsuarioSeleccionado = useSelector((state: RootState) => state.usuario.errorUsuarioSeleccionado);

    const usuariosEnRed = useSelector((state: RootState) => state.usuario.usuariosEnRed);
    const loadingUsuariosEnRed = useSelector((state: RootState) => state.usuario.loadingUsuariosEnRed);
    const errorUsuariosEnRed = useSelector((state: RootState) => state.usuario.errorUsuariosEnRed);

    // Estados de transferencia entre usuarios
    const loadingTransferenciaEntreUsuarios = useSelector((state: RootState) => state.usuario.loadingTransferenciaEntreUsuarios);
    const errorTransferenciaEntreUsuarios = useSelector((state: RootState) => state.usuario.errorTransferenciaEntreUsuarios);

    const loadingEditarUsuarioAdmin = useSelector((state: RootState) => state.usuario.loadingEditarUsuarioAdmin);
    const errorEditarUsuarioAdmin = useSelector((state: RootState) => state.usuario.errorEditarUsuarioAdmin);

    /**
     * Función para registrar un nuevo usuario
     * @param registroData - Datos de registro (username, password, email, referenciado)
     * @returns Promise con la respuesta del servidor
     */
    const registrar = async (registroData: RegistroRequestDTO) => {
        try {
            const result = await dispatch(registro(registroData));
            const data = unwrapResult(result).data;
            if (data) {
                dispatch(setUsuario(data.user));
            }
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
            const data= unwrapResult(result).data;
            if (data) {
                dispatch(setUsuario(data.user)); 
                dispatch(setUsuarioEnRed(data.usuarioEnRed)); // Guardar datos del usuario en el estado
            }

            const ruta = obtenerRutaSegunRol(data.token);
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
        navigate(ROUTES.LANDING); // Redirigir a la página de inicio después de cerrar sesión
    };

    /**
     * Función para obtener el rol del usuario desde el token JWT
     * @returns El rol del usuario o null si no hay token o es inválido
     */
    const obtenerRolDesdeToken = (token: string): string | null => {
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
    const obtenerRutaSegunRol = (token: string): string => {
        const rol = obtenerRolDesdeToken(token);

        switch (rol) {
            case 'ROLE_ADMINISTRADOR':
                return ROUTES.ADMIN.DASHBOARD;
            case 'ROLE_USUARIO':
                return ROUTES.USER.HOME;
            default:
                return ROUTES.LANDING;
        }
    };

    /**
     * Función para editar el perfil del usuario autenticado
     * @param editarPerfilData - Datos del perfil (nombre, apellido, telefono, pais)
     * @returns Promise con la respuesta del servidor
     */
    const editarPerfil = async (editarPerfilData: EditarPerfilRequestDTO) => {
        try {
            const result = await dispatch(editarPerfilThunk(editarPerfilData));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al editar perfil:', error);
            throw error;
        }
    };

    const solicitarCompraLicencia = async (tipoCrypto: TipoCrypto, tipoLicencia: string, tipoSolicitud: TipoSolicitud) => {
        try {
            await dispatch(solicitarCompraLicenciaThunk({ tipoCrypto, tipoLicencia, tipoSolicitud }));
        } catch (error) {
            console.error('Error al solicitar compra de licencia:', error);
        }
    }

    const obtenerSolicitudes = async (page: number = 0, size: number = 25, sort?: string) => {
        try {
            const result = await dispatch(obtenerSolicitudesThunk({ page, size, sort }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al obtener solicitudes:', error);
            throw error;
        }
    };

    const obtenerTodosLosUsuarios = async (filtro?: string, page: number = 0, size: number = 10, sort?: string) => {
        try {
            const result = await dispatch(obtenerTodosLosUsuariosThunk({ filtro, page, size, sort }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    };

    const aprobarSolicitud = async (id: number) => {
        try {
            const result = await dispatch(aprobarCompraLicenciaThunk({ idSolicitud: id }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al aprobar solicitud:', error);
            throw error;
        }
    };

    const rechazarSolicitud = async (id: number) => {
        try {
            const result = await dispatch(rechazarSolicitudThunk({ idSolicitud: id }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al rechazar solicitud:', error);
            throw error;
        }
    };

    const obtenerUsuarioPorId = async (id: number) => {
        try {
            const result = await dispatch(obtenerUsuarioPorIdThunk({ idUsuario: id }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al obtener usuario por ID:', error);
            throw error;
        }
    };

    const recargarUsuarioPorId = async (id: number) => {
        try {
            const result = await dispatch(obtenerUsuarioPorIdThunk({ idUsuario: id }));
            const usuarioActualizado = unwrapResult(result).data;
            dispatch(setUsuario(usuarioActualizado)); // Actualizar el estado del usuario con los datos obtenidos
        } catch (error) {
            console.error('Error al recargar usuario por ID:', error);
            throw error;
        }
    };

    const obtenerUsuariosEnRed = async (username: string) => {
        try {
            const result =await dispatch(obtenerUsuariosEnRedThunk({ username }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al obtener usuarios en red:', error);
            throw error;
        }
    };

    const solicitarRetiro = async (walletAddressId: number, monto: number, tipoSolicitud: string) => {
        try {
            await dispatch(solicitarRetiroFondosThunk({ walletAddressId, monto, tipoSolicitud }));   
        } catch (error) {
            console.error('Error al solicitar retiro:', error);
            throw error;
        }
    };

    /**
     * Función para realizar transferencia entre usuarios
     * @param usuarioDestinatario - Username del usuario destinatario
     * @param monto - Monto a transferir
     * @param tipoWallet - Tipo de wallet (DIVIDENDOS o COMISIONES)
     * @returns Promise con la respuesta del servidor
     */
    const transferenciaEntreUsuarios = async (usuarioDestinatario: string, monto: number, tipoWallet: TipoWallets) => {
        try {
            const result = await dispatch(transferenciaEntreUsuariosThunk({ usuarioDestinatario, monto, tipoWallet }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al realizar transferencia entre usuarios:', error);
            throw error;
        }
    };

    const editarUsuarioAdmin = async (usuario: Usuario) => {
        try {
            const result = await dispatch(editarUsuarioAdminThunk(usuario));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al editar usuario (Admin):', error);
            throw error;
        }
    };

    const handleSetUsuarioSeleccionado = (usuario: Usuario | null) => {
        dispatch(setUsuarioSeleccionado(usuario));
     };

    // Retornar objeto con métodos y estados
    return {
        // Datos del usuario
        usuario,
        token,
        isAuthenticated,
        recargarUsuarioPorId,

        usuarioEnRed,

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

        // Estados de usuarios
        usuarios,
        loadingUsuarios,
        errorUsuarios,
        obtenerTodosLosUsuarios,

        // Método y estados de Editar Perfil
        editarPerfil,
        loadingEditarPerfil,
        errorEditarPerfil,
        //Metodos de usuario
        solicitarCompraLicencia,

        //Estados de solicitudes pendientes
        solicitudes,
        loadingSolicitudes,
        errorSolicitudes,
        obtenerSolicitudes,

        // aprobarSolicitud
        aprobarSolicitud,
        loadingAprobarSolicitud,
        errorAprobarSolicitud,

        // rechazarSolicitud
        rechazarSolicitud,
        loadingRechazarSolicitud,
        errorRechazarSolicitud,

        // Obtener usuario por ID
        obtenerUsuarioPorId,
        usuarioSeleccionado,
        loadingUsuarioSeleccionado,
        errorUsuarioSeleccionado,

        // Obtener usuarios en red
        obtenerUsuariosEnRed,
        usuariosEnRed,
        loadingUsuariosEnRed,
        errorUsuariosEnRed,

        // Solicitar retiro
        solicitarRetiro,
        loadingSolicitarRetiroFondos,
        errorSolicitarRetiroFondos,

        // Transferencia entre usuarios
        transferenciaEntreUsuarios,
        loadingTransferenciaEntreUsuarios,
        errorTransferenciaEntreUsuarios,

        editarUsuarioAdmin,
        loadingEditarUsuarioAdmin,
        errorEditarUsuarioAdmin,

        handleSetUsuarioSeleccionado
    };
};
