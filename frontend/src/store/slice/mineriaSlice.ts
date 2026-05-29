import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { LicenciaMineria } from "../../type/entityTypes";
import { mineriaService } from "../../service/MineriaService";
import type { ApiResponse } from "../../type/apiTypes";

interface MineriaState {
    licenciasUsuario: LicenciaMineria[] | null;
    loadingLicenciasUsuario: boolean;
    errorLicenciasUsuario: string | null;

    licenciasPorUsuario: LicenciaMineria[] | null;
    loadingLicenciasPorUsuario: boolean;
    errorLicenciasPorUsuario: string | null;

    loadingIniciarMineria: boolean;
    errorIniciarMineria: string | null;

    loadingDetenerMineria: boolean;
    errorDetenerMineria: string | null;

    loadingRetirarGanancias: boolean;
    errorRetirarGanancias: string | null;
}

const initialState: MineriaState = {
    licenciasUsuario: null,
    loadingLicenciasUsuario: false,
    errorLicenciasUsuario: null,

    licenciasPorUsuario: null,
    loadingLicenciasPorUsuario: false,
    errorLicenciasPorUsuario: null,

    loadingIniciarMineria: false,
    errorIniciarMineria: null,

    loadingDetenerMineria: false,
    errorDetenerMineria: null,

    loadingRetirarGanancias: false,
    errorRetirarGanancias: null,
};

// Thunks

// Obtener licencias del usuario autenticado
export const obtenerLicenciasUsuarioThunk = createAsyncThunk<
    ApiResponse<LicenciaMineria[]>,
    void,
    { rejectValue: string }
>("mineria/obtenerLicenciasUsuario", async (_, { rejectWithValue }) => {
    try {
        const response = await mineriaService.obtenerLicenciasUsuario();
        if (!response.success) {
            return rejectWithValue(response.message || "Error al obtener licencias");
        }
        return response;
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Error al obtener licencias");
    }
});

// Obtener licencias de un usuario específico (Admin)
export const obtenerLicenciasPorUsuarioThunk = createAsyncThunk<
    ApiResponse<LicenciaMineria[]>,
    { usuarioId: number },
    { rejectValue: string }
>("mineria/obtenerLicenciasPorUsuario", async ({ usuarioId }, { rejectWithValue }) => {
    try {
        const response = await mineriaService.obtenerLicenciasPorUsuario(usuarioId);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al obtener licencias del usuario");
        }
        return response;
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Error al obtener licencias del usuario");
    }
});

// Iniciar minería
export const iniciarMineriaThunk = createAsyncThunk<
    ApiResponse<string>,
    { licenciaId: number; plazo: number },
    { rejectValue: string }
>("mineria/iniciarMineria", async ({ licenciaId, plazo }, { rejectWithValue }) => {
    try {
        const response = await mineriaService.iniciarMineria(licenciaId, plazo);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al iniciar minería");
        }
        return response;
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Error al iniciar minería");
    }
});

// Detener minería
export const detenerMineriaThunk = createAsyncThunk<
    ApiResponse<string>,
    { licenciaId: number },
    { rejectValue: string }
>("mineria/detenerMineria", async ({ licenciaId }, { rejectWithValue }) => {
    try {
        const response = await mineriaService.detenerMineria(licenciaId);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al detener minería");
        }
        return response;
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Error al detener minería");
    }
});

// Retirar ganancias
export const retirarGananciasThunk = createAsyncThunk<
    ApiResponse<string>,
    void,
    { rejectValue: string }
>("mineria/retirarGanancias", async (_, { rejectWithValue }) => {
    try {
        const response = await mineriaService.retirarGanancias();
        if (!response.success) {
            return rejectWithValue(response.message || "Error al retirar ganancias");
        }
        return response;
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Error al retirar ganancias");
    }
});

const mineriaSlice = createSlice({
    name: 'mineria',
    initialState,
    reducers: {
        clearLicenciasUsuario(state) {
            state.licenciasUsuario = null;
        },
        clearLicenciasPorUsuario(state) {
            state.licenciasPorUsuario = null;
        },
        clearErrores(state) {
            state.errorLicenciasUsuario = null;
            state.errorLicenciasPorUsuario = null;
            state.errorIniciarMineria = null;
            state.errorDetenerMineria = null;
            state.errorRetirarGanancias = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Obtener licencias del usuario
            .addCase(obtenerLicenciasUsuarioThunk.pending, (state) => {
                state.loadingLicenciasUsuario = true;
                state.errorLicenciasUsuario = null;
            })
            .addCase(obtenerLicenciasUsuarioThunk.fulfilled, (state, action) => {
                state.loadingLicenciasUsuario = false;
                state.errorLicenciasUsuario = null;
                state.licenciasUsuario = action.payload.data || [];
            })
            .addCase(obtenerLicenciasUsuarioThunk.rejected, (state, action) => {
                state.loadingLicenciasUsuario = false;
                state.errorLicenciasUsuario = action.payload || "Error al obtener licencias";
                state.licenciasUsuario = [];
            })
            
            // Obtener licencias por usuario (Admin)
            .addCase(obtenerLicenciasPorUsuarioThunk.pending, (state) => {
                state.loadingLicenciasPorUsuario = true;
                state.errorLicenciasPorUsuario = null;
            })
            .addCase(obtenerLicenciasPorUsuarioThunk.fulfilled, (state, action) => {
                state.loadingLicenciasPorUsuario = false;
                state.errorLicenciasPorUsuario = null;
                state.licenciasPorUsuario = action.payload.data || [];
            })
            .addCase(obtenerLicenciasPorUsuarioThunk.rejected, (state, action) => {
                state.loadingLicenciasPorUsuario = false;
                state.errorLicenciasPorUsuario = action.payload || "Error al obtener licencias del usuario";
                state.licenciasPorUsuario = [];
            })
            
            // Iniciar minería
            .addCase(iniciarMineriaThunk.pending, (state) => {
                state.loadingIniciarMineria = true;
                state.errorIniciarMineria = null;
            })
            .addCase(iniciarMineriaThunk.fulfilled, (state) => {
                state.loadingIniciarMineria = false;
                state.errorIniciarMineria = null;
            })
            .addCase(iniciarMineriaThunk.rejected, (state, action) => {
                state.loadingIniciarMineria = false;
                state.errorIniciarMineria = action.payload || "Error al iniciar minería";
            })
            
            // Detener minería
            .addCase(detenerMineriaThunk.pending, (state) => {
                state.loadingDetenerMineria = true;
                state.errorDetenerMineria = null;
            })
            .addCase(detenerMineriaThunk.fulfilled, (state) => {
                state.loadingDetenerMineria = false;
                state.errorDetenerMineria = null;
            })
            .addCase(detenerMineriaThunk.rejected, (state, action) => {
                state.loadingDetenerMineria = false;
                state.errorDetenerMineria = action.payload || "Error al detener minería";
            })
            
            // Retirar ganancias
            .addCase(retirarGananciasThunk.pending, (state) => {
                state.loadingRetirarGanancias = true;
                state.errorRetirarGanancias = null;
            })
            .addCase(retirarGananciasThunk.fulfilled, (state) => {
                state.loadingRetirarGanancias = false;
                state.errorRetirarGanancias = null;
            })
            .addCase(retirarGananciasThunk.rejected, (state, action) => {
                state.loadingRetirarGanancias = false;
                state.errorRetirarGanancias = action.payload || "Error al retirar ganancias";
            });
    },
});

export const { clearLicenciasUsuario, clearLicenciasPorUsuario, clearErrores } = mineriaSlice.actions;
export default mineriaSlice.reducer;
