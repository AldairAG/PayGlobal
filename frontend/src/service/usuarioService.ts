import { apiBase } from './apiBase';
import type { ApiResponse } from './apiBase';
import type { AxiosInstance } from 'axios';
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

class UsuarioService {
    private readonly BASE_PATH = '/usuarios';
    private readonly axios: AxiosInstance;

    constructor() {
        this.axios = apiBase.getAxiosInstance();
    }

    /**
     * Registro de nuevo usuario
     * POST /api/usuarios/registro
     */
    async registrar(registroRequest: RegistroRequestDTO): Promise<ApiResponse<JwtResponse>> {
        const response = await this.axios.post<ApiResponse<JwtResponse>>(
            `${this.BASE_PATH}/registro`,
            registroRequest
        );
        return response.data;
    }

    /**
     * Login de usuario
     * POST /api/usuarios/login
     */
    async login(loginRequest: LoginRequestDTO): Promise<ApiResponse<JwtResponse>> {
        const response = await this.axios.post<ApiResponse<JwtResponse>>(
            `${this.BASE_PATH}/login`,
            loginRequest
        );
        
        // Guardar token automáticamente
        if (response.data.success && response.data.data.token) {
            await apiBase.setAuthToken(response.data.data.token);
        }
        
        return response.data;
    }

    /**
     * Editar perfil del usuario autenticado
     * PUT /api/usuarios/perfil
     */
    async editarPerfil(editarPerfilRequest: EditarPerfilRequestDTO): Promise<ApiResponse<Usuario>> {
        const response = await this.axios.put<ApiResponse<Usuario>>(
            `${this.BASE_PATH}/perfil`,
            editarPerfilRequest
        );
        return response.data;
    }

    /**
     * Cambiar contraseña del usuario autenticado
     * PATCH /api/usuarios/cambiar-password
     */
/*     async cambiarPassword(cambiarPasswordRequest: CambiarPasswordRequest): Promise<string> {
        const response = await this.axios.patch<string>(
            `${this.BASE_PATH}/cambiar-password`,
            cambiarPasswordRequest
        );
        return response.data;
    } */

    /**
     * Verificación de dos pasos
     * POST /api/usuarios/verificacion-dos-pasos
     */
    async verificacionDosPasos(codigoVerificacion: string): Promise<string> {
        const response = await this.axios.post<string>(
            `${this.BASE_PATH}/verificacion-dos-pasos`,
            null,
            {
                params: { codigoVerificacion }
            }
        );
        return response.data;
    }

    /**
     * Obtener usuarios en red
     * GET /api/usuarios/red/{username}
     */
    async obtenerUsuariosEnRed(username: string): Promise<ApiResponse<UsuarioEnRedResponse[]>> {
        const response = await this.axios.get<ApiResponse<UsuarioEnRedResponse[]>>(
            `${this.BASE_PATH}/red/${username}`
        );
        return response.data;
    }

    /**
     * Editar usuario (Admin)
     * PUT /api/usuarios/admin/editar
     */
    async editarUsuarioAdmin(usuario: Usuario): Promise<ApiResponse<string>> {
        const response = await this.axios.put<ApiResponse<string>>(
            `${this.BASE_PATH}/admin/editar`,
            usuario
        );
        return response.data;
    }

    /**
     * Solicitar compra de licencia
     * POST /api/usuarios/solicitar-licencia
     */
    async solicitarCompraLicencia(
        tipoCrypto: TipoCrypto,
        tipoLicencia: string, // 'LICENCIA1', 'LICENCIA2', etc.
        tipoSolicitud: string  // Enum TipoSolicitud del backend
    ): Promise<ApiResponse<string>> {
        const response = await this.axios.post<ApiResponse<string>>(
            `${this.BASE_PATH}/solicitar-licencia`,
            null,
            {
                params: {
                    tipoCrypto,
                    tipoLicencia,
                    tipoSolicitud
                }
            }
        );
        return response.data;
    }

    /**
     * Solicitar retiro de fondos
     * POST /api/usuarios/solicitar-retiro
     */
    async solicitarRetiroFondos(
        walletAddressId: number,
        monto: number,
        tipoSolicitud: string
    ): Promise<ApiResponse<string>> {
        const response = await this.axios.post<ApiResponse<string>>(
            `${this.BASE_PATH}/solicitar-retiro`,
            null,
            {
                params: {
                    walletAddressId,
                    monto,
                    tipoSolicitud
                }
            }
        );
        return response.data;
    }

    /**
     * Comprar licencia delegada (para otro usuario)
     * POST /api/usuarios/comprar-licencia-delegada
     */
    async comprarLicenciaDelegada(
        tipoLicencia: string,
        destinatario: string,
        tipoMetodoPago: string  // Enum TipoMetodoPago del backend
    ): Promise<ApiResponse<string>> {
        const response = await this.axios.post<ApiResponse<string>>(
            `${this.BASE_PATH}/comprar-licencia-delegada`,
            null,
            {
                params: {
                    tipoLicencia,
                    destinatario,
                    tipoMetodoPago
                }
            }
        );
        return response.data;
    }

    /**
     * Transferencia entre usuarios
     * POST /api/usuarios/transferencia
     */
    async transferenciaEntreUsuarios(
        usuarioDestinatario: string,
        monto: number,
        tipoWallet: TipoWallets
    ): Promise<ApiResponse<string>> {
        const response = await this.axios.post<ApiResponse<string>>(
            `${this.BASE_PATH}/transferencia`,
            null,
            {
                params: {
                    usuarioDestinatario,
                    monto,
                    tipoWallet
                }
            }
        );
        return response.data;
    }

    /**
     * Aprobar compra de licencia (Admin)
     * PUT /api/usuarios/admin/aprobar-licencia/{idSolicitud}
     */
    async aprobarCompraLicencia(idSolicitud: number): Promise<ApiResponse<string>> {
        const response = await this.axios.put<ApiResponse<string>>(
            `${this.BASE_PATH}/admin/aprobar-licencia/${idSolicitud}`
        );
        return response.data;
    }

    /**
     * Rechazar solicitud (Admin)
     * PUT /api/usuarios/admin/rechazar-solicitud/{idSolicitud}
     */
    async rechazarSolicitud(idSolicitud: number): Promise<ApiResponse<string>> {
        const response = await this.axios.put<ApiResponse<string>>(
            `${this.BASE_PATH}/admin/rechazar-solicitud/${idSolicitud}`
        );
        return response.data;
    }

}

// Exportar instancia única
export const usuarioService = new UsuarioService();
export default usuarioService;
