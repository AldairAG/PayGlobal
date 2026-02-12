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

export const LICENCIAS = {
    LICENCIA1: { name: "Licencia 1", value: 100 },
    LICENCIA2: { name: "Licencia 2", value: 200 },
    LICENCIA3: { name: "Licencia 3", value: 500 },
    LICENCIA4: { name: "Licencia 4", value: 1000 },
    LICENCIA5: { name: "Licencia 5", value: 3000 },
    LICENCIA6: { name: "Licencia 6", value: 5000 },
    LICENCIA7: { name: "Licencia 7", value: 10000 },
    LICENCIA8: { name: "Licencia 8", value: 15000 },
    LICENCIA9: { name: "Licencia 9", value: 25000 },
    LICENCIA10: { name: "Licencia 10", value: 50000 },
};
