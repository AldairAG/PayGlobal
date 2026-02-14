import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Wallet, Plus, ArrowDownToLine, Filter, ChevronLeft, ChevronRight, Calendar, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import type { WalletRetiro, SolicitudRetiro } from "../../type/entityTypes";
import { TipoCrypto, EstadoOperacion } from "../../type/enum";

export const RetiroPage = () => {
    // Estado para wallets de retiro
    const [walletsRetiro, setWalletsRetiro] = useState<WalletRetiro[]>([
        {
            id: 1,
            address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            tipoCrypto: TipoCrypto.USDT_ERC20,
            nombre: "Mi Wallet Principal",
            balanceRetirado: 1250.50,
            usuario: "usuario@example.com"
        },
        {
            id: 2,
            address: "TKVx9RNEqXqZhZfJVqFrr8BhNWXXkNhzHb",
            tipoCrypto: TipoCrypto.USDT_TRC20,
            nombre: "Wallet Tron",
            balanceRetirado: 750.00,
            usuario: "usuario@example.com"
        },
        {
            id: 3,
            address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            tipoCrypto: TipoCrypto.BITCOIN,
            nombre: "BTC Principal",
            balanceRetirado: 0.5,
            usuario: "usuario@example.com"
        }
    ]);

    // Estado para solicitudes de retiro
    const [solicitudesRetiro, setSolicitudesRetiro] = useState<SolicitudRetiro[]>([
        {
            id: 1,
            walletId: 1,
            walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            monto: 500,
            fecha: new Date("2026-02-12"),
            estado: EstadoOperacion.PENDIENTE,
            tipoCrypto: TipoCrypto.USDT_ERC20
        },
        {
            id: 2,
            walletId: 2,
            walletAddress: "TKVx9RNEqXqZhZfJVqFrr8BhNWXXkNhzHb",
            monto: 300,
            fecha: new Date("2026-02-10"),
            estado: EstadoOperacion.COMPLETADA,
            tipoCrypto: TipoCrypto.USDT_TRC20
        },
        {
            id: 3,
            walletId: 1,
            walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            monto: 150,
            fecha: new Date("2026-02-08"),
            estado: EstadoOperacion.RECHAZADA,
            tipoCrypto: TipoCrypto.USDT_ERC20
        },
        {
            id: 4,
            walletId: 3,
            walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            monto: 0.1,
            fecha: new Date("2026-02-05"),
            estado: EstadoOperacion.COMPLETADA,
            tipoCrypto: TipoCrypto.BITCOIN
        },
        {
            id: 5,
            walletId: 2,
            walletAddress: "TKVx9RNEqXqZhZfJVqFrr8BhNWXXkNhzHb",
            monto: 450,
            fecha: new Date("2026-02-01"),
            estado: EstadoOperacion.COMPLETADA,
            tipoCrypto: TipoCrypto.USDT_TRC20
        }
    ]);

    // Estados de UI
    const [showWalletForm, setShowWalletForm] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<number | null>(null);
    const [estadoFiltro, setEstadoFiltro] = useState<string>("");
    const [paginaActual, setPaginaActual] = useState(1);
    const solicitudesPorPagina = 5;

    // Validación para nueva wallet
    const walletValidationSchema = Yup.object({
        address: Yup.string()
            .required("La dirección es requerida")
            .min(26, "Dirección inválida"),
        tipoCrypto: Yup.string()
            .required("El tipo de cripto es requerido"),
        nombre: Yup.string()
            .required("El nombre es requerido")
            .min(3, "El nombre debe tener al menos 3 caracteres")
    });

    // Formik para nueva wallet
    const walletFormik = useFormik({
        initialValues: {
            address: "",
            tipoCrypto: TipoCrypto.USDT_ERC20,
            nombre: ""
        },
        validationSchema: walletValidationSchema,
        onSubmit: (values, { resetForm }) => {
            const nuevaWallet: WalletRetiro = {
                id: walletsRetiro.length + 1,
                address: values.address,
                tipoCrypto: values.tipoCrypto as TipoCrypto,
                nombre: values.nombre,
                balanceRetirado: 0,
                usuario: "usuario@example.com"
            };
            setWalletsRetiro([...walletsRetiro, nuevaWallet]);
            resetForm();
            setShowWalletForm(false);
            toast.success("Wallet creada exitosamente");
        }
    });

    // Validación para retiro
    const retiroValidationSchema = Yup.object({
        walletId: Yup.number()
            .required("Selecciona una wallet")
            .min(1, "Selecciona una wallet"),
        monto: Yup.number()
            .required("El monto es requerido")
            .min(1, "El monto mínimo es 1")
    });

    // Formik para retiro
    const retiroFormik = useFormik({
        initialValues: {
            walletId: 0,
            monto: 0
        },
        validationSchema: retiroValidationSchema,
        onSubmit: (values, { resetForm }) => {
            const wallet = walletsRetiro.find(w => w.id === values.walletId);
            if (!wallet) return;

            const nuevaSolicitud: SolicitudRetiro = {
                id: solicitudesRetiro.length + 1,
                walletId: values.walletId,
                walletAddress: wallet.address,
                monto: values.monto,
                fecha: new Date(),
                estado: EstadoOperacion.PENDIENTE,
                tipoCrypto: wallet.tipoCrypto
            };
            setSolicitudesRetiro([nuevaSolicitud, ...solicitudesRetiro]);
            resetForm();
            toast.success("Solicitud de retiro enviada");
        }
    });

    // Filtrar solicitudes por fecha
    const solicitudesFiltradas = solicitudesRetiro.filter((sol) => {
        if (estadoFiltro && sol.estado !== estadoFiltro) return false;
        return true;
    });

    // Paginación
    const indexUltimaSolicitud = paginaActual * solicitudesPorPagina;
    const indexPrimeraSolicitud = indexUltimaSolicitud - solicitudesPorPagina;
    const solicitudesPaginadas = solicitudesFiltradas.slice(indexPrimeraSolicitud, indexUltimaSolicitud);
    const totalPaginas = Math.ceil(solicitudesFiltradas.length / solicitudesPorPagina);

    // Obtener icono y color según estado
    const getEstadoInfo = (estado: EstadoOperacion) => {
        switch (estado) {
            case EstadoOperacion.PENDIENTE:
                return { icon: Clock, color: "#F0973C", text: "Pendiente" };
            case EstadoOperacion.COMPLETADA:
                return { icon: CheckCircle, color: "#69AC95", text: "Completada" };
            case EstadoOperacion.RECHAZADA:
                return { icon: XCircle, color: "#BC2020", text: "Rechazada" };
            case EstadoOperacion.APROBADA:
                return { icon: CheckCircle, color: "#69AC95", text: "Aprobada" };
            default:
                return { icon: AlertCircle, color: "#000000", text: "Desconocido" };
        }
    };

    // Obtener símbolo de crypto
    const getCryptoSymbol = (tipo: TipoCrypto): string => {
        switch (tipo) {
            case TipoCrypto.BITCOIN:
                return "BTC";
            case TipoCrypto.USDT_ERC20:
                return "USDT (ERC-20)";
            case TipoCrypto.USDT_TRC20:
                return "USDT (TRC-20)";
            case TipoCrypto.SOLANA:
                return "SOL";
            default:
                return "CRYPTO";
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-black">
                        Gestión de Retiros
                    </h1>
                    <p className="text-gray-600">
                        Administra tus wallets y solicitudes de retiro
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Sección: Mis Wallets */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Wallet size={24} className="text-[#F0973C]" />
                                Mis Wallets
                            </h2>
                            <button
                                onClick={() => setShowWalletForm(!showWalletForm)}
                                className="p-2 rounded-lg transition-all hover:scale-105 bg-[#F0973C]"
                                title="Nueva Wallet"
                            >
                                <Plus size={20} className="text-white" />
                            </button>
                        </div>

                        {/* Formulario Nueva Wallet */}
                        {showWalletForm && (
                            <div className="mb-6 p-4 rounded-lg border-2 border-[#F0973C] bg-[#FFF4E6]">
                                <h3 className="font-semibold mb-4">Nueva Wallet</h3>
                                <form onSubmit={walletFormik.handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={walletFormik.values.nombre}
                                            onChange={walletFormik.handleChange}
                                            onBlur={walletFormik.handleBlur}
                                            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${walletFormik.touched.nombre && walletFormik.errors.nombre ? "border-red-600" : "border-[#F0973C]"
                                                }`}
                                            placeholder="Mi Wallet Principal"
                                        />
                                        {walletFormik.touched.nombre && walletFormik.errors.nombre && (
                                            <p className="text-sm mt-1 text-red-600">
                                                {walletFormik.errors.nombre}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Tipo de Cripto *
                                        </label>
                                        <select
                                            name="tipoCrypto"
                                            value={walletFormik.values.tipoCrypto}
                                            onChange={walletFormik.handleChange}
                                            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none border-[#F0973C]"
                                        >
                                            <option value={TipoCrypto.USDT_ERC20}>USDT (ERC-20)</option>
                                            <option value={TipoCrypto.USDT_TRC20}>USDT (TRC-20)</option>
                                            <option value={TipoCrypto.BITCOIN}>Bitcoin</option>
                                            <option value={TipoCrypto.SOLANA}>Solana</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Dirección *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={walletFormik.values.address}
                                            onChange={walletFormik.handleChange}
                                            onBlur={walletFormik.handleBlur}
                                            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none font-mono text-sm ${walletFormik.touched.address && walletFormik.errors.address ? "border-red-600" : "border-[#F0973C]"
                                                }`}
                                            placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                                        />
                                        {walletFormik.touched.address && walletFormik.errors.address && (
                                            <p className="text-sm mt-1 text-red-600">
                                                {walletFormik.errors.address}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="flex-1 py-2 rounded-lg font-semibold transition-all hover:scale-105 bg-[#69AC95] text-white"
                                        >
                                            Crear Wallet
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowWalletForm(false);
                                                walletFormik.resetForm();
                                            }}
                                            className="flex-1 py-2 rounded-lg font-semibold border-2 border-black text-black"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Lista de Wallets */}
                        <div className="space-y-3 max-h-100 overflow-y-auto">
                            {walletsRetiro.map((wallet) => (
                                <div
                                    key={wallet.id}
                                    className="p-4 rounded-lg border-2 transition-all hover:shadow-md border-gray-200 bg-white"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold">{wallet.nombre}</h3>
                                            <p className="text-xs text-[#F0973C]">
                                                {getCryptoSymbol(wallet.tipoCrypto)}
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#69AC95] text-white">
                                            ${wallet.balanceRetirado.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-xs font-mono text-gray-500 break-all">
                                        {wallet.address}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sección: Solicitar Retiro */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <ArrowDownToLine size={24} className="text-[#69AC95]" />
                            Solicitar Retiro
                        </h2>

                        <form onSubmit={retiroFormik.handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Seleccionar Wallet *
                                </label>
                                <select
                                    name="walletId"
                                    value={retiroFormik.values.walletId}
                                    onChange={(e) => {
                                        retiroFormik.handleChange(e);
                                        setSelectedWallet(Number(e.target.value));
                                    }}
                                    onBlur={retiroFormik.handleBlur}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${retiroFormik.touched.walletId && retiroFormik.errors.walletId ? "border-red-600" : "border-[#F0973C]"
                                        }`}
                                >
                                    <option value={0}>Selecciona una wallet</option>
                                    {walletsRetiro.map((wallet) => (
                                        <option key={wallet.id} value={wallet.id}>
                                            {wallet.nombre} - {getCryptoSymbol(wallet.tipoCrypto)}
                                        </option>
                                    ))}
                                </select>
                                {retiroFormik.touched.walletId && retiroFormik.errors.walletId && (
                                    <p className="text-sm mt-1 text-red-600">
                                        {retiroFormik.errors.walletId}
                                    </p>
                                )}
                            </div>

                            {/* Información de la wallet seleccionada */}
                            {selectedWallet && selectedWallet > 0 && (
                                <div className="p-4 rounded-lg bg-[#E6F4F1] border-2 border-[#69AC95]">
                                    {(() => {
                                        const wallet = walletsRetiro.find(w => w.id === selectedWallet);
                                        return wallet ? (
                                            <>
                                                <p className="text-sm font-semibold mb-2">Wallet Seleccionada:</p>
                                                <p className="text-xs font-mono text-gray-600 break-all mb-2">{wallet.address}</p>
                                                <p className="text-sm">
                                                    Balance Retirado: <span className="font-bold text-[#69AC95]">
                                                        ${wallet.balanceRetirado.toFixed(2)}
                                                    </span>
                                                </p>
                                            </>
                                        ) : null;
                                    })()}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Monto a Retirar *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        name="monto"
                                        value={retiroFormik.values.monto || ""}
                                        onChange={retiroFormik.handleChange}
                                        onBlur={retiroFormik.handleBlur}
                                        className={`w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:outline-none ${retiroFormik.touched.monto && retiroFormik.errors.monto ? "border-red-600" : "border-[#F0973C]"
                                            }`}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                                {retiroFormik.touched.monto && retiroFormik.errors.monto && (
                                    <p className="text-sm mt-1 text-red-600">
                                        {retiroFormik.errors.monto}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!retiroFormik.isValid || retiroFormik.isSubmitting}
                                className="w-full py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-[#69AC95] text-white"
                            >
                                Solicitar Retiro
                            </button>
                        </form>

                        {/* Información adicional */}
                        <div className="mt-6 p-4 rounded-lg bg-[#FFF4E5] border border-[#F0973C]">
                            <h3 className="font-semibold text-sm mb-2 text-[#F0973C]">
                                ℹ️ Información Importante
                            </h3>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>• Las solicitudes son procesadas en 24-48 horas</li>
                                <li>• Monto mínimo de retiro: $10 USD</li>
                                <li>• Se aplicarán comisiones según la red</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Historial de Solicitudes */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Calendar size={24} className="text-[#F0973C]" />
                            Historial de Solicitudes
                        </h2>

                        {/* Filtro por estado */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter size={20} className="text-[#F0973C]" />

                            <select
                                value={estadoFiltro}
                                onChange={(e) => {
                                    setEstadoFiltro(e.target.value);
                                    setPaginaActual(1);
                                }}
                                className="px-3 py-2 border-2 rounded-lg text-sm focus:outline-none border-[#F0973C]"
                            >
                                <option value="">Todos los estados</option>
                                <option value={EstadoOperacion.PENDIENTE}>Pendiente</option>
                                <option value={EstadoOperacion.COMPLETADA}>Completada</option>
                                <option value={EstadoOperacion.RECHAZADA}>Rechazada</option>
                            </select>

                            {estadoFiltro && (
                                <button
                                    onClick={() => {
                                        setEstadoFiltro("");
                                        setPaginaActual(1);
                                    }}
                                    className="px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 bg-red-600 text-white"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>

                    </div>

                    {/* Tabla de solicitudes */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b-2 border-gray-200">
                                    <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Wallet</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Cripto</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold">Monto</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudesPaginadas.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                            No hay solicitudes que mostrar
                                        </td>
                                    </tr>
                                ) : (
                                    solicitudesPaginadas.map((solicitud) => {
                                        const estadoInfo = getEstadoInfo(solicitud.estado);
                                        const IconoEstado = estadoInfo.icon;
                                        return (
                                            <tr key={solicitud.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-4 text-sm font-semibold">#{solicitud.id}</td>
                                                <td className="px-4 py-4 text-xs font-mono text-gray-600 max-w-50 truncate">
                                                    {solicitud.walletAddress}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <span className="px-2 py-1 rounded text-xs font-semibold bg-[#F0973C] text-white">
                                                        {getCryptoSymbol(solicitud.tipoCrypto)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-right text-sm font-bold text-[#69AC95]">
                                                    ${solicitud.monto.toFixed(2)}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {solicitud.fecha.toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <IconoEstado size={16} style={{ color: estadoInfo.color }} />
                                                        <span className="text-sm font-semibold" style={{ color: estadoInfo.color }}>
                                                            {estadoInfo.text}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {totalPaginas > 1 && (
                        <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-gray-200">
                            <p className="text-sm text-gray-600">
                                Mostrando {indexPrimeraSolicitud + 1} - {Math.min(indexUltimaSolicitud, solicitudesFiltradas.length)} de {solicitudesFiltradas.length} solicitudes
                            </p>
                            <div className="flex gap-2">
                                <button
                                    title="Página anterior"
                                    onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                    disabled={paginaActual === 1}
                                    className="p-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-orange-500 text-white"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                                        <button
                                            key={pagina}
                                            onClick={() => setPaginaActual(pagina)}
                                            className={`px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 ${paginaActual === pagina ? "bg-orange-500 text-white" : "bg-gray-200 text-black"
                                                }`}
                                        >
                                            {pagina}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    title="Página siguiente"
                                    onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                    disabled={paginaActual === totalPaginas}
                                    className="p-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-orange-500 text-white"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}