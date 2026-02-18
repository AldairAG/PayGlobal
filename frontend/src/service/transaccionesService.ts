import type { ApiResponse, Page } from "../type/apiTypes";
import type { Transaccion } from "../type/entityTypes";
import { TipoConceptos, EstadoOperacion } from "../type/enum";
import type { GananciaMesDTO } from "../type/responseType";
import { api } from "./apiBase";

const BASE_PATH = '/transacciones';

export interface FiltrosTransacciones {
    usuarioId?: number;
    desde?: string; // ISO date string
    hasta?: string; // ISO date string
    concepto?: TipoConceptos | "TODOS";
    estado?: EstadoOperacion | "TODOS";
    page?: number;
    size?: number;
}

const filtrarTransacciones = async (filtros: FiltrosTransacciones): Promise<ApiResponse<Page<Transaccion>>> => {
    const params = new URLSearchParams();
    
    if (filtros.usuarioId) {
        params.append('usuarioId', filtros.usuarioId.toString());
    }
    
    if (filtros.desde) {
        params.append('desde', filtros.desde);
    }
    
    if (filtros.hasta) {
        params.append('hasta', filtros.hasta);
    }
    
    if (filtros.concepto && filtros.concepto !== "TODOS") {
        params.append('concepto', filtros.concepto);
    }
    
    if (filtros.estado && filtros.estado !== "TODOS") {
        params.append('estado', filtros.estado);
    }
    
    if (filtros.page !== undefined) {
        params.append('page', filtros.page.toString());
    }
    
    if (filtros.size !== undefined) {
        params.append('size', filtros.size.toString());
    }
    
    const queryString = params.toString();
    const url = queryString ? `${BASE_PATH}/filtrar?${queryString}` : `${BASE_PATH}/filtrar`;
    
    return api.get<Page<Transaccion>>(url);
}

const listarTransacciones = async (page: number = 0, size: number = 10): Promise<ApiResponse<Page<Transaccion>>> => {
    return api.get<Page<Transaccion>>(`${BASE_PATH}?page=${page}&size=${size}`);
}

const obtenerGananciasPorMes = async (): Promise<ApiResponse<GananciaMesDTO[]>> => {
    return await api.get<GananciaMesDTO[]>(`${BASE_PATH}/ganancias-por-mes`);
}

export const transaccionesService = {
    filtrarTransacciones,
    listarTransacciones,
    obtenerGananciasPorMes,
};