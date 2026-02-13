/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import SolicitudItem from "../../components/items/SolcitudItem";
import { EstadoOperacion, TipoSolicitud } from "../../type/enum";
import { Filter, RefreshCw, FileText, Loader2, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { useUsuario } from "../../hooks/usuarioHook";
import { toast } from "react-toastify";

export const GestionPagosPage = () => {
    // Estado para las solicitudes (datos de ejemplo)
    const { solicitudes, loadingSolicitudes, errorSolicitudes, obtenerSolicitudes,
        aprobarSolicitud, loadingAprobarSolicitud, errorAprobarSolicitud, rechazarSolicitud, loadingRechazarSolicitud,
        errorRechazarSolicitud } = useUsuario();

    const [filtroEstado, setFiltroEstado] = useState<EstadoOperacion | "TODOS">("TODOS");
    const [filtroTipo, setFiltroTipo] = useState<TipoSolicitud | "TODOS">("TODOS");
    const [paginaActual, setPaginaActual] = useState(0);
    const [tamanioPagina, setTamanioPagina] = useState(10);

    useEffect(() => {
        obtenerSolicitudes(paginaActual, tamanioPagina);
    }, [paginaActual, tamanioPagina]);

    // Efecto para mostrar errores de aprobación
    useEffect(() => {
        if (errorAprobarSolicitud) {
            toast.error(`Error al aprobar: ${errorAprobarSolicitud}`);
        }
    }, [errorAprobarSolicitud]);

    // Efecto para mostrar errores de rechazo
    useEffect(() => {
        if (errorRechazarSolicitud) {
            toast.error(`Error al rechazar: ${errorRechazarSolicitud}`);
        }
    }, [errorRechazarSolicitud]);

    // Efecto para refrescar después de aprobar exitosamente
    useEffect(() => {
        if (!loadingAprobarSolicitud && !errorAprobarSolicitud) {
            // Si ya no está cargando y no hay error, significa que fue exitoso
            const timer = setTimeout(() => {
                obtenerSolicitudes(paginaActual, tamanioPagina);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [loadingAprobarSolicitud, errorAprobarSolicitud]);

    // Efecto para refrescar después de rechazar exitosamente
    useEffect(() => {
        if (!loadingRechazarSolicitud && !errorRechazarSolicitud) {
            // Si ya no está cargando y no hay error, significa que fue exitoso
            const timer = setTimeout(() => {
                obtenerSolicitudes(paginaActual, tamanioPagina);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [loadingRechazarSolicitud, errorRechazarSolicitud]);

    // Handlers para aprobar/rechazar
    const handleAprobar = async (solicitudId: number) => {
        try {
            await aprobarSolicitud(solicitudId);
            toast.success('Solicitud aprobada exitosamente');
        } catch (error) {
            console.log(error);
        }
    };

    const handleRechazar = async (solicitudId: number) => {
        try {
            await rechazarSolicitud(solicitudId);
            toast.success('Solicitud rechazada exitosamente');
        } catch (error) {
            console.log(error);
        }
    };

    // Filtrar solicitudes
    const solicitudesFiltradas = (solicitudes?.content ?? []).filter(sol => {
        const cumpleFiltroEstado = filtroEstado === "TODOS" || sol.estado === filtroEstado;
        const cumpleFiltroTipo = filtroTipo === "TODOS" || sol.tipoSolicitud === filtroTipo;
        return cumpleFiltroEstado && cumpleFiltroTipo;
    });

    // Contar por estado
    const contarPorEstado = (estado: EstadoOperacion) => {
        return (solicitudes?.content ?? []).filter(sol => sol.estado === estado).length;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-5 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText size={32} className="text-[#69AC95]" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Gestión de Pagos</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Administra y procesa las solicitudes de pago
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => obtenerSolicitudes(paginaActual, tamanioPagina)}
                        disabled={loadingSolicitudes}
                        className="flex items-center gap-2 px-4 py-2 bg-[#69AC95] hover:bg-[#5a9a82] text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw size={18} className={loadingSolicitudes ? "animate-spin" : ""} />
                        <span>Actualizar</span>
                    </button>
                </div>
            </div>

            <div className="px-6">
                {/* Alertas de Error */}
                {(errorAprobarSolicitud || errorRechazarSolicitud) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertTriangle size={20} className="text-red-600 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-red-800">Error en la operación</p>
                            <p className="text-sm text-red-700 mt-1">
                                {errorAprobarSolicitud || errorRechazarSolicitud}
                            </p>
                        </div>
                    </div>
                )}

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600 mb-1">Total</p>
                        <p className="text-2xl font-bold text-gray-800">{solicitudes?.totalElements ?? 0}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4">
                        <p className="text-sm text-yellow-700 mb-1">Pendientes</p>
                        <p className="text-2xl font-bold text-yellow-800">{contarPorEstado(EstadoOperacion.PENDIENTE)}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4">
                        <p className="text-sm text-blue-700 mb-1">Aprobadas</p>
                        <p className="text-2xl font-bold text-blue-800">{contarPorEstado(EstadoOperacion.APROBADA)}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
                        <p className="text-sm text-green-700 mb-1">Completadas</p>
                        <p className="text-2xl font-bold text-green-800">{contarPorEstado(EstadoOperacion.COMPLETADA)}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4">
                        <p className="text-sm text-red-700 mb-1">Rechazadas</p>
                        <p className="text-2xl font-bold text-red-800">{contarPorEstado(EstadoOperacion.RECHAZADA)}</p>
                    </div>
                </div>

                {/* Filtros y búsqueda */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Filtro por estado */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Filter size={16} />
                                Filtrar por Estado
                            </label>
                            <select
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value as EstadoOperacion | "TODOS")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#69AC95] focus:border-transparent outline-none"
                            >
                                <option value="TODOS">Todos los estados</option>
                                <option value={EstadoOperacion.PENDIENTE}>Pendientes</option>
                                <option value={EstadoOperacion.APROBADA}>Aprobadas</option>
                                <option value={EstadoOperacion.COMPLETADA}>Completadas</option>
                                <option value={EstadoOperacion.RECHAZADA}>Rechazadas</option>
                            </select>
                        </div>

                        {/* Filtro por tipo */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FileText size={16} />
                                Filtrar por Tipo
                            </label>
                            <select
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value as TipoSolicitud | "TODOS")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#69AC95] focus:border-transparent outline-none"
                            >
                                <option value="TODOS">Todos los tipos</option>
                                <option value={TipoSolicitud.COMPRA_LICENCIA}>Compra de Licencia</option>
                                <option value={TipoSolicitud.SOLICITUD_RETIRO_WALLET_DIVIDENDOS}>Retiro de Dividendos</option>
                                <option value={TipoSolicitud.SOLICITUD_RETIRO_WALLET_COMISIONES}>Retiro de Comisiones</option>
                                <option value={TipoSolicitud.TRANFERENCIA_USUARIO}>Transferencia a Usuario</option>
                                <option value={TipoSolicitud.PAGO_DELEGADO}>Pago Delegado</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Lista de solicitudes */}
                <div className="space-y-4">
                    {loadingSolicitudes ? (
                        // Estado de carga
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <Loader2 size={48} className="text-[#69AC95] mx-auto mb-4 animate-spin" />
                            <p className="text-gray-600 text-lg">Cargando solicitudes...</p>
                            <p className="text-gray-500 text-sm mt-2">Por favor espera un momento</p>
                        </div>
                    ) : errorSolicitudes ? (
                        // Estado de error
                        <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-12 text-center">
                            <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                            <p className="text-red-700 text-lg font-semibold">Error al cargar las solicitudes</p>
                            <p className="text-red-600 text-sm mt-2">{errorSolicitudes}</p>
                            <button
                                onClick={() => obtenerSolicitudes(paginaActual, tamanioPagina)}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 mx-auto"
                            >
                                <RefreshCw size={16} />
                                <span>Reintentar</span>
                            </button>
                        </div>
                    ) : solicitudesFiltradas.length > 0 ? (
                        // Lista de solicitudes
                        solicitudesFiltradas.map(solicitud => (
                            <SolicitudItem
                                key={solicitud.id}
                                solicitud={solicitud}
                                isAdmin={true}
                                onAprobar={handleAprobar}
                                onRechazar={handleRechazar}
                                isLoading={loadingAprobarSolicitud || loadingRechazarSolicitud}
                            />
                        ))
                    ) : (
                        // Sin resultados
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">No se encontraron solicitudes</p>
                            <p className="text-gray-500 text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
                        </div>
                    )}
                </div>

                {/* Controles de paginación */}
                {solicitudes && solicitudes.totalPages > 1 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
                        <div className="flex items-center justify-between">
                            {/* Información de paginación */}
                            <div className="text-sm text-gray-600">
                                Mostrando <span className="font-semibold">{solicitudes.numberOfElements}</span> de{' '}
                                <span className="font-semibold">{solicitudes.totalElements}</span> solicitudes
                                {' '}(Página <span className="font-semibold">{paginaActual + 1}</span> de{' '}
                                <span className="font-semibold">{solicitudes.totalPages}</span>)
                            </div>

                            {/* Controles de navegación */}
                            <div className="flex items-center gap-2">
                                {/* Botón Primera página */}
                                <button
                                    onClick={() => setPaginaActual(0)}
                                    disabled={solicitudes.first || loadingSolicitudes}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Primera página"
                                >
                                    Primera
                                </button>

                                {/* Botón Anterior */}
                                <button
                                    onClick={() => setPaginaActual(prev => Math.max(0, prev - 1))}
                                    disabled={solicitudes.first || loadingSolicitudes}
                                    className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Página anterior"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {/* Números de página */}
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, solicitudes.totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (solicitudes.totalPages <= 5) {
                                            pageNum = i;
                                        } else if (paginaActual < 3) {
                                            pageNum = i;
                                        } else if (paginaActual > solicitudes.totalPages - 4) {
                                            pageNum = solicitudes.totalPages - 5 + i;
                                        } else {
                                            pageNum = paginaActual - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPaginaActual(pageNum)}
                                                disabled={loadingSolicitudes}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    paginaActual === pageNum
                                                        ? 'bg-[#69AC95] text-white'
                                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {pageNum + 1}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Botón Siguiente */}
                                <button
                                    onClick={() => setPaginaActual(prev => Math.min(solicitudes.totalPages - 1, prev + 1))}
                                    disabled={solicitudes.last || loadingSolicitudes}
                                    className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Página siguiente"
                                >
                                    <ChevronRight size={20} />
                                </button>

                                {/* Botón Última página */}
                                <button
                                    onClick={() => setPaginaActual(solicitudes.totalPages - 1)}
                                    disabled={solicitudes.last || loadingSolicitudes}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Última página"
                                >
                                    Última
                                </button>

                                {/* Selector de tamaño de página */}
                                <select
                                    value={tamanioPagina}
                                    onChange={(e) => {
                                        setTamanioPagina(Number(e.target.value));
                                        setPaginaActual(0);
                                    }}
                                    disabled={loadingSolicitudes}
                                    className="ml-4 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <option value={5}>5 por página</option>
                                    <option value={10}>10 por página</option>
                                    <option value={20}>20 por página</option>
                                    <option value={50}>50 por página</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}