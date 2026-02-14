import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Ticket, Plus, MessageSquare, X, Send, CheckCircle, Clock } from "lucide-react";
import { toast } from "react-toastify";
import type { Ticket as TicketType, RespuestaTicket } from "../../type/entityTypes";
import { EstadoTicket as EstadoTicketEnum } from "../../type/entityTypes";

export const SoportePage = () => {
    // Estado para almacenar los tickets (mock data)
    const [tickets, setTickets] = useState<TicketType[]>([
        {
            id: 1,
            asunto: "Problema con retiro de fondos",
            fechaCreacion: new Date("2026-02-10"),
            estado: EstadoTicketEnum.ABIERTO,
            descripcion: "No puedo realizar un retiro de mis fondos. El sistema muestra un error al procesar la transacción.",
            respuestas: [
                {
                    id: 1,
                    respuesta: "Hemos recibido su solicitud y estamos investigando el problema. Le informaremos pronto.",
                    fechaRespuesta: new Date("2026-02-10T14:30:00")
                }
            ]
        },
        {
            id: 2,
            asunto: "Consulta sobre comisiones",
            fechaCreacion: new Date("2026-02-08"),
            estado: EstadoTicketEnum.CERRADO,
            descripcion: "¿Cuáles son las comisiones aplicables a las transferencias internacionales?",
            respuestas: [
                {
                    id: 2,
                    respuesta: "Las comisiones varían según el tipo de transacción. Para transferencias internacionales, la comisión es del 2%.",
                    fechaRespuesta: new Date("2026-02-08T16:00:00")
                },
                {
                    id: 3,
                    respuesta: "Para más detalles, puede consultar nuestra política de comisiones en la sección de ayuda.",
                    fechaRespuesta: new Date("2026-02-08T16:05:00")
                }
            ]
        }
    ]);

    const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
    const [showNewTicketForm, setShowNewTicketForm] = useState(false);
    const [newResponse, setNewResponse] = useState("");

    // Validación para nuevo ticket
    const validationSchema = Yup.object({
        asunto: Yup.string()
            .required("El asunto es requerido")
            .min(5, "El asunto debe tener al menos 5 caracteres"),
        descripcion: Yup.string()
            .required("La descripción es requerida")
            .min(20, "La descripción debe tener al menos 20 caracteres")
    });

    // Formik para nuevo ticket
    const formik = useFormik({
        initialValues: {
            asunto: "",
            descripcion: ""
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            const nuevoTicket: TicketType = {
                id: tickets.length + 1,
                asunto: values.asunto,
                fechaCreacion: new Date(),
                estado: EstadoTicketEnum.ABIERTO,
                descripcion: values.descripcion,
                respuestas: []
            };
            setTickets([nuevoTicket, ...tickets]);
            resetForm();
            setShowNewTicketForm(false);
            toast.success("Ticket creado exitosamente");
        }
    });

    // Agregar respuesta a un ticket
    const handleAddResponse = () => {
        if (!selectedTicket || !newResponse.trim()) return;
        
        const nuevaRespuesta: RespuestaTicket = {
            id: selectedTicket.respuestas.length + 1,
            respuesta: newResponse,
            fechaRespuesta: new Date()
        };

        const ticketsActualizados = tickets.map(ticket => 
            ticket.id === selectedTicket.id 
                ? { ...ticket, respuestas: [...ticket.respuestas, nuevaRespuesta] }
                : ticket
        );

        setTickets(ticketsActualizados);
        setSelectedTicket({ ...selectedTicket, respuestas: [...selectedTicket.respuestas, nuevaRespuesta] });
        setNewResponse("");
        toast.success("Respuesta agregada exitosamente");
    };

    // Cerrar ticket
    const handleCloseTicket = () => {
        if (!selectedTicket) return;

        const ticketsActualizados = tickets.map(ticket =>
            ticket.id === selectedTicket.id
                ? { ...ticket, estado: EstadoTicketEnum.CERRADO }
                : ticket
        );

        setTickets(ticketsActualizados);
        setSelectedTicket({ ...selectedTicket, estado: EstadoTicketEnum.CERRADO });
        toast.info("Ticket cerrado");
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-black">
                        Centro de Soporte
                    </h1>
                    <p className="text-gray-600">
                        Gestiona tus tickets y obtén ayuda de nuestro equipo
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel izquierdo - Lista de tickets */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Ticket size={24} className="text-[#F0973C]" />
                                    Mis Tickets
                                </h2>
                                <button
                                    onClick={() => setShowNewTicketForm(true)}
                                    className="p-2 rounded-lg transition-all hover:scale-105 bg-[#F0973C]"
                                    title="Nuevo Ticket"
                                >
                                    <Plus size={20} className="text-white" />
                                </button>
                            </div>

                            {/* Lista de tickets */}
                            <div className="space-y-3 max-h-150 overflow-y-auto">
                                {tickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        onClick={() => setSelectedTicket(ticket)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                                            selectedTicket?.id === ticket.id
                                                ? "border-[#F0973C] border-opacity-100 shadow-md"
                                                : "border-gray-200 hover:border-opacity-50"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-sm line-clamp-1">
                                                {ticket.asunto}
                                            </h3>
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                                                    ticket.estado === EstadoTicketEnum.ABIERTO ? "bg-[#69AC95]" : "bg-red-600"
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
                                                {ticket.fechaCreacion.toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare size={12} />
                                                {ticket.respuestas.length}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                                            Nuevo Ticket
                                        </h2>
                                        <button

                                            onClick={() => {
                                                setShowNewTicketForm(false);
                                                formik.resetForm();
                                            }}
                                            className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                                            title="Cerrar formulario"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                                        {/* Campo Asunto */}
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">
                                                Asunto *
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
                                                placeholder="Describe brevemente el problema"
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
                                                Descripción *
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
                                                placeholder="Describe detalladamente tu problema o consulta"
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
                                                Crear Ticket
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowNewTicketForm(false);
                                                    formik.resetForm();
                                                }}
                                                className="flex-1 py-3 rounded-lg font-semibold border-2 transition-all hover:bg-gray-50 border-black text-black"
                                            >
                                                Cancelar
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
                                                        Creado: {selectedTicket.fechaCreacion.toLocaleDateString()}
                                                    </span>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 text-white ${
                                                            selectedTicket.estado === EstadoTicketEnum.ABIERTO ? "bg-[#69AC95]" : "bg-red-600"
                                                        }`}
                                                    >
                                                        {selectedTicket.estado === EstadoTicketEnum.ABIERTO ? (
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
                                            {selectedTicket.estado === EstadoTicketEnum.ABIERTO && (
                                                <button
                                                    onClick={handleCloseTicket}
                                                    className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 bg-red-600 text-white"
                                                >
                                                    Cerrar Ticket
                                                </button>
                                            )}
                                        </div>
                                        
                                        {/* Descripción original */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2 text-sm text-[#F0973C]">
                                                Descripción Original:
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
                                            Respuestas ({selectedTicket.respuestas.length})
                                        </h3>
                                        
                                        {selectedTicket.respuestas.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400">
                                                <MessageSquare size={48} className="mx-auto mb-2 opacity-30" />
                                                <p>No hay respuestas aún</p>
                                            </div>
                                        ) : (
                                            selectedTicket.respuestas.map((respuesta) => (
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
                                                    placeholder="Escribe un comentario..."
                                                    rows={3}
                                                        className="flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-opacity-100 transition-all resize-none border-[#F0973C]"
                                                />
                                                <button
                                                    title="subir"
                                                    onClick={handleAddResponse}
                                                    disabled={!newResponse.trim()}
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
                                                    Este ticket está cerrado. No se pueden agregar más comentarios.
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
                                        Selecciona un ticket para ver los detalles
                                    </p>
                                    <p className="text-sm">
                                        o crea uno nuevo para obtener ayuda
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