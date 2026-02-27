import type { EstadoOperacion, EstadoTicket, TipoCrypto, TipoKycFile, TipoRechazos } from "./enum";

export interface RegistroRequestDTO {
    username: string;
    password: string;
    email: string;
    referenciado: string;
}

export interface LoginRequestDTO {
    username: string;
    password: string;
}

export interface EditarPerfilRequestDTO {
    nombre: string;
    apellido: string;
    telefono: string;
    pais: string;   
}

export interface CreateWalletAddress {
    address: string;
    tipoCrypto: TipoCrypto;
    nombre: string;

}

export interface CrearTiketRequest {
    asunto?: string;
    descripcion?: string;
    estado?: EstadoTicket;
    comentario?: string;
}

export interface GuardarKycFileRequest {
    fileType: TipoKycFile;
    file: File;
}

export interface EvaluarKycFileRequest {
    nuevoEstado: EstadoOperacion;
    comentario?: string;
    razonRechazo?: TipoRechazos;
}