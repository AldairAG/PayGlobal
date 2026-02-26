import { X } from "lucide-react";
import { useEffect, useMemo } from "react";

interface FileViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileName: string;
    fileBlob: Blob | null;
}

export const FileViewerModal = ({ isOpen, onClose, fileName, fileBlob }: FileViewerModalProps) => {

    // Crear URL del blob usando useMemo para evitar recreaciones innecesarias
    const fileUrl = useMemo(() => {
        if (fileBlob) {
            const url = window.URL.createObjectURL(fileBlob);
            console.log('URL creada:', url);
            return url;
        }
        return null;
    }, [fileBlob]);

    // Obtener el tipo de archivo directamente del blob
    const fileType = fileBlob?.type || "";
    
    console.log('fileType detectado:', fileType);

    // Limpiar URL cuando el componente se desmonte o cambie el blob
    useEffect(() => {
        return () => {
            if (fileUrl) {
                window.URL.revokeObjectURL(fileUrl);
            }
        };
    }, [fileUrl]);

    if (!isOpen) return null;

    const isPDF = fileType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
    const isImage = fileType.startsWith('image/') || 
                    fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/);
    
    console.log('isPDF:', isPDF);
    console.log('isImage:', isImage);

    const handleDownload = () => {
        if (fileUrl) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-800 truncate">{fileName}</h3>
                        <p className="text-sm text-gray-500">Tipo: {fileType || 'Desconocido'}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-all"
                            style={{ backgroundColor: '#69AC95' }}
                        >
                            Descargar
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 bg-gray-50">
                    {fileUrl ? (
                        <div className="h-full flex items-center justify-center">
                            {isPDF ? (
                                <iframe
                                    src={fileUrl}
                                    className="w-full h-full min-h-150 rounded-lg border border-gray-300"
                                    title={fileName}
                                />
                            ) : isImage ? (
                                <img
                                    src={fileUrl}
                                    alt={fileName}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                />
                            ) : (
                                <div className="text-center p-8">
                                    <p className="text-gray-600 mb-4">
                                        No se puede previsualizar este tipo de archivo
                                    </p>
                                    <button
                                        onClick={handleDownload}
                                        className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-all"
                                        style={{ backgroundColor: '#69AC95' }}
                                    >
                                        Descargar Archivo
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
