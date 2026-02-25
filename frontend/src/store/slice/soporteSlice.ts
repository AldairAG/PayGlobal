import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Ticket } from "../../type/entityTypes";
import { soporteService } from "../../service/soporteService";
import type { ApiResponse, Page } from "../../type/apiTypes";
import type { EstadoTicket } from "../../type/enum";
import type { CrearTiketRequest } from "../../type/requestTypes";

interface SoporteState {
    // Tickets del usuario
    misTikets: Ticket[];
    paginaActualMisTikets: number;
    totalPaginasMisTikets: number;
    totalElementosMisTikets: number;
    loadingMisTikets: boolean;
    errorMisTikets: string | null;

    // Todos los tickets (admin)
    todosLosTikets: Ticket[];
    paginaActualTodos: number;
    totalPaginasTodos: number;
    totalElementosTodos: number;
    loadingTodosLosTikets: boolean;
    errorTodosLosTikets: string | null;

    // Crear ticket
    loadingCrearTiket: boolean;
    errorCrearTiket: string | null;

    // Actualizar estado
    loadingActualizarEstado: boolean;
    errorActualizarEstado: string | null;

    // Agregar comentario
    loadingAgregarComentario: boolean;
    errorAgregarComentario: string | null;

    // Ticket actualmente seleccionado
    tiketSeleccionado: Ticket | null;
}

const initialState: SoporteState = {
    misTikets: [],
    paginaActualMisTikets: 0,
    totalPaginasMisTikets: 0,
    totalElementosMisTikets: 0,
    loadingMisTikets: false,
    errorMisTikets: null,

    todosLosTikets: [],
    paginaActualTodos: 0,
    totalPaginasTodos: 0,
    totalElementosTodos: 0,
    loadingTodosLosTikets: false,
    errorTodosLosTikets: null,

    loadingCrearTiket: false,
    errorCrearTiket: null,

    loadingActualizarEstado: false,
    errorActualizarEstado: null,

    loadingAgregarComentario: false,
    errorAgregarComentario: null,

    tiketSeleccionado: null,
};

// Async Thunks

export const crearTiketThunk = createAsyncThunk<
    ApiResponse<Ticket>,
    CrearTiketRequest,
    { rejectValue: string }
>(
    'soporte/crearTiket',
    async (request, { rejectWithValue }) => {
        try {
            const response = await soporteService.crearTiket(request);
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al crear el ticket';
            return rejectWithValue(message);
        }
    }
);

export const actualizarEstadoTiketThunk = createAsyncThunk<
    ApiResponse<Ticket>,
    { id: number; estado: EstadoTicket },
    { rejectValue: string }
>(
    'soporte/actualizarEstado',
    async ({ id, estado }, { rejectWithValue }) => {
        try {
            const response = await soporteService.actualizarEstadoTiket(id, estado);
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al actualizar el estado del ticket';
            return rejectWithValue(message);
        }
    }
);

export const agregarComentarioThunk = createAsyncThunk<
    ApiResponse<Ticket>,
    { id: number; comentario: string },
    { rejectValue: string }
>(
    'soporte/agregarComentario',
    async ({ id, comentario }, { rejectWithValue }) => {
        try {
            const response = await soporteService.agregarComentario(id, comentario);
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al agregar el comentario';
            return rejectWithValue(message);
        }
    }
);

export const listarMisTiketsThunk = createAsyncThunk<
    ApiResponse<Page<Ticket>>,
    { page: number; size: number },
    { rejectValue: string }
>(
    'soporte/listarMisTikets',
    async ({ page, size }, { rejectWithValue }) => {
        try {
            const response = await soporteService.listarMisTikets(page, size);
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al listar mis tickets';
            return rejectWithValue(message);
        }
    }
);

export const listarTodosLosTiketsThunk = createAsyncThunk<
    ApiResponse<Page<Ticket>>,
    { page: number; size: number },
    { rejectValue: string }
>(
    'soporte/listarTodosLosTikets',
    async ({ page, size }, { rejectWithValue }) => {
        try {
            const response = await soporteService.listarTodosLosTikets(page, size);
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al listar todos los tickets';
            return rejectWithValue(message);
        }
    }
);

// Slice

export const soporteSlice = createSlice({
    name: 'soporte',
    initialState,
    reducers: {
        setTiketSeleccionado: (state, action) => {
            state.tiketSeleccionado = action.payload;
        },
        clearTiketSeleccionado: (state) => {
            state.tiketSeleccionado = null;
        },
        clearErrores: (state) => {
            state.errorCrearTiket = null;
            state.errorActualizarEstado = null;
            state.errorAgregarComentario = null;
            state.errorMisTikets = null;
            state.errorTodosLosTikets = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Crear Ticket
            .addCase(crearTiketThunk.pending, (state) => {
                state.loadingCrearTiket = true;
                state.errorCrearTiket = null;
            })
            .addCase(crearTiketThunk.fulfilled, (state, action) => {
                state.loadingCrearTiket = false;
                // Agregar el nuevo ticket a la lista si existe
                if (action.payload.data) {
                    state.misTikets.unshift(action.payload.data);
                    state.totalElementosMisTikets += 1;
                }
            })
            .addCase(crearTiketThunk.rejected, (state, action) => {
                state.loadingCrearTiket = false;
                state.errorCrearTiket = action.payload || 'Error al crear el ticket';
            })

            // Actualizar Estado
            .addCase(actualizarEstadoTiketThunk.pending, (state) => {
                state.loadingActualizarEstado = true;
                state.errorActualizarEstado = null;
            })
            .addCase(actualizarEstadoTiketThunk.fulfilled, (state, action) => {
                state.loadingActualizarEstado = false;
                // Actualizar el ticket en las listas
                const tiketActualizado = action.payload.data;
                if (tiketActualizado) {
                    // Actualizar en mis tickets
                    const indexMisTikets = state.misTikets.findIndex(t => t.id === tiketActualizado.id);
                    if (indexMisTikets !== -1) {
                        state.misTikets[indexMisTikets] = tiketActualizado;
                    }
                    // Actualizar en todos los tickets
                    const indexTodos = state.todosLosTikets.findIndex(t => t.id === tiketActualizado.id);
                    if (indexTodos !== -1) {
                        state.todosLosTikets[indexTodos] = tiketActualizado;
                    }
                    // Actualizar ticket seleccionado si es el mismo
                    if (state.tiketSeleccionado?.id === tiketActualizado.id) {
                        state.tiketSeleccionado = tiketActualizado;
                    }
                }
            })
            .addCase(actualizarEstadoTiketThunk.rejected, (state, action) => {
                state.loadingActualizarEstado = false;
                state.errorActualizarEstado = action.payload || 'Error al actualizar el estado';
            })

            // Agregar Comentario
            .addCase(agregarComentarioThunk.pending, (state) => {
                state.loadingAgregarComentario = true;
                state.errorAgregarComentario = null;
            })
            .addCase(agregarComentarioThunk.fulfilled, (state, action) => {
                state.loadingAgregarComentario = false;
                // Actualizar el ticket con el nuevo comentario
                const tiketActualizado = action.payload.data;
                if (tiketActualizado) {
                    // Actualizar en mis tickets
                    const indexMisTikets = state.misTikets.findIndex(t => t.id === tiketActualizado.id);
                    if (indexMisTikets !== -1) {
                        state.misTikets[indexMisTikets] = tiketActualizado;
                    }
                    // Actualizar en todos los tickets
                    const indexTodos = state.todosLosTikets.findIndex(t => t.id === tiketActualizado.id);
                    if (indexTodos !== -1) {
                        state.todosLosTikets[indexTodos] = tiketActualizado;
                    }
                    // Actualizar ticket seleccionado si es el mismo
                    if (state.tiketSeleccionado?.id === tiketActualizado.id) {
                        state.tiketSeleccionado = tiketActualizado;
                    }
                }
            })
            .addCase(agregarComentarioThunk.rejected, (state, action) => {
                state.loadingAgregarComentario = false;
                state.errorAgregarComentario = action.payload || 'Error al agregar el comentario';
            })

            // Listar Mis Tickets
            .addCase(listarMisTiketsThunk.pending, (state) => {
                state.loadingMisTikets = true;
                state.errorMisTikets = null;
            })
            .addCase(listarMisTiketsThunk.fulfilled, (state, action) => {
                state.loadingMisTikets = false;
                state.misTikets = action.payload.data.content;
                state.paginaActualMisTikets = action.payload.data.page.number;
                state.totalPaginasMisTikets = action.payload.data.page.totalPages;
                state.totalElementosMisTikets = action.payload.data.page.totalElements;
            })
            .addCase(listarMisTiketsThunk.rejected, (state, action) => {
                state.loadingMisTikets = false;
                state.errorMisTikets = action.payload || 'Error al listar mis tickets';
            })

            // Listar Todos Los Tickets
            .addCase(listarTodosLosTiketsThunk.pending, (state) => {
                state.loadingTodosLosTikets = true;
                state.errorTodosLosTikets = null;
            })
            .addCase(listarTodosLosTiketsThunk.fulfilled, (state, action) => {
                state.loadingTodosLosTikets = false;
                state.todosLosTikets = action.payload.data.content;
                state.paginaActualTodos = action.payload.data.page.number;
                state.totalPaginasTodos = action.payload.data.page.totalPages;
                state.totalElementosTodos = action.payload.data.page.totalElements;
            })
            .addCase(listarTodosLosTiketsThunk.rejected, (state, action) => {
                state.loadingTodosLosTikets = false;
                state.errorTodosLosTikets = action.payload || 'Error al listar todos los tickets';
            });
    }
});

export const { setTiketSeleccionado, clearTiketSeleccionado, clearErrores } = soporteSlice.actions;
export default soporteSlice.reducer;
