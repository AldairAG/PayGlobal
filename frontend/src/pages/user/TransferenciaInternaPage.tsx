import { useState, useEffect } from 'react';
import { useUsuario } from '../../hooks/usuarioHook';
import { useTransacciones } from '../../hooks/useTransacciones';
import { TipoWallets, TipoConceptos } from '../../type/enum';
import type { Transaccion } from '../../type/entityTypes';

export const TransferenciaInternaPage = () => {
    const { 
        usuario, 
        transferenciaEntreUsuarios, 
        loadingTransferenciaEntreUsuarios, 
        errorTransferenciaEntreUsuarios 
    } = useUsuario();

    const { 
        transacciones, 
        cargarTransacciones, 
        cargando: cargandoTransacciones 
    } = useTransacciones();

    // Estados del formulario
    const [tipoWallet, setTipoWallet] = useState<TipoWallets>(TipoWallets.WALLET_DIVIDENDOS);
    const [usernameDestino, setUsernameDestino] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null);

    // Cargar transacciones al montar el componente
    useEffect(() => {
        if (usuario?.id) {
            cargarTransacciones({ 
                usuarioId: usuario.id, 
                concepto: TipoConceptos.TRANSFERENCIA_ENTRE_USUARIOS,
                page: 0,
                size: 10
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usuario?.id]);

    // Obtener saldo actual según el tipo de wallet seleccionado
    const getSaldoActual = () => {
        if (!usuario?.wallets) return 0;
        const wallet = usuario.wallets.find(w => w.tipo === tipoWallet);
        return wallet?.saldo || 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validaciones
        if (!usernameDestino.trim()) {
            setMensaje({ tipo: 'error', texto: 'Debe ingresar el username del destinatario' });
            return;
        }

        const montoNumerico = parseFloat(cantidad);
        if (isNaN(montoNumerico) || montoNumerico <= 0) {
            setMensaje({ tipo: 'error', texto: 'Debe ingresar una cantidad válida' });
            return;
        }

        if (montoNumerico > getSaldoActual()) {
            setMensaje({ tipo: 'error', texto: 'Saldo insuficiente' });
            return;
        }

        if (usernameDestino.toLowerCase() === usuario?.username.toLowerCase()) {
            setMensaje({ tipo: 'error', texto: 'No puede transferir a su propia cuenta' });
            return;
        }

        // Mostrar modal de confirmación
        setShowModal(true);
    };

    const confirmarTransferencia = async () => {
        try {
            await transferenciaEntreUsuarios(
                usernameDestino,
                parseFloat(cantidad),
                tipoWallet
            );
            
            setMensaje({ tipo: 'success', texto: 'Transferencia realizada exitosamente' });
            setShowModal(false);
            
            // Limpiar formulario
            setUsernameDestino('');
            setCantidad('');
            
            // Recargar transacciones
            if (usuario?.id) {
                cargarTransacciones({ 
                    usuarioId: usuario.id, 
                    concepto: TipoConceptos.TRANSFERENCIA_ENTRE_USUARIOS,
                    page: 0,
                    size: 10
                });
            }
        } catch {
            setMensaje({ 
                tipo: 'error', 
                texto: errorTransferenciaEntreUsuarios || 'Error al realizar la transferencia' 
            });
            setShowModal(false);
        }
    };

    const formatearFecha = (fecha: Date) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-white p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-black mb-2">
                    Transferencia Interna
                </h1>
                <p className="text-gray-600">
                    Transfiere fondos a otros usuarios de la plataforma
                </p>
            </div>

            {/* Mensaje de éxito o error */}
            {mensaje && (
                <div className={`mb-6 p-4 rounded-lg ${
                    mensaje.tipo === 'success' 
                        ? 'bg-[#69AC95] text-white' 
                        : 'bg-[#BC2020] text-white'
                }`}>
                    {mensaje.texto}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Formulario de transferencia */}
                <div className="bg-white border-2 border-[#69AC95] rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-black mb-6">
                        Nueva Transferencia
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Selector de Wallet */}
                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                Wallet a Retirar
                            </label>
                            <select
                                value={tipoWallet}
                                onChange={(e) => setTipoWallet(e.target.value as TipoWallets)}
                                className="w-full p-3 border-2 border-[#F0973C] rounded-lg focus:outline-none focus:border-[#69AC95] transition-colors"
                            >
                                <option value={TipoWallets.WALLET_DIVIDENDOS}>
                                    Dividendos (${getSaldoActual().toFixed(2)})
                                </option>
                                <option value={TipoWallets.WALLET_COMISIONES}>
                                    Comisiones (${getSaldoActual().toFixed(2)})
                                </option>
                            </select>
                            <p className="mt-2 text-sm text-gray-600">
                                Saldo disponible: <span className="font-bold text-[#69AC95]">
                                    ${getSaldoActual().toFixed(2)}
                                </span>
                            </p>
                        </div>

                        {/* Username destinatario */}
                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                Username del Destinatario
                            </label>
                            <input
                                type="text"
                                value={usernameDestino}
                                onChange={(e) => setUsernameDestino(e.target.value)}
                                placeholder="Ingrese el username"
                                className="w-full p-3 border-2 border-[#F0973C] rounded-lg focus:outline-none focus:border-[#69AC95] transition-colors"
                                required
                            />
                        </div>

                        {/* Cantidad */}
                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                                Cantidad a Transferir
                            </label>
                            <input
                                type="number"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                min="0.01"
                                max={getSaldoActual()}
                                className="w-full p-3 border-2 border-[#F0973C] rounded-lg focus:outline-none focus:border-[#69AC95] transition-colors"
                                required
                            />
                        </div>

                        {/* Botón de enviar */}
                        <button
                            type="submit"
                            disabled={loadingTransferenciaEntreUsuarios}
                            className="w-full bg-[#F0973C] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#69AC95] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingTransferenciaEntreUsuarios ? 'Procesando...' : 'Continuar'}
                        </button>
                    </form>
                </div>

                {/* Información de la cuenta */}
                <div className="bg-white border-2 border-[#F0973C] rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-black mb-6">
                        Información de Wallets
                    </h2>

                    <div className="space-y-4">
                        {usuario?.wallets.map((wallet) => (
                            <div 
                                key={wallet.id}
                                className="bg-gradient-to-r from-[#69AC95] to-[#F0973C] text-white p-5 rounded-lg"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium opacity-90">
                                        {wallet.tipo === TipoWallets.WALLET_DIVIDENDOS 
                                            ? 'Wallet Dividendos' 
                                            : 'Wallet Comisiones'}
                                    </span>
                                    <span className="text-xs opacity-75">
                                        {wallet.codigo}
                                    </span>
                                </div>
                                <div className="text-3xl font-bold">
                                    ${wallet.saldo.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Información adicional */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-black mb-2 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-[#F0973C]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Información Importante
                        </h3>
                        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                            <li>Las transferencias son instantáneas</li>
                            <li>No hay comisión por transferencias internas</li>
                            <li>Verifica el username del destinatario</li>
                            <li>Las transacciones no son reversibles</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Historial de Transferencias */}
            <div className="mt-8 bg-white border-2 border-[#69AC95] rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-black mb-6">
                    Historial de Transferencias
                </h2>

                {cargandoTransacciones ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#F0973C] border-t-transparent"></div>
                        <p className="mt-2 text-gray-600">Cargando...</p>
                    </div>
                ) : transacciones && transacciones.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-[#F0973C] text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                                        Monto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                                        Método
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transacciones.map((transaccion: Transaccion) => (
                                    <tr key={transaccion.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatearFecha(transaccion.fecha)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {transaccion.usuario.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#69AC95]">
                                            ${transaccion.monto.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {transaccion.metodoPago === 'WALLET_DIVIDENDOS' 
                                                ? 'Dividendos' 
                                                : 'Comisiones'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                transaccion.estado === 'COMPLETADA' 
                                                    ? 'bg-[#69AC95] text-white' 
                                                    : transaccion.estado === 'PENDIENTE'
                                                    ? 'bg-[#F0973C] text-white'
                                                    : 'bg-[#BC2020] text-white'
                                            }`}>
                                                {transaccion.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No hay transferencias registradas</p>
                    </div>
                )}
            </div>

            {/* Modal de Confirmación */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold text-black mb-6 flex items-center">
                            <svg className="w-8 h-8 mr-3 text-[#F0973C]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Confirmar Transferencia
                        </h3>
                        
                        <div className="space-y-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Destinatario</p>
                                <p className="text-lg font-semibold text-black">{usernameDestino}</p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Monto</p>
                                <p className="text-lg font-semibold text-[#69AC95]">
                                    ${parseFloat(cantidad).toFixed(2)}
                                </p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Desde Wallet</p>
                                <p className="text-lg font-semibold text-black">
                                    {tipoWallet === TipoWallets.WALLET_DIVIDENDOS ? 'Dividendos' : 'Comisiones'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-[#F0973C] p-4 mb-6">
                            <p className="text-sm text-gray-700">
                                ⚠️ Esta acción no se puede deshacer. Verifica los datos antes de continuar.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 bg-gray-300 text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarTransferencia}
                                disabled={loadingTransferenciaEntreUsuarios}
                                className="flex-1 bg-[#69AC95] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#F0973C] transition-colors disabled:opacity-50"
                            >
                                {loadingTransferenciaEntreUsuarios ? 'Procesando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
