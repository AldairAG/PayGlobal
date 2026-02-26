import { useState, useMemo, useEffect } from "react";
import type { Bono } from "../../type/entityTypes";
import { TipoConceptos, EstadoOperacion } from "../../type/enum";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Filter, TrendingUp, DollarSign, Award, Clock, CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useUsuario } from "../../hooks/usuarioHook";
import { useTransacciones } from "../../hooks/useTransacciones";
import { useTranslation } from 'react-i18next';
import i18n from "../../i18n";
import { TraducirEstadoOperacion, TraducirConcepto } from "../../helpers/idiomaHelpers";


export const HistorialPage = () => {
    const { t } = useTranslation();
    const idiomaActual = i18n.language;
    const { usuario } = useUsuario();
    const { 
        transacciones, 
        paginaActual: paginaActualRedux, 
        totalPaginas, 
        totalElementos, 
        cargando, 
        error,
        cargarTransacciones 
    } = useTransacciones();

    const [activeTab, setActiveTab] = useState<"transacciones" | "bonos">("transacciones");
    
    // Estados para filtros de transacciones
    const [filtroConcepto, setFiltroConcepto] = useState<TipoConceptos | "TODOS">("TODOS");
    const [filtroEstado, setFiltroEstado] = useState<EstadoOperacion | "TODOS">("TODOS");
    const [fechaInicio, setFechaInicio] = useState<string>("");
    const [fechaFin, setFechaFin] = useState<string>("");
    
    const itemsPorPagina = 10;

    // Cargar transacciones cuando cambien los filtros o la página
    useEffect(() => {
        if (!usuario?.id) return;

        cargarTransacciones({
            usuarioId: usuario.id,
            desde: fechaInicio ? new Date(fechaInicio).toISOString() : undefined,
            hasta: fechaFin ? new Date(fechaFin).toISOString() : undefined,
            concepto: filtroConcepto,
            estado: filtroEstado,
            page: paginaActualRedux,
            size: itemsPorPagina,
        }).catch(err => {
            console.error(t("reports.error_loading_transactions"), err);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usuario?.id, filtroConcepto, filtroEstado, fechaInicio, fechaFin, paginaActualRedux]);

    // Función para cambiar de página
    const cambiarPagina = (nuevaPagina: number) => {
        if (!usuario?.id) return;
        
        cargarTransacciones({
            usuarioId: usuario.id,
            desde: fechaInicio ? new Date(fechaInicio).toISOString() : undefined,
            hasta: fechaFin ? new Date(fechaFin).toISOString() : undefined,
            concepto: filtroConcepto,
            estado: filtroEstado,
            page: nuevaPagina,
            size: itemsPorPagina,
        }).catch(err => {
            console.error(t("reports.error_loading_transactions"), err);
        });
    };

    // Obtener bonos del usuario
    const bonosUsuario: Bono[] = useMemo(() => {
        return usuario?.bonos || [];
    }, [usuario?.bonos]);

    // Datos para gráficas
    const datosGanancias = useMemo(() => {
        const gananciasPorMes = transacciones.reduce((acc: Record<string, number>, trans) => {
            if (trans.monto > 0 && trans.estado === EstadoOperacion.COMPLETADA) {
                const mes = new Date(trans.fecha).toLocaleDateString('es', { month: 'short', year: '2-digit' });
                acc[mes] = (acc[mes] || 0) + trans.monto;
            }
            return acc;
        }, {});
        
        return Object.entries(gananciasPorMes).map(([mes, monto]) => ({
            mes,
            ganancias: monto
        }));
    }, [transacciones]);

    const datosBonosChart = useMemo(() => {
        return bonosUsuario.map(bono => ({
            nombre: bono.nombre.toString().replace('BONO_', ''),
            acumulado: bono.acumulado
        }));
    }, [bonosUsuario]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    // Calcular estadísticas
    const totalGanancias = useMemo(() => {
        return transacciones
            .filter(t => t.monto > 0 && t.estado === EstadoOperacion.COMPLETADA)
            .reduce((sum, t) => sum + t.monto, 0);
    }, [transacciones]);
    
    const totalRetiros = useMemo(() => {
        return Math.abs(transacciones
            .filter(t => t.monto < 0 && t.estado === EstadoOperacion.COMPLETADA)
            .reduce((sum, t) => sum + t.monto, 0));
    }, [transacciones]);
    
    const totalBonos = useMemo(() => {
        return bonosUsuario.reduce((sum, b) => sum + b.acumulado, 0);
    }, [bonosUsuario]);

    const obtenerColorEstado = (estado: EstadoOperacion) => {
        switch (estado) {
            case EstadoOperacion.COMPLETADA:
            case EstadoOperacion.APROBADA:
                return "text-green-600 bg-green-50";
            case EstadoOperacion.PENDIENTE:
                return "text-yellow-600 bg-yellow-50";
            case EstadoOperacion.FALLIDA:
            case EstadoOperacion.RECHAZADA:
                return "text-red-600 bg-red-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    const obtenerIconoEstado = (estado: EstadoOperacion) => {
        switch (estado) {
            case EstadoOperacion.COMPLETADA:
            case EstadoOperacion.APROBADA:
                return <CheckCircle2 className="w-4 h-4" />;
            case EstadoOperacion.PENDIENTE:
                return <Clock className="w-4 h-4" />;
            case EstadoOperacion.FALLIDA:
            case EstadoOperacion.RECHAZADA:
                return <XCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {t("reports.history_and_reports")}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {t("reports.view_your_transaction_history_and_generate_reports")}
                    </p>
                </div>

                {/* Estadísticas Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">{t("reports.total_earnings")}</p>
                                <p className="text-3xl font-bold text-gray-800">${totalGanancias.toFixed(2)}</p>
                                <p className="text-green-600 text-xs mt-1 flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {t("reports.completed")}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <DollarSign className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">{t("reports.total_bonuses")}</p>
                                <p className="text-3xl font-bold text-gray-800">${totalBonos.toFixed(2)}</p>
                                <p className="text-purple-600 text-xs mt-1">{bonosUsuario.length} {t("reports.bonus_types")}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Award className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">{t("reports.total_withdrawals")}</p>
                                <p className="text-3xl font-bold text-gray-800">${totalRetiros.toFixed(2)}</p>
                                <p className="text-blue-600 text-xs mt-1">{t("reports.processed")}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <DollarSign className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gráficas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Gráfica de Ganancias por Mes */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                            {t("reports.monthly_earnings")}
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={datosGanancias}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey={t("reports.month")} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey={t("reports.earnings")} stroke="#3B82F6" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gráfica de Distribución de Bonos */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <Award className="w-5 h-5 mr-2 text-purple-600" />
                            {t("reports.bonus_distribution")}
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={datosBonosChart}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey={t("reports.accumulated")}
                                    label
                                >
                                    {datosBonosChart.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number | undefined) => value ? `$${value.toFixed(2)}` : '$0.00'} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab("transacciones")}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                                activeTab === "transacciones"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            <div className="flex items-center justify-center">
                                <DollarSign className="w-5 h-5 mr-2" />
                                {t("reports.transactions")}
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("bonos")}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                                activeTab === "bonos"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            <div className="flex items-center justify-center">
                                <Award className="w-5 h-5 mr-2" />
                                {t("reports.bonuses")}
                            </div>
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Tab de Transacciones */}
                        {activeTab === "transacciones" && (
                            <div>
                                {/* Filtros */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
                                        <Filter className="w-5 h-5 mr-2" />
                                        {t("reports.filters")}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Filtro de Concepto */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t("reports.concept")}
                                            </label>
                                            <select
                                                value={filtroConcepto}
                                                onChange={(e) => setFiltroConcepto(e.target.value as TipoConceptos | "TODOS")}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="TODOS">{t("reports.all")}</option>
                                                {Object.values(TipoConceptos).map((concepto) => (
                                                    <option key={concepto} value={concepto}>
                                                        {TraducirConcepto(concepto, idiomaActual)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Filtro de Estado */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t("reports.status")}
                                            </label>
                                            <select
                                                value={filtroEstado}
                                                onChange={(e) => setFiltroEstado(e.target.value as EstadoOperacion | "TODOS")}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="TODOS">{t("reports.all")}</option>
                                                {Object.values(EstadoOperacion).map((estado) => (
                                                    <option key={estado} value={estado}>
                                                        {TraducirEstadoOperacion(estado, idiomaActual)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Fecha Inicio */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t("reports.start_date")}
                                            </label>
                                            <input
                                                type="date"
                                                value={fechaInicio}
                                                onChange={(e) => setFechaInicio(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        {/* Fecha Fin */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t("reports.end_date")}
                                            </label>
                                            <input
                                                type="date"
                                                value={fechaFin}
                                                onChange={(e) => setFechaFin(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tabla de Transacciones */}
                                {cargando ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p className="mt-2 text-gray-600">{t("reports.loading_transactions")}</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-8 text-red-600">
                                        <p>{error}</p>
                                    </div>
                                ) : !transacciones || transacciones.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>{t("reports.no_transactions_found")}</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        ID
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Fecha
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Concepto
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Descripción
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Monto
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Estado
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {transacciones.map((transaccion) => (
                                                    <tr key={transaccion.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            #{transaccion.id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(transaccion.fecha).toLocaleDateString('es-ES')}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            <span className="font-medium">
                                                                {transaccion.concepto.replace(/_/g, ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {transaccion.descripcion}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                                            <span className={transaccion.monto >= 0 ? "text-green-600" : "text-red-600"}>
                                                                {transaccion.monto >= 0 ? '+' : ''}{transaccion.monto.toFixed(2)} USD
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${obtenerColorEstado(transaccion.estado)}`}>
                                                                {obtenerIconoEstado(transaccion.estado)}
                                                                <span className="ml-1">{transaccion.estado}</span>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Paginación */}
                                {totalPaginas > 1 && (
                                    <div className="mt-6 border-t pt-4">
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                            {/* Información de resultados */}
                                            <div className="text-sm text-gray-700">
                                                {t("reports.showing")} <span className="font-semibold">{(paginaActualRedux * itemsPorPagina) + 1}</span> {t("reports.to")}{' '}
                                                <span className="font-semibold">{Math.min((paginaActualRedux + 1) * itemsPorPagina, totalElementos)}</span> {t("reports.of")}{' '}
                                                <span className="font-semibold">{totalElementos}</span> {t("reports.results")}
                                            </div>
                                            
                                            {/* Botones de paginación */}
                                            <div className="flex items-center gap-1">
                                                {/* Botón Primera Página */}
                                                <button
                                                    onClick={() => cambiarPagina(0)}
                                                    disabled={paginaActualRedux === 0}
                                                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                                                    title={t("reports.first_page")}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                    <ChevronLeft className="w-4 h-4 -ml-3" />
                                                </button>
                                                
                                                {/* Botón Anterior */}
                                                <button
                                                    onClick={() => cambiarPagina(Math.max(0, paginaActualRedux - 1))}
                                                    disabled={paginaActualRedux === 0}
                                                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                                                    title={t("reports.previous_page")}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>

                                                {/* Botones numéricos de página */}
                                                {(() => {
                                                    const maxBotones = 5;
                                                    const mitad = Math.floor(maxBotones / 2);
                                                    let inicio = Math.max(0, paginaActualRedux - mitad);
                                                    const fin = Math.min(totalPaginas - 1, inicio + maxBotones - 1);
                                                    
                                                    if (fin - inicio < maxBotones - 1) {
                                                        inicio = Math.max(0, fin - maxBotones + 1);
                                                    }

                                                    const paginas = [];
                                                    for (let i = inicio; i <= fin; i++) {
                                                        paginas.push(i);
                                                    }

                                                    return (
                                                        <>
                                                            {inicio > 0 && (
                                                                <>
                                                                    <button
                                                                        onClick={() => cambiarPagina(0)}
                                                                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                                                    >
                                                                        1
                                                                    </button>
                                                                    {inicio > 1 && (
                                                                        <span className="px-2 text-gray-500">...</span>
                                                                    )}
                                                                </>
                                                            )}
                                                            
                                                            {paginas.map((numPagina) => (
                                                                <button
                                                                    key={numPagina}
                                                                    onClick={() => cambiarPagina(numPagina)}
                                                                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                                                                        numPagina === paginaActualRedux
                                                                            ? "bg-blue-600 text-white border-2 border-blue-600"
                                                                            : "bg-white border border-gray-300 hover:bg-gray-50"
                                                                    }`}
                                                                >
                                                                    {numPagina + 1}
                                                                </button>
                                                            ))}
                                                            
                                                            {fin < totalPaginas - 1 && (
                                                                <>
                                                                    {fin < totalPaginas - 2 && (
                                                                        <span className="px-2 text-gray-500">...</span>
                                                                    )}
                                                                    <button
                                                                        onClick={() => cambiarPagina(totalPaginas - 1)}
                                                                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                                                    >
                                                                        {totalPaginas}
                                                                    </button>
                                                                </>
                                                            )}
                                                        </>
                                                    );
                                                })()}

                                                {/* Botón Siguiente */}
                                                <button
                                                    onClick={() => cambiarPagina(Math.min(totalPaginas - 1, paginaActualRedux + 1))}
                                                    disabled={paginaActualRedux >= totalPaginas - 1}
                                                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                                                    title={t("reports.next_page")}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                                
                                                {/* Botón Última Página */}
                                                <button
                                                    onClick={() => cambiarPagina(totalPaginas - 1)}
                                                    disabled={paginaActualRedux >= totalPaginas - 1}
                                                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                                                    title={t("reports.last_page")}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                    <ChevronRight className="w-4 h-4 -ml-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab de Bonos */}
                        {activeTab === "bonos" && (
                            <div>
                                {bonosUsuario.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>{t("reports.no_bonuses_found")}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {bonosUsuario.map((bono) => (
                                                <div
                                                    key={bono.id}
                                                    className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="bg-blue-600 text-white p-3 rounded-full">
                                                            <Award className="w-6 h-6" />
                                                        </div>
                                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                            {bono.codigo}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                                                        {bono.nombre.toString().replace('BONO_', '').replace(/_/g, ' ')}
                                                    </h3>
                                                    <div className="mt-4">
                                                        <p className="text-sm text-gray-600 mb-1">{t("reports.total_accumulated")}</p>
                                                        <p className="text-3xl font-bold text-blue-600">
                                                            ${bono.acumulado.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Gráfica de Barras de Bonos */}
                                        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border">
                                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                                {t("reports.bonus_comparison")}
                                            </h3>
                                            <ResponsiveContainer width="100%" height={400}>
                                                <BarChart data={datosBonosChart}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey={t("reports.name")} />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey={t("reports.accumulated")} fill="#3B82F6" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};