import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Transaccion } from "../../type/entityTypes";
import { transaccionesService } from "../../service/transaccionesService";
import type { ApiResponse, Page } from "../../type/apiTypes";
import type { EstadoOperacion, TipoConceptos } from "../../type/enum";
import type { GananciaMesDTO } from "../../type/responseType";

interface TransaccionesState {
    transacciones: Transaccion[];
    paginaActual: number;
    totalPaginas: number;
    totalElementos: number;
    cargando: boolean;
    error: string | null;

    gananciasPorMes: GananciaMesDTO[];
    loadingGanancias: boolean;
    errorGanancias: string | null;
}

const initialState: TransaccionesState = {
    transacciones: [],
    paginaActual: 0,
    totalPaginas: 0,
    totalElementos: 0,
    cargando: false,
    error: null,

    gananciasPorMes: [],
    loadingGanancias: false,
    errorGanancias: null,
};


export const obtenerTransacciones = createAsyncThunk<
    ApiResponse<Page<Transaccion>>,
    { concepto: TipoConceptos; estado: EstadoOperacion; page: number, size: number; desde?: string; hasta?: string; usuarioId?: number },
    { rejectValue: string }
>(
    'transacciones/obtener',
    async ({ concepto, estado, page, size, desde, hasta, usuarioId }, { rejectWithValue }) => {
        try {
            const response = await transaccionesService.filtrarTransacciones({ concepto, estado, page, size, desde, hasta, usuarioId });
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al obtener transacciones';
            return rejectWithValue(message);
        }
    }
);

export const obtenerGananciasPorMes = createAsyncThunk<
    ApiResponse<GananciaMesDTO[]>,
    void,
    { rejectValue: string }
>(
    'transacciones/obtenerGananciasPorMes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await transaccionesService.obtenerGananciasPorMes();
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al obtener ganancias por mes';
            return rejectWithValue(message);
        }
    }
);


export const transaccionesSlice = createSlice({
    name: 'transacciones',
    initialState,
    reducers: {
        cargarTransacciones: (state) => {
            state.cargando = true;
            state.error = null;
        },
        cargarTransaccionesExito: (state, action) => {
            state.cargando = false;
            state.transacciones = action.payload.content;
            state.paginaActual = action.payload.page.number;
            state.totalPaginas = action.payload.page.totalPages;
            state.totalElementos = action.payload.page.totalElements;
        },
        cargarTransaccionesError: (state, action) => {
            state.cargando = false;
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(obtenerTransacciones.pending, (state) => {
                state.cargando = true;
                state.error = null;
            })
            .addCase(obtenerTransacciones.fulfilled, (state, action) => {
                state.cargando = false;
                state.transacciones = action.payload.data.content;
                state.paginaActual = action.payload.data.page.number;
                state.totalPaginas = action.payload.data.page.totalPages;
                state.totalElementos = action.payload.data.page.totalElements;
            })
            .addCase(obtenerTransacciones.rejected, (state, action) => {
                state.cargando = false;
                state.error = action.payload || 'Error al cargar transacciones';
            })
            .addCase(obtenerGananciasPorMes.pending, (state) => {
                state.loadingGanancias = true;
                state.errorGanancias = null;
            })
            .addCase(obtenerGananciasPorMes.fulfilled, (state, action) => {
                state.loadingGanancias = false;
                state.gananciasPorMes = action.payload.data;
            })
            .addCase(obtenerGananciasPorMes.rejected, (state, action) => {
                state.loadingGanancias = false;
                state.errorGanancias = action.payload || 'Error al cargar ganancias por mes';
            });
    }
});

export const { cargarTransacciones, cargarTransaccionesExito, cargarTransaccionesError } = transaccionesSlice.actions;
export default transaccionesSlice.reducer;