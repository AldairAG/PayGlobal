/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useUsuario } from "../../hooks/usuarioHook";
import { Users, Search, RefreshCw, Loader2, AlertTriangle, ChevronLeft, ChevronRight, Edit, Mail, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import { formatearFecha } from "../../helpers/formatHelpers";

export const ExploradorUsuarioPage = () => {

    const { obtenerTodosLosUsuarios, usuarios, loadingUsuarios, errorUsuarios } = useUsuario();
    const navigate = useNavigate();

    const [filtro, setFiltro] = useState("");
    const [filtroBusqueda, setFiltroBusqueda] = useState(""); // El filtro que se envía al backend
    const [paginaActual, setPaginaActual] = useState(0);
    const [tamanioPagina, setTamanioPagina] = useState(10);

    useEffect(() => {
        obtenerTodosLosUsuarios(filtroBusqueda, paginaActual, tamanioPagina);
    }, [paginaActual, tamanioPagina, filtroBusqueda]);

    const handleBuscar = () => {
        setFiltroBusqueda(filtro);
        setPaginaActual(0); // Resetear a la primera página al buscar
    };

    const handleLimpiarBusqueda = () => {
        setFiltro("");
        setFiltroBusqueda("");
        setPaginaActual(0);
    };

    const handleEditarUsuario = (idUsuario: number) => {
        navigate(`${ROUTES.ADMIN.EDITAR_USUARIO}/${idUsuario}`);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleBuscar();
        }
    };



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-5 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users size={32} className="text-[#69AC95]" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Explorador de Usuarios</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Busca y gestiona usuarios del sistema
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => obtenerTodosLosUsuarios(filtroBusqueda, paginaActual, tamanioPagina)}
                        disabled={loadingUsuarios}
                        className="flex items-center gap-2 px-4 py-2 bg-[#69AC95] hover:bg-[#5a9a82] text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw size={18} className={loadingUsuarios ? "animate-spin" : ""} />
                        <span>Actualizar</span>
                    </button>
                </div>
            </div>

            <div className="px-6">
                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600 mb-1">Total Usuarios</p>
                        <p className="text-2xl font-bold text-gray-800">{usuarios?.totalElements ?? 0}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4">
                        <p className="text-sm text-blue-700 mb-1">Página Actual</p>
                        <p className="text-2xl font-bold text-blue-800">{paginaActual + 1}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
                        <p className="text-sm text-green-700 mb-1">Mostrando</p>
                        <p className="text-2xl font-bold text-green-800">{usuarios?.numberOfElements ?? 0}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-4">
                        <p className="text-sm text-purple-700 mb-1">Total Páginas</p>
                        <p className="text-2xl font-bold text-purple-800">{usuarios?.totalPages ?? 0}</p>
                    </div>
                </div>

                {/* Buscador */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por username, email, nombre o apellido..."
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#69AC95] focus:border-transparent outline-none"
                            />
                        </div>
                        <button
                            onClick={handleBuscar}
                            disabled={loadingUsuarios}
                            className="px-6 py-2.5 bg-[#69AC95] hover:bg-[#5a9a82] text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Buscar
                        </button>
                        {filtroBusqueda && (
                            <button
                                onClick={handleLimpiarBusqueda}
                                disabled={loadingUsuarios}
                                className="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                    {filtroBusqueda && (
                        <p className="text-sm text-gray-600 mt-2">
                            Buscando: <span className="font-semibold text-gray-800">"{filtroBusqueda}"</span>
                        </p>
                    )}
                </div>

                {/* Lista de usuarios */}
                <div className="space-y-4">
                    {loadingUsuarios ? (
                        // Estado de carga
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <Loader2 size={48} className="text-[#69AC95] mx-auto mb-4 animate-spin" />
                            <p className="text-gray-600 text-lg">Cargando usuarios...</p>
                            <p className="text-gray-500 text-sm mt-2">Por favor espera un momento</p>
                        </div>
                    ) : errorUsuarios ? (
                        // Estado de error
                        <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-12 text-center">
                            <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                            <p className="text-red-700 text-lg font-semibold">Error al cargar los usuarios</p>
                            <p className="text-red-600 text-sm mt-2">{errorUsuarios}</p>
                            <button
                                onClick={() => obtenerTodosLosUsuarios(filtroBusqueda, paginaActual, tamanioPagina)}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 mx-auto"
                            >
                                <RefreshCw size={16} />
                                <span>Reintentar</span>
                            </button>
                        </div>
                    ) : usuarios && usuarios.content.length > 0 ? (
                        // Tabla de usuarios
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Usuario
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Registro
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {usuarios.content.map((usuario) => (
                                            <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="shrink-0 h-10 w-10 bg-[#69AC95] rounded-full flex items-center justify-center">
                                                            <span className="text-white font-semibold text-sm">
                                                                {usuario.nombre?.charAt(0).toUpperCase() ?? usuario.username.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {usuario.nombre && usuario.apellido 
                                                                    ? `${usuario.nombre} ${usuario.apellido}`
                                                                    : usuario.username}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                @{usuario.username}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-900">
                                                        <Mail size={14} className="text-gray-400 mr-2" />
                                                        {usuario.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-900">
                                                        <Calendar size={14} className="text-gray-400 mr-2" />
                                                        {usuario.fechaRegistro ? formatearFecha(new Date(usuario.fechaRegistro).toLocaleString()) : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEditarUsuario(usuario.id)}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-[#69AC95] hover:bg-[#5a9a82] text-white rounded-lg transition-colors duration-200"
                                                    >
                                                        <Edit size={14} />
                                                        Editar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        // Sin resultados
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <Users size={48} className="text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">No se encontraron usuarios</p>
                            <p className="text-gray-500 text-sm mt-2">
                                {filtroBusqueda 
                                    ? 'Intenta con otro criterio de búsqueda' 
                                    : 'No hay usuarios registrados en el sistema'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Controles de paginación */}
                {usuarios && usuarios.totalPages > 1 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
                        <div className="flex items-center justify-between">
                            {/* Información de paginación */}
                            <div className="text-sm text-gray-600">
                                Mostrando <span className="font-semibold">{usuarios.numberOfElements}</span> de{' '}
                                <span className="font-semibold">{usuarios.totalElements}</span> usuarios
                                {' '}(Página <span className="font-semibold">{paginaActual + 1}</span> de{' '}
                                <span className="font-semibold">{usuarios.totalPages}</span>)
                            </div>

                            {/* Controles de navegación */}
                            <div className="flex items-center gap-2">
                                {/* Botón Primera página */}
                                <button
                                    onClick={() => setPaginaActual(0)}
                                    disabled={usuarios.first || loadingUsuarios}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Primera página"
                                >
                                    Primera
                                </button>

                                {/* Botón Anterior */}
                                <button
                                    onClick={() => setPaginaActual(prev => Math.max(0, prev - 1))}
                                    disabled={usuarios.first || loadingUsuarios}
                                    className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Página anterior"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {/* Números de página */}
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, usuarios.totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (usuarios.totalPages <= 5) {
                                            pageNum = i;
                                        } else if (paginaActual < 3) {
                                            pageNum = i;
                                        } else if (paginaActual > usuarios.totalPages - 4) {
                                            pageNum = usuarios.totalPages - 5 + i;
                                        } else {
                                            pageNum = paginaActual - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPaginaActual(pageNum)}
                                                disabled={loadingUsuarios}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    paginaActual === pageNum
                                                        ? 'bg-[#69AC95] text-white'
                                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {pageNum + 1}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Botón Siguiente */}
                                <button
                                    onClick={() => setPaginaActual(prev => Math.min(usuarios.totalPages - 1, prev + 1))}
                                    disabled={usuarios.last || loadingUsuarios}
                                    className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Página siguiente"
                                >
                                    <ChevronRight size={20} />
                                </button>

                                {/* Botón Última página */}
                                <button
                                    onClick={() => setPaginaActual(usuarios.totalPages - 1)}
                                    disabled={usuarios.last || loadingUsuarios}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Última página"
                                >
                                    Última
                                </button>

                                {/* Selector de tamaño de página */}
                                <select
                                    value={tamanioPagina}
                                    onChange={(e) => {
                                        setTamanioPagina(Number(e.target.value));
                                        setPaginaActual(0);
                                    }}
                                    disabled={loadingUsuarios}
                                    className="ml-4 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <option value={5}>5 por página</option>
                                    <option value={10}>10 por página</option>
                                    <option value={20}>20 por página</option>
                                    <option value={50}>50 por página</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}