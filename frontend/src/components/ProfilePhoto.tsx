import { useEffect, useRef, useState } from "react";
import { Camera, User } from "lucide-react";
import { useUsuario } from "../hooks/usuarioHook";

interface ProfilePhotoProps {
    /** Nombre de archivo guardado en el servidor (campo fotoPerfil del usuario) */
    fotoPerfil?: string;
    /** Tamaño del contenedor (clases Tailwind, default: "w-32 h-32") */
    size?: string;
    /** Modo solo lectura: no muestra botón de carga */
    readOnly?: boolean;
}

export const ProfilePhoto = ({ fotoPerfil, size = "w-32 h-32", readOnly = false }: ProfilePhotoProps) => {
    const { subirFotoPerfil, obtenerFotoPerfil, loadingSubirFotoPerfil } = useUsuario();
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Cargar imagen cuando exista fotoPerfil
    useEffect(() => {
        if (!fotoPerfil) return;
        let objectUrl: string | null = null;

        const cargar = async () => {
            try {
                const blob = await obtenerFotoPerfil(fotoPerfil);
                if (blob.size > 0) {
                    objectUrl = URL.createObjectURL(blob);
                    setBlobUrl(objectUrl);
                }
            } catch {
                // silencioso: mostrar placeholder
            }
        };

        cargar();
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
        // obtenerFotoPerfil es estable (no depende de estado que cambie)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fotoPerfil]);

    const handleClick = () => {
        if (!readOnly) inputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setError("Solo se aceptan imágenes JPG, PNG o WEBP.");
            return;
        }
        // Validar tamaño (5 MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("La imagen no puede superar los 5 MB.");
            return;
        }
        setError(null);

        // Preview local inmediato
        const preview = URL.createObjectURL(file);
        setBlobUrl(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return preview;
        });

        try {
            await subirFotoPerfil(file);
        } catch {
            setError("Error al subir la foto. Inténtalo de nuevo.");
        }

        // Limpiar input para permitir resubida del mismo archivo
        e.target.value = "";
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={`${size} rounded-full relative flex items-center justify-center border border-[#69AC95]/30 bg-[#69AC95]/20 overflow-hidden group ${!readOnly ? "cursor-pointer" : ""}`}
                onClick={handleClick}
                title={!readOnly ? "Cambiar foto de perfil" : undefined}
            >
                {blobUrl ? (
                    <img src={blobUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
                ) : (
                    <User size={64} className="text-[#69AC95]" />
                )}

                {/* Overlay hover */}
                {!readOnly && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full">
                        {loadingSubirFotoPerfil ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Camera size={28} className="text-white" />
                        )}
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    aria-label="Subir foto de perfil"
                    onChange={handleFileChange}
                    disabled={loadingSubirFotoPerfil}
                />
            </div>

            {error && (
                <p className="text-red-400 text-xs text-center max-w-40">{error}</p>
            )}
        </div>
    );
};
