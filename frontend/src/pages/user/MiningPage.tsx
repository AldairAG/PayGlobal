import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, DollarSign, Calendar, Pickaxe, Info } from 'lucide-react';
import { getLicenseImage } from '../../helpers/imgHelpers';

// Configuración de tasas de interés compuesto (ejemplo)
const INTEREST_RATES = {
  'Basic': 0.05,      // 5% mensual
  'Standard': 0.08,   // 8% mensual
  'Premium': 0.12,    // 12% mensual
  'Platinum': 0.15,   // 15% mensual
  'Diamond': 0.18,    // 18% mensual
  'Master': 0.22,     // 22% mensual
};

const MiningPage = () => {
  // Estados
  const [selectedPeriod, setSelectedPeriod] = useState(12); // meses
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [pickaxePosition, setPickaxePosition] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [miningActive, setMiningActive] = useState(false);

  // Licencias disponibles (simuladas basadas en el patrón de la app)
  const licenses = [
    { name: 'Basic', value: 100, color: '#4B5563' },
    { name: 'Standard', value: 500, color: '#3B82F6' },
    { name: 'Premium', value: 1000, color: '#8B5CF6' },
    { name: 'Platinum', value: 2500, color: '#F59E0B' },
    { name: 'Diamond', value: 5000, color: '#10B981' },
    { name: 'Master', value: 10000, color: '#EF4444' },
  ];

  const [selectedLicense, setSelectedLicense] = useState(licenses[0]);

  // Calcular interés compuesto
  const calculations = useMemo(() => {
    const principal = selectedLicense.value;
    const rate = INTEREST_RATES[selectedLicense.name as keyof typeof INTEREST_RATES] || 0.05;
    
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

  return (
    <div className="min-h-screen bg-[#000000] text-white px-4 py-8">
      <div className="container mx-auto max-w-7xl space-y-8">
        
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
            <h3 className="text-lg font-semibold text-[#F0973C] mb-4">
              Selecciona tu Licencia
            </h3>
            
            {licenses.map((license) => (
              <div
                key={license.name}
                onClick={() => setSelectedLicense(license)}
                className={`group cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                  selectedLicense.name === license.name
                    ? 'border-[#F0973C] bg-[#F0973C]/10 scale-105 shadow-lg shadow-[#F0973C]/20'
                    : 'border-white/10 bg-white/5 hover:border-[#F0973C]/50 hover:bg-[#F0973C]/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={getLicenseImage(license.name)}
                    alt={license.name}
                    className="w-16 h-16 object-contain"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{license.name}</h4>
                    <p className="text-sm text-[#69AC95]">
                      ${license.value.toLocaleString()} USDT
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      {(INTEREST_RATES[license.name as keyof typeof INTEREST_RATES] * 100).toFixed(0)}% mensual
                    </p>
                  </div>
                  {selectedLicense.name === license.name && (
                    <div className="w-3 h-3 rounded-full bg-[#F0973C] animate-pulse" />
                  )}
                </div>
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
                  className={`flex-1 px-6 py-3 rounded-lg font-bold text-lg transition-all ${
                    miningActive 
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
                    ${selectedLicense.value.toLocaleString()}
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

          </div>
        </div>

      </div>
    </div>
  );
};

export default MiningPage;