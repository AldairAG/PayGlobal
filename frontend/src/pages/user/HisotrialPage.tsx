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

    const COLORS = ['#F0973C', '#69AC95', '#e8841f', '#5a9a84', '#F0973C99', '#69AC9599'];

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
                return "text-[#69AC95] bg-[#69AC95]/10 border border-[#69AC95]/30";
            case EstadoOperacion.PENDIENTE:
                return "text-[#F0973C] bg-[#F0973C]/10 border border-[#F0973C]/30";
            case EstadoOperacion.FALLIDA:
            case EstadoOperacion.RECHAZADA:
                return "text-red-400 bg-red-500/10 border border-red-500/30";
            default:
                return "text-white/50 bg-white/5 border border-white/10";
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
        <div className="min-h-screen bg-[#000000] text-white px-4 py-8">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#F0973C]">
                        {t("reports.history_and_reports")}
                    </h1>
                    <p className="text-white/40 text-lg">
                        {t("reports.view_your_transaction_history_and_generate_reports")}
                    </p>
                </div>

                {/* Estadísticas Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="rounded-xl border border-[#69AC95]/20 bg-[#69AC95]/5 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">{t("reports.total_earnings")}</p>
                                <p className="text-3xl font-bold text-white">${totalGanancias.toFixed(2)}</p>
                                <p className="text-[#69AC95] text-xs mt-1 flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {t("reports.completed")}
                                </p>
                            </div>
                            <div className="bg-[#69AC95]/20 p-3 rounded-full border border-[#69AC95]/30">
                                <DollarSign className="w-8 h-8 text-[#69AC95]" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#F0973C]/20 bg-[#F0973C]/5 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">{t("reports.total_bonuses")}</p>
                                <p className="text-3xl font-bold text-white">${totalBonos.toFixed(2)}</p>
                                <p className="text-[#F0973C] text-xs mt-1">{bonosUsuario.length} {t("reports.bonus_types")}</p>
                            </div>
                            <div className="bg-[#F0973C]/20 p-3 rounded-full border border-[#F0973C]/30">
                                <Award className="w-8 h-8 text-[#F0973C]" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">{t("reports.total_withdrawals")}</p>
                                <p className="text-3xl font-bold text-white">${totalRetiros.toFixed(2)}</p>
                                <p className="text-white/50 text-xs mt-1">{t("reports.processed")}</p>
                            </div>
                            <div className="bg-white/10 p-3 rounded-full border border-white/10">
                                <DollarSign className="w-8 h-8 text-white/50" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gráficas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Gráfica de Ganancias por Mes */}
                    <div className="rounded-xl border border-[#69AC95]/20 bg-[#69AC95]/5 p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-[#69AC95]" />
                            {t("reports.monthly_earnings")}
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={datosGanancias}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey={t("reports.month")} stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(105,172,149,0.3)', borderRadius: '12px', color: '#fff' }} />
                                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.6)' }} />
                                <Line type="monotone" dataKey={t("reports.earnings")} stroke="#69AC95" strokeWidth={3} dot={{ fill: '#69AC95' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gráfica de Distribución de Bonos */}
                    <div className="rounded-xl border border-[#F0973C]/20 bg-[#F0973C]/5 p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                            <Award className="w-5 h-5 mr-2 text-[#F0973C]" />
                            {t("reports.bonus_distribution")}
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={datosBonosChart}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#F0973C"
                                    dataKey={t("reports.accumulated")}
                                    label
                                >
                                    {datosBonosChart.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(240,151,60,0.3)', borderRadius: '12px', color: '#fff' }} formatter={(value: number | undefined) => value ? `$${value.toFixed(2)}` : '$0.00'} />
                                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.6)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tabs */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
                    <div className="flex border-b border-white/5">
                        <button
                            onClick={() => setActiveTab("transacciones")}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                                activeTab === "transacciones"
                                    ? "bg-[#F0973C] text-black"
                                    : "bg-transparent text-white/50 hover:text-white hover:bg-white/5"
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
                                    ? "bg-[#F0973C] text-black"
                                    : "bg-transparent text-white/50 hover:text-white hover:bg-white/5"
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
                                <div className="mb-6 p-4 rounded-xl border border-white/5 bg-white/[0.03]">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                                        <Filter className="w-5 h-5 mr-2 text-[#F0973C]" />
                                        {t("reports.filters")}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Filtro de Concepto */}
                                        <div>
                                            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                                {t("reports.concept")}
                                            </label>
                                            <select
                                                value={filtroConcepto}
                                                onChange={(e) => setFiltroConcepto(e.target.value as TipoConceptos | "TODOS")}
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F0973C]/50"
                                            >
                                                <option value="TODOS" className="bg-[#111]">{t("reports.all")}</option>
                                                {Object.values(TipoConceptos).map((concepto) => (
                                                    <option key={concepto} value={concepto} className="bg-[#111]">
                                                        {TraducirConcepto(concepto, idiomaActual)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Filtro de Estado */}
                                        <div>
                                            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                                {t("reports.status")}
                                            </label>
                                            <select
                                                value={filtroEstado}
                                                onChange={(e) => setFiltroEstado(e.target.value as EstadoOperacion | "TODOS")}
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F0973C]/50"
                                            >
                                                <option value="TODOS" className="bg-[#111]">{t("reports.all")}</option>
                                                {Object.values(EstadoOperacion).map((estado) => (
                                                    <option key={estado} value={estado} className="bg-[#111]">
                                                        {TraducirEstadoOperacion(estado, idiomaActual)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Fecha Inicio */}
                                        <div>
                                            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                                {t("reports.start_date")}
                                            </label>
                                            <input
                                                type="date"
                                                value={fechaInicio}
                                                onChange={(e) => setFechaInicio(e.target.value)}
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F0973C]/50 [color-scheme:dark]"
                                            />
                                        </div>

                                        {/* Fecha Fin */}
                                        <div>
                                            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                                {t("reports.end_date")}
                                            </label>
                                            <input
                                                type="date"
                                                value={fechaFin}
                                                onChange={(e) => setFechaFin(e.target.value)}
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F0973C]/50 [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tabla de Transacciones */}
                                {cargando ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0973C]"></div>
                                        <p className="mt-2 text-white/40">{t("reports.loading_transactions")}</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-8 text-red-400">
                                        <p>{error}</p>
                                    </div>
                                ) : !transacciones || transacciones.length === 0 ? (
                                    <div className="text-center py-8 text-white/30">
                                        <p>{t("reports.no_transactions_found")}</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-white/5">
                                            <thead className="bg-white/5">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                                                        ID
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                                                        Fecha
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                                                        Concepto
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                                                        Descripción
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                                                        Monto
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                                                        Estado
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {transacciones.map((transaccion) => (
                                                    <tr key={transaccion.id} className="hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                            #{transaccion.id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                                                            {new Date(transaccion.fecha).toLocaleDateString('es-ES')}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-white">
                                                            <span className="font-medium">
                                                                {transaccion.concepto.replace(/_/g, ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-white/50">
                                                            {transaccion.descripcion}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                                            <span className={transaccion.monto >= 0 ? "text-[#69AC95]" : "text-red-400"}>
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
                                    <div className="mt-6 border-t border-white/5 pt-4">
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                            {/* Información de resultados */}
                                            <div className="text-sm text-white/40">
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
                                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors text-white"
                                                    title={t("reports.first_page")}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                    <ChevronLeft className="w-4 h-4 -ml-3" />
                                                </button>
                                                
                                                {/* Botón Anterior */}
                                                <button
                                                    onClick={() => cambiarPagina(Math.max(0, paginaActualRedux - 1))}
                                                    disabled={paginaActualRedux === 0}
                                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors text-white"
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
                                                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 font-medium transition-colors text-white"
                                                                    >
                                                                        1
                                                                    </button>
                                                                    {inicio > 1 && (
                                                                        <span className="px-2 text-white/30">...</span>
                                                                    )}
                                                                </>
                                                            )}
                                                            
                                                            {paginas.map((numPagina) => (
                                                                <button
                                                                    key={numPagina}
                                                                    onClick={() => cambiarPagina(numPagina)}
                                                                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                                                                        numPagina === paginaActualRedux
                                                                            ? "bg-[#F0973C] text-black"
                                                                            : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                                                                    }`}
                                                                >
                                                                    {numPagina + 1}
                                                                </button>
                                                            ))}
                                                            
                                                            {fin < totalPaginas - 1 && (
                                                                <>
                                                                    {fin < totalPaginas - 2 && (
                                                                        <span className="px-2 text-white/30">...</span>
                                                                    )}
                                                                    <button
                                                                        onClick={() => cambiarPagina(totalPaginas - 1)}
                                                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 font-medium transition-colors text-white"
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
                                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors text-white"
                                                    title={t("reports.next_page")}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                                
                                                {/* Botón Última Página */}
                                                <button
                                                    onClick={() => cambiarPagina(totalPaginas - 1)}
                                                    disabled={paginaActualRedux >= totalPaginas - 1}
                                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors text-white"
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
                                    <div className="text-center py-8 text-white/30">
                                        <p>{t("reports.no_bonuses_found")}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {bonosUsuario.map((bono, index) => (
                                                <div
                                                    key={bono.id}
                                                    className={`rounded-xl p-6 border transition-all hover:scale-[1.02] ${
                                                        index % 2 === 0
                                                            ? 'border-[#F0973C]/20 bg-[#F0973C]/5 hover:border-[#F0973C]/40'
                                                            : 'border-[#69AC95]/20 bg-[#69AC95]/5 hover:border-[#69AC95]/40'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className={`p-3 rounded-full ${
                                                            index % 2 === 0 ? 'bg-[#F0973C]/20 border border-[#F0973C]/30' : 'bg-[#69AC95]/20 border border-[#69AC95]/30'
                                                        }`}>
                                                            <Award className={`w-6 h-6 ${index % 2 === 0 ? 'text-[#F0973C]' : 'text-[#69AC95]'}`} />
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                            index % 2 === 0 ? 'bg-[#F0973C]/20 text-[#F0973C] border border-[#F0973C]/30' : 'bg-[#69AC95]/20 text-[#69AC95] border border-[#69AC95]/30'
                                                        }`}>
                                                            {bono.codigo}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-white mb-2">
                                                        {bono.nombre.toString().replace('BONO_', '').replace(/_/g, ' ')}
                                                    </h3>
                                                    <div className="mt-4">
                                                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{t("reports.total_accumulated")}</p>
                                                        <p className={`text-3xl font-bold ${index % 2 === 0 ? 'text-[#F0973C]' : 'text-[#69AC95]'}`}>
                                                            ${bono.acumulado.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Gráfica de Barras de Bonos */}
                                        <div className="mt-8 rounded-xl border border-[#F0973C]/20 bg-[#F0973C]/5 p-6">
                                            <h3 className="text-xl font-bold text-white mb-4">
                                                {t("reports.bonus_comparison")}
                                            </h3>
                                            <ResponsiveContainer width="100%" height={400}>
                                                <BarChart data={datosBonosChart}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                                    <XAxis dataKey={t("reports.name")} stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                                                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(240,151,60,0.3)', borderRadius: '12px', color: '#fff' }} />
                                                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.6)' }} />
                                                    <Bar dataKey={t("reports.accumulated")} fill="#F0973C" radius={[4, 4, 0, 0]} />
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