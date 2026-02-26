import { useEffect, useState, useCallback } from "react";
import { useKyc } from "../../hooks/useKyc";
import { FileText, CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import { EstadoOperacion, TipoKycFile, TipoRechazos } from "../../type/enum";
import type { KycFile } from "../../type/entityTypes";
import { FileViewerModal } from "../../components/modal/FileViewerModal";

export const GestionKycPage = () => {
    const {
        obtenerArchivosKycPendientes,
        evaluarArchivoKyc,
        obtenerArchivoKyc,
        archivosPendientes,
        loadingArchivosPendientes,
        loadingEvaluarArchivo,
    } = useKyc();

    const [selectedArchivo, setSelectedArchivo] = useState<KycFile | null>(null);
    const [evaluacionEstado, setEvaluacionEstado] = useState<EstadoOperacion>(EstadoOperacion.APROBADA);
    const [comentario, setComentario] = useState("");
    const [razonRechazo, setRazonRechazo] = useState<TipoRechazos>(TipoRechazos.ARCHIVO_NO_LEGIBLE);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Modal para visualizar archivo
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<{ name: string; blob: Blob | null }>({
        name: '',
        blob: null
    });

    const cargarArchivosPendientes = useCallback(async () => {
        try {
            await obtenerArchivosKycPendientes();
        } catch (error) {
            console.error('Error al cargar archivos pendientes:', error);
        }
    }, [obtenerArchivosKycPendientes]);

    useEffect(() => {
        cargarArchivosPendientes();
    }, [cargarArchivosPendientes]);

    const handleEvaluar = async () => {
        if (!selectedArchivo) return;

        try {
            await evaluarArchivoKyc(selectedArchivo.id, {
                nuevoEstado: evaluacionEstado,
                comentario: comentario.trim() || undefined,
                razonRechazo: evaluacionEstado === EstadoOperacion.RECHAZADA ? razonRechazo : undefined,
            });

            setSuccessMessage(`Documento ${evaluacionEstado === EstadoOperacion.APROBADA ? 'aprobado' : 'rechazado'} exitosamente`);
            setSelectedArchivo(null);
            setComentario("");
            setEvaluacionEstado(EstadoOperacion.APROBADA);
            await cargarArchivosPendientes();
            
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (error) {
            console.error('Error al evaluar archivo:', error);
            setErrorMessage('Error al evaluar el documento');
            setTimeout(() => setErrorMessage(null), 5000);
        }
    };

    const handleVerArchivo = async (archivo: KycFile) => {
        try {
            const blob = await obtenerArchivoKyc(archivo.fileName);
            if (blob) {
                setSelectedFile({
                    name: archivo.fileName,
                    blob: blob
                });
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error('Error al obtener archivo:', error);
            setErrorMessage('Error al cargar el archivo');
            setTimeout(() => setErrorMessage(null), 5000);
        }
    };

    const getTipoDocumentoLabel = (tipo: TipoKycFile): string => {
        return tipo === TipoKycFile.DOCUMENTO_IDENTIDAD
            ? "Documento de Identidad"
            : "Comprobante de Domicilio";
    };

    const getRazonRechazoLabel = (razon: TipoRechazos): string => {
        switch (razon) {
            case TipoRechazos.ARCHIVO_NO_LEGIBLE:
                return "Archivo no legible";
            case TipoRechazos.INFORMACION_INCONSISTENTE:
                return "Información inconsistente";
            case TipoRechazos.DOCUMENTO_VENCIDO:
                return "Documento vencido";
            case TipoRechazos.DOCUMENTO_NO_VALIDO:
                return "Documento no válido";
            default:
                return razon;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Documentos KYC</h1>
                    <p className="text-gray-600">Revisa y aprueba los documentos de verificación de usuarios</p>
                </div>

                {/* Mensajes */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                        <CheckCircle className="text-green-600" size={24} />
                        <p className="text-green-700 font-medium">{successMessage}</p>
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                        <XCircle className="text-red-600" size={24} />
                        <p className="text-red-700 font-medium">{errorMessage}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Lista de documentos pendientes */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Clock className="text-orange-500" size={24} />
                                Documentos Pendientes
                            </h2>
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                {archivosPendientes.length}
                            </span>
                        </div>

                        {loadingArchivosPendientes ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                            </div>
                        ) : archivosPendientes.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="mx-auto text-gray-300 mb-4" size={64} />
                                <p className="text-gray-500 text-lg">No hay documentos pendientes</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-150 overflow-y-auto pr-2">
                                {archivosPendientes.map((archivo) => (
                                    <div
                                        key={archivo.id}
                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                            selectedArchivo?.id === archivo.id
                                                ? 'border-[#69AC95] bg-green-50'
                                                : 'border-gray-200 hover:border-[#69AC95] hover:bg-gray-50'
                                        }`}
                                        onClick={() => setSelectedArchivo(archivo)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-800">
                                                    {archivo.usuario?.username || 'Usuario desconocido'}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {getTipoDocumentoLabel(archivo.fileType)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleVerArchivo(archivo);
                                                }}
                                                className="p-2 hover:bg-[#69AC95] hover:text-white rounded-lg transition-all"
                                                title="Ver archivo"
                                            >
                                                <Eye size={20} />
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-500 space-y-1">
                                            <p>Subido: {new Date(archivo.uploadDate).toLocaleDateString()}</p>
                                            <p className="truncate">Archivo: {archivo.fileName}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Panel de evaluación */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Evaluar Documento</h2>

                        {selectedArchivo ? (
                            <div className="space-y-6">
                                {/* Información del documento */}
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <h3 className="font-bold text-gray-800 mb-3">Información del Documento</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Usuario:</span>
                                            <span className="font-medium text-gray-800">
                                                {selectedArchivo.usuario?.username}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium text-gray-800">
                                                {selectedArchivo.usuario?.email}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tipo:</span>
                                            <span className="font-medium text-gray-800">
                                                {getTipoDocumentoLabel(selectedArchivo.fileType)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Fecha:</span>
                                            <span className="font-medium text-gray-800">
                                                {new Date(selectedArchivo.uploadDate).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Tamaño:</span>
                                            <span className="font-medium text-gray-800">
                                                {(selectedArchivo.fileSize / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleVerArchivo(selectedArchivo)}
                                        className="mt-4 w-full px-4 py-2 bg-[#69AC95] text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Eye size={20} />
                                        Ver Documento
                                    </button>
                                </div>

                                {/* Formulario de evaluación */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Decisión *
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setEvaluacionEstado(EstadoOperacion.APROBADA)}
                                                className={`p-4 rounded-lg border-2 transition-all ${
                                                    evaluacionEstado === EstadoOperacion.APROBADA
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-300 hover:border-green-500'
                                                }`}
                                            >
                                                <CheckCircle
                                                    className={`mx-auto mb-2 ${
                                                        evaluacionEstado === EstadoOperacion.APROBADA
                                                            ? 'text-green-600'
                                                            : 'text-gray-400'
                                                    }`}
                                                    size={32}
                                                />
                                                <p className="font-medium text-gray-800">Aprobar</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEvaluacionEstado(EstadoOperacion.RECHAZADA)}
                                                className={`p-4 rounded-lg border-2 transition-all ${
                                                    evaluacionEstado === EstadoOperacion.RECHAZADA
                                                        ? 'border-red-500 bg-red-50'
                                                        : 'border-gray-300 hover:border-red-500'
                                                }`}
                                            >
                                                <XCircle
                                                    className={`mx-auto mb-2 ${
                                                        evaluacionEstado === EstadoOperacion.RECHAZADA
                                                            ? 'text-red-600'
                                                            : 'text-gray-400'
                                                    }`}
                                                    size={32}
                                                />
                                                <p className="font-medium text-gray-800">Rechazar</p>
                                            </button>
                                        </div>
                                    </div>

                                    {evaluacionEstado === EstadoOperacion.RECHAZADA && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Motivo de Rechazo *
                                            </label>
                                            <select
                                                value={razonRechazo}
                                                onChange={(e) => setRazonRechazo(e.target.value as TipoRechazos)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#69AC95] focus:border-transparent"
                                            >
                                                {Object.values(TipoRechazos).map((razon) => (
                                                    <option key={razon} value={razon}>
                                                        {getRazonRechazoLabel(razon)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Comentario {evaluacionEstado === EstadoOperacion.RECHAZADA && '*'}
                                        </label>
                                        <textarea
                                            value={comentario}
                                            onChange={(e) => setComentario(e.target.value)}
                                            placeholder={
                                                evaluacionEstado === EstadoOperacion.RECHAZADA
                                                    ? 'Explica el motivo del rechazo...'
                                                    : 'Comentario opcional...'
                                            }
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#69AC95] focus:border-transparent resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={handleEvaluar}
                                            disabled={loadingEvaluarArchivo || (evaluacionEstado === EstadoOperacion.RECHAZADA && !comentario.trim())}
                                            className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all ${
                                                evaluacionEstado === EstadoOperacion.APROBADA
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : 'bg-red-600 hover:bg-red-700'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {loadingEvaluarArchivo ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                    Evaluando...
                                                </span>
                                            ) : (
                                                `${evaluacionEstado === EstadoOperacion.APROBADA ? 'Aprobar' : 'Rechazar'} Documento`
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedArchivo(null);
                                                setComentario("");
                                                setEvaluacionEstado(EstadoOperacion.APROBADA);
                                            }}
                                            disabled={loadingEvaluarArchivo}
                                            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FileText className="mx-auto text-gray-300 mb-4" size={64} />
                                <p className="text-gray-500">
                                    Selecciona un documento de la lista para evaluarlo
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal para visualizar archivo */}
            <FileViewerModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedFile({ name: '', blob: null });
                }}
                fileName={selectedFile.name}
                fileBlob={selectedFile.blob}
            />
        </div>
    );
};