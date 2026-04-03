/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useEstadisticas } from '../../hooks/useEstadisticas';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

export const DashboardPage = () => {
    const { estadisticas, loading, error, obtenerEstadisticas } = useEstadisticas();

    useEffect(() => {
        obtenerEstadisticas();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Cargando estadísticas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center bg-white p-8 rounded-lg shadow-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar estadísticas</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={obtenerEstadisticas}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (!estadisticas) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <p className="text-gray-600">No hay datos disponibles</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard de Estadísticas</h1>
                    <p className="text-gray-600 mt-2">Panel de control administrativo</p>
                </div>

                {/* Cards de resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Card: Ganancias por Licencias */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600">Ganancias por Licencias</h3>
                            <div className="bg-green-100 p-3 rounded-full">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-green-600">
                            ${estadisticas.gananciasLicencias.totalGanancias.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {estadisticas.gananciasLicencias.totalComprasAceptadas} compras aceptadas
                        </p>
                    </div>

                    {/* Card: Comisiones por Retiros */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600">Comisiones por Retiros</h3>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">
                            ${estadisticas.comisionesRetiros.totalComisiones.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {estadisticas.comisionesRetiros.totalRetiros} retiros procesados
                        </p>
                    </div>

                    {/* Card: Total de Usuarios con Licencias */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600">Total Usuarios</h3>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-purple-600">
                            {estadisticas.usuariosPorLicencia.reduce((sum, item) => sum + item.cantidad, 0)}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            usuarios registrados
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfica 1: Usuarios Nuevos del Mes */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Usuarios Nuevos del Mes
                        </h2>
                        {estadisticas.usuariosNuevosMes.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={estadisticas.usuariosNuevosMes}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="fecha" 
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="cantidad" 
                                        stroke="#8884d8" 
                                        strokeWidth={2}
                                        name="Usuarios"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-75 text-gray-500">
                                No hay datos de usuarios nuevos este mes
                            </div>
                        )}
                    </div>

                    {/* Gráfica 2: Usuarios por Tipo de Licencia */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Distribución de Licencias
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={estadisticas.usuariosPorLicencia}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => {
                                        const payload = entry as { payload?: { licencia: string; cantidad: number } };
                                        return payload.payload && payload.payload.cantidad > 0 ? `${payload.payload.licencia}: ${payload.payload.cantidad}` : '';
                                    }}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="cantidad"
                                >
                                    {estadisticas.usuariosPorLicencia.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gráfica 3: Resumen de Ganancias */}
                    <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Resumen de Ingresos
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={[
                                    {
                                        nombre: 'Ganancias Licencias',
                                        monto: estadisticas.gananciasLicencias.totalGanancias
                                    },
                                    {
                                        nombre: 'Comisiones Retiros',
                                        monto: Number(estadisticas.comisionesRetiros.totalComisiones)
                                    },
                                    {
                                        nombre: 'Total',
                                        monto: estadisticas.gananciasLicencias.totalGanancias + 
                                               Number(estadisticas.comisionesRetiros.totalComisiones)
                                    }
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="nombre" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="monto" fill="#82ca9d" name="Monto ($)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gráfica 4: Detalle de Usuarios por Licencia */}
                    <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Detalle de Usuarios por Licencia
                        </h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={estadisticas.usuariosPorLicencia}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis 
                                    type="category" 
                                    dataKey="licencia" 
                                    width={70}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip 
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            const total = estadisticas.usuariosPorLicencia.reduce((sum, i) => sum + i.cantidad, 0);
                                            const porcentaje = total > 0 ? (data.cantidad / total * 100).toFixed(1) : '0.0';
                                            return (
                                                <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                                                    <p className="font-semibold text-gray-900">{data.licencia}</p>
                                                    <p className="text-sm text-gray-600">Usuarios: {data.cantidad}</p>
                                                    <p className="text-sm text-gray-600">Porcentaje: {porcentaje}%</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="cantidad" fill="#8884d8" name="Cantidad de Usuarios" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}