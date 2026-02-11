import { TrendingUp, Coins, Wallet, Award, Server } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const HomePage = () => {
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

                <div className="p-6 space-y-8">

                    {/* SECCIÓN SUPERIOR: TARJETAS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

                        {/* Reloj de progreso */}
                        <div className="p-5 rounded-2xl shadow flex flex-col items-center text-center border" 
                             style={{ backgroundColor: '#FFFFFF', borderColor: '#e5e7eb' }}>
                            <div className="w-28 h-28 rounded-full border-8 flex items-center justify-center text-xl font-bold" 
                                 style={{ borderColor: '#69AC95' }}>
                                75%
                            </div>
                            <h3 className="mt-3 text-lg font-semibold">Reloj de progreso</h3>
                        </div>

                        {/* Licencia */}
                        <div className="p-5 rounded-2xl shadow border" 
                             style={{ backgroundColor: '#FFFFFF', borderColor: '#e5e7eb' }}>
                            <div className="flex items-center gap-3">
                                <Award size={30} style={{ color: '#F0973C' }} />
                                <h3 className="text-xl font-semibold">Licencia activa</h3>
                            </div>
                            <p className="mt-2 text-gray-600">Expira: 12/12/2026</p>
                        </div>

                        {/* Wallet Dividendos */}
                        <div className="p-5 rounded-2xl shadow border" 
                             style={{ backgroundColor: '#FFFFFF', borderColor: '#e5e7eb' }}>
                            <div className="flex items-center gap-3">
                                <Wallet size={30} style={{ color: '#69AC95' }} />
                                <h3 className="text-xl font-semibold">Dividendos</h3>
                            </div>
                            <p className="mt-2 text-2xl font-bold">$ 1,250.00</p>
                        </div>

                        {/* Wallet Comisiones */}
                        <div className="p-5 rounded-2xl shadow border" 
                             style={{ backgroundColor: '#FFFFFF', borderColor: '#e5e7eb' }}>
                            <div className="flex items-center gap-3">
                                <Coins size={30} style={{ color: '#F0973C' }} />
                                <h3 className="text-xl font-semibold">Comisiones</h3>
                            </div>
                            <p className="mt-2 text-2xl font-bold">$ 780.00</p>
                        </div>

                    </div>

                    {/* TABLA DE CRYPTOMONEDAS */}
                    <div className="rounded-2xl shadow border overflow-hidden" 
                         style={{ backgroundColor: '#FFFFFF', borderColor: '#e5e7eb' }}>
                        <div className="p-6" style={{ backgroundColor: '#69AC95' }}>
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                                <Server size={28} /> Valores de Cryptomonedas
                            </h2>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                {/* Bitcoin */}
                                <div className="flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-md" 
                                     style={{ backgroundColor: '#f9fafb' }}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                                             style={{ backgroundColor: '#F0973C' }}>
                                            ₿
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg" style={{ color: '#000000' }}>Bitcoin</h3>
                                            <p className="text-sm text-gray-500">BTC</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-xl" style={{ color: '#000000' }}>$95,000</p>
                                        <div className="flex items-center gap-2 justify-end mt-1">
                                            <span className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                                                  style={{ backgroundColor: '#69AC95' }}>
                                                +5.2%
                                            </span>
                                            <span className="text-sm text-gray-500">$1.5T</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ethereum */}
                                <div className="flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-md" 
                                     style={{ backgroundColor: '#f9fafb' }}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                                             style={{ backgroundColor: '#69AC95' }}>
                                            Ξ
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg" style={{ color: '#000000' }}>Ethereum</h3>
                                            <p className="text-sm text-gray-500">ETH</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-xl" style={{ color: '#000000' }}>$4,820</p>
                                        <div className="flex items-center gap-2 justify-end mt-1">
                                            <span className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                                                  style={{ backgroundColor: '#69AC95' }}>
                                                +3.1%
                                            </span>
                                            <span className="text-sm text-gray-500">$580B</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Solana */}
                                <div className="flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-md" 
                                     style={{ backgroundColor: '#f9fafb' }}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                                             style={{ backgroundColor: '#F0973C' }}>
                                            ◎
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg" style={{ color: '#000000' }}>Solana</h3>
                                            <p className="text-sm text-gray-500">SOL</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-xl" style={{ color: '#000000' }}>$210</p>
                                        <div className="flex items-center gap-2 justify-end mt-1">
                                            <span className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                                                  style={{ backgroundColor: '#BC2020' }}>
                                                -1.2%
                                            </span>
                                            <span className="text-sm text-gray-500">$90B</span>
                                        </div>
                                    </div>
                                </div>
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

                    {/* DATOS DE RED Y RANGO */}
                    <div className="p-6 rounded-2xl shadow border" 
                         style={{ backgroundColor: '#FFFFFF', borderColor: '#e5e7eb' }}>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Award style={{ color: '#F0973C' }} /> Datos de red & Detalles de rango
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="p-5 rounded-xl" style={{ backgroundColor: '#f9fafb' }}>
                                <h3 className="font-semibold text-lg">Mi rango actual</h3>
                                <p className="mt-2 text-2xl font-bold" style={{ color: '#69AC95' }}>Gold Partner</p>
                            </div>

                            <div className="p-5 rounded-xl" style={{ backgroundColor: '#f9fafb' }}>
                                <h3 className="font-semibold text-lg">Usuarios en mi red</h3>
                                <p className="mt-2 text-2xl font-bold" style={{ color: '#F0973C' }}>128 afiliados</p>
                            </div>

                        </div>
                    </div>

                </div>

        </div>
    );
};

export default HomePage;