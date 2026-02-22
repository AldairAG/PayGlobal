import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Solicitud, Usuario } from "../../type/entityTypes";
import { usuarioService } from "../../service/usuarioService";
import type { EditarPerfilRequestDTO } from "../../type/requestTypes";
import type { ApiResponse, Page } from "../../type/apiTypes";
import type { TipoCrypto, TipoSolicitud, TipoWallets } from "../../type/enum";
import { saveToSessionStorage, loadFromSessionStorage } from "../../helpers/authHelpers";
import { logout } from "./authSlice";
import type { UsuarioEnRedResponse } from "../../type/responseType";

interface UsuarioState {
    usuario: Usuario | null;

    usuarioEnRed: number | null;

    loadingRegistro: boolean;
    errorRegistro: string | null;

    loadingLogin: boolean;
    errorLogin: string | null;

    loadingEditarPerfil: boolean;
    errorEditarPerfil: string | null;

    loadingEditarUsuarioAdmin: boolean;
    errorEditarUsuarioAdmin: string | null;

    loadingSolicitarCompraLicencia: boolean;
    errorSolicitarCompraLicencia: string | null;

    loadingSolicitarRetiroFondos: boolean;
    errorSolicitarRetiroFondos: string | null;

    loadingComprarLicenciaDelegada: boolean;
    errorComprarLicenciaDelegada: string | null;

    loadingTransferenciaEntreUsuarios: boolean;
    errorTransferenciaEntreUsuarios: string | null;

    loadingAprobarCompraLicencia: boolean;
    errorAprobarCompraLicencia: string | null;

    loadingRechazarSolicitud: boolean;
    errorRechazarSolicitud: string | null;

    solicitudes: Page<Solicitud> | null;
    loadingSolicitudes: boolean;
    errorSolicitudes: string | null;

    usuarios: Page<Usuario> | null;
    loadingUsuarios: boolean;
    errorUsuarios: string | null;

    usuarioSeleccionado?: Usuario | null;
    loadingUsuarioSeleccionado: boolean;
    errorUsuarioSeleccionado: string | null;

    usuariosEnRed?: UsuarioEnRedResponse[] | null;
    loadingUsuariosEnRed: boolean;
    errorUsuariosEnRed: string | null;
}

// Cargar estado inicial desde sessionStorage
const loadInitialState = (): UsuarioState => {
    const savedUser = loadFromSessionStorage('auth_user');

    return {
        usuario: savedUser || null,
        usuarioEnRed: 0,
        loadingRegistro: false,
        errorRegistro: null,
        loadingLogin: false,
        errorLogin: null,
        loadingEditarPerfil: false,
        errorEditarPerfil: null,
        loadingEditarUsuarioAdmin: false,
        errorEditarUsuarioAdmin: null,
        loadingSolicitarCompraLicencia: false,
        errorSolicitarCompraLicencia: null,
        loadingSolicitarRetiroFondos: false,
        errorSolicitarRetiroFondos: null,
        loadingComprarLicenciaDelegada: false,
        errorComprarLicenciaDelegada: null,
        loadingTransferenciaEntreUsuarios: false,
        errorTransferenciaEntreUsuarios: null,
        loadingAprobarCompraLicencia: false,
        errorAprobarCompraLicencia: null,
        loadingRechazarSolicitud: false,
        errorRechazarSolicitud: null,
        solicitudes: null,
        loadingSolicitudes: false,
        errorSolicitudes: null,
        usuarios: null,
        loadingUsuarios: false,
        errorUsuarios: null,
        usuarioSeleccionado: null,
        loadingUsuarioSeleccionado: false,
        errorUsuarioSeleccionado: null,
        usuariosEnRed: null,
        loadingUsuariosEnRed: false,
        errorUsuariosEnRed: null,
    };
};

const initialState: UsuarioState = loadInitialState();

export const editarPerfilThunk = createAsyncThunk<
    ApiResponse<Usuario>,
    EditarPerfilRequestDTO,
    { rejectValue: string }
>("usuario/editarPerfil", async (editarPerfilRequest, { rejectWithValue }) => {
    try {
        const response = await usuarioService.editarPerfil(editarPerfilRequest);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al editar perfil");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al editar perfil";
        return rejectWithValue(message);
    }
});

export const editarUsuarioAdminThunk = createAsyncThunk<
    ApiResponse<string>,
    Usuario,
    { rejectValue: string }
>("usuario/editarUsuarioAdmin", async (usuario, { rejectWithValue }) => {
    try {
        const response = await usuarioService.editarUsuarioAdmin(usuario);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al editar usuario (admin)");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al editar usuario (admin)";
        return rejectWithValue(message);
    }
});

export const solicitarCompraLicenciaThunk = createAsyncThunk<
    ApiResponse<string>,
    { tipoCrypto: TipoCrypto; tipoLicencia: string; tipoSolicitud: TipoSolicitud; },
    { rejectValue: string }
>("usuario/solicitarCompraLicencia", async (payload, { rejectWithValue }) => {
    try {
        const response = await usuarioService.solicitarCompraLicencia(
            payload.tipoCrypto,
            payload.tipoLicencia,
            payload.tipoSolicitud
        );
        if (!response.success) {
            return rejectWithValue(response.message || "Error al solicitar compra de licencia");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al solicitar compra de licencia";
        return rejectWithValue(message);
    }
});

export const solicitarRetiroFondosThunk = createAsyncThunk<
    ApiResponse<string>,
    { walletAddressId: number; monto: number; tipoSolicitud: string },
    { rejectValue: string }
>("usuario/solicitarRetiroFondos", async (payload, { rejectWithValue }) => {
    try {
        const response = await usuarioService.solicitarRetiroFondos(
            payload.walletAddressId,
            payload.monto,
            payload.tipoSolicitud
        );
        if (!response.success) {
            return rejectWithValue(response.message || "Error al solicitar retiro de fondos");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al solicitar retiro de fondos";
        return rejectWithValue(message);
    }
});

export const comprarLicenciaDelegadaThunk = createAsyncThunk<
    ApiResponse<string>,
    { tipoLicencia: string; destinatario: string; tipoMetodoPago: string },
    { rejectValue: string }
>("usuario/comprarLicenciaDelegada", async (payload, { rejectWithValue }) => {
    try {
        const response = await usuarioService.comprarLicenciaDelegada(
            payload.tipoLicencia,
            payload.destinatario,
            payload.tipoMetodoPago
        );
        if (!response.success) {
            return rejectWithValue(response.message || "Error al comprar licencia delegada");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al comprar licencia delegada";
        return rejectWithValue(message);
    }
});

export const transferenciaEntreUsuariosThunk = createAsyncThunk<
    ApiResponse<string>,
    { usuarioDestinatario: string; monto: number; tipoWallet: TipoWallets },
    { rejectValue: string }
>("usuario/transferenciaEntreUsuarios", async (payload, { rejectWithValue }) => {
    try {
        const response = await usuarioService.transferenciaEntreUsuarios(
            payload.usuarioDestinatario,
            payload.monto,
            payload.tipoWallet
        );
        if (!response.success) {
            return rejectWithValue(response.message || "Error en transferencia entre usuarios");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error en transferencia entre usuarios";
        return rejectWithValue(message);
    }
});

export const aprobarCompraLicenciaThunk = createAsyncThunk<
    ApiResponse<string>,
    { idSolicitud: number },
    { rejectValue: string }
>("usuario/aprobarCompraLicencia", async ({ idSolicitud }, { rejectWithValue }) => {
    try {
        const response = await usuarioService.aprobarCompraLicencia(idSolicitud);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al aprobar compra de licencia");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al aprobar compra de licencia";
        return rejectWithValue(message);
    }
});

export const rechazarSolicitudThunk = createAsyncThunk<
    ApiResponse<string>,
    { idSolicitud: number },
    { rejectValue: string }
>("usuario/rechazarSolicitud", async ({ idSolicitud }, { rejectWithValue }) => {
    try {
        const response = await usuarioService.rechazarSolicitud(idSolicitud);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al rechazar solicitud");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al rechazar solicitud";
        return rejectWithValue(message);
    }
});

export const obtenerSolicitudesThunk = createAsyncThunk<
    ApiResponse<Page<Solicitud>>,
    { page?: number; size?: number; sort?: string },
    { rejectValue: string }
>("usuario/obtenerSolicitudes", async ({ page = 0, size = 10, sort }, { rejectWithValue }) => {
    try {
        const response = await usuarioService.obtenerSolicitudes(page, size, sort);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al obtener solicitudes pendientes");
        }
        return response;

    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al obtener solicitudes pendientes";
        return rejectWithValue(message);
    }
});

export const obtenerTodosLosUsuariosThunk = createAsyncThunk<
    ApiResponse<Page<Usuario>>,
    { filtro?: string; page?: number; size?: number; sort?: string },
    { rejectValue: string }
>("usuario/obtenerTodosLosUsuarios", async ({ filtro, page = 0, size = 10, sort }, { rejectWithValue }) => {
    try {
        const response = await usuarioService.obtenerTodosLosUsuarios(filtro, page, size, sort);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al obtener usuarios");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al obtener usuarios";
        return rejectWithValue(message);
    }
});

export const obtenerUsuarioPorIdThunk = createAsyncThunk<
    ApiResponse<Usuario>,
    { idUsuario: number },
    { rejectValue: string }
>("usuario/obtenerUsuarioPorId", async ({ idUsuario }, { rejectWithValue }) => {
    try {
        const response = await usuarioService.obtenerUsuarioPorId(idUsuario);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al obtener usuario por ID");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al obtener usuario por ID";
        return rejectWithValue(message);
    }
});

export const obtenerUsuariosEnRedThunk = createAsyncThunk<
    ApiResponse<UsuarioEnRedResponse[]>,
    { username: string },
    { rejectValue: string }
>("usuario/obtenerUsuariosEnRed", async ({ username }, { rejectWithValue }) => {
    try {
        const response = await usuarioService.obtenerUsuariosEnRed(username);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al obtener usuarios en red");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al obtener usuarios en red";
        return rejectWithValue(message);
    }
});

const usuarioSlice = createSlice({
    name: 'usuario',
    initialState,
    reducers: {
        setUsuario(state, action: PayloadAction<Usuario>) {
            state.usuario = action.payload;
            // Guardar en sessionStorage
            saveToSessionStorage('auth_user', action.payload);
        },
        clearUsuario(state) {
            state.usuario = null;
            // Limpiar del sessionStorage también se hace en el logout de authSlice
        },
        setUsuarioEnRed(state, action: PayloadAction<number>) {
            state.usuarioEnRed = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(editarPerfilThunk.pending, (state) => {
                state.loadingEditarPerfil = true;
                state.errorEditarPerfil = null;
            })
            .addCase(editarPerfilThunk.fulfilled, (state, action) => {
                state.loadingEditarPerfil = false;
                state.errorEditarPerfil = null;
                state.usuario = action.payload.data || state.usuario;
                // Actualizar también en sessionStorage
                if (action.payload.data) {
                    saveToSessionStorage('auth_user', action.payload.data);
                }
            })
            .addCase(editarPerfilThunk.rejected, (state, action) => {
                state.loadingEditarPerfil = false;
                state.errorEditarPerfil = action.payload || "Error al editar perfil";
            })
            .addCase(obtenerUsuariosEnRedThunk.pending, (state) => {
                state.loadingUsuariosEnRed = true;
                state.errorUsuariosEnRed = null;
            })
            .addCase(obtenerUsuariosEnRedThunk.fulfilled, (state, action) => {
                state.loadingUsuariosEnRed = false;
                state.errorUsuariosEnRed = null;
                state.usuariosEnRed = action.payload.data || [];
            })
            .addCase(obtenerUsuariosEnRedThunk.rejected, (state, action) => {
                state.loadingUsuariosEnRed = false;
                state.errorUsuariosEnRed = action.payload || "Error al obtener usuarios en red";
                state.usuariosEnRed = [];
            })
            .addCase(editarUsuarioAdminThunk.pending, (state) => {
                state.loadingEditarUsuarioAdmin = true;
                state.errorEditarUsuarioAdmin = null;
            })
            .addCase(editarUsuarioAdminThunk.fulfilled, (state) => {
                state.loadingEditarUsuarioAdmin = false;
                state.errorEditarUsuarioAdmin = null;
            })
            .addCase(editarUsuarioAdminThunk.rejected, (state, action) => {
                state.loadingEditarUsuarioAdmin = false;
                state.errorEditarUsuarioAdmin = action.payload || "Error al editar usuario (admin)";
            })
            .addCase(solicitarCompraLicenciaThunk.pending, (state) => {
                state.loadingSolicitarCompraLicencia = true;
                state.errorSolicitarCompraLicencia = null;
            })
            .addCase(solicitarCompraLicenciaThunk.fulfilled, (state) => {
                state.loadingSolicitarCompraLicencia = false;
                state.errorSolicitarCompraLicencia = null;
            })
            .addCase(solicitarCompraLicenciaThunk.rejected, (state, action) => {
                state.loadingSolicitarCompraLicencia = false;
                state.errorSolicitarCompraLicencia = action.payload || "Error al solicitar compra de licencia";
            })
            .addCase(solicitarRetiroFondosThunk.pending, (state) => {
                state.loadingSolicitarRetiroFondos = true;
                state.errorSolicitarRetiroFondos = null;
            })
            .addCase(solicitarRetiroFondosThunk.fulfilled, (state) => {
                state.loadingSolicitarRetiroFondos = false;
                state.errorSolicitarRetiroFondos = null;
            })
            .addCase(solicitarRetiroFondosThunk.rejected, (state, action) => {
                state.loadingSolicitarRetiroFondos = false;
                state.errorSolicitarRetiroFondos = action.payload || "Error al solicitar retiro de fondos";
            })
            .addCase(comprarLicenciaDelegadaThunk.pending, (state) => {
                state.loadingComprarLicenciaDelegada = true;
                state.errorComprarLicenciaDelegada = null;
            })
            .addCase(comprarLicenciaDelegadaThunk.fulfilled, (state) => {
                state.loadingComprarLicenciaDelegada = false;
                state.errorComprarLicenciaDelegada = null;
            })
            .addCase(comprarLicenciaDelegadaThunk.rejected, (state, action) => {
                state.loadingComprarLicenciaDelegada = false;
                state.errorComprarLicenciaDelegada = action.payload || "Error al comprar licencia delegada";
            })
            .addCase(transferenciaEntreUsuariosThunk.pending, (state) => {
                state.loadingTransferenciaEntreUsuarios = true;
                state.errorTransferenciaEntreUsuarios = null;
            })
            .addCase(transferenciaEntreUsuariosThunk.fulfilled, (state) => {
                state.loadingTransferenciaEntreUsuarios = false;
                state.errorTransferenciaEntreUsuarios = null;
            })
            .addCase(transferenciaEntreUsuariosThunk.rejected, (state, action) => {
                state.loadingTransferenciaEntreUsuarios = false;
                state.errorTransferenciaEntreUsuarios = action.payload || "Error en transferencia entre usuarios";
            })
            .addCase(aprobarCompraLicenciaThunk.pending, (state) => {
                state.loadingAprobarCompraLicencia = true;
                state.errorAprobarCompraLicencia = null;
            })
            .addCase(aprobarCompraLicenciaThunk.fulfilled, (state) => {
                state.loadingAprobarCompraLicencia = false;
                state.errorAprobarCompraLicencia = null;
            })
            .addCase(aprobarCompraLicenciaThunk.rejected, (state, action) => {
                state.loadingAprobarCompraLicencia = false;
                state.errorAprobarCompraLicencia = action.payload || "Error al aprobar compra de licencia";
            })
            .addCase(rechazarSolicitudThunk.pending, (state) => {
                state.loadingRechazarSolicitud = true;
                state.errorRechazarSolicitud = null;
            })
            .addCase(rechazarSolicitudThunk.fulfilled, (state) => {
                state.loadingRechazarSolicitud = false;
                state.errorRechazarSolicitud = null;
            })
            .addCase(rechazarSolicitudThunk.rejected, (state, action) => {
                state.loadingRechazarSolicitud = false;
                state.errorRechazarSolicitud = action.payload || "Error al rechazar solicitud";
            })
            .addCase(obtenerSolicitudesThunk.pending, (state) => {
                state.loadingSolicitudes = true;
                state.errorSolicitudes = null;
            })
            .addCase(obtenerSolicitudesThunk.fulfilled, (state, action) => {
                state.loadingSolicitudes = false;
                state.errorSolicitudes = null;
                state.solicitudes = action.payload.data || null;
            })
            .addCase(obtenerSolicitudesThunk.rejected, (state, action) => {
                state.loadingSolicitudes = false;
                state.errorSolicitudes = action.payload || "Error al obtener solicitudes pendientes";
            })
            .addCase(obtenerTodosLosUsuariosThunk.pending, (state) => {
                state.loadingUsuarios = true;
                state.errorUsuarios = null;
            })
            .addCase(obtenerTodosLosUsuariosThunk.fulfilled, (state, action) => {
                state.loadingUsuarios = false;
                state.errorUsuarios = null;
                state.usuarios = action.payload.data || null;
            })
            .addCase(obtenerTodosLosUsuariosThunk.rejected, (state, action) => {
                state.loadingUsuarios = false;
                state.errorUsuarios = action.payload || "Error al obtener usuarios";
            })
            .addCase(obtenerUsuarioPorIdThunk.pending, (state) => {
                state.loadingUsuarioSeleccionado = true;
                state.errorUsuarioSeleccionado = null;
            })
            .addCase(obtenerUsuarioPorIdThunk.fulfilled, (state, action) => {
                state.loadingUsuarioSeleccionado = false;
                state.errorUsuarioSeleccionado = null;
                state.usuarioSeleccionado = action.payload.data || null;
            })
            .addCase(obtenerUsuarioPorIdThunk.rejected, (state, action) => {
                state.loadingUsuarioSeleccionado = false;
                state.errorUsuarioSeleccionado = action.payload || "Error al obtener usuario por ID";
            })
            // Escuchar la acción de logout del authSlice para limpiar el usuario
            .addCase(logout, (state) => {
                state.usuario = null;
                state.solicitudes = null;
                state.usuarios = null;
                state.usuarioSeleccionado = null;
                state.usuariosEnRed = null;
            });
    },
});

export const { setUsuario, clearUsuario,setUsuarioEnRed } = usuarioSlice.actions;
export default usuarioSlice.reducer;