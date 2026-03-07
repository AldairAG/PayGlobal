/* eslint-disable react-hooks/exhaustive-deps */
import { TrendingUp, Coins, Wallet, Award } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useUsuario } from "../../hooks/usuarioHook";
import { formatearFechaDate } from "../../helpers/formatHelpers";
import { TipoWallets } from "../../type/enum";
import { useEffect, useMemo } from 'react';
import { getLicenseImage } from "../../helpers/imgHelpers";
import { useTransacciones } from "../../hooks/useTransacciones";
import { useTranslation } from 'react-i18next';
import CryptoTicker from '../../components/CryptoTicker';
import ForexTicker from '../../components/ForexTicker';

const HomePage = () => {
    const { t } = useTranslation();
    const { usuario, usuarioEnRed } = useUsuario();
    const { cargarGananciasPorMes, gananciasPorMes, loadingGanancias, errorGanancias } = useTransacciones();

    useEffect(() => {
        cargarGananciasPorMes();
    }, []);

    const porcentajeCalculo = useMemo(() => {
        return (valor: number, total: number) => {
            if (total === 0) return "0%";
            const porcentaje = (valor / total) * 100;
            return `${porcentaje.toFixed(2)}%`;
        };
    }, []);

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#000000] text-white">

            {/* TICKER DE CRYPTOMONEDAS */}
            <CryptoTicker />

            {/* MERCADO FOREX */}
            <ForexTicker />



            <div className="p-6 space-y-8">

                {/* FILA 1: Licencia, Dividendos, Comisiones */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Licencia */}
                    <div className="p-5 rounded-2xl border border-[#F0973C]/20 bg-[#F0973C]/5">
                        <div className="flex items-center gap-4">
                            <img
                                src={getLicenseImage(usuario?.licencia.nombre || '')}
                                alt={t('home.license')}
                                className="w-20 h-20 object-contain shrink-0"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white">{t('home.active_license')}</h3>
                                <p className="text-sm text-[#F0973C] font-bold mt-1">{usuario?.licencia.nombre || t('home.without_license')}</p>
                                <p className="text-xs text-white/40 mt-2">{t('home.renewed')}: {usuario?.licencia.fechaCompra ? formatearFechaDate(new Date(usuario.licencia.fechaCompra)) : 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Wallet Dividendos */}
                    <div className="p-5 rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/5">
                        <div className="flex items-center gap-3">
                            <Wallet size={30} className="text-[#69AC95]" />
                            <h3 className="text-xl font-semibold text-white/80">{t('home.dividends')}</h3>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-[#69AC95]">$ {usuario?.wallets.find(wallet => wallet.tipo === TipoWallets.WALLET_DIVIDENDOS)?.saldo}</p>
                    </div>

                    {/* Wallet Comisiones */}
                    <div className="p-5 rounded-2xl border border-[#F0973C]/20 bg-[#F0973C]/5">
                        <div className="flex items-center gap-3">
                            <Coins size={30} className="text-[#F0973C]" />
                            <h3 className="text-xl font-semibold text-white/80">{t('home.commissions')}</h3>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-[#F0973C]">$ {usuario?.wallets.find(wallet => wallet.tipo === TipoWallets.WALLET_COMISIONES)?.saldo}</p>
                    </div>

                </div>

                {/* FILA 2: Reloj de progreso y Montos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Reloj de progreso */}
                    <div className="p-5 rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/5 flex flex-col items-center justify-center">
                        <div
                            className="w-36 h-36 rounded-full flex items-center justify-center"
                            style={{
                                background: `conic-gradient(#69AC95 0% ${porcentajeCalculo(usuario?.licencia.saldoAcumulado || 0, usuario?.licencia.limite || 1)}, #1f2937 ${porcentajeCalculo(usuario?.licencia.saldoAcumulado || 0, usuario?.licencia.limite || 1)} 100%)`,
                            }}>
                            <div className="w-28 h-28 rounded-full bg-[#0a0a0a] flex flex-col items-center justify-center gap-0.5">
                                <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">{t('home.progress_clock')}</span>
                                <span className="text-lg font-bold text-[#69AC95]">
                                    {porcentajeCalculo(usuario?.licencia.saldoAcumulado || 0, usuario?.licencia.limite || 1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Monto máximo y Total Recaudado */}
                    <div className="p-5 rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/5 flex flex-col justify-center gap-4">
                        <div className="border-b border-[#69AC95]/20 pb-3">
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{t('home.maximum_amount')}</p>
                            <p className="text-2xl font-bold text-white">$ {usuario?.licencia.limite}</p>
                        </div>
                        <div>
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{t('home.total_collected')}</p>
                            <p className="text-2xl font-bold text-[#69AC95]">$ {usuario?.licencia.saldoAcumulado}</p>
                        </div>
                    </div>

                </div>

                {/* DATOS DE RED Y RANGO */}
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                        <Award className="text-[#F0973C]" /> {t('home.network_data_and_range_details')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="p-5 rounded-xl border border-[#69AC95]/20 bg-[#69AC95]/5">
                            <h3 className="font-semibold text-lg text-white/70 uppercase tracking-wider text-sm">{t('home.my_current_rank')}</h3>
                            <p className="mt-2 text-2xl font-bold text-[#69AC95]">{usuario?.rango || t('home.no_range')}</p>
                        </div>

                        <div className="p-5 rounded-xl border border-[#F0973C]/20 bg-[#F0973C]/5">
                            <h3 className="font-semibold text-lg text-white/70 uppercase tracking-wider text-sm">{t('home.users_on_my_network')}</h3>
                            <p className="mt-2 text-2xl font-bold text-[#F0973C]">{usuarioEnRed || 0} {t('home.affiliates')}</p>
                        </div>

                    </div>
                </div>

                {/* GRAFICA DE GANANCIAS */}
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-white">
                        <TrendingUp className="text-[#69AC95]" /> {t("home.profit_increase")}
                    </h2>

                    <div className="w-full h-64">
                        {loadingGanancias ? (
                            <p className="text-center text-white/40">{t("home.loading_monthly_earnings...")}</p>
                        ) : errorGanancias ? (
                            <p className="text-center text-red-400">Error: {errorGanancias}</p>
                        ) : gananciasPorMes.length === 0 ? (
                            <p className="text-center text-white/40">{t("home.no_earnings_data_available.")}</p>
                        ) : (
                            <ResponsiveContainer>
                                <LineChart data={gananciasPorMes}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="mes" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(240,151,60,0.2)', borderRadius: '0.75rem', color: '#fff' }} />
                                    <Line type="monotone" dataKey="ganancia" stroke="#69AC95" strokeWidth={3} dot={{ fill: '#69AC95', strokeWidth: 0 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomePage;