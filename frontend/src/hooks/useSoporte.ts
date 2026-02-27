import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../store';
import {
    crearTiketThunk,
    actualizarEstadoTiketThunk,
    agregarComentarioThunk,
    listarMisTiketsThunk,
    listarTodosLosTiketsThunk,
    setTiketSeleccionado,
    clearTiketSeleccionado,
    clearErrores,
} from '../store/slice/soporteSlice';
import type { CrearTiketRequest } from '../type/requestTypes';
import type { EstadoTicket } from '../type/enum';
import type { Ticket } from '../type/entityTypes';

/**
 * Hook personalizado para manejo de tickets de soporte
 * Proporciona métodos y estados para crear, listar y gestionar tickets
 */
export const useSoporte = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Seleccionar estados de mis tickets desde Redux
    const misTikets = useSelector((state: RootState) => state.soporte.misTikets);
    const paginaActualMisTikets = useSelector((state: RootState) => state.soporte.paginaActualMisTikets);
    const totalPaginasMisTikets = useSelector((state: RootState) => state.soporte.totalPaginasMisTikets);
    const totalElementosMisTikets = useSelector((state: RootState) => state.soporte.totalElementosMisTikets);
    const loadingMisTikets = useSelector((state: RootState) => state.soporte.loadingMisTikets);
    const errorMisTikets = useSelector((state: RootState) => state.soporte.errorMisTikets);

    // Seleccionar estados de todos los tickets (admin) desde Redux
    const todosLosTikets = useSelector((state: RootState) => state.soporte.todosLosTikets);
    const paginaActualTodos = useSelector((state: RootState) => state.soporte.paginaActualTodos);
    const totalPaginasTodos = useSelector((state: RootState) => state.soporte.totalPaginasTodos);
    const totalElementosTodos = useSelector((state: RootState) => state.soporte.totalElementosTodos);
    const loadingTodosLosTikets = useSelector((state: RootState) => state.soporte.loadingTodosLosTikets);
    const errorTodosLosTikets = useSelector((state: RootState) => state.soporte.errorTodosLosTikets);

    // Seleccionar estados de operaciones desde Redux
    const loadingCrearTiket = useSelector((state: RootState) => state.soporte.loadingCrearTiket);
    const errorCrearTiket = useSelector((state: RootState) => state.soporte.errorCrearTiket);

    const loadingActualizarEstado = useSelector((state: RootState) => state.soporte.loadingActualizarEstado);
    const errorActualizarEstado = useSelector((state: RootState) => state.soporte.errorActualizarEstado);

    const loadingAgregarComentario = useSelector((state: RootState) => state.soporte.loadingAgregarComentario);
    const errorAgregarComentario = useSelector((state: RootState) => state.soporte.errorAgregarComentario);

    // Ticket seleccionado
    const tiketSeleccionado = useSelector((state: RootState) => state.soporte.tiketSeleccionado);

    /**
     * Función para crear un nuevo ticket de soporte
     * @param request - Datos del ticket (asunto, descripción)
     * @returns Promise con la respuesta del servidor
     */
    const crearTiket = async (request: CrearTiketRequest) => {
        try {
            const result = await dispatch(crearTiketThunk(request));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al crear ticket:', error);
            throw error;
        }
    };

    /**
     * Función para actualizar el estado de un ticket
     * @param id - ID del ticket
     * @param estado - Nuevo estado del ticket
     * @returns Promise con la respuesta del servidor
     */
    const actualizarEstadoTiket = async (id: number, estado: EstadoTicket) => {
        try {
            const result = await dispatch(actualizarEstadoTiketThunk({ id, estado }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al actualizar estado del ticket:', error);
            throw error;
        }
    };

    /**
     * Función para agregar un comentario a un ticket
     * @param id - ID del ticket
     * @param comentario - Texto del comentario
     * @returns Promise con la respuesta del servidor
     */
    const agregarComentario = async (id: number, comentario: string) => {
        try {
            const result = await dispatch(agregarComentarioThunk({ id, comentario }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al agregar comentario:', error);
            throw error;
        }
    };

    /**
     * Función para listar los tickets del usuario autenticado
     * @param page - Número de página (default: 0)
     * @param size - Tamaño de página (default: 10)
     * @returns Promise con la respuesta del servidor
     */
    const listarMisTikets = async (page: number = 0, size: number = 10) => {
        try {
            const result = await dispatch(listarMisTiketsThunk({ page, size }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al listar mis tickets:', error);
            throw error;
        }
    };

    /**
     * Función para listar todos los tickets (solo admin)
     * @param page - Número de página (default: 0)
     * @param size - Tamaño de página (default: 10)
     * @returns Promise con la respuesta del servidor
     */
    const listarTodosLosTikets = async (page: number = 0, size: number = 10) => {
        try {
            const result = await dispatch(listarTodosLosTiketsThunk({ page, size }));
            return unwrapResult(result);
        } catch (error) {
            console.error('Error al listar todos los tickets:', error);
            throw error;
        }
    };

    /**
     * Función para seleccionar un ticket
     * @param ticket - Ticket a seleccionar o null para deseleccionar
     */
    const seleccionarTiket = (ticket: Ticket | null) => {
        if (ticket) {
            dispatch(setTiketSeleccionado(ticket));
        } else {
            dispatch(clearTiketSeleccionado());
        }
    };

    /**
     * Función para limpiar todos los errores del estado
     */
    const limpiarErrores = () => {
        dispatch(clearErrores());
    };

    return {
        // Estados - Mis Tickets
        misTikets,
        paginaActualMisTikets,
        totalPaginasMisTikets,
        totalElementosMisTikets,
        loadingMisTikets,
        errorMisTikets,

        // Estados - Todos los Tickets (Admin)
        todosLosTikets,
        paginaActualTodos,
        totalPaginasTodos,
        totalElementosTodos,
        loadingTodosLosTikets,
        errorTodosLosTikets,

        // Estados - Operaciones
        loadingCrearTiket,
        errorCrearTiket,
        loadingActualizarEstado,
        errorActualizarEstado,
        loadingAgregarComentario,
        errorAgregarComentario,

        // Estado - Ticket Seleccionado
        tiketSeleccionado,

        // Métodos
        crearTiket,
        actualizarEstadoTiket,
        agregarComentario,
        listarMisTikets,
        listarTodosLosTikets,
        seleccionarTiket,
        limpiarErrores,
    };
};
