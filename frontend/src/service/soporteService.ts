import { api } from './apiBase';
import type { ApiResponse, Page } from '../type/apiTypes';
import type { Ticket } from '../type/entityTypes';
import { EstadoTicket } from '../type/enum';
import type { CrearTiketRequest } from '../type/requestTypes';

const BASE_PATH = '/soporte';

// Crear un nuevo tiket de soporte
// POST /api/soporte
const crearTiket = async (request: CrearTiketRequest): Promise<ApiResponse<Ticket>> => {
    return api.post<Ticket>(BASE_PATH, request);
};

// Actualizar el estado de un tiket
// PATCH /api/soporte/{id}/estado
const actualizarEstadoTiket = async (id: number, estado: EstadoTicket): Promise<ApiResponse<Ticket>> => {
    return api.patch<Ticket>(`${BASE_PATH}/${id}/estado`, { estado });
};

// Agregar un comentario/respuesta a un tiket
// POST /api/soporte/{id}/comentarios
const agregarComentario = async (id: number, comentario: string): Promise<ApiResponse<Ticket>> => {
    return api.post<Ticket>(`${BASE_PATH}/${id}/comentarios`, { comentario });
};

// Listar los tikets del usuario autenticado
// GET /api/soporte/mis-tikets
const listarMisTikets = async (page: number = 0, size: number = 10): Promise<ApiResponse<Page<Ticket>>> => {
    return api.get<Page<Ticket>>(`${BASE_PATH}/mis-tikets`, {
        params: { page, size }
    });
};

// Listar todos los tikets (solo admins)
// GET /api/soporte
const listarTodosLosTikets = async (page: number = 0, size: number = 10): Promise<ApiResponse<Page<Ticket>>> => {
    return api.get<Page<Ticket>>(BASE_PATH, {
        params: { page, size }
    });
};

export const soporteService = {
    crearTiket,
    actualizarEstadoTiket,
    agregarComentario,
    listarMisTikets,
    listarTodosLosTikets,
};