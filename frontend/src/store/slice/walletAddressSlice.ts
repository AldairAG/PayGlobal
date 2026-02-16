import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WalletAddress } from "../../type/entityTypes";
import { walletAddressService } from "../../service/walletAddressService";
import type { CreateWalletAddress } from "../../type/requestTypes";
import type { ApiResponse } from "../../type/apiTypes";

interface WalletAddressState {
    walletAddresses: WalletAddress[];
    selectedWalletAddress: WalletAddress | null;

    loadingCreate: boolean;
    errorCreate: string | null;

    loadingGetById: boolean;
    errorGetById: string | null;

    loadingUpdate: boolean;
    errorUpdate: string | null;

    loadingDelete: boolean;
    errorDelete: string | null;

    loadingMyWallets: boolean;
    errorMyWallets: string | null;

    loadingByUserId: boolean;
    errorByUserId: string | null;
}

const initialState: WalletAddressState = {
    walletAddresses: [],
    selectedWalletAddress: null,

    loadingCreate: false,
    errorCreate: null,

    loadingGetById: false,
    errorGetById: null,

    loadingUpdate: false,
    errorUpdate: null,

    loadingDelete: false,
    errorDelete: null,

    loadingMyWallets: false,
    errorMyWallets: null,

    loadingByUserId: false,
    errorByUserId: null,
};

// Crear una nueva dirección de wallet
export const createWalletAddressThunk = createAsyncThunk<
    ApiResponse<WalletAddress>,
    CreateWalletAddress,
    { rejectValue: string }
>("walletAddress/create", async (walletAddress, { rejectWithValue }) => {
    try {
        const response = await walletAddressService.createWalletAddress(walletAddress);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al crear dirección de wallet");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al crear dirección de wallet";
        return rejectWithValue(message);
    }
});

// Obtener dirección de wallet por ID
export const getWalletAddressByIdThunk = createAsyncThunk<
    ApiResponse<WalletAddress>,
    { id: number },
    { rejectValue: string }
>("walletAddress/getById", async ({ id }, { rejectWithValue }) => {
    try {
        const response = await walletAddressService.getWalletAddressById(id);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al obtener dirección de wallet");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al obtener dirección de wallet";
        return rejectWithValue(message);
    }
});

// Actualizar dirección de wallet
export const updateWalletAddressThunk = createAsyncThunk<
    ApiResponse<WalletAddress>,
    { id: number; walletAddress: CreateWalletAddress },
    { rejectValue: string }
>("walletAddress/update", async ({ id, walletAddress }, { rejectWithValue }) => {
    try {
        const response = await walletAddressService.updateWalletAddress(id, walletAddress);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al actualizar dirección de wallet");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al actualizar dirección de wallet";
        return rejectWithValue(message);
    }
});

// Eliminar dirección de wallet
export const deleteWalletAddressThunk = createAsyncThunk<
    ApiResponse<void>,
    { id: number },
    { rejectValue: string }
>("walletAddress/delete", async ({ id }, { rejectWithValue }) => {
    try {
        const response = await walletAddressService.deleteWalletAddress(id);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al eliminar dirección de wallet");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al eliminar dirección de wallet";
        return rejectWithValue(message);
    }
});

// Obtener mis direcciones de wallet
export const getMyWalletAddressesThunk = createAsyncThunk<
    ApiResponse<WalletAddress[]>,
    void,
    { rejectValue: string }
>("walletAddress/getMyWallets", async (_, { rejectWithValue }) => {
    try {
        const response = await walletAddressService.getMyWalletAddresses();
        if (!response.success) {
            return rejectWithValue(response.message || "Error al obtener mis direcciones de wallet");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al obtener mis direcciones de wallet";
        return rejectWithValue(message);
    }
});

// Obtener direcciones de wallet por usuario
export const getWalletAddressesByUserIdThunk = createAsyncThunk<
    ApiResponse<WalletAddress[]>,
    { userId: number },
    { rejectValue: string }
>("walletAddress/getByUserId", async ({ userId }, { rejectWithValue }) => {
    try {
        const response = await walletAddressService.getWalletAddressesByUserId(userId);
        if (!response.success) {
            return rejectWithValue(response.message || "Error al obtener direcciones de wallet del usuario");
        }
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al obtener direcciones de wallet del usuario";
        return rejectWithValue(message);
    }
});

const walletAddressSlice = createSlice({
    name: 'walletAddress',
    initialState,
    reducers: {
        clearSelectedWalletAddress(state) {
            state.selectedWalletAddress = null;
        },
        clearWalletAddresses(state) {
            state.walletAddresses = [];
        },
        setSelectedWalletAddress(state, action: PayloadAction<WalletAddress>) {
            state.selectedWalletAddress = action.payload;
        },
        updateWalletInState(state, action: PayloadAction<WalletAddress>) {
            // Actualizar wallet en el array
            const index = state.walletAddresses.findIndex(w => w.id === action.payload.id);
            if (index !== -1) {
                state.walletAddresses[index] = action.payload;
            } else {
                state.walletAddresses.push(action.payload);
            }
            // Actualizar selectedWalletAddress si es la misma
            if (state.selectedWalletAddress?.id === action.payload.id) {
                state.selectedWalletAddress = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Crear dirección de wallet
            .addCase(createWalletAddressThunk.pending, (state) => {
                state.loadingCreate = true;
                state.errorCreate = null;
            })
            .addCase(createWalletAddressThunk.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.errorCreate = null;
                if (action.payload.data) {
                    // Verificar si ya existe antes de agregar
                    const exists = state.walletAddresses.some(w => w.id === action.payload.data?.id);
                    if (!exists) {
                        state.walletAddresses.push(action.payload.data);
                    }
                }
            })
            .addCase(createWalletAddressThunk.rejected, (state, action) => {
                state.loadingCreate = false;
                state.errorCreate = action.payload || "Error al crear dirección de wallet";
            })

            // Obtener dirección de wallet por ID
            .addCase(getWalletAddressByIdThunk.pending, (state) => {
                state.loadingGetById = true;
                state.errorGetById = null;
            })
            .addCase(getWalletAddressByIdThunk.fulfilled, (state, action) => {
                state.loadingGetById = false;
                state.errorGetById = null;
                state.selectedWalletAddress = action.payload.data || null;
            })
            .addCase(getWalletAddressByIdThunk.rejected, (state, action) => {
                state.loadingGetById = false;
                state.errorGetById = action.payload || "Error al obtener dirección de wallet";
            })

            // Actualizar dirección de wallet
            .addCase(updateWalletAddressThunk.pending, (state) => {
                state.loadingUpdate = true;
                state.errorUpdate = null;
            })
            .addCase(updateWalletAddressThunk.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                state.errorUpdate = null;
                if (action.payload.data) {
                    const index = state.walletAddresses.findIndex(w => w.id === action.payload.data?.id);
                    if (index !== -1) {
                        // Actualizar la wallet existente en el array
                        state.walletAddresses[index] = action.payload.data;
                    } else {
                        // Si no existe, agregarla al array
                        state.walletAddresses.push(action.payload.data);
                    }
                    // Actualizar también selectedWalletAddress si es la misma
                    if (state.selectedWalletAddress?.id === action.payload.data.id) {
                        state.selectedWalletAddress = action.payload.data;
                    }
                }
            })
            .addCase(updateWalletAddressThunk.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.errorUpdate = action.payload || "Error al actualizar dirección de wallet";
            })

            // Eliminar dirección de wallet
            .addCase(deleteWalletAddressThunk.pending, (state) => {
                state.loadingDelete = true;
                state.errorDelete = null;
            })
            .addCase(deleteWalletAddressThunk.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.errorDelete = null;
                // Remover del array usando el id del parámetro original
                const deletedId = action.meta.arg.id;
                state.walletAddresses = state.walletAddresses.filter(w => w.id !== deletedId);
                // Limpiar selectedWalletAddress si era la wallet eliminada
                if (state.selectedWalletAddress?.id === deletedId) {
                    state.selectedWalletAddress = null;
                }
            })
            .addCase(deleteWalletAddressThunk.rejected, (state, action) => {
                state.loadingDelete = false;
                state.errorDelete = action.payload || "Error al eliminar dirección de wallet";
            })

            // Obtener mis direcciones de wallet
            .addCase(getMyWalletAddressesThunk.pending, (state) => {
                state.loadingMyWallets = true;
                state.errorMyWallets = null;
            })
            .addCase(getMyWalletAddressesThunk.fulfilled, (state, action) => {
                state.loadingMyWallets = false;
                state.errorMyWallets = null;
                state.walletAddresses = action.payload.data || [];
            })
            .addCase(getMyWalletAddressesThunk.rejected, (state, action) => {
                state.loadingMyWallets = false;
                state.errorMyWallets = action.payload || "Error al obtener mis direcciones de wallet";
            })

            // Obtener direcciones de wallet por usuario
            .addCase(getWalletAddressesByUserIdThunk.pending, (state) => {
                state.loadingByUserId = true;
                state.errorByUserId = null;
            })
            .addCase(getWalletAddressesByUserIdThunk.fulfilled, (state, action) => {
                state.loadingByUserId = false;
                state.errorByUserId = null;
                state.walletAddresses = action.payload.data || [];
            })
            .addCase(getWalletAddressesByUserIdThunk.rejected, (state, action) => {
                state.loadingByUserId = false;
                state.errorByUserId = action.payload || "Error al obtener direcciones de wallet del usuario";
            });
    },
});

export const { clearSelectedWalletAddress, clearWalletAddresses, setSelectedWalletAddress, updateWalletInState } = walletAddressSlice.actions;
export default walletAddressSlice.reducer;
