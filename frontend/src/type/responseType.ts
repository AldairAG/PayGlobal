import type { Licencia } from "./entityTypes";

export interface GananciaMesDTO {
    mes: string;
    ganancia: number;
}

export interface UsuarioEnRedResponse { 
    id: number;
    username: string;
    licencia:Licencia;  
    nivel: number;
    referido: string;
}
