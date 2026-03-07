import { Upload, FileText, CheckCircle, XCircle, Clock, Trash2, Eye, AlertCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useKyc } from "../hooks/useKyc";
import { TipoKycFile, EstadoOperacion } from "../type/enum";
import type { KycFile } from "../type/entityTypes";
import { FileViewerModal } from "./modal/FileViewerModal";
import { useTranslation } from 'react-i18next';


interface KycDocumentsProps {
    usuarioId: number;
}

export const KycDocuments = ({ usuarioId }: KycDocumentsProps) => {
    const { t } = useTranslation();
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
            alert(t("profile.file_too_large"));
            return;
        }

        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            alert(t("profile.file_type_not_allowed"));
            return;
        }

        setUploadingType(tipo);
        setSuccessMessage(null);
        limpiarErrores();

        try {
            await subirArchivoKyc({ fileType: tipo, file }, usuarioId);
            setSuccessMessage(`${getTipoDocumentoLabel(tipo)} ${t("profile.upload_success")}`);
            // Recargar archivos
            await obtenerArchivosKycPorUsuario(usuarioId);
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (error) {
            console.error(t("profile.upload_error"), error);
        } finally {
            setUploadingType(null);
            // Limpiar el input
            event.target.value = '';
        }
    };

    // Manejar eliminación de archivo
    const handleDeleteFile = async (archivo: KycFile) => {
        if (!confirm(`${t("profile.confirm_delete")} ${getTipoDocumentoLabel(archivo.fileType)}${t("profile.?")}`)) {
            return;
        }

        try {
            await eliminarArchivoKyc(archivo.id);
            setSuccessMessage(t("profile.file_deleted_successfully"));
            // Recargar archivos
            await obtenerArchivosKycPorUsuario(usuarioId);
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (error) {
            console.error(t("profile.file_delete_error"), error);
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
            console.error(t("profile.file_get_error"), error);
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
            ? t("profile.document_identity")
            : t("profile.proof_of_address");
    };

    // Obtener descripción del tipo de documento
    const getTipoDocumentoDescripcion = (tipo: TipoKycFile): string => {
        return tipo === TipoKycFile.DOCUMENTO_IDENTIDAD
            ? t("profile.identity_document_description")
            : t("profile.proof_of_address_description");
    };

    // Obtener icono y color según estado
    const getEstadoInfo = (estado: EstadoOperacion) => {
        switch (estado) {
            case EstadoOperacion.APROBADA:
                return { icon: CheckCircle, color: 'text-[#69AC95]', bg: 'bg-[#69AC95]/10', border: 'border-[#69AC95]/30', text: t("profile.approved") };
            case EstadoOperacion.RECHAZADA:
                return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', text: t("profile.rejected") };
            case EstadoOperacion.PENDIENTE:
                return { icon: Clock, color: 'text-[#F0973C]', bg: 'bg-[#F0973C]/10', border: 'border-[#F0973C]/30', text: t("profile.in_review") };
            default:
                return { icon: Clock, color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10', text: t("profile.pending") };
        }
    };

    // Renderizar tarjeta de documento
    const renderDocumentCard = (tipo: TipoKycFile) => {
        const archivo = obtenerArchivoPorTipo(tipo);
        const estadoInfo = archivo ? getEstadoInfo(archivo.estado) : null;
        const IconoEstado = estadoInfo?.icon;
        const isUploading = uploadingType === tipo && loadingSubirArchivo;

        return (
            <div className="rounded-xl border border-[#69AC95]/20 bg-[#69AC95]/5 p-6 hover:border-[#69AC95]/40 transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#69AC95' }}>
                            <FileText size={24} className="text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{getTipoDocumentoLabel(tipo)}</h4>
                            <p className="text-xs text-white/40">{getTipoDocumentoDescripcion(tipo)}</p>
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
                        <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-white/70">{t("profile.file_uploaded")}</span>
                                <span className="text-xs text-white/40">
                                    {new Date(archivo.uploadDate).toLocaleDateString('es-ES')}
                                </span>
                            </div>
                            <p className="text-sm text-white/60 truncate">{archivo.fileName}</p>
                            <p className="text-xs text-white/40 mt-1">
                                {t("profile.file_size")} {(archivo.fileSize / 1024).toFixed(2)} KB
                            </p>
                        </div>

                        {/* Comentario de rechazo */}
                        {archivo.estado === EstadoOperacion.RECHAZADA && archivo.comentarioRechazo && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <p className="text-xs font-semibold text-red-400 mb-1">{t("profile.rejection_reason")}:</p>
                                <p className="text-sm text-red-400/80">{archivo.comentarioRechazo}</p>
                                {archivo.razonRechazo && (
                                    <p className="text-xs text-red-400/60 mt-1">{t("profile.reason")}: {archivo.razonRechazo}</p>
                                )}
                            </div>
                        )}

                        {/* Acciones */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleViewFile(archivo)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl transition-colors text-sm font-medium border border-white/10"
                            >
                                <Eye size={16} />
                                {t("profile.view")}
                            </button>
                            <button
                                onClick={() => handleDeleteFile(archivo)}
                                disabled={loadingEliminarArchivo}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 size={16} />
                                {t("profile.delete")}
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
                                    {isUploading ? t("profile.uploading") : t("profile.resubmit_document")}
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
                                className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#69AC95]/50 hover:bg-[#69AC95]/5 transition-all"
                            >
                                <Upload size={32} className="text-white/30" />
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-white/70">
                                        {isUploading ? t("profile.uploading_document") : t("profile.upload_document")}
                                    </p>
                                    <p className="text-xs text-white/30 mt-1">
                                            {t("profile.file_format")}
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
        <div className="rounded-2xl border border-[#F0973C]/20 bg-[#F0973C]/5 p-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-[#F0973C] mb-2">{t("profile.kyc_verification")}</h3>
                <p className="text-sm text-white/40">
                    {t("profile.kyc_verification_description")}
                </p>
            </div>

            {/* Mensajes */}
            {successMessage && (
                <div className="mb-4 p-4 bg-[#69AC95]/10 border border-[#69AC95]/30 rounded-xl flex items-center gap-3">
                    <CheckCircle size={20} className="text-[#69AC95]" />
                    <span className="text-sm font-medium text-[#69AC95]">{successMessage}</span>
                </div>
            )}

            {(errorMisArchivosKyc || errorSubirArchivo) && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-400" />
                    <span className="text-sm font-medium text-red-400">
                        {errorMisArchivosKyc || errorSubirArchivo}
                    </span>
                </div>
            )}

            {/* Estado de carga */}
            {loadingMisArchivosKyc ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#69AC95]"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderDocumentCard(TipoKycFile.DOCUMENTO_IDENTIDAD)}
                    {renderDocumentCard(TipoKycFile.COMPROBANTE_DOMICILIO)}
                </div>
            )}

            {/* Información adicional */}
            <div className="mt-6 p-4 bg-[#F0973C]/5 border border-[#F0973C]/20 rounded-xl">
                <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-[#F0973C] shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold mb-1 text-[#F0973C]">{t("profile.kyc_verification_info")}</p>
                        <ul className="list-disc list-inside space-y-1 text-xs text-white/50">
                            <li>{t("profile.kyc_verification_documents")}</li>
                            <li>{t("profile.kyc_verification_images")}</li>
                            <li>{t("profile.kyc_verification_notification")}</li>
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
