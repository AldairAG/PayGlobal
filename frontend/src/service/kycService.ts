import { api } from './apiBase';
import type { ApiResponse } from '../type/apiTypes';
import type { KycFile } from '../type/entityTypes';
import type { EvaluarKycFileRequest, GuardarKycFileRequest } from '../type/requestTypes';

const BASE_PATH = '/kyc';

/**
 * Subir un archivo KYC
 * POST /api/kyc/upload/{idUsuario}
 * @param kycFileRequest - Datos del archivo KYC (fileType y file)
 * @param idUsuario - ID del usuario
 * @returns KycFile guardado
 */
const subirArchivoKyc = async (
    kycFileRequest: GuardarKycFileRequest,
    idUsuario: number
): Promise<ApiResponse<KycFile>> => {
    const formData = new FormData();
    formData.append('file', kycFileRequest.file);
    formData.append('fileType', kycFileRequest.fileType);

    return api.post<KycFile>(`${BASE_PATH}/upload/${idUsuario}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

/**
 * Eliminar un archivo KYC
 * DELETE /api/kyc/{id}
 * @param id - ID del archivo KYC
 * @returns Mensaje de confirmación
 */
const eliminarArchivoKyc = async (id: number): Promise<ApiResponse<string>> => {
    return api.delete<string>(`${BASE_PATH}/${id}`);
};

/**
 * Obtener todos los archivos KYC de un usuario
 * GET /api/kyc/usuario/{idUsuario}
 * @param idUsuario - ID del usuario
 * @returns Lista de archivos KYC
 */
const obtenerArchivosKycPorUsuario = async (idUsuario: number): Promise<ApiResponse<KycFile[]>> => {
    return api.get<KycFile[]>(`${BASE_PATH}/usuario/${idUsuario}`);
};

/**
 * Obtener todos los archivos KYC pendientes de revisión (Solo administradores)
 * GET /api/kyc/pendientes
 * @returns Lista de archivos KYC pendientes
 */
const obtenerArchivosKycPendientes = async (): Promise<ApiResponse<KycFile[]>> => {
    return api.get<KycFile[]>(`${BASE_PATH}/pendientes`);
};

/**
 * Evaluar y actualizar el estado de un archivo KYC (Solo administradores)
 * PUT /api/kyc/{id}/evaluar
 * @param id - ID del archivo KYC
 * @param evaluarRequest - Datos de la evaluación (nuevoEstado, comentario, razonRechazo)
 * @returns KycFile actualizado
 */
const evaluarArchivoKyc = async (
    id: number,
    evaluarRequest: EvaluarKycFileRequest
): Promise<ApiResponse<KycFile>> => {
    return api.put<KycFile>(`${BASE_PATH}/${id}/evaluar`, evaluarRequest);
};

/**
 * Descargar/visualizar un archivo KYC
 * GET /api/kyc/file/{fileName}
 * @param fileName - Nombre del archivo
 * @returns URL del archivo o Blob
 */
const descargarArchivoKyc = async (fileName: string): Promise<Blob> => {
    try {
        const response = await api.descargarArchivo(fileName);
        return response;
    } catch (error) {
        console.error('Error al descargar archivo KYC:', error);
        return new Blob();
    }
};

export const kycService = {
    subirArchivoKyc,
    eliminarArchivoKyc,
    obtenerArchivosKycPorUsuario,
    obtenerArchivosKycPendientes,
    evaluarArchivoKyc,
    descargarArchivoKyc,
};
