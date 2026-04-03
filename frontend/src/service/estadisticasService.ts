import { api } from './apiBase';
import type { ApiResponse } from '../type/apiTypes';
import type { EstadisticasDTO } from '../type/responseType';

const BASE_PATH = '/estadisticas';

// Obtener todas las estadísticas del dashboard
// GET /api/estadisticas
const obtenerEstadisticas = async (): Promise<ApiResponse<EstadisticasDTO>> => {
    return api.get<EstadisticasDTO>(`${BASE_PATH}`);
};

export const estadisticasService = {
    obtenerEstadisticas
};
