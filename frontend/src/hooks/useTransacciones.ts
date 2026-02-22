import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../store';
import { obtenerGananciasPorMes, obtenerTransacciones } from '../store/slice/transaccionesSlice';
import type { TipoConceptos, EstadoOperacion } from '../type/enum';

/**
 * Hook personalizado para manejo de transacciones
 * Proporciona métodos y estados para obtener y filtrar transacciones
 */
export const useTransacciones = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Seleccionar estados de transacciones desde Redux
    const transacciones = useSelector((state: RootState) => state.transacciones.transacciones);
    const paginaActual = useSelector((state: RootState) => state.transacciones.paginaActual);
    const totalPaginas = useSelector((state: RootState) => state.transacciones.totalPaginas);
    const totalElementos = useSelector((state: RootState) => state.transacciones.totalElementos);
    const cargando = useSelector((state: RootState) => state.transacciones.cargando);
    const error = useSelector((state: RootState) => state.transacciones.error);

    const gananciasPorMes = useSelector((state: RootState) => state.transacciones.gananciasPorMes);
    const loadingGanancias = useSelector((state: RootState) => state.transacciones.loadingGanancias);
    const errorGanancias = useSelector((state: RootState) => state.transacciones.errorGanancias);

    /**
     * Función para obtener transacciones con filtros
     * @param params - Parámetros de filtrado (usuarioId, concepto, estado, fechas, página, tamaño)
     * @returns Promise con la respuesta del servidor
     */
    const cargarTransacciones = async (params: {
        usuarioId?: number;
        concepto?: TipoConceptos | "TODOS";
        estado?: EstadoOperacion | "TODOS";
        desde?: string;
        hasta?: string;
        page?: number;
        size?: number;
    }) => {
        try {
            const result = await dispatch(obtenerTransacciones({
                usuarioId: params.usuarioId,
                concepto: params.concepto === "TODOS" ? undefined as unknown as TipoConceptos : params.concepto || "TODOS" as unknown as TipoConceptos,
                estado: params.estado === "TODOS" ? undefined as unknown as EstadoOperacion : params.estado || "TODOS" as unknown as EstadoOperacion,
                desde: params.desde,
                hasta: params.hasta,
                page: params.page || 0,
                size: params.size || 10,
            }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al cargar transacciones:', error);
            throw error;
        }
    };

    /**
     * Función para obtener transacciones de un usuario específico
     * @param usuarioId - ID del usuario
     * @param page - Número de página (default: 0)
     * @param size - Tamaño de página (default: 10)
     * @returns Promise con la respuesta del servidor
     */
    const cargarTransaccionesPorUsuario = async (
        usuarioId: number,
        page: number = 0,
        size: number = 10
    ) => {
        return cargarTransacciones({ usuarioId, page, size });
    };

    /**
     * Función para filtrar transacciones por rango de fechas
     * @param usuarioId - ID del usuario
     * @param desde - Fecha de inicio (ISO string)
     * @param hasta - Fecha de fin (ISO string)
     * @param page - Número de página (default: 0)
     * @param size - Tamaño de página (default: 10)
     * @returns Promise con la respuesta del servidor
     */
    const filtrarPorFechas = async (
        usuarioId: number,
        desde: string,
        hasta: string,
        page: number = 0,
        size: number = 10
    ) => {
        return cargarTransacciones({ usuarioId, desde, hasta, page, size });
    };

    /**
     * Función para filtrar transacciones por concepto y estado
     * @param usuarioId - ID del usuario
     * @param concepto - Tipo de concepto de la transacción
     * @param estado - Estado de la transacción
     * @param page - Número de página (default: 0)
     * @param size - Tamaño de página (default: 10)
     * @returns Promise con la respuesta del servidor
     */
    const filtrarPorConceptoYEstado = async (
        usuarioId: number,
        concepto?: TipoConceptos | "TODOS",
        estado?: EstadoOperacion | "TODOS",
        page: number = 0,
        size: number = 10
    ) => {
        return cargarTransacciones({ usuarioId, concepto, estado, page, size });
    };

    const cargarGananciasPorMes = async () => {
        try {
            const result = await dispatch(obtenerGananciasPorMes());
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al cargar ganancias por mes:', error);
            throw error;
        }
    };

    return {
        // Estados
        transacciones,
        paginaActual,
        totalPaginas,
        totalElementos,
        cargando,
        error,
        gananciasPorMes,
        loadingGanancias,
        errorGanancias,
        // Métodos
        cargarTransacciones,
        cargarGananciasPorMes,
        cargarTransaccionesPorUsuario,
        filtrarPorFechas,
        filtrarPorConceptoYEstado,
    };
};