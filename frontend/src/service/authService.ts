// Registro de nuevo usuario

import type { ApiResponse } from "../type/apiTypes";
import type { LoginRequestDTO, RegistroRequestDTO } from "../type/requestTypes";
import { api } from "./apiBase"
import { apiBase } from "./apiBase";

import type { JwtResponse } from "./usuarioService";

const BASE_PATH = '/api/usuarios';

// POST /api/usuarios/registro
const registrar = async (registroRequest: RegistroRequestDTO): Promise<ApiResponse<JwtResponse>> => {
    return api.post<JwtResponse>(`${BASE_PATH}/registro`, registroRequest);
};

// Login de usuario
// POST /api/usuarios/login
const login = async (loginRequest: LoginRequestDTO): Promise<ApiResponse<JwtResponse>> => {
    const response = await api.post<JwtResponse>(`${BASE_PATH}/login`, loginRequest);
    
    // Guardar token automáticamente
    if (response.success && response.data.token) {
        await apiBase.setAuthToken(response.data.token);
    }
    
    return response;
};

export const authService = {
    registrar,
    login,
};