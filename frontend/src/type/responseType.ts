import type { Licencia } from "./entityTypes";
import { EstadoOperacion, TipoCrypto, TipoSolicitud } from "./enum";

export interface GananciaMesDTO {
    mes: string;
    ganancia: number;
}

export interface GananciaDiaDTO {
    fecha: string; // Formato: yyyy-MM-dd
    ganancia: number;
}

export interface UsuarioEnRedResponse { 
    id: number;
    username: string;
    licencia:Licencia;  
    nivel: number;
    referido: string;
}

export interface SolicitudRetiroDTO {
    // Campos de la solicitud
    id: number;
    tipoSolicitud: TipoSolicitud;
    monto: number;
    fecha: Date;
    estado: EstadoOperacion;
    tipoCrypto: TipoCrypto;
    walletAddress: string;
    descripcion: string;
    
    // Campos del usuario
    usuarioId: number;
    username: string;
    email: string;
    nombre: string;
    apellido: string;
}

// Estadísticas
export interface UsuariosNuevosDTO {
    fecha: string; // Fecha en formato "YYYY-MM-DD"
    cantidad: number;
}

export interface GananciasLicenciasDTO {
    totalComprasAceptadas: number;
    totalGanancias: number;
}

export interface ComisionesRetirosDTO {
    totalRetiros: number;
    totalComisiones: number;
}

export interface UsuariosPorLicenciaDTO {
    licencia: string; // Nombre de la licencia (P0, P10, P25, etc.)
    cantidad: number;
}

export interface EstadisticasDTO {
    usuariosNuevosMes: UsuariosNuevosDTO[];
    gananciasLicencias: GananciasLicenciasDTO;
    comisionesRetiros: ComisionesRetirosDTO;
    usuariosPorLicencia: UsuariosPorLicenciaDTO[];
}
