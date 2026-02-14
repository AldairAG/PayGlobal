/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Usuario } from "../../type/entityTypes";
import { TipoRango } from "../../type/enum";
import { useUsuario } from "../../hooks/usuarioHook";

export const EditarUsuarioPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const { usuarioSeleccionado, obtenerUsuarioPorId, loadingUsuarioSeleccionado, errorUsuarioSeleccionado } = useUsuario();
    const [isEditing, setIsEditing] = useState(false);

    // Cargar datos del usuario cuando el componente se monte
    useEffect(() => {
        if (userId) {
            obtenerUsuarioPorId(parseInt(userId));
        }
    }, [userId]);

    const handleInputChange = (field: keyof Usuario, value: Usuario[keyof Usuario]) => {
        if (usuarioSeleccionado) {
            // TODO: Actualizar en Redux store cuando esté en modo edición
            console.log("Campo a actualizar:", field, value);
        }
    };

    const handleSave = () => {
        // TODO: Implementar guardado en backend
        console.log("Guardando usuario:", usuarioSeleccionado);
        setIsEditing(false);
    };

    // Estado de carga
    if (loadingUsuarioSeleccionado) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Cargando usuario...</p>
                </div>
            </div>
        );
    }

    // Estado de error
    if (errorUsuarioSeleccionado) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center bg-white p-8 rounded-lg shadow-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar usuario</h2>
                    <p className="text-gray-600 mb-4">{errorUsuarioSeleccionado}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    // Usuario no encontrado
    if (!usuarioSeleccionado) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center bg-white p-8 rounded-lg shadow-md">
                    <div className="text-gray-400 text-5xl mb-4">👤</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Usuario no encontrado</h2>
                    <p className="text-gray-600 mb-4">No se pudo encontrar el usuario solicitado</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Editar Usuario</h1>
                        <p className="text-gray-600 mt-1">ID: {usuarioSeleccionado.id}</p>
                    </div>
                    <div className="space-x-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Guardar Cambios
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Editar
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sección 1: Información Personal */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                            Información Personal
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={usuarioSeleccionado.nombre}
                                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    value={usuarioSeleccionado.apellido}
                                    onChange={(e) => handleInputChange("apellido", e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={usuarioSeleccionado.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={usuarioSeleccionado.telefono}
                                    onChange={(e) => handleInputChange("telefono", e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    País
                                </label>
                                <input
                                    type="text"
                                    value={usuarioSeleccionado.pais}
                                    onChange={(e) => handleInputChange("pais", e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Información de Cuenta */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                            Información de Cuenta
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={usuarioSeleccionado.username}
                                    onChange={(e) => handleInputChange("username", e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Referenciado por
                                </label>
                                <input
                                    type="text"
                                    value={usuarioSeleccionado.referenciado}
                                    onChange={(e) => handleInputChange("referenciado", e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rango
                                </label>
                                <select
                                    value={usuarioSeleccionado.rango.numero}
                                    onChange={(e) => {
                                        const rangoKey = `RANGO_${e.target.value}` as keyof typeof TipoRango;
                                        handleInputChange("rango", TipoRango[rangoKey]);
                                    }}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    {Object.entries(TipoRango).map(([key, rango]) => {
                                        if (typeof rango === 'object') {
                                            return (
                                                <option key={key} value={rango.numero}>
                                                    {rango.nombre}
                                                </option>
                                            );
                                        }
                                        return null;
                                    })}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha de Registro
                                </label>
                                <input
                                    type="text"
                                    value={new Date(usuarioSeleccionado.fechaRegistro).toLocaleDateString()}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={usuarioSeleccionado.activo}
                                        onChange={(e) => handleInputChange("activo", e.target.checked)}
                                        disabled={!isEditing}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                                    />
                                    <label className="ml-2 text-sm font-medium text-gray-700">
                                        Activo
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={usuarioSeleccionado.verificado}
                                        onChange={(e) => handleInputChange("verificado", e.target.checked)}
                                        disabled={!isEditing}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                                    />
                                    <label className="ml-2 text-sm font-medium text-gray-700">
                                        Verificado
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección 3: Licencia */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                            Licencia
                        </h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        value={usuarioSeleccionado.licencia.nombre}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Precio
                                    </label>
                                    <input
                                        type="number"
                                        value={usuarioSeleccionado.licencia.precio}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Límite
                                    </label>
                                    <input
                                        type="number"
                                        value={usuarioSeleccionado.licencia.limite}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Saldo Acumulado
                                    </label>
                                    <input
                                        type="number"
                                        value={usuarioSeleccionado.licencia.saldoAcumulado}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha de Compra
                                </label>
                                <input
                                    type="text"
                                    value={new Date(usuarioSeleccionado.licencia.fechaCompra).toLocaleDateString()}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={usuarioSeleccionado.licencia.activo}
                                    disabled
                                    className="w-4 h-4 text-blue-600 rounded cursor-not-allowed"
                                />
                                <label className="ml-2 text-sm font-medium text-gray-700">
                                    Licencia Activa
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Sección 4: Wallets */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                            Wallets
                        </h2>
                        {usuarioSeleccionado.wallets.length > 0 ? (
                            <div className="space-y-3">
                                {usuarioSeleccionado.wallets.map((wallet) => (
                                    <div
                                        key={wallet.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    {wallet.tipo}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Código: {wallet.codigo}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-green-600">
                                                    ${wallet.saldo.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                No hay wallets registradas
                            </p>
                        )}
                    </div>

                    {/* Sección 5: Bonos */}
                    <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                            Bonos
                        </h2>
                        {usuarioSeleccionado.bonos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {usuarioSeleccionado.bonos.map((bono) => (
                                    <div
                                        key={bono.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    {bono.nombre}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Código: {bono.codigo}
                                                </p>
                                            </div>
                                            <div className="bg-blue-100 px-2 py-1 rounded">
                                                <p className="text-xs font-semibold text-blue-800">
                                                    ID: {bono.id}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-lg font-bold text-green-600">
                                                ${bono.acumulado.toFixed(2)}
                                            </p>
                                            <p className="text-xs text-gray-500">Acumulado</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                No hay bonos registrados
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};