import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../store';
import type { CreateWalletAddress } from '../type/requestTypes';
import {
    createWalletAddressThunk,
    getWalletAddressByIdThunk,
    updateWalletAddressThunk,
    deleteWalletAddressThunk,
    getMyWalletAddressesThunk,
    getWalletAddressesByUserIdThunk,
    clearSelectedWalletAddress,
    clearWalletAddresses,
    setSelectedWalletAddress,
    updateWalletInState
} from '../store/slice/walletAddressSlice';
import type { WalletAddress } from '../type/entityTypes';

/**
 * Hook personalizado para manejo de direcciones de wallet
 * Proporciona métodos y estados para gestionar las direcciones de wallet
 */
export const useWalletAddress = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Seleccionar estados desde Redux
    const walletAddresses = useSelector((state: RootState) => state.walletAddress.walletAddresses);
    const selectedWalletAddress = useSelector((state: RootState) => state.walletAddress.selectedWalletAddress);

    // Estados de Crear
    const loadingCreate = useSelector((state: RootState) => state.walletAddress.loadingCreate);
    const errorCreate = useSelector((state: RootState) => state.walletAddress.errorCreate);

    // Estados de Obtener por ID
    const loadingGetById = useSelector((state: RootState) => state.walletAddress.loadingGetById);
    const errorGetById = useSelector((state: RootState) => state.walletAddress.errorGetById);

    // Estados de Actualizar
    const loadingUpdate = useSelector((state: RootState) => state.walletAddress.loadingUpdate);
    const errorUpdate = useSelector((state: RootState) => state.walletAddress.errorUpdate);

    // Estados de Eliminar
    const loadingDelete = useSelector((state: RootState) => state.walletAddress.loadingDelete);
    const errorDelete = useSelector((state: RootState) => state.walletAddress.errorDelete);

    // Estados de Mis Wallets
    const loadingMyWallets = useSelector((state: RootState) => state.walletAddress.loadingMyWallets);
    const errorMyWallets = useSelector((state: RootState) => state.walletAddress.errorMyWallets);

    // Estados de Wallets por Usuario
    const loadingByUserId = useSelector((state: RootState) => state.walletAddress.loadingByUserId);
    const errorByUserId = useSelector((state: RootState) => state.walletAddress.errorByUserId);

    /**
     * Función para crear una nueva dirección de wallet
     * @param walletAddressData - Datos de la wallet (address, tipoCrypto, nombre)
     * @returns Promise con la respuesta del servidor
     */
    const createWalletAddress = async (walletAddressData: CreateWalletAddress) => {
        try {
            const result = await dispatch(createWalletAddressThunk(walletAddressData));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al crear dirección de wallet:', error);
            throw error;
        }
    };

    /**
     * Función para obtener una dirección de wallet por ID
     * @param id - ID de la wallet
     * @returns Promise con la respuesta del servidor
     */
    const getWalletAddressById = async (id: number) => {
        try {
            const result = await dispatch(getWalletAddressByIdThunk({ id }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al obtener dirección de wallet:', error);
            throw error;
        }
    };

    /**
     * Función para actualizar una dirección de wallet
     * @param id - ID de la wallet a actualizar
     * @param walletAddressData - Datos actualizados de la wallet
     * @returns Promise con la respuesta del servidor
     */
    const updateWalletAddress = async (id: number, walletAddressData: CreateWalletAddress) => {
        try {
            const result = await dispatch(updateWalletAddressThunk({ id, walletAddress: walletAddressData }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al actualizar dirección de wallet:', error);
            throw error;
        }
    };

    /**
     * Función para eliminar una dirección de wallet
     * @param id - ID de la wallet a eliminar
     * @returns Promise con la respuesta del servidor
     */
    const deleteWalletAddress = async (id: number) => {
        try {
            const result = await dispatch(deleteWalletAddressThunk({ id }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al eliminar dirección de wallet:', error);
            throw error;
        }
    };

    /**
     * Función para obtener todas las direcciones de wallet del usuario autenticado
     * @returns Promise con la respuesta del servidor
     */
    const getMyWalletAddresses = async () => {
        try {
            const result = await dispatch(getMyWalletAddressesThunk());
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al obtener mis direcciones de wallet:', error);
            throw error;
        }
    };

    /**
     * Función para obtener todas las direcciones de wallet de un usuario específico
     * @param userId - ID del usuario
     * @returns Promise con la respuesta del servidor
     */
    const getWalletAddressesByUserId = async (userId: number) => {
        try {
            const result = await dispatch(getWalletAddressesByUserIdThunk({ userId }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al obtener direcciones de wallet del usuario:', error);
            throw error;
        }
    };

    /**
     * Función para limpiar la wallet seleccionada
     */
    const clearSelected = () => {
        dispatch(clearSelectedWalletAddress());
    };

    /**
     * Función para limpiar todas las wallets del estado
     */
    const clearWallets = () => {
        dispatch(clearWalletAddresses());
    };

    /**
     * Función para establecer una wallet como seleccionada
     * @param wallet - Wallet a seleccionar
     */
    const selectWalletAddress = (wallet: WalletAddress) => {
        dispatch(setSelectedWalletAddress(wallet));
    };

    /**
     * Función para actualizar una wallet en el estado global
     * @param wallet - Wallet actualizada
     */
    const updateWalletInGlobalState = (wallet: WalletAddress) => {
        dispatch(updateWalletInState(wallet));
    };

    // Retornar objeto con métodos y estados
    return {
        // Datos
        walletAddresses,
        selectedWalletAddress,

        // Métodos CRUD
        createWalletAddress,
        getWalletAddressById,
        updateWalletAddress,
        deleteWalletAddress,
        getMyWalletAddresses,
        getWalletAddressesByUserId,

        // Métodos de limpieza y selección
        clearSelected,
        clearWallets,
        selectWalletAddress,
        updateWalletInGlobalState,

        // Estados de Crear
        loadingCreate,
        errorCreate,

        // Estados de Obtener por ID
        loadingGetById,
        errorGetById,

        // Estados de Actualizar
        loadingUpdate,
        errorUpdate,

        // Estados de Eliminar
        loadingDelete,
        errorDelete,

        // Estados de Mis Wallets
        loadingMyWallets,
        errorMyWallets,

        // Estados de Wallets por Usuario
        loadingByUserId,
        errorByUserId,
    };
};
