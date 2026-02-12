import { type Solicitud } from "../../type/entityTypes";
import { EstadoOperacion, TipoSolicitud, TipoCrypto } from "../../type/enum";
import { Calendar, DollarSign, Hash, Wallet, FileText, CheckCircle, XCircle, Clock, AlertCircle, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";

interface SolicitudItemProps {
    solicitud: Solicitud;
    isAdmin?: boolean;
    isLoading?: boolean;
    onAprobar?: (solicitudId: number) => void;
    onRechazar?: (solicitudId: number) => void;
}

const SolicitudItem = ({ solicitud, isAdmin = false, isLoading = false, onAprobar, onRechazar }: SolicitudItemProps) => {
    
    const handleAprobar = () => {
        if (onAprobar) {
            onAprobar(solicitud.id);
        }
    };

    const handleRechazar = () => {
        if (onRechazar) {
            onRechazar(solicitud.id);
        }
    };
    
    // Función para obtener el color del badge según el estado
    const getEstadoColor = (estado: EstadoOperacion) => {
        switch (estado) {
            case EstadoOperacion.COMPLETADA:
                return "bg-green-100 text-green-800 border-green-300";
            case EstadoOperacion.APROBADA:
                return "bg-blue-100 text-blue-800 border-blue-300";
            case EstadoOperacion.PENDIENTE:
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case EstadoOperacion.FALLIDA:
                return "bg-red-100 text-red-800 border-red-300";
            case EstadoOperacion.RECHAZADA:
                return "bg-gray-100 text-gray-800 border-gray-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    // Función para obtener el icono según el estado
    const getEstadoIcon = (estado: EstadoOperacion) => {
        switch (estado) {
            case EstadoOperacion.COMPLETADA:
                return <CheckCircle size={16} />;
            case EstadoOperacion.APROBADA:
                return <CheckCircle size={16} />;
            case EstadoOperacion.PENDIENTE:
                return <Clock size={16} />;
            case EstadoOperacion.FALLIDA:
                return <XCircle size={16} />;
            case EstadoOperacion.RECHAZADA:
                return <AlertCircle size={16} />;
            default:
                return <Clock size={16} />;
        }
    };

    // Función para formatear el tipo de solicitud
    const getTipoSolicitudText = (tipo: TipoSolicitud) => {
        switch (tipo) {
            case TipoSolicitud.COMPRA_LICENCIA:
                return "Compra de Licencia";
            case TipoSolicitud.SOLICITUD_RETIRO_WALLET_DIVIDENDOS:
                return "Retiro de Dividendos";
            case TipoSolicitud.SOLICITUD_RETIRO_WALLET_COMISIONES:
                return "Retiro de Comisiones";
            case TipoSolicitud.TRANFERENCIA_USUARIO:
                return "Transferencia a Usuario";
            case TipoSolicitud.PAGO_DELEGADO:
                return "Pago Delegado";
            default:
                return "N/A";
        }
    };

    // Función para formatear el estado
    const getEstadoText = (estado: EstadoOperacion) => {
        switch (estado) {
            case EstadoOperacion.COMPLETADA:
                return "Completada";
            case EstadoOperacion.APROBADA:
                return "Aprobada";
            case EstadoOperacion.PENDIENTE:
                return "Pendiente";
            case EstadoOperacion.FALLIDA:
                return "Fallida";
            case EstadoOperacion.RECHAZADA:
                return "Rechazada";
            default:
                return "N/A";
        }
    };

    // Función para formatear el tipo de crypto
    const getTipoCryptoText = (tipo: TipoCrypto) => {
        switch (tipo) {
            case TipoCrypto.BITCOIN:
                return "Bitcoin (BTC)";
            case TipoCrypto.USDT_ERC20:
                return "Tether (USDT ERC20)";
            case TipoCrypto.USDT_TRC20:
                return "Tether (USDT TRC20)";
            case TipoCrypto.SOLANA:
                return "Solana (SOL)";
            default:
                return "N/A";
        }
    };

    // Formatear fecha
    const formatearFecha = (fecha: Date) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
            {/* Header con ID, Tipo y Estado */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <Hash size={16} className="text-gray-400" />
                        <span className="text-sm font-semibold text-gray-800">{solicitud.id}</span>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-1.5">
                        <FileText size={16} className="text-[#69AC95]" />
                        <span className="text-sm font-medium text-gray-700">{getTipoSolicitudText(solicitud.tipoSolicitud)}</span>
                    </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getEstadoColor(solicitud.estado)}`}>
                    {getEstadoIcon(solicitud.estado)}
                    <span>{getEstadoText(solicitud.estado)}</span>
                </div>
            </div>

            {/* Grid con información */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                {/* Monto */}
                <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-green-600" />
                    <div>
                        <p className="text-xs text-gray-500">Monto</p>
                        <p className="text-sm font-bold text-gray-800">${solicitud.monto.toFixed(2)}</p>
                    </div>
                </div>

                {/* Tipo de Crypto */}
                <div className="flex items-center gap-2">
                    <Wallet size={16} className="text-orange-600" />
                    <div>
                        <p className="text-xs text-gray-500">Crypto</p>
                        <p className="text-sm font-semibold text-gray-800">{getTipoCryptoText(solicitud.tipoCrypto)}</p>
                    </div>
                </div>

                {/* Fecha */}
                <div className="flex items-center gap-2 col-span-2">
                    <Calendar size={16} className="text-blue-600" />
                    <div>
                        <p className="text-xs text-gray-500">Fecha</p>
                        <p className="text-sm font-semibold text-gray-800">{formatearFecha(solicitud.fecha)}</p>
                    </div>
                </div>
            </div>

            {/* Wallet Address */}
            {solicitud.walletAddress && (
                <div className="bg-gray-50 rounded p-2 mb-3">
                    <div className="flex items-center gap-2">
                        <Wallet size={14} className="text-purple-600" />
                        <p className="text-xs text-gray-600">Wallet:</p>
                        <p className="text-xs font-mono text-gray-800 truncate">{solicitud.walletAddress}</p>
                    </div>
                </div>
            )}

            {/* Descripción */}
            {solicitud.descripcion && (
                <div className="bg-gray-50 rounded p-2 mb-3">
                    <p className="text-xs text-gray-700">{solicitud.descripcion}</p>
                </div>
            )}

            {/* Botones de Admin - Solo visible para administradores */}
            {isAdmin && solicitud.estado === EstadoOperacion.PENDIENTE && (
                <div className="flex gap-2 justify-end pt-3 border-t border-gray-200">
                    <button
                        onClick={handleRechazar}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <ThumbsDown size={14} />
                        )}
                        <span>Rechazar</span>
                    </button>
                    <button
                        onClick={handleAprobar}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <ThumbsUp size={14} />
                        )}
                        <span>Aprobar</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default SolicitudItem;