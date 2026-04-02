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
