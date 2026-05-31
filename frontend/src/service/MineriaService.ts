import { api } from './apiBase';
import type { ApiResponse } from '../type/apiTypes';
import type { LicenciaMineria } from '../type/entityTypes';

const BASE_PATH = '/mineria';

// Obtener todas las licencias de minería del usuario autenticado
// GET /api/mineria/licencias
const obtenerLicenciasUsuario = async (): Promise<ApiResponse<LicenciaMineria[]>> => {
    return api.get<LicenciaMineria[]>(`${BASE_PATH}/licencias`);
};

// Obtener licencias de minería de un usuario específico (Admin)
// GET /api/mineria/licencias/{usuarioId}
const obtenerLicenciasPorUsuario = async (usuarioId: number): Promise<ApiResponse<LicenciaMineria[]>> => {
    return api.get<LicenciaMineria[]>(`${BASE_PATH}/licencias/${usuarioId}`);
};

// Iniciar minería con una licencia
// POST /api/mineria/iniciar/{licenciaId}
const iniciarMineria = async (licenciaId: number, plazo: number): Promise<ApiResponse<string>> => {
    return api.post<string>(`${BASE_PATH}/iniciar/${licenciaId}`, null, {
        params: { plazo }
    });
};

// Detener minería de una licencia
// POST /api/mineria/detener/{licenciaId}
const detenerMineria = async (licenciaId: number): Promise<ApiResponse<string>> => {
    return api.post<string>(`${BASE_PATH}/detener/${licenciaId}`);
};

// Retirar ganancias de minería a wallet de staking
// POST /api/mineria/retirar-ganancias
const retirarGanancias = async (): Promise<ApiResponse<string>> => {
    return api.post<string>(`${BASE_PATH}/retirar-ganancias`);
};

// Objeto con todas las funciones
export const mineriaService = {
    obtenerLicenciasUsuario,
    obtenerLicenciasPorUsuario,
    iniciarMineria,
    detenerMineria,
    retirarGanancias,
};

