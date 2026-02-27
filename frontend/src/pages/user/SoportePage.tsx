import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Ticket, Plus, MessageSquare, X, Send, CheckCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import type { Ticket as TicketType } from "../../type/entityTypes";
import { EstadoTicket as EstadoTicketEnum } from "../../type/enum";
import { useSoporte } from "../../hooks/useSoporte";
import type { CrearTiketRequest } from "../../type/requestTypes";
import { useTranslation } from "react-i18next";

export const SoportePage = () => {

    const {
        listarMisTikets, crearTiket, actualizarEstadoTiket, agregarComentario,
        misTikets,
        loadingCrearTiket, errorCrearTiket,
        loadingActualizarEstado, errorActualizarEstado,
        loadingAgregarComentario, errorAgregarComentario,
        loadingMisTikets,
        totalPaginasMisTikets,
        totalElementosMisTikets,

    } = useSoporte();

    const { t } = useTranslation();

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);

    useEffect(() => {
        listarMisTikets(currentPage, pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
    const [showNewTicketForm, setShowNewTicketForm] = useState(false);
    const [newResponse, setNewResponse] = useState("");

    // Funciones de paginación
    const handleNextPage = () => {
        if (currentPage < totalPaginasMisTikets - 1) {
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

    // Validación para nuevo ticket
    const validationSchema = Yup.object({
        asunto: Yup.string()
            .required(t("support.subject_required"))
            .min(5, t("support.subject_min_length")),
        descripcion: Yup.string()
            .required(t("support.description_required"))
            .min(20, t("support.description_min_length"))
    });

    // Formik para nuevo ticket
    const formik = useFormik({
        initialValues: {
            asunto: "",
            descripcion: ""
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            const nuevoTicket: CrearTiketRequest = {
                asunto: values.asunto,
                descripcion: values.descripcion,
            };

            crearTiket(nuevoTicket)
                .then(() => {
                    listarMisTikets(currentPage, pageSize);
                })
                .catch((error) => {
                    console.error("Error al crear ticket:", error);
                    toast.error(errorCrearTiket || "Error al crear el ticket. Por favor, intenta nuevamente.");
                });

            resetForm();
            setShowNewTicketForm(false);
            toast.success(t("support.ticket_created_successfully"));
        }
    });

    // Agregar respuesta a un ticket
    const handleAddResponse = () => {
        if (!selectedTicket || !newResponse.trim()) return;

        agregarComentario(selectedTicket.id, newResponse.trim())
            .then(() => {
                listarMisTikets(currentPage, pageSize);
                setSelectedTicket(null);
                toast.success("Respuesta agregada exitosamente");
            })  
            .catch((error) => {
                console.error("Error al agregar respuesta:", error);
                toast.error(errorAgregarComentario || "Error al agregar la respuesta. Por favor, intenta nuevamente.");
            });

        setNewResponse("");
        toast.success(t("support.response_added_successfully"));
    };

    // Cerrar ticket
    const handleCloseTicket = () => {
        if (!selectedTicket) return;

        actualizarEstadoTiket(selectedTicket.id, EstadoTicketEnum.CERRADO)
            .then(() => {
                listarMisTikets(currentPage, pageSize);
            }).catch((error) => {
                console.error("Error al cerrar el ticket:", error);
                toast.error(errorActualizarEstado || "Error al cerrar el ticket. Por favor, intenta nuevamente.");
            });

        //setTickets(ticketsActualizados);
        setSelectedTicket({ ...selectedTicket, estado: EstadoTicketEnum.CERRADO });
        toast.info(t("support.ticket_closed_successfully"));
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-black">
                        {t("support.support_center")}
                    </h1>
                    <p className="text-gray-600">
                        {t("support.manage_your_tickets_and_get_help_from_our_team")}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel izquierdo - Lista de tickets */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Ticket size={24} className="text-[#F0973C]" />
                                    {t("support.my_tickets")}
                                </h2>
                                <button
                                    onClick={() => setShowNewTicketForm(true)}
                                    className="p-2 rounded-lg transition-all hover:scale-105 bg-[#F0973C]"
                                    title={t("support.new_ticket")}
                                >
                                    <Plus size={20} className="text-white" />
                                </button>
                            </div>

                            {/* Lista de tickets */}
                            <div className="space-y-3 max-h-150 overflow-y-auto">
                                {loadingMisTikets ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0973C]"></div>
                                    </div>
                                ) : misTikets.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <Ticket size={48} className="mx-auto mb-2 opacity-30" />
                                        <p>No tienes tickets aún</p>
                                    </div>
                                ) : (
                                    misTikets.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            onClick={() => setSelectedTicket(ticket)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${selectedTicket?.id === ticket.id
                                                ? "border-[#F0973C] border-opacity-100 shadow-md"
                                                : "border-gray-200 hover:border-opacity-50"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-sm line-clamp-1">
                                                    {ticket.asunto}
                                                </h3>
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold text-white ${ticket.estado === EstadoTicketEnum.ABIERTO ? "bg-[#69AC95]" : "bg-red-600"
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
                                                    {ticket.respuestaTikect.length}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Paginación */}
                            {!loadingMisTikets && totalPaginasMisTikets > 1 && (
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        {/* Información de página */}
                                        <div className="text-sm text-gray-600">
                                            Página {currentPage + 1} de {totalPaginasMisTikets}
                                            <span className="ml-2 text-gray-400">
                                                ({totalElementosMisTikets} tickets)
                                            </span>
                                        </div>

                                        {/* Controles de paginación */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handlePreviousPage}
                                                disabled={currentPage === 0}
                                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                title="Página anterior"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>

                                            {/* Números de página */}
                                            <div className="flex gap-1">
                                                {Array.from({ length: Math.min(5, totalPaginasMisTikets) }, (_, i) => {
                                                    let pageNum;
                                                    if (totalPaginasMisTikets <= 5) {
                                                        pageNum = i;
                                                    } else if (currentPage < 3) {
                                                        pageNum = i;
                                                    } else if (currentPage > totalPaginasMisTikets - 4) {
                                                        pageNum = totalPaginasMisTikets - 5 + i;
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
                                                disabled={currentPage === totalPaginasMisTikets - 1}
                                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                title="Página siguiente"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel derecho - Detalle del ticket o formulario */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6 min-h-150">
                            {showNewTicketForm ? (
                                /* Formulario de nuevo ticket */
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                            <Plus size={28} className="text-[#F0973C]" />
                                            {t("support.new_ticket")}
                                        </h2>
                                        <button
                                            disabled={loadingCrearTiket}
                                            onClick={() => {
                                                setShowNewTicketForm(false);
                                                formik.resetForm();
                                            }}
                                            className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                                            title={t("support.close_form")}
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                                        {/* Campo Asunto */}
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">
                                                {t("support.subject")} *
                                            </label>
                                            <input
                                                type="text"
                                                name="asunto"
                                                value={formik.values.asunto}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-opacity-100 transition-all ${
                                                    formik.touched.asunto && formik.errors.asunto ? "border-red-600" : "border-[#F0973C]"
                                                }`}
                                                placeholder={t("support.describe_briefly_the_problem")}
                                            />
                                            {formik.touched.asunto && formik.errors.asunto && (
                                                <p className="text-sm mt-1 text-red-600">
                                                    {formik.errors.asunto}
                                                </p>
                                            )}
                                        </div>

                                        {/* Campo Descripción */}
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">
                                                {t("support.description")} *
                                            </label>
                                            <textarea
                                                name="descripcion"
                                                value={formik.values.descripcion}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                rows={8}
                                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-opacity-100 transition-all resize-none ${
                                                    formik.touched.descripcion && formik.errors.descripcion ? "border-red-600" : "border-[#F0973C]"
                                                }`}
                                                placeholder={t("support.describe_your_problem_in_detail")}
                                            />
                                            {formik.touched.descripcion && formik.errors.descripcion && (
                                                <p className="text-sm mt-1 text-red-600">
                                                    {formik.errors.descripcion}
                                                </p>
                                            )}
                                        </div>

                                        {/* Botones */}
                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                disabled={!formik.isValid || formik.isSubmitting}
                                                className="flex-1 py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-[#69AC95] text-white"
                                            >
                                                {t("support.create_ticket")}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowNewTicketForm(false);
                                                    formik.resetForm();
                                                }}
                                                className="flex-1 py-3 rounded-lg font-semibold border-2 transition-all hover:bg-gray-50 border-black text-black"
                                            >
                                                {t("support.cancel")}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : selectedTicket ? (
                                /* Vista detallada del ticket */
                                <div className="flex flex-col h-full">
                                    {/* Header del ticket */}
                                    <div className="mb-6 pb-6 border-b-2 border-gray-200">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h2 className="text-2xl font-bold mb-2">
                                                    {selectedTicket.asunto}
                                                </h2>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={16} />
                                                        Creado: {new Date(selectedTicket.fechaCreacion).toLocaleDateString()}
                                                    </span>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 text-white ${selectedTicket.estado === EstadoTicketEnum.ABIERTO ? "bg-[#69AC95]" : "bg-red-600"
                                                            }`}
                                                    >
                                                        {selectedTicket.estado === EstadoTicketEnum.ABIERTO ? (
                                                            <>
                                                                <Clock size={14} />
                                                                {t("support.open")}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle size={14} />
                                                                {t("support.closed")}
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* NO SE TRADUCE */}
                                            {selectedTicket.estado === EstadoTicketEnum.ABIERTO && (
                                                <button
                                                    disabled={loadingActualizarEstado}
                                                    onClick={handleCloseTicket}
                                                    className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 bg-red-600 text-white"
                                                >
                                                        {t("support.close_ticket")}
                                                </button>
                                            )}
                                        </div>

                                        {/* Descripción original */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2 text-sm text-[#F0973C]">
                                                {t("support.original_description")}
                                            </h3>
                                            <p className="text-gray-700 whitespace-pre-wrap">
                                                {selectedTicket.descripcion}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Respuestas */}
                                    <div className="flex-1 overflow-y-auto mb-6 space-y-4">
                                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                            <MessageSquare size={20} className="text-[#69AC95]" />
                                            {t("support.responses")} ({selectedTicket.respuestaTikect.length})
                                        </h3>

                                        {selectedTicket.respuestaTikect.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400">
                                                <MessageSquare size={48} className="mx-auto mb-2 opacity-30" />
                                                <p>{t("support.no_responses_yet")}</p>
                                            </div>
                                        ) : (
                                            selectedTicket.respuestaTikect.map((respuesta) => (
                                                <div
                                                    key={respuesta.id}
                                                    className="p-4 rounded-lg border-l-4 bg-gray-50 border-l-[#69AC95]"
                                                >
                                                    <p className="text-gray-800 mb-2 whitespace-pre-wrap">
                                                        {respuesta.respuesta}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {respuesta.fechaRespuesta.toLocaleString()}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Campo para nueva respuesta */}
                                    {selectedTicket.estado === EstadoTicketEnum.ABIERTO ? (
                                        <div className="border-t-2 border-gray-200 pt-4">
                                            <div className="flex gap-2">
                                                <textarea
                                                    value={newResponse}
                                                    onChange={(e) => setNewResponse(e.target.value)}
                                                        placeholder={t("support.write_a_comment")}
                                                    rows={3}
                                                    className="flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-opacity-100 transition-all resize-none border-[#F0973C]"
                                                />
                                                <button
                                                    title="subir"
                                                    onClick={handleAddResponse}
                                                    disabled={!newResponse.trim() || loadingAgregarComentario}
                                                    className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-[#69AC95] text-white"
                                                >
                                                    <Send size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-t-2 border-gray-200 pt-4">
                                            <div className="bg-gray-100 p-4 rounded-lg text-center">
                                                <p className="text-gray-600 font-semibold">
                                                    {t("support.ticket_is_closed")}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Estado inicial - sin ticket seleccionado */
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <Ticket size={64} className="mb-4 opacity-30" />
                                    <p className="text-lg font-semibold mb-2">
                                                {t("support.select_ticket_to_view_details")}
                                    </p>
                                    <p className="text-sm">
                                        {t("support.or_create_a_new_one_for_help")}
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