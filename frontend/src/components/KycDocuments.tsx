import { Upload, FileText, CheckCircle, XCircle, Clock, Trash2, Eye, AlertCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useKyc } from "../hooks/useKyc";
import { TipoKycFile, EstadoOperacion } from "../type/enum";
import type { KycFile } from "../type/entityTypes";
import { FileViewerModal } from "./modal/FileViewerModal";

interface KycDocumentsProps {
    usuarioId: number;
}

export const KycDocuments = ({ usuarioId }: KycDocumentsProps) => {
    const {
        misArchivosKyc,
        loadingMisArchivosKyc,
        errorMisArchivosKyc,
        loadingSubirArchivo,
        errorSubirArchivo,
        loadingEliminarArchivo,
        subirArchivoKyc,
        eliminarArchivoKyc,
        obtenerArchivosKycPorUsuario,
        obtenerArchivoKyc,
        limpiarErrores
    } = useKyc();

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [uploadingType, setUploadingType] = useState<TipoKycFile | null>(null);
    
    // Estado para el modal de visualización
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<{ name: string; blob: Blob | null }>({
        name: '',
        blob: null
    });

    // Cargar archivos al montar el componente
    const cargarArchivos = useCallback(() => {
        if (usuarioId) {
            obtenerArchivosKycPorUsuario(usuarioId);
        }
    }, [usuarioId, obtenerArchivosKycPorUsuario]);

    useEffect(() => {
        cargarArchivos();
    }, [cargarArchivos]);

    // Obtener archivo por tipo
    const obtenerArchivoPorTipo = (tipo: TipoKycFile): KycFile | undefined => {
        return misArchivosKyc.find(archivo => archivo.fileType === tipo);
    };

    // Manejar subida de archivo
    const handleFileUpload = async (tipo: TipoKycFile, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tamaño (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("El archivo es demasiado grande. Máximo 5MB.");
            return;
        }

        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            alert("Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG) y PDF.");
            return;
        }

        setUploadingType(tipo);
        setSuccessMessage(null);
        limpiarErrores();

        try {
            await subirArchivoKyc({ fileType: tipo, file }, usuarioId);
            setSuccessMessage(`${getTipoDocumentoLabel(tipo)} subido exitosamente`);
            // Recargar archivos
            await obtenerArchivosKycPorUsuario(usuarioId);
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (error) {
            console.error('Error al subir archivo:', error);
        } finally {
            setUploadingType(null);
            // Limpiar el input
            event.target.value = '';
        }
    };

    // Manejar eliminación de archivo
    const handleDeleteFile = async (archivo: KycFile) => {
        if (!confirm(`¿Estás seguro de eliminar ${getTipoDocumentoLabel(archivo.fileType)}?`)) {
            return;
        }

        try {
            await eliminarArchivoKyc(archivo.id);
            setSuccessMessage("Archivo eliminado exitosamente");
            // Recargar archivos
            await obtenerArchivosKycPorUsuario(usuarioId);
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (error) {
            console.error('Error al eliminar archivo:', error);
        }
    };

    // Manejar visualización de archivo en modal
    const handleViewFile = async (archivo: KycFile) => {
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
        }
    };

    // Cerrar modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFile({ name: '', blob: null });
    };

    // Obtener label del tipo de documento
    const getTipoDocumentoLabel = (tipo: TipoKycFile): string => {
        return tipo === TipoKycFile.DOCUMENTO_IDENTIDAD
            ? "Documento de Identidad"
            : "Comprobante de Domicilio";
    };

    // Obtener descripción del tipo de documento
    const getTipoDocumentoDescripcion = (tipo: TipoKycFile): string => {
        return tipo === TipoKycFile.DOCUMENTO_IDENTIDAD
            ? "INE, Pasaporte, Licencia de Conducir"
            : "Recibo de luz, agua, teléfono o estado de cuenta";
    };

    // Obtener icono y color según estado
    const getEstadoInfo = (estado: EstadoOperacion) => {
        switch (estado) {
            case EstadoOperacion.APROBADA:
                return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', text: 'Aprobado' };
            case EstadoOperacion.RECHAZADA:
                return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', text: 'Rechazado' };
            case EstadoOperacion.PENDIENTE:
                return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'En Revisión' };
            default:
                return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', text: 'Pendiente' };
        }
    };

    // Renderizar tarjeta de documento
    const renderDocumentCard = (tipo: TipoKycFile) => {
        const archivo = obtenerArchivoPorTipo(tipo);
        const estadoInfo = archivo ? getEstadoInfo(archivo.estado) : null;
        const IconoEstado = estadoInfo?.icon;
        const isUploading = uploadingType === tipo && loadingSubirArchivo;

        return (
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-gray-300 transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#69AC95' }}>
                            <FileText size={24} className="text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">{getTipoDocumentoLabel(tipo)}</h4>
                            <p className="text-xs text-gray-500">{getTipoDocumentoDescripcion(tipo)}</p>
                        </div>
                    </div>
                    {estadoInfo && IconoEstado && (
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${estadoInfo.bg} ${estadoInfo.border} border`}>
                            <IconoEstado size={14} className={estadoInfo.color} />
                            <span className={`text-xs font-semibold ${estadoInfo.color}`}>
                                {estadoInfo.text}
                            </span>
                        </div>
                    )}
                </div>

                {/* Contenido */}
                {archivo ? (
                    <div className="space-y-3">
                        {/* Información del archivo */}
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Archivo subido:</span>
                                <span className="text-xs text-gray-500">
                                    {new Date(archivo.uploadDate).toLocaleDateString('es-ES')}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{archivo.fileName}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Tamaño: {(archivo.fileSize / 1024).toFixed(2)} KB
                            </p>
                        </div>

                        {/* Comentario de rechazo */}
                        {archivo.estado === EstadoOperacion.RECHAZADA && archivo.comentarioRechazo && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-xs font-semibold text-red-700 mb-1">Motivo de rechazo:</p>
                                <p className="text-sm text-red-600">{archivo.comentarioRechazo}</p>
                                {archivo.razonRechazo && (
                                    <p className="text-xs text-red-500 mt-1">Razón: {archivo.razonRechazo}</p>
                                )}
                            </div>
                        )}

                        {/* Acciones */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleViewFile(archivo)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Eye size={16} />
                                Ver
                            </button>
                            <button
                                onClick={() => handleDeleteFile(archivo)}
                                disabled={loadingEliminarArchivo}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 size={16} />
                                Eliminar
                            </button>
                        </div>

                        {/* Opción de resubir si fue rechazado */}
                        {archivo.estado === EstadoOperacion.RECHAZADA && (
                            <label className="block">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                                    onChange={(e) => handleFileUpload(tipo, e)}
                                    disabled={isUploading}
                                    className="hidden"
                                />
                                <div
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white cursor-pointer hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: '#F0973C' }}
                                >
                                    <Upload size={18} />
                                    {isUploading ? "Subiendo..." : "Resubir Documento"}
                                </div>
                            </label>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Zona de subida */}
                        <label className="block">
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,application/pdf"
                                onChange={(e) => handleFileUpload(tipo, e)}
                                disabled={isUploading}
                                className="hidden"
                            />
                            <div
                                className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Upload size={32} className="text-gray-400" />
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-gray-700">
                                        {isUploading ? "Subiendo documento..." : "Subir documento"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        JPG, PNG o PDF (máx. 5MB)
                                    </p>
                                </div>
                            </div>
                        </label>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Verificación KYC</h3>
                <p className="text-sm text-gray-500">
                    Sube los documentos requeridos para verificar tu identidad
                </p>
            </div>

            {/* Mensajes */}
            {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">{successMessage}</span>
                </div>
            )}

            {(errorMisArchivosKyc || errorSubirArchivo) && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-600" />
                    <span className="text-sm font-medium text-red-700">
                        {errorMisArchivosKyc || errorSubirArchivo}
                    </span>
                </div>
            )}

            {/* Estado de carga */}
            {loadingMisArchivosKyc ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderDocumentCard(TipoKycFile.DOCUMENTO_IDENTIDAD)}
                    {renderDocumentCard(TipoKycFile.COMPROBANTE_DOMICILIO)}
                </div>
            )}

            {/* Información adicional */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                        <p className="font-semibold mb-1">Información importante:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>Los documentos deben ser legibles y estar vigentes</li>
                            <li>Las imágenes deben mostrar claramente toda la información</li>
                            <li>El proceso de verificación puede tomar hasta 48 horas</li>
                            <li>Recibirás una notificación cuando tus documentos sean revisados</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Modal de visualización de archivos */}
            <FileViewerModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                fileName={selectedFile.name}
                fileBlob={selectedFile.blob}
            />
        </div>
    );
};
