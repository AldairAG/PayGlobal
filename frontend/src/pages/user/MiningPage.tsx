/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, DollarSign, Calendar, Pickaxe, Info, ShoppingCart, X, Wallet, ArrowRightLeft, Zap, Circle, Lightbulb, CheckCircle2, Clock, Hash } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getLicenseImage } from '../../helpers/imgHelpers';
import PurchaseLicenseModal from '../../components/modal/PurchaseLicenseModal';
import { EstadoLicenciaMineria, TipoSolicitud, TipoWallets } from '../../type/enum';
import { LICENCIAS, type LicenciaMineria } from '../../type/entityTypes';
import { useMineria } from '../../hooks/useMineria';
import type { RootState } from '../../store';

// Configuración de tasas de interés compuesto (rendimiento diario)
const INTEREST_RATES = {
  P50: { name: "P50", value: 50, rendimientoDiario: 0.01 },
  P100: { name: "P100", value: 100, rendimientoDiario: 0.01 },
  P250: { name: "P250", value: 250, rendimientoDiario: 0.01 },
  P500: { name: "P500", value: 500, rendimientoDiario: 0.01 },
  P1000: { name: "P1000", value: 1000, rendimientoDiario: 0.015 },
  P2500: { name: "P2500", value: 2500, rendimientoDiario: 0.015 },
  P5000: { name: "P5000", value: 5000, rendimientoDiario: 0.02 },
  P7500: { name: "P7500", value: 7500, rendimientoDiario: 0.02 },
  P10000: { name: "P10000", value: 10000, rendimientoDiario: 0.025 },
  P15000: { name: "P15000", value: 15000, rendimientoDiario: 0.025 },
  P25000: { name: "P25000", value: 25000, rendimientoDiario: 0.03 },
  P50000: { name: "P50000", value: 50000, rendimientoDiario: 0.03 },
};

// Opciones de periodo permitidas
const PERIOD_OPTIONS = [18, 24, 36, 48, 60];

// Función determinística para generar ID público desde ID interno
const generatePublicId = (internalId: number): number => {
  // Usar un algoritmo de hash simple pero efectivo
  // Combinar múltiples operaciones para crear un patrón no secuencial
  let hash = internalId;
  
  // Primera mezcla: multiplicar por un primo grande y usar XOR
  hash = ((hash * 2654435761) ^ (hash >> 16)) & 0xFFFFFFFF;
  
  // Segunda mezcla: rotar bits y multiplicar
  hash = ((hash << 13) | (hash >>> 19)) * 0x5bd1e995;
  
  // Tercera mezcla: XOR con desplazamiento
  hash ^= hash >> 15;
  
  // Asegurar que el resultado sea un número de 4 dígitos mínimo
  return Math.abs(hash % 90000) + 10000;
};

// Función para calcular días restantes
const calculateDaysRemaining = (expirationDate: Date): number => {
  const now = new Date();
  const expiration = new Date(expirationDate);
  const diffTime = expiration.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Función para formatear fecha
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Función para obtener el color del estado
const getStatusColor = (estado: EstadoLicenciaMineria, activa: boolean) => {
  if (activa) return { bg: 'bg-[#69AC95]/20', border: 'border-[#69AC95]/50', text: 'text-[#69AC95]' };
  if (estado === EstadoLicenciaMineria.ACTIVA) return { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400' };
  if (estado === EstadoLicenciaMineria.INACTIVA) return { bg: 'bg-gray-500/20', border: 'border-gray-500/50', text: 'text-gray-400' };
  return { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400' };
};

// Función para obtener el texto del estado
const getStatusText = (estado: EstadoLicenciaMineria, activa: boolean) => {
  if (activa) return 'Minando';
  if (estado === EstadoLicenciaMineria.ACTIVA) return 'Activa';
  if (estado === EstadoLicenciaMineria.INACTIVA) return 'Inactiva';
  return 'Vencida';
};

const MiningPage = () => {

  //Hooks personalizados para manejar la lógica de minería y licencias
  const { licenciasUsuario, loadingLicenciasUsuario, errorLicenciasUsuario, obtenerLicenciasUsuario,
    iniciarMineria, loadingIniciarMineria, errorIniciarMineria,
    retirarGanancias, loadingRetirarGanancias, errorRetirarGanancias
  } = useMineria();

  const usuario = useSelector((state: RootState) => state.usuario.usuario);

  const licenciaPrincipal: LicenciaMineria = {
    id: 0,
    activa: false,
    fechaInicio: new Date(),
    fechaExpiracion: new Date(),
    estado: EstadoLicenciaMineria.INACTIVA,
    gananciaActual: 0,
    licencia: usuario?.licencia || { id: 0, nombre: '', precio: 0, limite: 0, activo: false, fechaCompra: new Date(), saldoAcumulado: 0 },
    tasaMineria: 0,
    plazo: 0
  };

  // Estados
  const [selectedPeriod, setSelectedPeriod] = useState(18); // meses
  const [pickaxePosition, setPickaxePosition] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showPurchaseLicenseModal, setShowPurchaseLicenseModal] = useState(false);
  const [licenseToPurchase, setLicenseToPurchase] = useState<{ name: string; value: number } | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showActivateMiningModal, setShowActivateMiningModal] = useState(false);

  const [selectedLicense, setSelectedLicense] = useState(licenciaPrincipal);

  // Calcular interés compuesto
  const calculations = useMemo(() => {
    if (!selectedLicense?.licencia?.precio) {
      return {
        totalAmount: '0.00',
        totalProfit: '0.00',
        dailyProfit: '0.00',
        monthlyProfit: '0.00',
        annualProfit: '0.00',
        profitPerSecond: 0,
        totalDays: 0,
        totalSeconds: 0,
      };
    }

    const totalDays = selectedPeriod * 30;

    const principal = selectedLicense.licencia.precio;
    //const rate = selectedLicense.id==usuario?.licencia.id ? INTEREST_RATES[selectedLicense.licencia.nombre as keyof typeof INTEREST_RATES]?.rendimientoDiario || 0.05 : 0.0077;
    const rate = INTEREST_RATES[selectedLicense.licencia.nombre as keyof typeof INTEREST_RATES]?.rendimientoDiario || 0.05;

    const rendimientoDiario = rate * principal; 

    // Fórmula: A = P(1 + r)^t
    //const totalAmount = principal * Math.pow(1 + rate, totalDays);
    const totalAmount = rendimientoDiario * totalDays + principal;
    const totalProfit = totalAmount - principal;

    const totalSeconds = totalDays * 86400; // Segundos totales
    const dailyProfit = rendimientoDiario; // Ganancia diaria
    const monthlyProfit = rendimientoDiario * 30; // Ganancia mensual
    //const annualProfit = selectedPeriod >= 12 ? totalProfit : (totalProfit / selectedPeriod) * 12;
    const annualProfit = monthlyProfit * 12; // Ganancia anual basada en la ganancia mensual
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

  const handleIniciarMineria = async () => {
    if (!selectedLicense) {
      toast.error('Debes seleccionar una licencia antes de iniciar la minería.');
      return;
    }
    try {
      await iniciarMineria(selectedLicense.id, selectedPeriod);
      toast.success('Minería iniciada exitosamente!');
      setShowActivateMiningModal(false);
    } catch {
      toast.error(errorIniciarMineria || 'Error al iniciar la minería');
    }
  };

  const handleOpenActivateMiningModal = () => {
    if (!selectedLicense) {
      toast.error('Debes seleccionar una licencia antes de iniciar la minería.');
      return;
    }
    setShowActivateMiningModal(true);
  };

  // Reiniciar cuando cambien los parámetros
  useEffect(() => {
    setSelectedLicense(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        gananciaActual: 0
      };
    });
  }, [selectedLicense?.id, selectedPeriod]);

  // Animación de ganancias incrementales - cada segundo en tiempo real
  useEffect(() => {
    // Solo incrementar si la minería está activa
    if (!selectedLicense?.activa) {
      return;
    }

    const interval = setInterval(() => {
      // Incrementar gananciaActual de la licencia seleccionada
      setSelectedLicense(prev => {
        if (!prev) return prev;

        const newGanancia = prev.gananciaActual + calculations.profitPerSecond;
        const maxProfit = parseFloat(calculations.totalProfit);

        return {
          ...prev,
          gananciaActual: newGanancia >= maxProfit ? maxProfit : newGanancia
        };
      });
    }, 1000); // Cada segundo real

    return () => clearInterval(interval);
  }, [calculations, selectedLicense?.activa]);

  // Animación del pico
  useEffect(() => {
    const interval = setInterval(() => {
      setPickaxePosition(prev => (prev + 0.5) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Función para obtener licencias del usuario
  useEffect(() => {
    obtenerLicenciasUsuario();
  }, []);

  useEffect(() => {
    if (!licenciasUsuario?.length) {
      return;
    }

    setSelectedLicense((prevSelected) => {
      if (prevSelected && licenciasUsuario.some((licencia) => licencia.id === prevSelected.id)) {
        return prevSelected;
      }

      const licenciaUsuario = usuario?.licencia;
      const licenciaSeleccionada = licenciaUsuario
        ? licenciasUsuario.find((licencia) => licencia.licencia.id === licenciaUsuario.id)
        ?? licenciasUsuario.find((licencia) => licencia.licencia.nombre === licenciaUsuario.nombre)
        ?? licenciasUsuario.find((licencia) => licencia.licencia.precio === licenciaUsuario.precio)
        : null;

      return licenciaSeleccionada ?? licenciasUsuario[0] ?? null;
    });
  }, [licenciasUsuario, usuario]);

  // Progreso actual (0-100%)
  const progressPercentage = (selectedLicense.gananciaActual / parseFloat(calculations.totalProfit)) * 100;

  // Función para abrir el modal de compra
  const handleOpenPurchaseModal = () => {
    setShowPurchaseModal(true);
  };

  // Función para seleccionar licencia y abrir modal de compra real
  const handleSelectPurchaseLicense = (licenseName: string, licenseValue: number) => {
    setLicenseToPurchase({ name: licenseName, value: licenseValue });
    setShowPurchaseModal(false);
    setShowPurchaseLicenseModal(true);
  };

  const handleClosePurchaseLicenseModal = () => {
    setShowPurchaseLicenseModal(false);
    setLicenseToPurchase(null);
  };

  // Función para transferir a wallet staking
  const handleTransferToStaking = async () => {
    try {
      await retirarGanancias();
      toast.success('¡Ganancias transferidas exitosamente a tu wallet de staking!');
      setShowTransferModal(false);
      // Recargar licencias para actualizar el saldo
      await obtenerLicenciasUsuario();
    } catch {
      toast.error(errorRetirarGanancias || 'Error al transferir las ganancias');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white px-4 py-8">
      <div className="container mx-auto max-w-7xl space-y-8">

        {/* Modal de selección de licencia para compra */}
        {showPurchaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl mx-4 p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#F0973C]/30 shadow-2xl shadow-[#F0973C]/20 max-h-[85vh] overflow-y-auto">
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
                  Selecciona una Licencia
                </h2>
                <p className="text-white/60 mb-6">
                  Primero elige una licencia existente para continuar con el proceso de compra
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {Object.entries(LICENCIAS).map(([key, license]) => (
                    <button
                      key={key}
                      onClick={() => handleSelectPurchaseLicense(license.name, license.value)}
                      className="text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:border-[#F0973C]/50 hover:bg-[#F0973C]/10 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={getLicenseImage(license.name)}
                          alt={license.name}
                          className="w-12 h-12 object-contain"
                        />
                        <div>
                          <h3 className="text-lg font-bold text-white">{license.name}</h3>
                          <p className="text-xs text-white/60">
                            {(INTEREST_RATES[license.name as keyof typeof INTEREST_RATES]?.rendimientoDiario * 100 || 0).toFixed(1)}% diario
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/50">Precio</span>
                        <span className="text-lg font-bold text-[#69AC95]">
                          ${license.value.toLocaleString()} USDT
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/10"
                >
                  Cancelar
                </button>

                <p className="mt-4 text-xs text-white/40">
                  Al continuar, se abrirá el modal de compra para la licencia seleccionada
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal de compra real */}
        {licenseToPurchase && (
          <PurchaseLicenseModal
            open={showPurchaseLicenseModal}
            onClose={handleClosePurchaseLicenseModal}
            licenseName={licenseToPurchase.name}
            licenseValue={licenseToPurchase.value}
            purchaseType={TipoSolicitud.COMPRA_LICENCIA_MINERIA}
          />
        )}

        {/* Sección explicativa superior */}
        <div className="p-6 rounded-2xl border border-[#F0973C]/20 bg-gradient-to-br from-[#F0973C]/10 to-[#69AC95]/10 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#F0973C]/20">
              <Info className="w-6 h-6 text-[#F0973C]" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-[#F0973C]">
                Minería BTC con Licencias
              </h2>
              <p className="text-white/70 leading-relaxed">
                Invierte con tu licencia y observa cómo crece tu capital mediante la mineria BTC.
                Selecciona el plazo de inversión y la licencia deseada para calcular tus ganancias diarias,
                mensuales y anuales. Maximiza tus retornos a largo plazo.
              </p>
            </div>
          </div>
        </div>

        {loadingLicenciasUsuario ? (
          <div className="text-center py-10">
            <p className="text-white/60">Cargando tus licencias...</p>
          </div>
        ) : errorLicenciasUsuario ? (
          <div className="text-center py-10">
            <p className="text-white/60">Error al cargar tus licencias.</p>
          </div>
        ) : licenciasUsuario?.length === 0 ? (
          <div className="text-center py-10">
            {/* Panel izquierdo: Licencias */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#F0973C]">
                  Selecciona tu Licencia
                </h3>
                <button
                  onClick={handleOpenPurchaseModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#F0973C] to-[#d67e2a] text-white font-semibold text-sm shadow-lg shadow-[#F0973C]/30 hover:shadow-[#F0973C]/50 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Comprar Más
                </button>
              </div>
            </div>
            <p className="text-white/60">No tienes licencias de minería. Compra una para comenzar a minar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

            {/* Panel izquierdo: Licencias */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#F0973C]">
                  Selecciona tu Licencia
                </h3>
                <button
                  onClick={handleOpenPurchaseModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#F0973C] to-[#d67e2a] text-white font-semibold text-sm shadow-lg shadow-[#F0973C]/30 hover:shadow-[#F0973C]/50 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Comprar Más
                </button>
              </div>

              {licenciasUsuario?.map((license, index) => {
                const publicId = generatePublicId(license.id);
                const daysRemaining = calculateDaysRemaining(license.fechaExpiracion);
                const statusColors = getStatusColor(license.estado, license.activa);
                const statusText = getStatusText(license.estado, license.activa);
                const isSelected = selectedLicense && selectedLicense?.licencia?.id === license.licencia.id;

                return (
                  <div
                    key={license.id}
                    onClick={() => setSelectedLicense(license)}
                    className={`group relative cursor-pointer rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? 'border-[#F0973C] bg-gradient-to-br from-[#F0973C]/15 to-[#F0973C]/5 scale-105 shadow-lg shadow-[#F0973C]/20'
                        : !selectedLicense && index === 0
                          ? 'border-[#F0973C]/60 bg-gradient-to-br from-[#F0973C]/10 to-[#F0973C]/5 hover:border-[#F0973C] hover:scale-102'
                          : 'border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:border-[#F0973C]/50 hover:from-[#F0973C]/5'
                      }`}
                  >
                    {/* Badge de destacado para la primera licencia */}
                    {index === 0 && (
                      <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#F0973C] to-[#d67e2a] text-xs font-bold text-white shadow-lg z-10">
                        Principal
                      </div>
                    )}

                    {/* Header con imagen y título */}
                    <div className="p-4 bg-gradient-to-r from-black/20 to-transparent border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={getLicenseImage(license.licencia.nombre || "")}
                            alt={license.licencia.nombre || "licencia"}
                            className="w-14 h-14 object-contain"
                          />
                          {license.activa && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#69AC95] rounded-full border-2 border-black animate-pulse" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-lg">{license.licencia.nombre}</h4>
                          <p className="text-sm text-[#69AC95] font-semibold">
                            ${license.licencia.precio.toLocaleString()} USDT
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-6 h-6 text-[#F0973C] animate-pulse" />
                        )}
                      </div>
                    </div>

                    {/* Body con información detallada */}
                    <div className="p-4 space-y-3">
                      {/* Estado y rendimiento */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded-full ${statusColors.bg} border ${statusColors.border}`}>
                            <span className={`text-xs font-bold ${statusColors.text} flex items-center gap-1`}>
                              <Circle className="w-2 h-2 fill-current" />
                              {statusText}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white/50">Rendimiento</p>
                          <p className="text-sm font-bold text-[#F0973C]">
                            {(INTEREST_RATES[license.licencia.nombre as keyof typeof INTEREST_RATES]?.rendimientoDiario * 100).toFixed(1)}% diario
                          </p>
                        </div>
                      </div>

                      {/* ID de licencia */}
                      <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-black/30">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-white/40" />
                          <span className="text-xs text-white/50">ID Licencia</span>
                        </div>
                        <span className="text-sm font-mono font-bold text-white/80">
                          {publicId}
                        </span>
                      </div>

                      {/* Fechas */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-black/20 border border-white/5">
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3 text-white/40" />
                            <p className="text-xs text-white/50">Compra</p>
                          </div>
                          <p className="text-xs font-semibold text-white/80">
                            {formatDate(license.fechaInicio)}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-black/20 border border-white/5">
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3 text-white/40" />
                            <p className="text-xs text-white/50">Vencimiento</p>
                          </div>
                          <p className="text-xs font-semibold text-white/80">
                            {formatDate(license.fechaExpiracion)}
                          </p>
                        </div>
                      </div>

                      {/* Días restantes */}
                      {daysRemaining > 0 && (
                        <div className={`flex items-center justify-between p-3 rounded-lg ${
                          daysRemaining <= 7 
                            ? 'bg-red-500/10 border border-red-500/30' 
                            : daysRemaining <= 30 
                              ? 'bg-yellow-500/10 border border-yellow-500/30'
                              : 'bg-[#69AC95]/10 border border-[#69AC95]/30'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${
                              daysRemaining <= 7 
                                ? 'text-red-400' 
                                : daysRemaining <= 30 
                                  ? 'text-yellow-400'
                                  : 'text-[#69AC95]'
                            }`} />
                            <span className="text-xs text-white/70">Tiempo restante</span>
                          </div>
                          <span className={`text-sm font-bold ${
                            daysRemaining <= 7 
                              ? 'text-red-400' 
                              : daysRemaining <= 30 
                                ? 'text-yellow-400'
                                : 'text-[#69AC95]'
                          }`}>
                            {daysRemaining} {daysRemaining === 1 ? 'día' : 'días'}
                          </span>
                        </div>
                      )}

                      {/* Plazo de la licencia */}
                      {license.plazo > 0 && (
                        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#F0973C]/5 border border-[#F0973C]/20">
                          <span className="text-xs text-white/60">Plazo contratado</span>
                          <span className="text-sm font-bold text-[#F0973C]">
                            {license.plazo} {license.plazo === 1 ? 'mes' : 'meses'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer con indicador de selección */}
                    {isSelected && (
                      <div className="px-4 pb-3">
                        <div className="w-full h-1 rounded-full bg-gradient-to-r from-[#F0973C] to-[#d67e2a] animate-pulse" />
                      </div>
                    )}
                  </div>
                );
              })}
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
                    min="0"
                    max="4"
                    step="1"
                    value={PERIOD_OPTIONS.indexOf(selectedPeriod)}
                    onChange={(e) => setSelectedPeriod(PERIOD_OPTIONS[parseInt(e.target.value)])}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #F0973C 0%, #F0973C ${(PERIOD_OPTIONS.indexOf(selectedPeriod) / 4) * 100}%, #1f2937 ${(PERIOD_OPTIONS.indexOf(selectedPeriod) / 4) * 100}%, #1f2937 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-white/50 mt-2">
                    <span>18 meses</span>
                    <span>24 meses</span>
                    <span>36 meses</span>
                    <span>48 meses</span>
                    <span>60 meses</span>
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
              <div className="p-6 rounded-2xl border border-[#F0973C]/20 bg-linear-to-br from-[#F0973C]/5 to-[#69AC95]/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    Progreso de Minería
                    <span className="text-xs text-[#69AC95] animate-pulse">
                      ● En vivo
                    </span>
                  </h3>
                  <div className="text-right">
                    <div className="text-sm text-white/60">
                      ${selectedLicense.gananciaActual.toFixed(6)} / ${calculations.totalProfit}
                    </div>
                  </div>
                </div>

                {/* Botón de activar minería */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={handleOpenActivateMiningModal}
                    disabled={selectedLicense.activa || loadingIniciarMineria}
                    className={`flex items-center justify-center gap-2 flex-1 px-6 py-3 rounded-lg font-bold text-lg transition-all ${selectedLicense.activa
                      ? 'bg-linear-to-r from-[#69AC95] to-[#4d8a73] text-white shadow-lg shadow-[#69AC95]/40 hover:shadow-[#69AC95]/60'
                      : 'bg-linear-to-r from-[#F0973C] to-[#d67e2a] text-white shadow-lg shadow-[#F0973C]/40 hover:shadow-[#F0973C]/60 hover:scale-105'
                      }`}
                  >
                    {selectedLicense.activa ? (
                      <>
                        <Zap className="w-5 h-5" />
                        MINERÍA ACTIVA
                      </>
                    ) : (
                      <>
                        <Pickaxe className="w-5 h-5" />
                        ACTIVAR MINERÍA
                      </>
                    )}
                  </button>
                </div>

                {/* Barra de progreso animada */}
                <div className="relative h-12 bg-linear-to-r from-gray-800 to-gray-900 rounded-full overflow-hidden border border-white/10">
                  {/* Progreso */}
                  <div
                    className="absolute top-0 left-0 h-full bg-linear-to-r from-[#F0973C] to-[#69AC95] transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </div>

                  {/* Pico animado - solo visible cuando está activo */}
                  {selectedLicense.activa && (
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
                    <span className={`flex items-center gap-2 text-sm font-bold ${selectedLicense.activa ? 'text-[#69AC95]' : 'text-[#F0973C]'}`}>
                      {selectedLicense.activa ? (
                        <>
                          <Circle className="w-3 h-3 fill-[#69AC95]" />
                          Minería Activa
                        </>
                      ) : (
                        <>
                          <Circle className="w-3 h-3 fill-[#F0973C]" />
                          Inactiva
                        </>
                      )}
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
                      ${selectedLicense?.licencia?.precio.toLocaleString()}
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
                    disabled={(usuario?.wallets?.find(wallet => wallet.tipo === TipoWallets.WALLET_MINERIA)?.saldo || 0) <= 0}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${(usuario?.wallets?.find(wallet => wallet.tipo === TipoWallets.WALLET_MINERIA)?.saldo || 0) > 0
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
                    ${usuario?.wallets?.find(wallet => wallet.tipo === TipoWallets.WALLET_MINERIA)?.saldo.toLocaleString() || "0.00"}
                  </p>
                  <p className="text-lg text-white/50">USDT</p>
                </div>

                {/* Información adicional */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                    <p className="text-xs text-white/50 mb-1">Ganancias Actuales</p>
                    <p className="text-xl font-bold text-[#F0973C]">
                      ${usuario?.wallets?.find(wallet => wallet.tipo === TipoWallets.WALLET_MINERIA)?.saldo.toLocaleString() || "0.00"}
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
                  <p className="flex items-start gap-2 text-xs text-white/60 leading-relaxed">
                    <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#F0973C]" />
                    <span>
                      <span className="font-semibold">Nota:</span> Las ganancias se depositarán automáticamente en tu Wallet de Minería al finalizar el plazo seleccionado. Puedes transferirlas a tu Wallet Staking para generar intereses adicionales.
                    </span>
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}



        {/* Modal de Confirmación de Activar Minería */}
        {showActivateMiningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4 p-6 rounded-2xl bg-linear-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#F0973C]/30 shadow-2xl shadow-[#F0973C]/20">
              <button
                onClick={() => setShowActivateMiningModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-[#F0973C]/10 border border-[#F0973C]/30">
                    <Pickaxe className="w-12 h-12 text-[#F0973C]" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-2 text-white">
                  Confirmar Activación de Minería
                </h2>
                <p className="text-white/60 mb-6">
                  ¿Estás seguro de que deseas activar la minería con esta licencia?
                </p>

                {/* Detalles de la licencia */}
                <div className="p-4 rounded-xl bg-[#F0973C]/5 border border-[#F0973C]/20 mb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Licencia</span>
                    <span className="text-base font-bold text-white">
                      {selectedLicense?.licencia?.nombre}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Inversión</span>
                    <span className="text-base font-bold text-[#69AC95]">
                      ${selectedLicense?.licencia?.precio.toLocaleString()} USDT
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Plazo</span>
                    <span className="text-base font-bold text-[#F0973C]">
                      {selectedPeriod} {selectedPeriod === 1 ? 'mes' : 'meses'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Rendimiento diario</span>
                    <span className="text-base font-bold text-[#F0973C]">
                      {(INTEREST_RATES[selectedLicense?.licencia?.nombre as keyof typeof INTEREST_RATES]?.rendimientoDiario * 100 || 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Ganancia estimada</span>
                    <span className="text-lg font-bold text-[#69AC95]">
                      ${calculations.totalProfit} USDT
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowActivateMiningModal(false)}
                    disabled={loadingIniciarMineria}
                    className="flex-1 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleIniciarMineria}
                    disabled={loadingIniciarMineria}
                    className="flex-1 px-6 py-3 rounded-lg bg-linear-to-r from-[#F0973C] to-[#d67e2a] text-white font-semibold shadow-lg shadow-[#F0973C]/30 hover:shadow-[#F0973C]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loadingIniciarMineria ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Activando...
                      </>
                    ) : (
                      <>
                        <Pickaxe className="w-4 h-4" />
                        Confirmar Activación
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-4 text-xs text-white/40">
                  La minería comenzará inmediatamente y las ganancias se calcularán en tiempo real
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Transferencia a Wallet Staking */}
        {showTransferModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4 p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#69AC95]/30 shadow-2xl shadow-[#69AC95]/20">
              <button
                onClick={() => setShowTransferModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-[#69AC95]/10 border border-[#69AC95]/30">
                    <ArrowRightLeft className="w-12 h-12 text-[#69AC95]" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-2 text-white">
                  Confirmar Transferencia
                </h2>
                <p className="text-white/60 mb-6">
                  Todas tus ganancias de minería serán transferidas a tu wallet de staking
                </p>

                <div className="p-4 rounded-xl bg-[#69AC95]/5 border border-[#69AC95]/20 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Saldo a Transferir</span>
                    <span className="text-2xl font-bold text-[#69AC95]">
                      ${usuario?.wallets.find(wallet => wallet.tipo === "WALLET_MINERIA")?.saldo || '0.00'} USDT
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTransferModal(false)}
                    disabled={loadingRetirarGanancias}
                    className="flex-1 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleTransferToStaking}
                    disabled={loadingRetirarGanancias || !selectedLicense?.gananciaActual || selectedLicense.gananciaActual <= 0}
                    className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[#69AC95] to-[#4a8c75] text-white font-semibold shadow-lg shadow-[#69AC95]/30 hover:shadow-[#69AC95]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loadingRetirarGanancias ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Procesando...
                      </>
                    ) : (
                      'Confirmar Transferencia'
                    )}
                  </button>
                </div>

                <p className="mt-4 text-xs text-white/40">
                  La transferencia se realizará de manera inmediata y el saldo aparecerá en tu wallet de staking
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div >
  )
}


export default MiningPage;