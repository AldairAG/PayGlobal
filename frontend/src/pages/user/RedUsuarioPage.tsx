/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useUsuario } from "../../hooks/usuarioHook";
import type { UsuarioEnRedResponse } from "../../type/responseType";
import { TipoRango } from "../../type/enum";

// Interfaz para nodo de red con referidos anidados
interface NodoRed {
    usuarioRaiz: UsuarioEnRedResponse;
    referidos: NodoRed[];
}

// Componente de nodo individual
const NodoUsuario = ({
    nodo,
    maxNivel,
    esRaiz = false
}: {
    nodo: NodoRed;
    maxNivel: number;
    esRaiz?: boolean;
}) => {
    const [expandido, setExpandido] = useState(esRaiz);
    const tieneReferidos = nodo.referidos.length > 0;
    const puedeVerMas = nodo.usuarioRaiz.nivel < maxNivel;

    return (
        <div className="flex flex-col items-center">
            {/* Nodo del usuario */}
            <div className={`relative ${!esRaiz && 'mt-8'}`}>
                {/* Línea conectora superior */}
                {!esRaiz && (
                    <div className="absolute bottom-full left-1/2 w-0.5 h-8 -translate-x-1/2" style={{ backgroundColor: '#69AC95' }}></div>
                )}

                {/* Tarjeta del usuario */}
                <div
                    className={`
                        relative bg-white rounded-xl shadow-lg border-2 
                        ${esRaiz ? 'ring-4' : ''}
                        p-4 min-w-50 max-w-62.5
                        transition-all duration-300 hover:shadow-2xl hover:scale-105
                        ${tieneReferidos && puedeVerMas ? 'cursor-pointer' : ''}
                    `}
                    style={{
                        borderColor: esRaiz ? '#69AC95' : '#e5e7eb',
                        ...(esRaiz ? { '--tw-ring-color': '#d1fae5' } : {})
                    } as React.CSSProperties}
                    onClick={() => tieneReferidos && puedeVerMas && setExpandido(!expandido)}
                >
                    {/* Badge de nivel */}
                    <div className="absolute -top-3 -right-3 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
                        style={{ backgroundColor: '#F0973C' }}>
                        Nivel {nodo.usuarioRaiz.nivel}
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center justify-center mb-3">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                            style={{ backgroundColor: '#69AC95' }}>
                            {nodo.usuarioRaiz.username.substring(0, 2).toUpperCase()}
                        </div>
                    </div>

                    {/* Info del usuario */}
                    <div className="text-center">
                        <h3 className="font-bold text-gray-800 text-sm mb-1">
                            @{nodo.usuarioRaiz.username}
                        </h3>

                        {/* Licencia */}
                        <div className="px-3 py-1 rounded-full mb-2" style={{ backgroundColor: '#f3f4f6' }}>
                            <span className="text-xs font-semibold" style={{ color: '#69AC95' }}>
                                {nodo.usuarioRaiz.licencia.nombre}
                            </span>
                        </div>

                        {/* Estadísticas */}
                        <div className="mt-3 text-xs">
                            <div className="rounded-lg p-2" style={{ backgroundColor: '#f9fafb' }}>
                                <p className="text-gray-500">Referidos</p>
                                <p className="font-bold" style={{ color: '#69AC95' }}>{nodo.referidos.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Indicador de expandible */}
                    {tieneReferidos && puedeVerMas && (
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border-2 rounded-full p-1 shadow-md"
                            style={{ borderColor: '#69AC95' }}>
                            <svg
                                className={`w-5 h-5 transition-transform ${expandido ? 'rotate-180' : ''}`}
                                style={{ color: '#69AC95' }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            {/* Referidos */}
            {expandido && tieneReferidos && puedeVerMas && (
                <div className="relative mt-12">
                    {nodo.referidos.length > 1 && (
                        <div
                            className="absolute top-0 left-0 h-0.5"
                            style={{
                                width: '100%',
                                transform: 'translateY(-24px)',
                                backgroundColor: '#69AC95'
                            }}
                        ></div>
                    )}

                    <div className="flex flex-wrap justify-center gap-8">
                        {nodo.referidos.map((referido, index) => (
                            <div key={`${referido.usuarioRaiz.username}-${index}`} className="relative">
                                <NodoUsuario
                                    nodo={referido}
                                    maxNivel={maxNivel}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const RedUsuarioPage = () => {
    const { usuario, usuariosEnRed, loadingUsuariosEnRed, errorUsuariosEnRed, obtenerUsuariosEnRed } = useUsuario();

    useEffect(() => {
        const cargarRedUsuarios = async () => {
            if (usuario && usuario.username) {
                await obtenerUsuariosEnRed(usuario.username);
            }
        };

        // Cargar red de usuarios cuando el componente se monte
        if (usuario && usuario.username) {
            cargarRedUsuarios();
        }
    }, [usuario]);

    // Función para convertir lista plana a árbol jerárquico
    const construirArbolRed = (usuarios: UsuarioEnRedResponse[]): NodoRed => {

        const usuarioRaiz = {
            id: usuario?.id || 0,
            licencia: usuario?.licencia,
            nivel: 0,
            username: usuario?.username || '',
            referido: '', // El usuario raíz no tiene referido
        } as UsuarioEnRedResponse;

        // Agrupar usuarios por nivel
        const usuariosPorNivel: { [nivel: number]: UsuarioEnRedResponse[] } = {};
        usuarios.forEach(u => {
            if (!usuariosPorNivel[u.nivel]) {
                usuariosPorNivel[u.nivel] = [];
            }
            usuariosPorNivel[u.nivel].push(u);
        });

        const construirNodo = (usuario: UsuarioEnRedResponse, nivel: number): NodoRed => {
            const todosReferidosDelSiguienteNivel = usuariosPorNivel[nivel + 1] || [];
            // Filtrar solo los usuarios que fueron referidos por este usuario específico
            const referidos = todosReferidosDelSiguienteNivel.filter(r => r.referido === usuario.username);
            return {
                usuarioRaiz: usuario,
                referidos: referidos.map(r => construirNodo(r, nivel + 1))
            };
        }

        return construirNodo(usuarioRaiz, 0);
    };


    // Mostrar loading mientras se carga o si los datos aún no están disponibles
    if (loadingUsuariosEnRed) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: '#69AC95' }}></div>
                    <p className="text-lg text-gray-600">Cargando red de usuarios...</p>
                </div>
            </div>
        );
    }

    if (errorUsuariosEnRed) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg border" style={{ borderColor: '#e5e7eb' }}>
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar la red</h2>
                    <p className="text-gray-600 mb-4">{errorUsuariosEnRed}</p>
                    <button
                        onClick={() => usuario && obtenerUsuariosEnRed(usuario.username)}
                        className="px-4 py-2 text-white rounded-lg transition hover:opacity-90"
                        style={{ backgroundColor: '#69AC95' }}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (usuariosEnRed?.length === 0) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg border" style={{ borderColor: '#e5e7eb' }}>
                    <div className="text-gray-400 text-5xl mb-4">🌐</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay red disponible</h2>
                    <p className="text-gray-600">Aún no tienes referidos en tu red</p>
                </div>
            </div>
        );
    }

    const maxNivel = usuario ? TipoRango[usuario.rango as keyof typeof TipoRango].numero  : 0;


    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 overflow-x-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 text-gray-900">
                        Tu Red de Usuarios
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Visualiza tu red de referidos hasta el nivel {maxNivel}
                    </p>

                    {/* Info del rango */}
                    <div className="inline-flex items-center bg-white rounded-full shadow-lg px-6 py-3 space-x-4 border" style={{ borderColor: '#e5e7eb' }}>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#69AC95' }}></div>
                            <span className="text-sm font-semibold text-gray-700">
                                Nivel máximo visible: {maxNivel}
                            </span>
                        </div>
                        <div className="h-6 w-0.5 bg-gray-300"></div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F0973C' }}></div>
                            <span className="text-sm font-semibold text-gray-700">
                                Usuario: {usuario?.username}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Leyenda */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-8 max-w-2xl mx-auto border" style={{ borderColor: '#e5e7eb' }}>
                    <div className="flex items-center justify-around text-xs">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#69AC95' }}></div>
                            <span className="text-gray-600">Usuario</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#69AC95' }}></div>
                            <span className="text-gray-600">Usuario Principal (Nivel 0)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" style={{ color: '#69AC95' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            <span className="text-gray-600">Click para expandir</span>
                        </div>
                    </div>
                </div>

                {/* Árbol de red */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 overflow-x-auto border" style={{ borderColor: '#e5e7eb' }}>
                    <div className="min-w-max flex justify-center">
                        <NodoUsuario
                            nodo={construirArbolRed(usuariosEnRed || [])}
                            maxNivel={maxNivel}
                            esRaiz={true}
                        />
                    </div>
                </div>

                {/* Información adicional */}
                <div className="mt-8 rounded-xl p-6 max-w-2xl mx-auto border" style={{ backgroundColor: '#f3f4f6', borderColor: '#e5e7eb' }}>
                    <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 shrink-0 mt-1" style={{ color: '#69AC95' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Información sobre niveles</h3>
                            <p className="text-gray-700 text-sm">
                                El <strong>nivel 0</strong> siempre es tu usuario. Los niveles subsiguientes representan
                                tus referidos directos e indirectos. A mayor rango, más niveles podrás visualizar de tu red.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RedUsuarioPage;