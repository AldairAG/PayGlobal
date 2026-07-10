import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import {
    obtenerLicenciasUsuarioThunk,
    obtenerLicenciasPorUsuarioThunk,
    iniciarMineriaThunk,
    detenerMineriaThunk,
    retirarGananciasThunk,
} from "../store/slice/mineriaSlice";

/**
 * Hook personalizado para manejo de minería
 * Proporciona métodos y estados para gestionar licencias de minería
 */
export const useMineria = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Seleccionar estados de licencias del usuario
    const licenciasUsuario = useSelector((state: RootState) => state.mineria.licenciasUsuario);
    const loadingLicenciasUsuario = useSelector((state: RootState) => state.mineria.loadingLicenciasUsuario);
    const errorLicenciasUsuario = useSelector((state: RootState) => state.mineria.errorLicenciasUsuario);

    // Seleccionar estados de licencias por usuario (Admin)
    const licenciasPorUsuario = useSelector((state: RootState) => state.mineria.licenciasPorUsuario);
    const loadingLicenciasPorUsuario = useSelector((state: RootState) => state.mineria.loadingLicenciasPorUsuario);
    const errorLicenciasPorUsuario = useSelector((state: RootState) => state.mineria.errorLicenciasPorUsuario);

    // Estados de iniciar minería
    const loadingIniciarMineria = useSelector((state: RootState) => state.mineria.loadingIniciarMineria);
    const errorIniciarMineria = useSelector((state: RootState) => state.mineria.errorIniciarMineria);

    // Estados de detener minería
    const loadingDetenerMineria = useSelector((state: RootState) => state.mineria.loadingDetenerMineria);
    const errorDetenerMineria = useSelector((state: RootState) => state.mineria.errorDetenerMineria);

    // Estados de retirar ganancias
    const loadingRetirarGanancias = useSelector((state: RootState) => state.mineria.loadingRetirarGanancias);
    const errorRetirarGanancias = useSelector((state: RootState) => state.mineria.errorRetirarGanancias);

    /**
     * Función para obtener las licencias de minería del usuario autenticado
     * @returns Promise con la respuesta del servidor
     */
    const obtenerLicenciasUsuario = async () => {
        try {
            const result = await dispatch(obtenerLicenciasUsuarioThunk()).unwrap();
            return result;
        } catch (error) {
            console.error("Error al obtener licencias del usuario:", error);
            throw error;
        }
    };

    /**
     * Función para obtener licencias de minería de un usuario específico (Admin)
     * @param usuarioId - ID del usuario
     * @returns Promise con la respuesta del servidor
     */
    const obtenerLicenciasPorUsuario = async (usuarioId: number) => {
        try {
            const result = await dispatch(obtenerLicenciasPorUsuarioThunk({ usuarioId })).unwrap();
            return result;
        } catch (error) {
            console.error("Error al obtener licencias del usuario:", error);
            throw error;
        }
    };

    /**
     * Función para iniciar minería con una licencia
     * @param licenciaId - ID de la licencia
     * @param plazo - Plazo en días
     * @returns Promise con la respuesta del servidor
     */
    const iniciarMineria = async (licenciaId: number, plazo: number) => {
        try {
            const result = await dispatch(iniciarMineriaThunk({ licenciaId, plazo })).unwrap();
            return result;
        } catch (error) {
            console.error("Error al iniciar minería:", error);
            throw error;
        }
    };

    /**
     * Función para detener minería de una licencia
     * @param licenciaId - ID de la licencia
     * @returns Promise con la respuesta del servidor
     */
    const detenerMineria = async (licenciaId: number) => {
        try {
            const result = await dispatch(detenerMineriaThunk({ licenciaId })).unwrap();
            return result;
        } catch (error) {
            console.error("Error al detener minería:", error);
            throw error;
        }
    };

    /**
     * Función para retirar ganancias de minería a wallet de staking
     * @returns Promise con la respuesta del servidor
     */
    const retirarGanancias = async () => {
        try {
            const result = await dispatch(retirarGananciasThunk()).unwrap();
            return result;
        } catch (error) {
            console.error("Error al retirar ganancias:", error);
            throw error;
        }
    };

    // Retornar objeto con métodos y estados
    return {
        // Licencias del usuario
        licenciasUsuario,
        loadingLicenciasUsuario,
        errorLicenciasUsuario,
        obtenerLicenciasUsuario,

        // Licencias por usuario (Admin)
        licenciasPorUsuario,
        loadingLicenciasPorUsuario,
        errorLicenciasPorUsuario,
        obtenerLicenciasPorUsuario,

        // Iniciar minería
        iniciarMineria,
        loadingIniciarMineria,
        errorIniciarMineria,

        // Detener minería
        detenerMineria,
        loadingDetenerMineria,
        errorDetenerMineria,

        // Retirar ganancias
        retirarGanancias,
        loadingRetirarGanancias,
        errorRetirarGanancias,
    };
};
