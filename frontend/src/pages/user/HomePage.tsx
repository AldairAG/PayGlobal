import { TrendingUp, Coins, Wallet, Award } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useUsuario } from "../../hooks/usuarioHook";
import { formatearFechaDate } from "../../helpers/formatHelpers";
import { TipoWallets } from "../../type/enum";

const HomePage = () => {
    const {usuario} = useUsuario();
    // Datos para la gráfica
    const data = [
        { name: "Ene", ganancias: 120 },
        { name: "Feb", ganancias: 200 },
        { name: "Mar", ganancias: 320 },
        { name: "Abr", ganancias: 410 },
        { name: "May", ganancias: 460 },
        { name: "Jun", ganancias: 600 },
    ];

    return (
        <div className="flex flex-col w-full">

                {/* TICKER DE CRYPTOMONEDAS - Diseño horizontal superior */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 shadow-sm">
                    <div className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            
                            {/* BTC/USD */}
                            <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                                        style={{ backgroundColor: '#F0973C' }}>
                                        ₿
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">BTC/USD</p>
                                        <p className="text-2xl font-bold text-gray-900">38549.77</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs font-semibold text-green-500">0.21%</span>
                                    </div>
                                    <p className="text-xs font-medium text-green-500">81.42</p>
                                </div>
                            </div>

                            {/* USDT (ERC-20) */}
                            <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                                        style={{ backgroundColor: '#26A17B' }}>
                                        ₮
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">USDT/USD</p>
                                        <p className="text-sm text-gray-500">(ERC-20)</p>
                                        <p className="text-2xl font-bold text-gray-900">1.00</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs font-semibold text-green-500">0.01%</span>
                                    </div>
                                    <p className="text-xs font-medium text-green-500">0.0001</p>
                                </div>
                            </div>

                            {/* USDT (TRC-20) */}
                            <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                                        style={{ backgroundColor: '#26A17B' }}>
                                        ₮
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">USDT/USD</p>
                                        <p className="text-sm text-gray-500">(TRC-20)</p>
                                        <p className="text-2xl font-bold text-gray-900">1.00</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs font-semibold text-green-500">0.02%</span>
                                    </div>
                                    <p className="text-xs font-medium text-green-500">0.0002</p>
                                </div>
                            </div>

                            {/* SOL/USD */}
                            <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                                        style={{ backgroundColor: '#9945FF' }}>
                                        ◎
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">SOL/USD</p>
                                        <p className="text-2xl font-bold text-gray-900">142.35</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs font-semibold text-green-500">1.87%</span>
                                    </div>
                                    <p className="text-xs font-medium text-green-500">2.61</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-8">

                    {/* SECCIÓN SUPERIOR: TARJETAS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

                        {/* Reloj de progreso */}
                        <div className="p-5 rounded-2xl shadow border" 
                             style={{ backgroundColor: '#FFFFFF', borderColor: '#e5e7eb' }}>
                            <div className="flex items-center gap-4">
                                {/* Reloj circular */}
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <div 
                                        className="w-24 h-24 rounded-full flex items-center justify-center text-lg font-bold"
                                        style={{
                                            background: `conic-gradient(#69AC95 0% 75%, #e5e7eb 75% 100%)`,
                                        }}>
                                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                                            75%
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Información de montos */}
                                <div className="flex-1 text-left">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Reloj de progreso</h3>
                                    <div className="space-y-1">
                                        <div>
                                            <p className="text-xs text-gray-500">Monto máximo</p>
                                            <p className="text-sm font-bold text-gray-900">$ {usuario?.licencia.limite}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Total recaudado</p>
                                            <p className="text-sm font-bold" style={{ color: '#69AC95' }}>$ {usuario?.licencia.saldoAcumulado}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Licencia */}
                        <div className="p-5 rounded-2xl shadow border" 
                             style={{ backgroundColor: '#FFFFFF', borderColor: '#e5e7eb' }}>
                            <div className="flex items-center gap-3">
                                <Award size={30} style={{ color: '#F0973C' }} />
                                <h3 className="text-xl font-semibold">Licencia activa</h3>
                            </div>
                            <p className="mt-2 text-gray-600">Ultima fecha de renovacion: {usuario?.licencia.fechaCompra ? formatearFechaDate(new Date(usuario.licencia.fechaCompra)) : 'N/A'}</p>
                        </div>

                        {/* Wallet Dividendos */}
                        <div className="p-5 rounded-2xl shadow border" 
                             style={{ backgroundColor: '#FFFFFF', borderColor: '#e5e7eb' }}>
                            <div className="flex items-center gap-3">
                                <Wallet size={30} style={{ color: '#69AC95' }} />
                                <h3 className="text-xl font-semibold">Dividendos</h3>
                            </div>
                        <p className="mt-2 text-2xl font-bold">$ {usuario?.wallets.find(wallet => wallet.tipo === TipoWallets.WALLET_DIVIDENDOS)?.saldo}</p>
                        </div>

                        {/* Wallet Comisiones */}
                        <div className="p-5 rounded-2xl shadow border" 
                             style={{ backgroundColor: '#FFFFFF', borderColor: '#e5e7eb' }}>
                            <div className="flex items-center gap-3">
                                <Coins size={30} style={{ color: '#F0973C' }} />
                                <h3 className="text-xl font-semibold">Comisiones</h3>
                            </div>
                            <p className="mt-2 text-2xl font-bold">$ {usuario?.wallets.find(wallet => wallet.tipo === TipoWallets.WALLET_COMISIONES)?.saldo}</p>
                        </div>

                    </div>

                    {/* DATOS DE RED Y RANGO */}
                    <div className="p-6 rounded-2xl shadow border"
                        style={{ backgroundColor: '#FFFFFF', borderColor: '#e5e7eb' }}>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Award style={{ color: '#F0973C' }} /> Datos de red & Detalles de rango
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="p-5 rounded-xl" style={{ backgroundColor: '#f9fafb' }}>
                                <h3 className="font-semibold text-lg">Mi rango actual</h3>
                            <p className="mt-2 text-2xl font-bold" style={{ color: '#69AC95' }}>{usuario?.rango?.nombre || "Sin Rango"}</p>
                            </div>

                            <div className="p-5 rounded-xl" style={{ backgroundColor: '#f9fafb' }}>
                                <h3 className="font-semibold text-lg">Usuarios en mi red</h3>
                                <p className="mt-2 text-2xl font-bold" style={{ color: '#F0973C' }}>128 afiliados</p>
                            </div>

                        </div>
                    </div>

                    

                    {/* GRAFICA DE GANANCIAS */}
                    <div className="p-6 rounded-2xl shadow border" 
                         style={{ backgroundColor: '#FFFFFF', borderColor: '#e5e7eb' }}>
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                            <TrendingUp style={{ color: '#69AC95' }} /> Aumento de Ganancias
                        </h2>

                        <div className="w-full h-64">
                            <ResponsiveContainer>
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="ganancias" stroke="#69AC95" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

        </div>
    );
};

export default HomePage;