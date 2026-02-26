import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { KycFile } from "../../type/entityTypes";
import { kycService } from "../../service/kycService";
import type { ApiResponse } from "../../type/apiTypes";
import type { EvaluarKycFileRequest, GuardarKycFileRequest } from "../../type/requestTypes";

interface KycState {
    // Archivos KYC del usuario
    misArchivosKyc: KycFile[];
    loadingMisArchivosKyc: boolean;
    errorMisArchivosKyc: string | null;

    // Archivos KYC pendientes (admin)
    archivosPendientes: KycFile[];
    loadingArchivosPendientes: boolean;
    errorArchivosPendientes: string | null;

    // Subir archivo
    loadingSubirArchivo: boolean;
    errorSubirArchivo: string | null;

    // Eliminar archivo
    loadingEliminarArchivo: boolean;
    errorEliminarArchivo: string | null;

    // Evaluar archivo (admin)
    loadingEvaluarArchivo: boolean;
    errorEvaluarArchivo: string | null;

    // Descargar archivo
    loadingDescargarArchivo: boolean;
    errorDescargarArchivo: string | null;

    // Archivo actualmente seleccionado
    archivoSeleccionado: KycFile | null;
}

const initialState: KycState = {
    misArchivosKyc: [],
    loadingMisArchivosKyc: false,
    errorMisArchivosKyc: null,

    archivosPendientes: [],
    loadingArchivosPendientes: false,
    errorArchivosPendientes: null,

    loadingSubirArchivo: false,
    errorSubirArchivo: null,

    loadingEliminarArchivo: false,
    errorEliminarArchivo: null,

    loadingEvaluarArchivo: false,
    errorEvaluarArchivo: null,

    loadingDescargarArchivo: false,
    errorDescargarArchivo: null,

    archivoSeleccionado: null,
};

// Async Thunks

export const subirArchivoKycThunk = createAsyncThunk<
    ApiResponse<KycFile>,
    { kycFileRequest: GuardarKycFileRequest; idUsuario: number },
    { rejectValue: string }
>(
    'kyc/subirArchivo',
    async ({ kycFileRequest, idUsuario }, { rejectWithValue }) => {
        try {
            const response = await kycService.subirArchivoKyc(kycFileRequest, idUsuario);
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al subir el archivo KYC';
            return rejectWithValue(message);
        }
    }
);

export const eliminarArchivoKycThunk = createAsyncThunk<
    ApiResponse<string>,
    number,
    { rejectValue: string }
>(
    'kyc/eliminarArchivo',
    async (id, { rejectWithValue }) => {
        try {
            const response = await kycService.eliminarArchivoKyc(id);
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al eliminar el archivo KYC';
            return rejectWithValue(message);
        }
    }
);

export const obtenerArchivosKycPorUsuarioThunk = createAsyncThunk<
    ApiResponse<KycFile[]>,
    number,
    { rejectValue: string }
>(
    'kyc/obtenerArchivosUsuario',
    async (idUsuario, { rejectWithValue }) => {
        try {
            const response = await kycService.obtenerArchivosKycPorUsuario(idUsuario);
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al obtener los archivos KYC del usuario';
            return rejectWithValue(message);
        }
    }
);

export const obtenerArchivosKycPendientesThunk = createAsyncThunk<
    ApiResponse<KycFile[]>,
    void,
    { rejectValue: string }
>(
    'kyc/obtenerArchivosPendientes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await kycService.obtenerArchivosKycPendientes();
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al obtener los archivos KYC pendientes';
            return rejectWithValue(message);
        }
    }
);

export const evaluarArchivoKycThunk = createAsyncThunk<
    ApiResponse<KycFile>,
    { id: number; evaluarRequest: EvaluarKycFileRequest },
    { rejectValue: string }
>(
    'kyc/evaluarArchivo',
    async ({ id, evaluarRequest }, { rejectWithValue }) => {
        try {
            const response = await kycService.evaluarArchivoKyc(id, evaluarRequest);
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al evaluar el archivo KYC';
            return rejectWithValue(message);
        }
    }
);

export const descargarArchivoKycThunk = createAsyncThunk<
    Blob,
    string,
    { rejectValue: string }
>(
    'kyc/descargarArchivo',
    async (fileName, { rejectWithValue }) => {
        try {
            const response = await kycService.descargarArchivoKyc(fileName);
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al descargar el archivo KYC';
            return rejectWithValue(message);
        }
    }
);

// Slice

export const kycSlice = createSlice({
    name: 'kyc',
    initialState,
    reducers: {
        setArchivoSeleccionado: (state, action) => {
            state.archivoSeleccionado = action.payload;
        },
        clearArchivoSeleccionado: (state) => {
            state.archivoSeleccionado = null;
        },
        clearErrores: (state) => {
            state.errorSubirArchivo = null;
            state.errorEliminarArchivo = null;
            state.errorMisArchivosKyc = null;
            state.errorArchivosPendientes = null;
            state.errorEvaluarArchivo = null;
            state.errorDescargarArchivo = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Subir Archivo KYC
            .addCase(subirArchivoKycThunk.pending, (state) => {
                state.loadingSubirArchivo = true;
                state.errorSubirArchivo = null;
            })
            .addCase(subirArchivoKycThunk.fulfilled, (state, action) => {
                state.loadingSubirArchivo = false;
                // Agregar el nuevo archivo a la lista si existe
                if (action.payload.data) {
                    state.misArchivosKyc.unshift(action.payload.data);
                }
            })
            .addCase(subirArchivoKycThunk.rejected, (state, action) => {
                state.loadingSubirArchivo = false;
                state.errorSubirArchivo = action.payload || 'Error al subir el archivo KYC';
            })

            // Eliminar Archivo KYC
            .addCase(eliminarArchivoKycThunk.pending, (state) => {
                state.loadingEliminarArchivo = true;
                state.errorEliminarArchivo = null;
            })
            .addCase(eliminarArchivoKycThunk.fulfilled, (state) => {
                state.loadingEliminarArchivo = false;
                // El archivo se eliminará de la lista cuando se refresque
            })
            .addCase(eliminarArchivoKycThunk.rejected, (state, action) => {
                state.loadingEliminarArchivo = false;
                state.errorEliminarArchivo = action.payload || 'Error al eliminar el archivo KYC';
            })

            // Obtener Archivos KYC del Usuario
            .addCase(obtenerArchivosKycPorUsuarioThunk.pending, (state) => {
                state.loadingMisArchivosKyc = true;
                state.errorMisArchivosKyc = null;
            })
            .addCase(obtenerArchivosKycPorUsuarioThunk.fulfilled, (state, action) => {
                state.loadingMisArchivosKyc = false;
                state.misArchivosKyc = action.payload.data;
            })
            .addCase(obtenerArchivosKycPorUsuarioThunk.rejected, (state, action) => {
                state.loadingMisArchivosKyc = false;
                state.errorMisArchivosKyc = action.payload || 'Error al obtener los archivos KYC del usuario';
            })

            // Obtener Archivos KYC Pendientes (Admin)
            .addCase(obtenerArchivosKycPendientesThunk.pending, (state) => {
                state.loadingArchivosPendientes = true;
                state.errorArchivosPendientes = null;
            })
            .addCase(obtenerArchivosKycPendientesThunk.fulfilled, (state, action) => {
                state.loadingArchivosPendientes = false;
                state.archivosPendientes = action.payload.data;
            })
            .addCase(obtenerArchivosKycPendientesThunk.rejected, (state, action) => {
                state.loadingArchivosPendientes = false;
                state.errorArchivosPendientes = action.payload || 'Error al obtener los archivos KYC pendientes';
            })

            // Evaluar Archivo KYC (Admin)
            .addCase(evaluarArchivoKycThunk.pending, (state) => {
                state.loadingEvaluarArchivo = true;
                state.errorEvaluarArchivo = null;
            })
            .addCase(evaluarArchivoKycThunk.fulfilled, (state, action) => {
                state.loadingEvaluarArchivo = false;
                // Actualizar el archivo en las listas
                const archivoActualizado = action.payload.data;
                if (archivoActualizado) {
                    // Actualizar en mis archivos
                    const indexMisArchivos = state.misArchivosKyc.findIndex(a => a.id === archivoActualizado.id);
                    if (indexMisArchivos !== -1) {
                        state.misArchivosKyc[indexMisArchivos] = archivoActualizado;
                    }
                    // Actualizar en archivos pendientes
                    const indexPendientes = state.archivosPendientes.findIndex(a => a.id === archivoActualizado.id);
                    if (indexPendientes !== -1) {
                        state.archivosPendientes[indexPendientes] = archivoActualizado;
                    }
                    // Actualizar archivo seleccionado si es el mismo
                    if (state.archivoSeleccionado?.id === archivoActualizado.id) {
                        state.archivoSeleccionado = archivoActualizado;
                    }
                }
            })
            .addCase(evaluarArchivoKycThunk.rejected, (state, action) => {
                state.loadingEvaluarArchivo = false;
                state.errorEvaluarArchivo = action.payload || 'Error al evaluar el archivo KYC';
            })

            // Descargar Archivo KYC
            .addCase(descargarArchivoKycThunk.pending, (state) => {
                state.loadingDescargarArchivo = true;
                state.errorDescargarArchivo = null;
            })
            .addCase(descargarArchivoKycThunk.fulfilled, (state) => {
                state.loadingDescargarArchivo = false;
                // La descarga se maneja en el componente
            })
            .addCase(descargarArchivoKycThunk.rejected, (state, action) => {
                state.loadingDescargarArchivo = false;
                state.errorDescargarArchivo = action.payload || 'Error al descargar el archivo KYC';
            });
    }
});

export const { setArchivoSeleccionado, clearArchivoSeleccionado, clearErrores } = kycSlice.actions;
export default kycSlice.reducer;
