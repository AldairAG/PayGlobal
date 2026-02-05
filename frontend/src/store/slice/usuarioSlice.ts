import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Usuario } from "../../type/entityTypes";
import { removeFromSessionStorage, saveToSessionStorage } from "../../helpers/authHelpers";
import { usuarioService, type JwtResponse, type UsuarioEnRedResponse } from "../../service/usuarioService";
import type { EditarPerfilRequestDTO, LoginRequestDTO, RegistroRequestDTO } from "../../type/requestTypes";
import type { ApiResponse } from "../../service/apiBase";
import type { TipoCrypto, TipoWallets } from "../../type/enum";

interface UserState {
    usuario: Usuario | null;
    token: string | null;
    loadingRegistro: boolean;
    errorRegistro: string | null;
    loadingLogin: boolean;
    errorLogin: string | null;
    isAuthenticated: boolean;
    loadingEditarPerfil: boolean;
    errorEditarPerfil: string | null;
    loadingUsuariosEnRed: boolean;
    errorUsuariosEnRed: string | null;
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
}

const initialState: UserState = {
    usuario: null,
    token: null,
    loadingRegistro: false,
    errorRegistro: null,
    loadingLogin: false,
    errorLogin: null,
    isAuthenticated: false,
    loadingEditarPerfil: false,
    errorEditarPerfil: null,
    loadingUsuariosEnRed: false,
    errorUsuariosEnRed: null,
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
};

export const registrarThunk = createAsyncThunk<
    ApiResponse<JwtResponse>,
    RegistroRequestDTO,
    { rejectValue: string }
>("usuario/registrar", async (registroRequest, { rejectWithValue }) => {
    try {
        const response = await usuarioService.registrar(registroRequest);

        if (!response.success) {
            return rejectWithValue(response.message || "Error al registrar usuario");
        }

        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al registrar usuario";
        return rejectWithValue(message);
    }
});

export const loginThunk = createAsyncThunk<
    ApiResponse<JwtResponse>,
    LoginRequestDTO,
    { rejectValue: string }
>("usuario/login", async (loginRequest, { rejectWithValue }) => {
    try {
        const response = await usuarioService.login(loginRequest);

        if (!response.success) {
            return rejectWithValue(response.message || "Error al iniciar sesión");
        }

        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al iniciar sesión";
        return rejectWithValue(message);
    }
});

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
    { tipoCrypto: TipoCrypto; tipoLicencia: string; tipoSolicitud: string },
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

const usuarioSlice = createSlice({
    name: 'usuario',
    initialState,
    reducers: {
        logout(state) {
            state.usuario = null;
            state.token = null;
            state.isAuthenticated = false;
            state.errorRegistro = null;
            state.errorLogin = null;
            state.errorEditarPerfil = null;
            state.errorUsuariosEnRed = null;
            state.errorEditarUsuarioAdmin = null;
            state.errorSolicitarCompraLicencia = null;
            state.errorSolicitarRetiroFondos = null;
            state.errorComprarLicenciaDelegada = null;
            state.errorTransferenciaEntreUsuarios = null;
            state.errorAprobarCompraLicencia = null;
            state.errorRechazarSolicitud = null;
            // Limpiar sessionStorage
            removeFromSessionStorage('auth_user');
            removeFromSessionStorage('auth_token');
        },
        setUsuario(state, action: PayloadAction<Usuario>) {
            state.usuario = action.payload;
            state.isAuthenticated = true;
            // Guardar en sessionStorage
            saveToSessionStorage('auth_user', action.payload);
        },
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
            // Guardar en sessionStorage
            saveToSessionStorage('auth_token', action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registrarThunk.pending, (state) => {
                state.loadingRegistro = true;
                state.errorRegistro = null;
            })
            .addCase(registrarThunk.fulfilled, (state, action) => {
                state.loadingRegistro = false;
                state.errorRegistro = null;

                const token = action.payload.data?.token;
                if (token) {
                    state.token = token;
                    state.isAuthenticated = true;
                    saveToSessionStorage('auth_token', token);
                }
            })
            .addCase(registrarThunk.rejected, (state, action) => {
                state.loadingRegistro = false;
                state.errorRegistro = action.payload || "Error al registrar usuario";
            })
            .addCase(loginThunk.pending, (state) => {
                state.loadingLogin = true;
                state.errorLogin = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loadingLogin = false;
                state.errorLogin = null;

                const token = action.payload.data?.token;
                if (token) {
                    state.token = token;
                    state.isAuthenticated = true;
                    saveToSessionStorage('auth_token', token);
                }
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loadingLogin = false;
                state.errorLogin = action.payload || "Error al iniciar sesión";
            })
            .addCase(editarPerfilThunk.pending, (state) => {
                state.loadingEditarPerfil = true;
                state.errorEditarPerfil = null;
            })
            .addCase(editarPerfilThunk.fulfilled, (state, action) => {
                state.loadingEditarPerfil = false;
                state.errorEditarPerfil = null;
                state.usuario = action.payload.data || state.usuario;
            })
            .addCase(editarPerfilThunk.rejected, (state, action) => {
                state.loadingEditarPerfil = false;
                state.errorEditarPerfil = action.payload || "Error al editar perfil";
            })
            .addCase(obtenerUsuariosEnRedThunk.pending, (state) => {
                state.loadingUsuariosEnRed = true;
                state.errorUsuariosEnRed = null;
            })
            .addCase(obtenerUsuariosEnRedThunk.fulfilled, (state) => {
                state.loadingUsuariosEnRed = false;
                state.errorUsuariosEnRed = null;
            })
            .addCase(obtenerUsuariosEnRedThunk.rejected, (state, action) => {
                state.loadingUsuariosEnRed = false;
                state.errorUsuariosEnRed = action.payload || "Error al obtener usuarios en red";
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
            });
    },
});

export const { logout, setToken, setUsuario } = usuarioSlice.actions;
export default usuarioSlice.reducer;