import { useEffect, useState } from "react";
import { useSoporte } from "../../hooks/useSoporte";
import { Ticket, MessageSquare, Send, CheckCircle, Clock, ChevronLeft, ChevronRight, XCircle, User, Calendar, Hash } from "lucide-react";
import { toast } from "react-toastify";
import { EstadoTicket as EstadoTicketEnum } from "../../type/enum";

const GestionSoportePage = () => {

    const {
        listarTodosLosTikets, loadingTodosLosTikets,
        todosLosTikets, totalPaginasTodos, totalElementosTodos,
        seleccionarTiket, tiketSeleccionado,
        actualizarEstadoTiket, loadingActualizarEstado, errorActualizarEstado,
        agregarComentario, loadingAgregarComentario, errorAgregarComentario,
    } = useSoporte();

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(15);
    const [newResponse, setNewResponse] = useState("");
    const [filterEstado, setFilterEstado] = useState<"TODOS" | EstadoTicketEnum>("TODOS");

    useEffect(() => {
        listarTodosLosTikets(currentPage, pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // Funciones de paginación
    const handleNextPage = () => {
        if (currentPage < totalPaginasTodos - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Agregar respuesta a un ticket
    const handleAddResponse = () => {
        if (!tiketSeleccionado || !newResponse.trim()) return;

        agregarComentario(tiketSeleccionado.id, newResponse.trim())
            .then(() => {
                listarTodosLosTikets(currentPage, pageSize);
                setNewResponse("");
                toast.success("Respuesta agregada exitosamente");
            })
            .catch((error) => {
                console.error("Error al agregar respuesta:", error);
                toast.error(errorAgregarComentario || "Error al agregar la respuesta.");
            });
    };

    // Cambiar estado del ticket
    const handleChangeStatus = (estado: EstadoTicketEnum) => {
        if (!tiketSeleccionado) return;

        actualizarEstadoTiket(tiketSeleccionado.id, estado)
            .then(() => {
                listarTodosLosTikets(currentPage, pageSize);
                toast.success(`Ticket ${estado === EstadoTicketEnum.CERRADO ? 'cerrado' : 'reabierto'} exitosamente`);
            })
            .catch((error) => {
                console.error("Error al cambiar estado:", error);
                toast.error(errorActualizarEstado || "Error al cambiar el estado del ticket.");
            });
    };

    // Filtrar tickets por estado
    const ticketsFiltrados = filterEstado === "TODOS" 
        ? todosLosTikets 
        : todosLosTikets.filter(t => t.estado === filterEstado);

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-black">
                        Gestión de Soporte
                    </h1>
                    <p className="text-gray-600">
                        Administra todos los tickets de soporte del sistema
                    </p>
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-[#F0973C]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-semibold">Total Tickets</p>
                                <p className="text-2xl font-bold text-[#F0973C]">{totalElementosTodos}</p>
                            </div>
                            <Ticket size={32} className="text-[#F0973C] opacity-50" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-[#69AC95]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-semibold">Tickets Abiertos</p>
                                <p className="text-2xl font-bold text-[#69AC95]">
                                    {todosLosTikets.filter(t => t.estado === EstadoTicketEnum.ABIERTO).length}
                                </p>
                            </div>
                            <Clock size={32} className="text-[#69AC95] opacity-50" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-semibold">Tickets Cerrados</p>
                                <p className="text-2xl font-bold text-gray-700">
                                    {todosLosTikets.filter(t => t.estado === EstadoTicketEnum.CERRADO).length}
                                </p>
                            </div>
                            <CheckCircle size={32} className="text-gray-500 opacity-50" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel izquierdo - Lista de tickets */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Ticket size={24} className="text-[#F0973C]" />
                                    Todos los Tickets
                                </h2>
                            </div>

                            {/* Filtro de estado */}
                            <div className="mb-4">
                                <select
                                    value={filterEstado}
                                    onChange={(e) => setFilterEstado(e.target.value as "TODOS" | EstadoTicketEnum)}
                                    className="w-full px-4 py-2 border-2 border-[#F0973C] rounded-lg focus:outline-none focus:border-opacity-100 transition-all"
                                >
                                    <option value="TODOS">Todos los estados</option>
                                    <option value={EstadoTicketEnum.ABIERTO}>Abiertos</option>
                                    <option value={EstadoTicketEnum.CERRADO}>Cerrados</option>
                                </select>
                            </div>

                            {/* Lista de tickets */}
                            <div className="space-y-3 max-h-150 overflow-y-auto">
                                {loadingTodosLosTikets ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0973C]"></div>
                                    </div>
                                ) : ticketsFiltrados.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <Ticket size={48} className="mx-auto mb-2 opacity-30" />
                                        <p>No hay tickets {filterEstado !== "TODOS" ? filterEstado.toLowerCase() + "s" : ""}</p>
                                    </div>
                                ) : (
                                    ticketsFiltrados.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            onClick={() => seleccionarTiket(ticket)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${tiketSeleccionado?.id === ticket.id
                                                ? "border-[#F0973C] bg-[#F0973C]/5 shadow-md"
                                                : "border-gray-200 hover:border-[#F0973C]/30"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <Hash size={14} className="text-gray-400 shrink-0" />
                                                    <h3 className="font-semibold text-sm truncate">
                                                        {ticket.asunto}
                                                    </h3>
                                                </div>
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold text-white ml-2 shrink-0 ${ticket.estado === EstadoTicketEnum.ABIERTO ? "bg-[#69AC95]" : "bg-gray-600"
                                                        }`}
                                                >
                                                    {ticket.estado === EstadoTicketEnum.ABIERTO ? "Abierto" : "Cerrado"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                                                {ticket.descripcion}
                                            </p>
                                            <div className="flex justify-between items-center text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {new Date(ticket.fechaCreacion).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare size={12} />
                                                    {ticket.respuestaTikect?.length || 0}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Paginación */}
                            {!loadingTodosLosTikets && totalPaginasTodos > 1 && (
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            Página {currentPage + 1} de {totalPaginasTodos}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handlePreviousPage}
                                                disabled={currentPage === 0}
                                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <div className="flex gap-1">
                                                {Array.from({ length: Math.min(5, totalPaginasTodos) }, (_, i) => {
                                                    let pageNum;
                                                    if (totalPaginasTodos <= 5) {
                                                        pageNum = i;
                                                    } else if (currentPage < 3) {
                                                        pageNum = i;
                                                    } else if (currentPage > totalPaginasTodos - 4) {
                                                        pageNum = totalPaginasTodos - 5 + i;
                                                    } else {
                                                        pageNum = currentPage - 2 + i;
                                                    }
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => handlePageChange(pageNum)}
                                                            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${currentPage === pageNum
                                                                ? "bg-[#F0973C] text-white"
                                                                : "border border-gray-300 hover:bg-gray-50"
                                                                }`}
                                                        >
                                                            {pageNum + 1}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <button
                                                onClick={handleNextPage}
                                                disabled={currentPage === totalPaginasTodos - 1}
                                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel derecho - Detalle del ticket */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6 min-h-150">
                            {tiketSeleccionado ? (
                                <div className="flex flex-col h-full">
                                    {/* Header del ticket */}
                                    <div className="mb-6 pb-6 border-b-2 border-gray-200">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Hash size={20} className="text-gray-400" />
                                                    <h2 className="text-2xl font-bold">
                                                        {tiketSeleccionado.asunto}
                                                    </h2>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <User size={16} />
                                                        Usuario: <span className="font-semibold">Usuario #{tiketSeleccionado.id}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={16} />
                                                        {new Date(tiketSeleccionado.fechaCreacion).toLocaleDateString()}
                                                    </span>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 text-white ${tiketSeleccionado.estado === EstadoTicketEnum.ABIERTO ? "bg-[#69AC95]" : "bg-gray-600"
                                                            }`}
                                                    >
                                                        {tiketSeleccionado.estado === EstadoTicketEnum.ABIERTO ? (
                                                            <>
                                                                <Clock size={14} />
                                                                Abierto
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle size={14} />
                                                                Cerrado
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Botones de acción */}
                                            <div className="flex gap-2">
                                                {tiketSeleccionado.estado === EstadoTicketEnum.ABIERTO ? (
                                                    <button
                                                        disabled={loadingActualizarEstado}
                                                        onClick={() => handleChangeStatus(EstadoTicketEnum.CERRADO)}
                                                        className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 bg-gray-600 text-white flex items-center gap-2 disabled:opacity-50"
                                                    >
                                                        <XCircle size={18} />
                                                        Cerrar
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled={loadingActualizarEstado}
                                                        onClick={() => handleChangeStatus(EstadoTicketEnum.ABIERTO)}
                                                        className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 bg-[#69AC95] text-white flex items-center gap-2 disabled:opacity-50"
                                                    >
                                                        <CheckCircle size={18} />
                                                        Reabrir
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Descripción original */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2 text-sm text-[#F0973C]">
                                                Descripción Original:
                                            </h3>
                                            <p className="text-gray-700 whitespace-pre-wrap">
                                                {tiketSeleccionado.descripcion}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Respuestas */}
                                    <div className="flex-1 overflow-y-auto mb-6 space-y-4">
                                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                            <MessageSquare size={20} className="text-[#69AC95]" />
                                            Conversación ({tiketSeleccionado.respuestaTikect?.length || 0})
                                        </h3>

                                        {!tiketSeleccionado.respuestaTikect || tiketSeleccionado.respuestaTikect.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400">
                                                <MessageSquare size={48} className="mx-auto mb-2 opacity-30" />
                                                <p>No hay respuestas aún. Sé el primero en responder.</p>
                                            </div>
                                        ) : (
                                            tiketSeleccionado.respuestaTikect.map((respuesta) => (
                                                <div
                                                    key={respuesta.id}
                                                    className={`p-4 rounded-lg border-l-4 ${respuesta.autor === "SOPORTE"
                                                        ? "bg-[#F0973C]/5 border-l-[#F0973C]"
                                                        : "bg-gray-50 border-l-[#69AC95]"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`text-xs font-bold ${respuesta.autor === "SOPORTE" ? "text-[#F0973C]" : "text-[#69AC95]"
                                                            }`}>
                                                            {respuesta.autor === "SOPORTE" ? "Equipo de Soporte" : "Usuario"}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(respuesta.fechaRespuesta).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-800 whitespace-pre-wrap">
                                                        {respuesta.respuesta}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Campo para nueva respuesta */}
                                    <div className="border-t-2 border-gray-200 pt-4">
                                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                                            Responder como Soporte
                                        </label>
                                        <div className="flex gap-2">
                                            <textarea
                                                value={newResponse}
                                                onChange={(e) => setNewResponse(e.target.value)}
                                                placeholder="Escribe tu respuesta al usuario..."
                                                rows={3}
                                                className="flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-opacity-100 transition-all resize-none border-[#F0973C]"
                                            />
                                            <button
                                                title="Enviar respuesta"
                                                onClick={handleAddResponse}
                                                disabled={!newResponse.trim() || loadingAgregarComentario}
                                                className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-[#F0973C] text-white"
                                            >
                                                <Send size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Estado inicial - sin ticket seleccionado */
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <Ticket size={64} className="mb-4 opacity-30" />
                                    <p className="text-lg font-semibold mb-2">
                                        Selecciona un ticket para ver los detalles
                                    </p>
                                    <p className="text-sm">
                                        Gestiona las consultas de los usuarios desde aquí
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GestionSoportePage;