import type { CodigoTipoBono, CodigoTipoWallets, TipoBono, TipoRango, TipoWallets } from "./enum";

export interface Usuario {
    id: number;
    username: string;
    password: string;
    email: string;
    nombre: string;
    apellido: string;
    telefono: string;
    pais: string;
    referenciado: string;
    fechaRegistro: Date;
    activo: boolean;
    rango: TipoRango;
    verificado: boolean;
    bonos: Bono[];
    wallets: Wallet[];
    licencia: Licencia;

}

export interface Bono {
    id: number;
    codigo: CodigoTipoBono;
    nombre: TipoBono;
    acumulado: number;
}

export interface Wallet {
    id: number;
    tipo: TipoWallets;
    codigo: CodigoTipoWallets;
    saldo: number;
}

export interface Licencia {
    id: number;
    nombre: string;
    precio: number;
    limite: number;
    activo: boolean;
    fechaCompra: Date;
    saldoAcumulado: number;
}

