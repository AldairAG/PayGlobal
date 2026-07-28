/* eslint-disable react-hooks/exhaustive-deps */
import { TrendingUp, Coins, Wallet, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useUsuario } from "../../hooks/usuarioHook";
import { formatearFechaDate } from "../../helpers/formatHelpers";
import { TipoWallets } from "../../type/enum";
import { useEffect, useMemo } from 'react';
import { getLicenseImage, getRankImage } from "../../helpers/imgHelpers";
import { useTransacciones } from "../../hooks/useTransacciones";
import { useTranslation } from 'react-i18next';
import CryptoTicker from '../../components/CryptoTicker';
import ForexTicker from '../../components/ForexTicker';

const tablaOfertas = [
    { licencia: '1,000', diario: '3%', gananciaEn12Meses: '$10,800 USDT' },
    { licencia: '2,500', diario: '3%', gananciaEn12Meses: '$27,000 USDT' },
    { licencia: '5,000', diario: '3%', gananciaEn12Meses: '$54,000 USDT' },
    { licencia: '10,000', diario: '3%', gananciaEn12Meses: '$108,000 USDT' },
    { licencia: '15,000', diario: '3%', gananciaEn12Meses: '$262,000 USDT' },
    { licencia: '25,000', diario: '3%', gananciaEn12Meses: '$270,000 USDT' },
    { licencia: '50,000', diario: '3%', gananciaEn12Meses: '$540,000 USDT' },
];

const HomePage = () => {
    const { t } = useTranslation();
    const { usuario } = useUsuario();
    const { 
        cargarGananciasUltimos30Dias, 
        gananciasUltimos30Dias, 
        loadingGanancias30Dias, 
        errorGanancias30Dias 
    } = useTransacciones();

    useEffect(() => {
        cargarGananciasUltimos30Dias();
    }, []);

    const porcentajeCalculo = useMemo(() => {
        return (valor: number, total: number) => {
            if (total === 0) return "0%";

            const sobrante = valor / total;

            //subtraer enteros y dejar decimales
            const sobranteDecimal = sobrante - Math.floor(sobrante);
            const porcentaje = sobranteDecimal * 100;
            return `${porcentaje.toFixed(2)}%`;
        }

    }, []);

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#000000] text-white">

            {/* TICKER DE CRYPTOMONEDAS */}
            <CryptoTicker />

            {/* MERCADO FOREX */}
            <ForexTicker />



            <div className="p-6 space-y-8">

                {/* FILA COMBINADA: [progreso + moneda + maxcap] | [info derecha] */}
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">

                    {/* BLOQUE IZQUIERDO: reloj + moneda (misma altura) y MAX CAP debajo */}
                    <div className="flex flex-col gap-4">

                        {/* Fila superior: reloj de progreso y moneda, igual altura */}
                        <div className="grid grid-cols-2 gap-4">

                            {/* Reloj de progreso */}
                            <div className="p-5 rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/5 flex flex-col items-center justify-center">
                                <div
                                    className="w-full aspect-square max-w-[235px] rounded-full flex items-center justify-center"
                                    style={{
                                        background: `conic-gradient(#69AC95 0% ${porcentajeCalculo(usuario?.licencia.saldoAcumulado || 0, usuario?.licencia.limite || 1)}, #1f2937 ${porcentajeCalculo(usuario?.licencia.saldoAcumulado || 0, usuario?.licencia.limite || 1)} 100%)`,
                                    }}>
                                    <div className="w-[85%] aspect-square rounded-full bg-[#0a0a0a] flex flex-col items-center justify-center gap-1">
                                        <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">{t('home.progress_clock')}</span>
                                        <span className="text-2xl font-bold text-[#69AC95]">
                                            {porcentajeCalculo(usuario?.licencia.saldoAcumulado || 0, usuario?.licencia.limite || 1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Imagen de la licencia */}
                            <div className="flex items-center justify-center p-5 rounded-2xl border border-[#F0973C]/20 bg-[#F0973C]/5">
                                <img
                                    src={getLicenseImage(usuario?.licencia.nombre || '')}
                                    alt={t('home.license')}
                                    className="w-full max-w-[260px] object-contain drop-shadow-2xl"
                                />
                            </div>

                        </div>

                        {/* MAX CAP y Earnings debajo, ancho completo */}
                        <div className="p-4 rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/5 flex flex-row justify-around items-center gap-4">
                            <div className="text-center">
                                <p className="text-sm font-semibold text-[#F0973C] uppercase tracking-wider mb-1">{t('home.maximum_amount')}</p>
                                <p className="text-2xl font-bold text-[#69AC95]">$ {usuario?.licencia.limite}</p>
                            </div>
                            <div className="w-px h-10 bg-[#69AC95]/30" />
                            <div className="text-center">
                                <p className="text-sm font-semibold text-[#F0973C] uppercase tracking-wider mb-1">{t('home.total_collected')}</p>
                                <p className="text-2xl font-bold text-[#69AC95]">$ {usuario?.licencia.saldoAcumulado}</p>
                            </div>
                        </div>

                    </div>

                    {/* COLUMNA DERECHA: Licencia info, Staking, Network */}
                    <div className="flex flex-col gap-4">

                        {/* Licencia */}
                        <div className="p-5 rounded-2xl border border-[#F0973C]/20 bg-[#F0973C]/5 flex-1 flex items-center justify-center gap-6">
                            <h3 className="mt-2 text-2xl font-semibold text-[#F0973C]">{t('home.active_license')}</h3>
                            <p className="mt-2 text-1xl text-white/40">{t('home.renewed')}: {usuario?.licencia.fechaCompra ? formatearFechaDate(new Date(usuario.licencia.fechaCompra)) : 'N/A'}</p>
                        </div>

                        {/* Wallet Dividendos */}
                        <div className="p-5 rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/5 flex flex-col justify-center items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Wallet size={30} className="text-[#69AC95]" />
                                <h3 className="text-xl font-semibold text-[#F0973C]">{t('home.staking')}</h3>
                            </div>
                            <p className="text-2xl font-bold text-[#69AC95] break-words text-center">$ {usuario?.wallets.find(wallet => wallet.tipo === TipoWallets.WALLET_STAKING)?.saldo}</p>
                        </div>

                        {/* Wallet Comisiones */}
                        <div className="p-5 rounded-2xl border border-[#F0973C]/20 bg-[#F0973C]/5 flex flex-col justify-center items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Coins size={30} className="text-[#69AC95]" />
                                <h3 className="text-xl font-semibold text-[#F0973C]">{t('home.network')}</h3>
                            </div>
                            <p className="text-2xl font-bold text-[#69AC95] break-words text-center">$ {usuario?.wallets.find(wallet => wallet.tipo === TipoWallets.WALLET_NETWORK)?.saldo}</p>
                        </div>

                    </div>
                    
                </div>

                {/* DATOS DE RED Y RANGO */}
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                        <Award className="text-[#F0973C]" /> {t('home.network_data_and_range_details')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="p-5 rounded-xl border border-[#69AC95]/20 bg-[#69AC95]/5 flex flex-col items-center justify-center">
                            <h3 className="font-semibold text-lg text-[#F0973C] uppercase tracking-wider text-sm mb-3">{t('home.my_current_rank')}</h3>
                           
                                <img
                                    src={getRankImage(usuario?.rango || "SIN RANGO")}
                                    alt={usuario?.rango}
                                    className="w-32 h-32 object-contain drop-shadow-2xl"
                                />
                        </div>

{/*                         <div className="p-5 rounded-xl border border-[#F0973C]/20 bg-[#F0973C]/5">
                            <h3 className="font-semibold text-lg text-[#F0973C] uppercase tracking-wider text-sm">{t('home.users_on_my_network')}</h3>
                            <p className="mt-2 text-2xl font-bold text-[#69AC95]">{usuarioEnRed || 0} {t('home.affiliates')}</p>
                        </div>
 */}
                    </div>
                </div>

                {/* GRAFICA DE GANANCIAS */}
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-[#F0973C]">
                        <TrendingUp className="text-[#69AC95]" /> {t("home.profit_increase")} - {t("home.last_30_days")}
                    </h2>

                    <div className="w-full h-96">
                        {loadingGanancias30Dias ? (
                            <p className="text-center text-white/40">{t("home.loading_monthly_earnings...")}</p>
                        ) : errorGanancias30Dias ? (
                            <p className="text-center text-red-400">Error: {errorGanancias30Dias}</p>
                        ) : gananciasUltimos30Dias.length === 0 ? (
                            <p className="text-center text-white/40">{t("home.no_earnings_data_available.")}</p>
                        ) : (
                            <ResponsiveContainer>
                                <BarChart 
                                    data={gananciasUltimos30Dias}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                                >
                                    <defs>
                                        <linearGradient id="barGradientHome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#69AC95" stopOpacity={0.9}/>
                                            <stop offset="95%" stopColor="#69AC95" stopOpacity={0.3}/>
                                        </linearGradient>
                                        <filter id="shadowHome" height="200%">
                                            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                                            <feOffset dx="2" dy="3" result="offsetblur"/>
                                            <feComponentTransfer>
                                                <feFuncA type="linear" slope="0.3"/>
                                            </feComponentTransfer>
                                            <feMerge>
                                                <feMergeNode/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis 
                                        dataKey="fecha" 
                                        stroke="rgba(255,255,255,0.3)" 
                                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                                        tickFormatter={(value) => {
                                            const fecha = new Date(value);
                                            return `${fecha.getDate()}/${fecha.getMonth() + 1}`;
                                        }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={70}
                                    />
                                    <YAxis 
                                        stroke="rgba(255,255,255,0.3)" 
                                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                                        domain={[0, 'auto']}
                                        tickFormatter={(value) => `$${value.toFixed(2)}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#111', 
                                            border: '1px solid rgba(105,172,149,0.3)', 
                                            borderRadius: '12px', 
                                            color: '#fff',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                                        }}
                                        labelFormatter={(label) => {
                                            const fecha = new Date(label);
                                            return fecha.toLocaleDateString('es-ES');
                                        }}
                                        formatter={(value: number | undefined) => value !== undefined ? [`$ ${value.toFixed(2)}`, t("home.earnings")] : ['$ 0.00', t("home.earnings")]}
                                    />
                                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.6)', paddingTop: '10px' }} />
                                    <Bar 
                                        dataKey="ganancia" 
                                        name={t("home.earnings")} 
                                        fill="url(#barGradientHome)" 
                                        radius={[8, 8, 0, 0]}
                                        filter="url(#shadowHome)"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="p-6 rounded-2xl border border-[#F0973C]/20 bg-[#F0973C]/5">
                    <div className="mb-4">
                        <h6 className="text-sm font-semibold uppercase tracking-widest text-[#69AC95]">{t('home.exclusive_offer')}</h6>
                        <h3 className="text-2xl font-bold text-[#F0973C] mt-1">{t('home.prelaunch_promotion')}</h3>
                        <h4 className="text-sm md:text-base font-semibold text-white/80 mt-2">{t('home.prelaunch_promotion_period')}</h4>
                        <h5 className="text-xs md:text-sm text-white/60 mt-1">{t('home.prelaunch_promotion_availability')}</h5>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="min-w-full bg-[#111]">
                            <thead>
                                <tr className="bg-[#69AC95]/20 text-[#F0973C] uppercase text-xs tracking-wider">
                                    <th className="px-4 py-3 text-left">{t('home.offer_table_license')}</th>
                                    <th className="px-4 py-3 text-left">{t('home.offer_table_daily_profit')}</th>
                                    <th className="px-4 py-3 text-left">{t('home.offer_table_profit_12_months')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tablaOfertas.map((oferta, index) => (
                                    <tr
                                        key={oferta.licencia}
                                        className={index % 2 === 0 ? 'bg-white/[0.02] border-t border-white/5' : 'bg-transparent border-t border-white/5'}
                                    >
                                        <td className="px-4 py-3 font-semibold text-[#69AC95]">$ {oferta.licencia} USDT</td>
                                        <td className="px-4 py-3 text-white">{oferta.diario}</td>
                                        <td className="px-4 py-3 text-white/90">{oferta.gananciaEn12Meses}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomePage;