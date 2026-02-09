import { apiBase } from './apiBase';
import type { ApiResponse } from '../type/apiTypes';
import type {
    RegistroRequestDTO,
    LoginRequestDTO,
    EditarPerfilRequestDTO,
} from '../type/requestTypes';
import type { Usuario } from '../type/entityTypes';
import { TipoCrypto, TipoWallets } from '../type/enum';

// Response types
export interface JwtResponse {
    token: string;
    type: string;
    id: number;
    username: string;
    email: string;
    roles: string[];
}

export interface UsuarioEnRedResponse {
    id: number;
    username: string;
    email: string;
    nombre: string;
    apellido: string;
    fechaRegistro: string;
    nivel: number;
}

const BASE_PATH = '/usuarios';

// Registro de nuevo usuario
// POST /api/usuarios/registro
const registrar = async (registroRequest: RegistroRequestDTO): Promise<ApiResponse<JwtResponse>> => {
    return apiBase.post<JwtResponse>(`${BASE_PATH}/registro`, registroRequest);
};

// Login de usuario
// POST /api/usuarios/login
const login = async (loginRequest: LoginRequestDTO): Promise<ApiResponse<JwtResponse>> => {
    const response = await apiBase.post<JwtResponse>(`${BASE_PATH}/login`, loginRequest);
    
    // Guardar token automáticamente
    if (response.success && response.data.token) {
        await apiBase.setAuthToken(response.data.token);
    }
    
    return response;
};

// Editar perfil del usuario autenticado
// PUT /api/usuarios/perfil
const editarPerfil = async (editarPerfilRequest: EditarPerfilRequestDTO): Promise<ApiResponse<Usuario>> => {
    return apiBase.put<Usuario>(`${BASE_PATH}/perfil`, editarPerfilRequest);
};

// Verificación de dos pasos
// POST /api/usuarios/verificacion-dos-pasos
const verificacionDosPasos = async (codigoVerificacion: string): Promise<ApiResponse<string>> => {
    return apiBase.post<string>(`${BASE_PATH}/verificacion-dos-pasos`, null, {
        params: { codigoVerificacion }
    });
};

// Obtener usuarios en red
// GET /api/usuarios/red/{username}
const obtenerUsuariosEnRed = async (username: string): Promise<ApiResponse<UsuarioEnRedResponse[]>> => {
    return apiBase.get<UsuarioEnRedResponse[]>(`${BASE_PATH}/red/${username}`);
};

// Editar usuario (Admin)
// PUT /api/usuarios/admin/editar
const editarUsuarioAdmin = async (usuario: Usuario): Promise<ApiResponse<string>> => {
    return apiBase.put<string>(`${BASE_PATH}/admin/editar`, usuario);
};

// Solicitar compra de licencia
// POST /api/usuarios/solicitar-licencia
const solicitarCompraLicencia = async (
    tipoCrypto: TipoCrypto,
    tipoLicencia: string,
    tipoSolicitud: string
): Promise<ApiResponse<string>> => {
    return apiBase.post<string>(`${BASE_PATH}/solicitar-licencia`, null, {
        params: {
            tipoCrypto,
            tipoLicencia,
            tipoSolicitud
        }
    });
};

// Solicitar retiro de fondos
// POST /api/usuarios/solicitar-retiro
const solicitarRetiroFondos = async (
    walletAddressId: number,
    monto: number,
    tipoSolicitud: string
): Promise<ApiResponse<string>> => {
    return apiBase.post<string>(`${BASE_PATH}/solicitar-retiro`, null, {
        params: {
            walletAddressId,
            monto,
            tipoSolicitud
        }
    });
};

// Comprar licencia delegada (para otro usuario)
// POST /api/usuarios/comprar-licencia-delegada
const comprarLicenciaDelegada = async (
    tipoLicencia: string,
    destinatario: string,
    tipoMetodoPago: string
): Promise<ApiResponse<string>> => {
    return apiBase.post<string>(`${BASE_PATH}/comprar-licencia-delegada`, null, {
        params: {
            tipoLicencia,
            destinatario,
            tipoMetodoPago
        }
    });
};

// Transferencia entre usuarios
// POST /api/usuarios/transferencia
const transferenciaEntreUsuarios = async (
    usuarioDestinatario: string,
    monto: number,
    tipoWallet: TipoWallets
): Promise<ApiResponse<string>> => {
    return apiBase.post<string>(`${BASE_PATH}/transferencia`, null, {
        params: {
            usuarioDestinatario,
            monto,
            tipoWallet
        }
    });
};

// Aprobar compra de licencia (Admin)
// PUT /api/usuarios/admin/aprobar-licencia/{idSolicitud}
const aprobarCompraLicencia = async (idSolicitud: number): Promise<ApiResponse<string>> => {
    return apiBase.put<string>(`${BASE_PATH}/admin/aprobar-licencia/${idSolicitud}`);
};

// Rechazar solicitud (Admin)
// PUT /api/usuarios/admin/rechazar-solicitud/{idSolicitud}
const rechazarSolicitud = async (idSolicitud: number): Promise<ApiResponse<string>> => {
    return apiBase.put<string>(`${BASE_PATH}/admin/rechazar-solicitud/${idSolicitud}`);
};

// Objeto con todas las funciones
export const usuarioService = {
    registrar,
    login,
    editarPerfil,
    verificacionDosPasos,
    obtenerUsuariosEnRed,
    editarUsuarioAdmin,
    solicitarCompraLicencia,
    solicitarRetiroFondos,
    comprarLicenciaDelegada,
    transferenciaEntreUsuarios,
    aprobarCompraLicencia,
    rechazarSolicitud,
};
