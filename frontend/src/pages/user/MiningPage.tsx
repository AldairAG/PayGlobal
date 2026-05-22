import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, DollarSign, Calendar, Pickaxe, Info, ShoppingCart, X, Wallet, ArrowRightLeft } from 'lucide-react';
import { getLicenseImage } from '../../helpers/imgHelpers';
import type { Licencia } from '../../type/entityTypes';

// Configuración de tasas de interés compuesto (rendimiento diario)
const INTEREST_RATES = {
    P50: { name: "P50", value: 50 ,rendimientoDiario: 0.01},
    P100: { name: "P100", value: 100 ,rendimientoDiario: 0.01},
    P250: { name: "P250", value: 250 ,rendimientoDiario: 0.01},
    P500: { name: "P500", value: 500 ,rendimientoDiario: 0.01},
    P1000: { name: "P1000", value: 1000 ,rendimientoDiario: 0.015},
    P2500: { name: "P2500", value: 2500 ,rendimientoDiario: 0.015},
    P5000: { name: "P5000", value: 5000 ,rendimientoDiario: 0.02},
    P7500: { name: "P7500", value: 7500 ,rendimientoDiario: 0.02},
    P10000: { name: "P10000", value: 10000 ,rendimientoDiario: 0.025},
    P15000: { name: "P15000", value: 15000 ,rendimientoDiario: 0.025},
    P25000: { name: "P25000", value: 25000 ,rendimientoDiario: 0.03},
    P50000: { name: "P50000", value: 50000 ,rendimientoDiario: 0.03},
};

const MiningPage = () => {
  // Estados
  const [selectedPeriod, setSelectedPeriod] = useState(12); // meses
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [pickaxePosition, setPickaxePosition] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [miningActive, setMiningActive] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [licenseToPurchase, setLicenseToPurchase] = useState<Licencia | null>(null);
  const [miningWalletBalance, setMiningWalletBalance] = useState(0);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');

  // Licencias disponibles (simuladas basadas en el patrón de la app)

  const licenses:Licencia[] = [
    { id: 1, nombre: 'P50', precio: 50, limite: 0, activo: true, fechaCompra: new Date(), saldoAcumulado: 0 },
    { id: 2, nombre: 'P100', precio: 100, limite: 0, activo: true, fechaCompra: new Date(), saldoAcumulado: 0 },
    { id: 3, nombre: 'P250', precio: 250, limite: 0, activo: true, fechaCompra: new Date(), saldoAcumulado: 0 },
    { id: 4, nombre: 'P500', precio: 500, limite: 0, activo: true, fechaCompra: new Date(), saldoAcumulado: 0 },
    { id: 5, nombre: 'P1000', precio: 1000, limite: 0, activo: true, fechaCompra: new Date(), saldoAcumulado: 0 },
  ];

/*   const licenses = [
    { name: 'Basic', value: 100, color: '#4B5563' },
    { name: 'Standard', value: 500, color: '#3B82F6' },
    { name: 'Premium', value: 1000, color: '#8B5CF6' },
    { name: 'Platinum', value: 2500, color: '#F59E0B' },
    { name: 'Diamond', value: 5000, color: '#10B981' },
    { name: 'Master', value: 10000, color: '#EF4444' },
  ]; */
    
  const [selectedLicense, setSelectedLicense] = useState(licenses[0]);

  // Calcular interés compuesto
  const calculations = useMemo(() => {
    const principal = selectedLicense.precio;
    const rate = INTEREST_RATES[selectedLicense.nombre as keyof typeof INTEREST_RATES]?.rendimientoDiario*30 || 0.05;

    // Fórmula: A = P(1 + r)^t
    const totalAmount = principal * Math.pow(1 + rate, selectedPeriod);
    const totalProfit = totalAmount - principal;

    const totalDays = selectedPeriod * 30;
    const totalSeconds = totalDays * 86400; // Segundos totales
    const dailyProfit = totalProfit / totalDays;
    const monthlyProfit = totalProfit / selectedPeriod;
    const annualProfit = selectedPeriod >= 12 ? totalProfit : (totalProfit / selectedPeriod) * 12;
    const profitPerSecond = totalProfit / totalSeconds; // Ganancia por segundo

    return {
      totalAmount: totalAmount.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      dailyProfit: dailyProfit.toFixed(2),
      monthlyProfit: monthlyProfit.toFixed(2),
      annualProfit: annualProfit.toFixed(2),
      profitPerSecond: profitPerSecond,
      totalDays,
      totalSeconds,
    };
  }, [selectedLicense, selectedPeriod]);

  // Reiniciar cuando cambien los parámetros
  useEffect(() => {
    setElapsedSeconds(0);
    setCurrentEarnings(0);
    setMiningActive(false);
  }, [selectedLicense, selectedPeriod]);

  // Animación de ganancias incrementales - cada segundo en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => {
        const nextSecond = prev + 1;
        if (nextSecond > calculations.totalSeconds) {
          return calculations.totalSeconds;
        }
        return nextSecond;
      });

      setCurrentEarnings(prev => {
        const newValue = prev + calculations.profitPerSecond;
        const maxProfit = parseFloat(calculations.totalProfit);

        if (newValue >= maxProfit) {
          return maxProfit;
        }
        return newValue;
      });
    }, 1000); // Cada segundo real

    return () => clearInterval(interval);
  }, [calculations]);

  // Animación del pico
  useEffect(() => {
    const interval = setInterval(() => {
      setPickaxePosition(prev => (prev + 0.5) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Progreso actual (0-100%)
  const progressPercentage = (currentEarnings / parseFloat(calculations.totalProfit)) * 100;

  // Convertir segundos a días, horas, minutos, segundos
  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { days, hours, minutes, seconds: secs };
  };

  const timeElapsed = formatTime(elapsedSeconds);

  // Función para abrir el modal de compra
  const handleOpenPurchaseModal = (license: Licencia) => {
    setLicenseToPurchase(license);
    setShowPurchaseModal(true);
  };

  // Función para confirmar la compra
  const handleConfirmPurchase = () => {
    // Aquí iría la lógica de compra real
    if (licenseToPurchase) {
      alert(`Compra de licencia ${licenseToPurchase.nombre} por $${licenseToPurchase.precio} USDT confirmada!`);
    }
    setShowPurchaseModal(false);
    setLicenseToPurchase(null);
  };

  // Función para recibir ganancias en la wallet de minería al completar el plazo
  useEffect(() => {
    if (elapsedSeconds >= calculations.totalSeconds && currentEarnings >= parseFloat(calculations.totalProfit)) {
      // Transferir ganancias a la wallet de minería
      setMiningWalletBalance(prev => prev + currentEarnings);
    }
  }, [elapsedSeconds, calculations.totalSeconds, currentEarnings, calculations.totalProfit]);

  // Función para transferir a wallet staking
  const handleTransferToStaking = () => {
    const amount = parseFloat(transferAmount);
    if (amount > 0 && amount <= miningWalletBalance) {
      setMiningWalletBalance(prev => prev - amount);
      // Aquí iría la lógica para transferir a wallet staking
      alert(`Se han transferido $${amount.toFixed(2)} USDT a tu Wallet Staking exitosamente!`);
      setShowTransferModal(false);
      setTransferAmount('');
    } else {
      alert('Monto inválido o saldo insuficiente');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white px-4 py-8">
      <div className="container mx-auto max-w-7xl space-y-8">

        {/* Modal de Compra de Licencia */}
        {/*         {showPurchaseModal && licenseToPurchase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4 p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#F0973C]/30 shadow-2xl shadow-[#F0973C]/20">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-[#F0973C]/10 border border-[#F0973C]/30">
                    <ShoppingCart className="w-12 h-12 text-[#F0973C]" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-2 text-white">
                  Comprar Licencia
                </h2>
                <p className="text-white/60 mb-6">
                  Estás a punto de adquirir una nueva licencia de minería
                </p>

                <div className="p-6 rounded-xl bg-black/40 border border-[#F0973C]/20 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={getLicenseImage(licenseToPurchase.name)}
                      alt={licenseToPurchase.name}
                      className="w-20 h-20 object-contain"
                    />
                    <div className="text-left flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {licenseToPurchase.name}
                      </h3>
                      <p className="text-sm text-white/60">
                        Tasa: {(INTEREST_RATES[licenseToPurchase.name as keyof typeof INTEREST_RATES] * 100).toFixed(0)}% mensual
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                      <span className="text-white/60">Precio</span>
                      <span className="text-xl font-bold text-[#69AC95]">
                        ${licenseToPurchase.value.toLocaleString()} USDT
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                      <span className="text-white/60">Comisión de red</span>
                      <span className="text-white/80">$5.00 USDT</span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-[#F0973C]/30 to-transparent"></div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-[#F0973C]/10">
                      <span className="font-semibold text-white">Total</span>
                      <span className="text-2xl font-bold text-[#F0973C]">
                        ${(licenseToPurchase.value + 5).toLocaleString()} USDT
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPurchaseModal(false)}
                    className="flex-1 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/10"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmPurchase}
                    className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[#F0973C] to-[#d67e2a] text-white font-bold shadow-lg shadow-[#F0973C]/40 hover:shadow-[#F0973C]/60 transition-all"
                  >
                    Confirmar Compra
                  </button>
                </div>

                <p className="mt-4 text-xs text-white/40">
                  Al confirmar, aceptas los términos y condiciones de la plataforma
                </p>
              </div>
            </div>
          </div>
        )} */}

        {/* Sección explicativa superior */}
        <div className="p-6 rounded-2xl border border-[#F0973C]/20 bg-gradient-to-br from-[#F0973C]/10 to-[#69AC95]/10 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#F0973C]/20">
              <Info className="w-6 h-6 text-[#F0973C]" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-[#F0973C]">
                Minería con Interés Compuesto
              </h2>
              <p className="text-white/70 leading-relaxed">
                Invierte con tu licencia y observa cómo crece tu capital mediante interés compuesto.
                Selecciona el plazo de inversión y la licencia deseada para calcular tus ganancias diarias,
                mensuales y anuales. El interés se reinvierte automáticamente, maximizando tus retornos a largo plazo.
              </p>
            </div>
          </div>
        </div>

        {/* Grid principal: Licencias (izquierda) + Panel de minería (derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

          {/* Panel izquierdo: Licencias */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#F0973C]">
                Selecciona tu Licencia
              </h3>
              <button
                onClick={() => handleOpenPurchaseModal(selectedLicense)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#F0973C] to-[#d67e2a] text-white font-semibold text-sm shadow-lg shadow-[#F0973C]/30 hover:shadow-[#F0973C]/50 transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                Comprar Más
              </button>
            </div>

            {licenses.map((license, index) => (
              <div
                key={license.id}
                className={`group relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${selectedLicense.nombre === license.nombre
                    ? 'border-[#F0973C] bg-[#F0973C]/10 scale-105 shadow-lg shadow-[#F0973C]/20'
                    : index === 0
                      ? 'border-[#F0973C]/60 bg-[#F0973C]/5 hover:border-[#F0973C] hover:bg-[#F0973C]/10'
                      : 'border-white/10 bg-white/5 hover:border-[#F0973C]/50 hover:bg-[#F0973C]/5'
                  }`}
              >
                {/* Badge de destacado para la primera licencia */}
                {index === 0 && (
                  <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#F0973C] to-[#d67e2a] text-xs font-bold text-white shadow-lg">
                    Recomendada
                  </div>
                )}

                <div
                  onClick={() => setSelectedLicense(license)}
                  className="flex items-center gap-4 mb-3"
                >
                  <img
                    src={getLicenseImage(license.nombre)}
                    alt={license.nombre}
                    className="w-16 h-16 object-contain"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{license.nombre}</h4>
                    <p className="text-sm text-[#69AC95]">
                      ${license.precio.toLocaleString()} USDT
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      {(INTEREST_RATES[license.nombre as keyof typeof INTEREST_RATES]?.rendimientoDiario * 100).toFixed(0)}% mensual
                    </p>
                  </div>
                  {selectedLicense.nombre === license.nombre && (
                    <div className="w-3 h-3 rounded-full bg-[#F0973C] animate-pulse" />
                  )}
                </div>

                {/* Botón de compra individual */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenPurchaseModal(license);
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#69AC95]/20 to-[#4d8a73]/20 hover:from-[#69AC95]/30 hover:to-[#4d8a73]/30 text-[#69AC95] font-semibold text-sm border border-[#69AC95]/30 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Comprar Licencia
                </button>
              </div>
            ))}
          </div>

          {/* Panel derecho: Controles y visualización */}
          <div className="space-y-6">

            {/* Selector de plazo */}
            <div className="p-6 rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#69AC95]" />
                  Selecciona el Plazo
                </h3>
                <span className="text-2xl font-bold text-[#F0973C]">
                  {selectedPeriod} {selectedPeriod === 1 ? 'mes' : 'meses'}
                </span>
              </div>

              {/* Slider personalizado */}
              <div className="relative pt-8 pb-4">
                <input
                  type="range"
                  min="1"
                  max="36"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #F0973C 0%, #F0973C ${(selectedPeriod / 36) * 100}%, #1f2937 ${(selectedPeriod / 36) * 100}%, #1f2937 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-white/50 mt-2">
                  <span>1 mes</span>
                  <span>18 meses</span>
                  <span>36 meses</span>
                </div>
              </div>
            </div>

            {/* Estadísticas de ganancias */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-[#69AC95]/20 bg-[#69AC95]/5 text-center">
                <div className="flex justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-[#69AC95]" />
                </div>
                <p className="text-sm text-white/60 mb-1">Ganancia Diaria</p>
                <p className="text-2xl font-bold text-[#69AC95]">
                  ${calculations.dailyProfit}
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[#F0973C]/20 bg-[#F0973C]/5 text-center">
                <div className="flex justify-center mb-2">
                  <Calendar className="w-6 h-6 text-[#F0973C]" />
                </div>
                <p className="text-sm text-white/60 mb-1">Ganancia Mensual</p>
                <p className="text-2xl font-bold text-[#F0973C]">
                  ${calculations.monthlyProfit}
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[#F0973C]/20 bg-gradient-to-br from-[#F0973C]/10 to-[#69AC95]/10 text-center">
                <div className="flex justify-center mb-2">
                  <DollarSign className="w-6 h-6 text-[#69AC95]" />
                </div>
                <p className="text-sm text-white/60 mb-1">Ganancia Anual</p>
                <p className="text-2xl font-bold text-[#69AC95]">
                  ${calculations.annualProfit}
                </p>
              </div>
            </div>

            {/* Barra de progreso con animación de pico */}
            <div className="p-6 rounded-2xl border border-[#F0973C]/20 bg-gradient-to-br from-[#F0973C]/5 to-[#69AC95]/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  Progreso de Minería
                  <span className="text-xs text-[#69AC95] animate-pulse">
                    ● En vivo
                  </span>
                </h3>
                <div className="text-right">
                  <div className="text-sm text-white/60">
                    ${currentEarnings.toFixed(6)} / ${calculations.totalProfit}
                  </div>
                  <div className="text-xs text-white/40">
                    {timeElapsed.days}d {timeElapsed.hours}h {timeElapsed.minutes}m {timeElapsed.seconds}s
                  </div>
                </div>
              </div>

              {/* Botón de activar minería */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setMiningActive(!miningActive)}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold text-lg transition-all ${miningActive
                      ? 'bg-gradient-to-r from-[#69AC95] to-[#4d8a73] text-white shadow-lg shadow-[#69AC95]/40 hover:shadow-[#69AC95]/60'
                      : 'bg-gradient-to-r from-[#F0973C] to-[#d67e2a] text-white shadow-lg shadow-[#F0973C]/40 hover:shadow-[#F0973C]/60'
                    }`}
                >
                  {miningActive ? '⚡ MINERÍA ACTIVA' : '⛏️ ACTIVAR MINERÍA'}
                </button>
                <button
                  onClick={() => {
                    setCurrentEarnings(0);
                    setElapsedSeconds(0);
                    setMiningActive(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-all"
                >
                  Reiniciar
                </button>
              </div>

              {/* Barra de progreso animada */}
              <div className="relative h-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full overflow-hidden border border-white/10">
                {/* Progreso */}
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F0973C] to-[#69AC95] transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>

                {/* Pico animado - solo visible cuando está activo */}
                {miningActive && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-100"
                    style={{ left: `${Math.min(progressPercentage, 100)}%` }}
                  >
                    <div className="relative -ml-6 animate-bounce">
                      <Pickaxe
                        className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]"
                        style={{
                          transform: `rotate(${Math.sin(pickaxePosition / 10) * 30 - 45}deg)`,
                          filter: 'drop-shadow(0 0 6px rgba(250, 204, 21, 0.6))'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Porcentaje */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white drop-shadow-lg">
                    {Math.min(progressPercentage, 100).toFixed(4)}%
                  </span>
                </div>
              </div>

              {/* Estado de minería */}
              <div className="mt-4 p-3 rounded-lg bg-black/30 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50">Estado:</span>
                  <span className={`text-sm font-bold ${miningActive ? 'text-[#69AC95]' : 'text-[#F0973C]'}`}>
                    {miningActive ? '🟢 Minería Activa' : '🟠 Inactiva'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-white/50">Ganancia/segundo:</span>
                  <span className="text-sm font-bold text-[#69AC95]">
                    ${calculations.profitPerSecond.toFixed(8)} USDT
                  </span>
                </div>
              </div>

              {/* Detalles adicionales */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                  <p className="text-xs text-white/50 mb-1">Inversión Inicial</p>
                  <p className="text-xl font-bold text-white">
                    ${selectedLicense.precio.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                  <p className="text-xs text-white/50 mb-1">Retorno Total</p>
                  <p className="text-xl font-bold text-[#69AC95]">
                    ${calculations.totalAmount}
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet de Minería */}
            <div className="p-6 rounded-2xl border border-[#69AC95]/20 bg-gradient-to-br from-[#69AC95]/10 to-[#F0973C]/10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#69AC95]/20">
                    <Wallet className="w-6 h-6 text-[#69AC95]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Wallet de Minería</h3>
                    <p className="text-sm text-white/50">Ganancias acumuladas de minería</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTransferModal(true)}
                  disabled={miningWalletBalance <= 0}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                    miningWalletBalance > 0
                      ? 'bg-gradient-to-r from-[#F0973C] to-[#d67e2a] text-white shadow-lg shadow-[#F0973C]/40 hover:shadow-[#F0973C]/60 hover:scale-105'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ArrowRightLeft className="w-5 h-5" />
                  Transferir a Staking
                </button>
              </div>

              {/* Balance de la wallet */}
              <div className="p-8 rounded-xl bg-gradient-to-br from-[#69AC95]/20 to-[#F0973C]/20 border border-[#69AC95]/30 text-center">
                <p className="text-sm text-white/60 mb-2">Balance Disponible</p>
                <p className="text-5xl font-bold text-[#69AC95] mb-1">
                  ${miningWalletBalance.toFixed(2)}
                </p>
                <p className="text-lg text-white/50">USDT</p>
              </div>

              {/* Información adicional */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                  <p className="text-xs text-white/50 mb-1">Ganancias Actuales</p>
                  <p className="text-xl font-bold text-[#F0973C]">
                    ${currentEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                  <p className="text-xs text-white/50 mb-1">Total Esperado</p>
                  <p className="text-xl font-bold text-[#69AC95]">
                    ${calculations.totalProfit}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-lg bg-[#69AC95]/10 border border-[#69AC95]/20">
                <p className="text-xs text-white/60 leading-relaxed">
                  💡 <span className="font-semibold">Nota:</span> Las ganancias se depositarán automáticamente en tu Wallet de Minería al finalizar el plazo seleccionado. Puedes transferirlas a tu Wallet Staking para generar intereses adicionales.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal de Transferencia a Wallet Staking */}
        {showTransferModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4 p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#69AC95]/30 shadow-2xl shadow-[#69AC95]/20">
              {/* Botón cerrar */}
              <button
                onClick={() => {
                  setShowTransferModal(false);
                  setTransferAmount('');
                }}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>

              {/* Contenido del modal */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-[#69AC95]/10 border border-[#69AC95]/30">
                    <ArrowRightLeft className="w-12 h-12 text-[#69AC95]" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-2 text-white">
                  Transferir a Wallet Staking
                </h2>
                <p className="text-white/60 mb-6">
                  Mueve tus ganancias de minería a staking para generar más rendimientos
                </p>

                {/* Balance disponible */}
                <div className="p-4 rounded-xl bg-black/40 border border-[#69AC95]/20 mb-6">
                  <p className="text-sm text-white/60 mb-1">Balance Disponible en Wallet Minería</p>
                  <p className="text-3xl font-bold text-[#69AC95]">
                    ${miningWalletBalance.toFixed(2)} USDT
                  </p>
                </div>

                {/* Input de monto */}
                <div className="mb-6">
                  <label className="block text-left text-sm font-semibold text-white/80 mb-2">
                    Monto a Transferir (USDT)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      max={miningWalletBalance}
                      className="w-full px-4 py-3 rounded-lg bg-black/40 border border-[#69AC95]/30 text-white text-lg font-semibold focus:border-[#69AC95] focus:outline-none focus:ring-2 focus:ring-[#69AC95]/20 transition-all"
                    />
                    <button
                      onClick={() => setTransferAmount(miningWalletBalance.toString())}
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded bg-[#69AC95]/20 text-[#69AC95] text-sm font-semibold hover:bg-[#69AC95]/30 transition-colors"
                    >
                      Máximo
                    </button>
                  </div>
                </div>

                {/* Información de la transferencia */}
                <div className="mb-6 p-4 rounded-lg bg-[#F0973C]/10 border border-[#F0973C]/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/60">Monto a transferir</span>
                    <span className="font-semibold text-white">
                      ${parseFloat(transferAmount || '0').toFixed(2)} USDT
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/60">Comisión</span>
                    <span className="font-semibold text-white">$0.00 USDT</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">Balance restante</span>
                    <span className="text-xl font-bold text-[#69AC95]">
                      ${(miningWalletBalance - parseFloat(transferAmount || '0')).toFixed(2)} USDT
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowTransferModal(false);
                      setTransferAmount('');
                    }}
                    className="flex-1 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/10"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleTransferToStaking}
                    disabled={!transferAmount || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > miningWalletBalance}
                    className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
                      transferAmount && parseFloat(transferAmount) > 0 && parseFloat(transferAmount) <= miningWalletBalance
                        ? 'bg-gradient-to-r from-[#69AC95] to-[#4d8a73] text-white shadow-lg shadow-[#69AC95]/40 hover:shadow-[#69AC95]/60'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Transferir
                  </button>
                </div>

                <p className="mt-4 text-xs text-white/40">
                  La transferencia se realizará de forma instantánea
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MiningPage;