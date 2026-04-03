import { useState } from 'react';
import { estadisticasService } from '../service/estadisticasService';
import type { EstadisticasDTO } from '../type/responseType';

export const useEstadisticas = () => {
    const [estadisticas, setEstadisticas] = useState<EstadisticasDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const obtenerEstadisticas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await estadisticasService.obtenerEstadisticas();
            setEstadisticas(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al obtener estadísticas');
            console.error('Error al obtener estadísticas:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        estadisticas,
        loading,
        error,
        obtenerEstadisticas
    };
};
