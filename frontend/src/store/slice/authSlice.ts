import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type JwtResponse } from '../../service/usuarioService';
import { authService } from '../../service/authService';
import { loadFromSessionStorage, removeFromSessionStorage, saveToSessionStorage } from '../../helpers/authHelpers';
import type { LoginRequestDTO, RegistroRequestDTO } from '../../type/requestTypes';
import type { ApiResponse } from '../../type/apiTypes';

interface AuthState {
    token: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

// Cargar estado inicial desde sessionStorage
const loadInitialState = (): AuthState => {
    const savedUser = loadFromSessionStorage('auth_user');
    const savedToken = loadFromSessionStorage('auth_token');

    return {
        token: savedToken,
        loading: false,
        error: null,
        isAuthenticated: !!(savedUser && savedToken),
    };
};

const initialState: AuthState = loadInitialState();

export const registro = createAsyncThunk<
    ApiResponse<JwtResponse>,
    RegistroRequestDTO,
    { rejectValue: string }
>(
    'auth/registro',
    async (registroRequest, { rejectWithValue }) => {
        try {
            const response = await authService.registrar(registroRequest);
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error en el registro';
            return rejectWithValue(errorMessage);
        }
    }
);

export const login = createAsyncThunk<
    ApiResponse<JwtResponse>,
    LoginRequestDTO,
    { rejectValue: string }
>(
    'auth/login',
    async (loginRequest, { rejectWithValue }) => {
        try {
            const response = await authService.login(loginRequest);
            if (!response.success) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error en el login';
            return rejectWithValue(errorMessage);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            // Limpiar sessionStorage
            removeFromSessionStorage('auth_user');
            removeFromSessionStorage('auth_token');
        },
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
            // Guardar en sessionStorage
            saveToSessionStorage('auth_token', action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registro.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registro.fulfilled, (state) => {
                state.loading = false;
                // Para el registro, guardamos el UsuarioResponse directament
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registro.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error en el registro';
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.data.token;
                state.isAuthenticated = true;
                state.error = null;
                // Guardar en sessionStorage
                saveToSessionStorage('auth_token', action.payload.data.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error en el login';
            });
    },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
