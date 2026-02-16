import { api } from './apiBase';
import type { ApiResponse } from '../type/apiTypes';
import type { CreateWalletAddress } from '../type/requestTypes';
import type { WalletAddress } from '../type/entityTypes';

const BASE_PATH = '/wallet-addresses';

// Crear una nueva dirección de wallet
// POST /api/wallet-addresses
const createWalletAddress = async (walletAddress: CreateWalletAddress): Promise<ApiResponse<WalletAddress>> => {
    return api.post<WalletAddress>(`${BASE_PATH}`, walletAddress);
};

// Obtener una dirección de wallet por ID
// GET /api/wallet-addresses/{id}
const getWalletAddressById = async (id: number): Promise<ApiResponse<WalletAddress>> => {
    return api.get<WalletAddress>(`${BASE_PATH}/${id}`);
};

// Actualizar una dirección de wallet
// PUT /api/wallet-addresses/{id}
const updateWalletAddress = async (id: number, walletAddress: CreateWalletAddress): Promise<ApiResponse<WalletAddress>> => {
    return api.put<WalletAddress>(`${BASE_PATH}/${id}`, walletAddress);
};

// Eliminar una dirección de wallet
// DELETE /api/wallet-addresses/{id}
const deleteWalletAddress = async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(`${BASE_PATH}/${id}`);
};

// Obtener todas las direcciones de wallet del usuario autenticado
// GET /api/wallet-addresses/mis-wallets
const getMyWalletAddresses = async (): Promise<ApiResponse<WalletAddress[]>> => {
    return api.get<WalletAddress[]>(`${BASE_PATH}/mis-wallets`);
};

// Obtener todas las direcciones de wallet de un usuario específico (ADMIN/USUARIO)
// GET /api/wallet-addresses/user/{userId}
const getWalletAddressesByUserId = async (userId: number): Promise<ApiResponse<WalletAddress[]>> => {
    return api.get<WalletAddress[]>(`${BASE_PATH}/user/${userId}`);
};

export const walletAddressService = {
    createWalletAddress,
    getWalletAddressById,
    updateWalletAddress,
    deleteWalletAddress,
    getMyWalletAddresses,
    getWalletAddressesByUserId,
};
