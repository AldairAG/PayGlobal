import { User, Mail, Phone, Globe, Calendar, Shield, Award, CreditCard, CheckCircle, AlertCircle, Wallet as WalletIcon, Coins } from "lucide-react";
import { useState, useEffect } from "react";
import { useUsuario } from "../../hooks/usuarioHook";
import { KycDocuments } from "../../components/KycDocuments";

export const ProfilePage = () => {
    const { usuario, editarPerfil, loadingEditarPerfil, errorEditarPerfil } = useUsuario();
    
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
        pais: ""
    });
    
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Cargar datos del usuario cuando esté disponible
    useEffect(() => {
        if (usuario) {
            setFormData({
                nombre: usuario.nombre || "",
                apellido: usuario.apellido || "",
                telefono: usuario.telefono || "",
                pais: usuario.pais || ""
            });
        }
    }, [usuario]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar mensajes al editar
        if (successMessage) setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        
        try {
            await editarPerfil(formData);
            setSuccessMessage("Perfil actualizado exitosamente");
            // Limpiar mensaje después de 5 segundos
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (error) {
            console.error('Error al editar perfil:', error);
        }
    };

    // Formatear fecha
    const formatearFecha = (fecha: Date | undefined) => {
        if (!fecha) return "N/A";
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
                    <p className="text-gray-500 mt-1">Gestiona tu información personal</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna izquierda - Avatar y datos básicos */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Tarjeta de Avatar */}
                    <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4"
                                style={{ backgroundColor: '#69AC95' }}>
                                <User size={64} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {usuario?.nombre && usuario?.apellido 
                                    ? `${usuario.nombre} ${usuario.apellido}` 
                                    : usuario?.username || "Usuario"}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">@{usuario?.username || "usuario"}</p>
                            
                            {/* Estado de verificación */}
                            <div className={`flex items-center gap-2 mt-4 px-4 py-2 rounded-full ${
                                usuario?.verificado 
                                    ? 'bg-green-50 border border-green-200' 
                                    : 'bg-yellow-50 border border-yellow-200'
                            }`}>
                                <Shield size={16} className={usuario?.verificado ? "text-green-600" : "text-yellow-600"} />
                                <span className={`text-sm font-semibold ${
                                    usuario?.verificado ? "text-green-700" : "text-yellow-700"
                                }`}>
                                    {usuario?.verificado ? "Verificado" : "No Verificado"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de Rango */}
                    <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <Award size={24} style={{ color: '#F0973C' }} />
                            <h3 className="text-lg font-bold text-gray-800">Rango Actual</h3>
                        </div>
                        <p className="text-2xl font-bold" style={{ color: '#69AC95' }}>
                            {usuario?.rango?.nombre || "Sin Rango"}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Rango {usuario?.rango?.numero || 0} • Capital: ${usuario?.rango?.capitalNecesario?.toFixed(2) || "0.00"}
                        </p>
                    </div>

                    {/* Tarjeta de Licencia */}
                    <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <CreditCard size={24} style={{ color: '#69AC95' }} />
                            <h3 className="text-lg font-bold text-gray-800">Licencia</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {usuario?.licencia?.nombre || "Sin Licencia"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Valor: ${usuario?.licencia?.precio?.toFixed(2) || "0.00"} USDT
                        </p>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Estado:</span>
                                <span className={`font-semibold ${
                                    usuario?.licencia?.activo ? "text-green-600" : "text-red-600"
                                }`}>
                                    {usuario?.licencia?.activo ? "Activo" : "Inactivo"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Acumulado:</span>
                                <span className="font-semibold text-gray-900">
                                    ${usuario?.licencia?.saldoAcumulado?.toFixed(2) || "0.00"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna derecha - Formulario de información */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Información Personal (Editable) */}
                    <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Información Personal</h3>
                        
                        {/* Mensajes de éxito o error */}
                        {successMessage && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                                <CheckCircle size={20} className="text-green-600" />
                                <span className="text-sm font-medium text-green-700">{successMessage}</span>
                            </div>
                        )}
                        
                        {errorEditarPerfil && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                <AlertCircle size={20} className="text-red-600" />
                                <span className="text-sm font-medium text-red-700">{errorEditarPerfil}</span>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Nombre - Editable */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                                        placeholder="Ingresa tu nombre"
                                    />
                                </div>

                                {/* Apellido - Editable */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Apellido
                                    </label>
                                    <input
                                        type="text"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                                        placeholder="Ingresa tu apellido"
                                    />
                                </div>

                                {/* Teléfono - Editable */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Phone size={16} />
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                                        placeholder="+1234567890"
                                    />
                                </div>

                                {/* País - Editable */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Globe size={16} />
                                        País
                                    </label>
                                    <input
                                        type="text"
                                        name="pais"
                                        value={formData.pais}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                                        placeholder="País de residencia"
                                    />
                                </div>
                            </div>

                            {/* Botón de guardar */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={loadingEditarPerfil}
                                    className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: '#69AC95' }}>
                                    {loadingEditarPerfil ? "Guardando..." : "Guardar Cambios"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Información de Cuenta (No editable) */}
                    <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Información de Cuenta</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* ID */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    ID de Usuario
                                </label>
                                <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-600">
                                    #{usuario?.id || "N/A"}
                                </div>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <User size={16} />
                                    Username
                                </label>
                                <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-600">
                                    {usuario?.username || "N/A"}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Mail size={16} />
                                    Email
                                </label>
                                <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-600">
                                    {usuario?.email || "N/A"}
                                </div>
                            </div>

                            {/* Referenciado por */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Referenciado por
                                </label>
                                <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-600">
                                    @{usuario?.referenciado || "N/A"}
                                </div>
                            </div>

                            {/* Fecha de Registro */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Calendar size={16} />
                                    Fecha de Registro
                                </label>
                                <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-600">
                                    {formatearFecha(usuario?.fechaRegistro)}
                                </div>
                            </div>

                            {/* Estado de cuenta */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Estado de Cuenta
                                </label>
                                <div className={`px-4 py-3 border-2 rounded-lg ${
                                    usuario?.activo 
                                        ? 'bg-green-50 border-green-200' 
                                        : 'bg-red-50 border-red-200'
                                }`}>
                                    <span className={`font-semibold ${
                                        usuario?.activo ? 'text-green-700' : 'text-red-700'
                                    }`}>
                                        {usuario?.activo ? "Activo" : "Inactivo"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resumen de Wallets */}
                    <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Mis Wallets</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {usuario?.wallets && usuario.wallets.length > 0 ? (
                                usuario.wallets.map((wallet) => (
                                    <div 
                                        key={wallet.id}
                                        className="p-4 rounded-xl border-2 border-gray-200"
                                        style={{
                                            background: wallet.codigo === 0 
                                                ? 'linear-gradient(to bottom right, rgb(240 253 244), white)' 
                                                : 'linear-gradient(to bottom right, rgb(255 247 237), white)'
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div 
                                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: wallet.codigo === 0 ? '#69AC95' : '#F0973C' }}
                                            >
                                                {wallet.codigo === 0 ? (
                                                    <WalletIcon size={16} className="text-white" />
                                                ) : (
                                                    <Coins size={16} className="text-white" />
                                                )}
                                            </div>
                                            <h4 className="font-bold text-gray-800">
                                                {wallet.codigo === 0 ? 'Wallet Dividendos' : 'Wallet Comisiones'}
                                            </h4>
                                        </div>
                                        <p 
                                            className="text-2xl font-bold" 
                                            style={{ color: wallet.codigo === 0 ? '#69AC95' : '#F0973C' }}
                                        >
                                            $ {wallet.saldo?.toFixed(2) || "0.00"}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="col-span-2 text-center text-gray-500 py-4">No hay wallets disponibles</p>
                            )}
                        </div>
                    </div>

                    {/* Resumen de Bonos */}
                    <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Mis Bonos</h3>
                        
                        <div className="space-y-3">
                            {usuario?.bonos && usuario.bonos.length > 0 ? (
                                usuario.bonos.map((bono) => (
                                    <div key={bono.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-semibold text-gray-700">
                                            {bono.nombre}
                                        </span>
                                        <span className="text-lg font-bold" style={{ color: '#69AC95' }}>
                                            ${bono.acumulado?.toFixed(2) || "0.00"}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">No hay bonos disponibles</p>
                            )}
                        </div>
                    </div>

                    {/* Documentos KYC */}
                    {usuario?.id && <KycDocuments usuarioId={usuario.id} />}
                </div>
            </div>
        </div>
    );
}