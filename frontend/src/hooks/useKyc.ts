import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../store';
import {
    subirArchivoKycThunk,
    eliminarArchivoKycThunk,
    obtenerArchivosKycPorUsuarioThunk,
    obtenerArchivosKycPendientesThunk,
    evaluarArchivoKycThunk,
    descargarArchivoKycThunk,
    setArchivoSeleccionado,
    clearArchivoSeleccionado,
    clearErrores,
} from '../store/slice/kycSlice';
import type { EvaluarKycFileRequest, GuardarKycFileRequest } from '../type/requestTypes';
import type { KycFile } from '../type/entityTypes';

/**
 * Hook personalizado para manejo de archivos KYC
 * Proporciona métodos y estados para subir, listar y gestionar archivos KYC
 */
export const useKyc = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Seleccionar estados de archivos KYC del usuario desde Redux
    const misArchivosKyc = useSelector((state: RootState) => state.kyc.misArchivosKyc);
    const loadingMisArchivosKyc = useSelector((state: RootState) => state.kyc.loadingMisArchivosKyc);
    const errorMisArchivosKyc = useSelector((state: RootState) => state.kyc.errorMisArchivosKyc);

    // Seleccionar estados de archivos KYC pendientes (admin) desde Redux
    const archivosPendientes = useSelector((state: RootState) => state.kyc.archivosPendientes);
    const loadingArchivosPendientes = useSelector((state: RootState) => state.kyc.loadingArchivosPendientes);
    const errorArchivosPendientes = useSelector((state: RootState) => state.kyc.errorArchivosPendientes);

    // Seleccionar estados de operaciones desde Redux
    const loadingSubirArchivo = useSelector((state: RootState) => state.kyc.loadingSubirArchivo);
    const errorSubirArchivo = useSelector((state: RootState) => state.kyc.errorSubirArchivo);

    const loadingEliminarArchivo = useSelector((state: RootState) => state.kyc.loadingEliminarArchivo);
    const errorEliminarArchivo = useSelector((state: RootState) => state.kyc.errorEliminarArchivo);

    const loadingEvaluarArchivo = useSelector((state: RootState) => state.kyc.loadingEvaluarArchivo);
    const errorEvaluarArchivo = useSelector((state: RootState) => state.kyc.errorEvaluarArchivo);

    const loadingDescargarArchivo = useSelector((state: RootState) => state.kyc.loadingDescargarArchivo);
    const errorDescargarArchivo = useSelector((state: RootState) => state.kyc.errorDescargarArchivo);

    // Archivo seleccionado
    const archivoSeleccionado = useSelector((state: RootState) => state.kyc.archivoSeleccionado);

    /**
     * Función para subir un archivo KYC
     * @param kycFileRequest - Datos del archivo (fileType y file)
     * @param idUsuario - ID del usuario
     * @returns Promise con la respuesta del servidor
     */
    const subirArchivoKyc = async (kycFileRequest: GuardarKycFileRequest, idUsuario: number) => {
        try {
            const result = await dispatch(subirArchivoKycThunk({ kycFileRequest, idUsuario }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al subir archivo KYC:', error);
            throw error;
        }
    };

    /**
     * Función para eliminar un archivo KYC
     * @param id - ID del archivo KYC
     * @returns Promise con la respuesta del servidor
     */
    const eliminarArchivoKyc = async (id: number) => {
        try {
            const result = await dispatch(eliminarArchivoKycThunk(id));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al eliminar archivo KYC:', error);
            throw error;
        }
    };

    /**
     * Función para obtener todos los archivos KYC de un usuario
     * @param idUsuario - ID del usuario
     * @returns Promise con la respuesta del servidor
     */
    const obtenerArchivosKycPorUsuario = async (idUsuario: number) => {
        try {
            const result = await dispatch(obtenerArchivosKycPorUsuarioThunk(idUsuario));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al obtener archivos KYC del usuario:', error);
            throw error;
        }
    };

    /**
     * Función para obtener todos los archivos KYC pendientes (solo admin)
     * @returns Promise con la respuesta del servidor
     */
    const obtenerArchivosKycPendientes = async () => {
        try {
            const result = await dispatch(obtenerArchivosKycPendientesThunk());
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al obtener archivos KYC pendientes:', error);
            throw error;
        }
    };

    /**
     * Función para evaluar un archivo KYC (solo admin)
     * @param id - ID del archivo KYC
     * @param evaluarRequest - Datos de la evaluación (nuevoEstado, comentario, razonRechazo)
     * @returns Promise con la respuesta del servidor
     */
    const evaluarArchivoKyc = async (id: number, evaluarRequest: EvaluarKycFileRequest) => {
        try {
            const result = await dispatch(evaluarArchivoKycThunk({ id, evaluarRequest }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al evaluar archivo KYC:', error);
            throw error;
        }
    };

    /**
     * Función para obtener un archivo KYC como Blob (sin descargar automáticamente)
     * @param fileName - Nombre del archivo
     * @returns Promise con el Blob del archivo
     */
    const obtenerArchivoKyc = async (fileName: string): Promise<Blob | null> => {
        try {
            const result = await dispatch(descargarArchivoKycThunk(fileName));
            const blob = unwrapResult(result);
            
            // El response es directamente un Blob
            if (blob instanceof Blob) {
                return blob;
            }
            
            return null;
        } catch (error) {
            console.error('Error al obtener archivo KYC:', error);
            throw error;
        }
    };

    /**
     * Función para descargar un archivo KYC directamente
     * @param fileName - Nombre del archivo
     * @returns Promise con la respuesta del servidor (Blob)
     */
    const descargarArchivoKyc = async (fileName: string) => {
        try {
            const blob = await obtenerArchivoKyc(fileName);
            
            if (blob) {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
            
            return blob;
        } catch (error) {
            console.error('Error al descargar archivo KYC:', error);
            throw error;
        }
    };

    /**
     * Función para seleccionar un archivo KYC
     * @param archivo - Archivo a seleccionar o null para deseleccionar
     */
    const seleccionarArchivo = (archivo: KycFile | null) => {
        if (archivo) {
            dispatch(setArchivoSeleccionado(archivo));
        } else {
            dispatch(clearArchivoSeleccionado());
        }
    };

    /**
     * Función para limpiar todos los errores del estado
     */
    const limpiarErrores = () => {
        dispatch(clearErrores());
    };

    return {
        // Estados - Mis Archivos KYC
        misArchivosKyc,
        loadingMisArchivosKyc,
        errorMisArchivosKyc,

        // Estados - Archivos Pendientes (Admin)
        archivosPendientes,
        loadingArchivosPendientes,
        errorArchivosPendientes,

        // Estados - Operaciones
        loadingSubirArchivo,
        errorSubirArchivo,
        loadingEliminarArchivo,
        errorEliminarArchivo,
        loadingEvaluarArchivo,
        errorEvaluarArchivo,
        loadingDescargarArchivo,
        errorDescargarArchivo,

        // Estado - Archivo Seleccionado
        archivoSeleccionado,

        // Métodos
        subirArchivoKyc,
        eliminarArchivoKyc,
        obtenerArchivosKycPorUsuario,
        obtenerArchivosKycPendientes,
        evaluarArchivoKyc,
        obtenerArchivoKyc,
        descargarArchivoKyc,
        seleccionarArchivo,
        limpiarErrores,
    };
};
