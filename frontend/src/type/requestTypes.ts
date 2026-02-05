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