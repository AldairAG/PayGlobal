import { EstadoTicket, TipoConceptos, TipoMetodoPago, TipoSolicitud, type CodigoTipoBono, type CodigoTipoWallets, type EstadoOperacion, type TipoBono, type TipoCrypto, type TipoWallets } from "./enum";

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
    rango: string;
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
    P10: { name: "P10", value: 10 },
    P25: { name: "P25", value: 25 },
    P50: { name: "P50", value: 50 },
    P100: { name: "P100", value: 100 },
    P200: { name: "P200", value: 200 },
    P500: { name: "P500", value: 500 },
    P1000: { name: "P1000", value: 1000 },
    P3000: { name: "P3000", value: 3000 },
    P5000: { name: "P5000", value: 5000 },
    P10000: { name: "P10000", value: 10000 },
    P15000: { name: "P15000", value: 15000 },
    P25000: { name: "P25000", value: 25000 },
    P50000: { name: "P50000", value: 50000 },
};


interface Operacion {
    monto: number;
    fecha: Date;
    estado: EstadoOperacion;
    tipoCrypto: TipoCrypto;
    descripcion: string;
}

export interface Solicitud extends Operacion {
    id: number;
    walletAddress: string;
    tipoSolicitud: TipoSolicitud;
}



export interface RespuestaTicket {
    id: number;
    respuesta: string;
    fechaRespuesta: Date;
}

export interface Ticket {
    id: number;
    asunto: string;
    fechaCreacion: Date;
    estado: EstadoTicket;
    descripcion: string;
    respuestas: RespuestaTicket[];
}

export interface WalletRetiro {
    id: number;
    address: string;
    tipoCrypto: TipoCrypto;
    nombre: string;
    balanceRetirado: number;
    usuario: string;
}

export interface SolicitudRetiro {
    walletId: number;
    walletAddress: string;
    monto: number;
    fecha: Date;
    estado: EstadoOperacion;
    tipoCrypto: TipoCrypto;
}

export interface WalletAddress {
    id: number;
    address: string;
    tipoCrypto: TipoCrypto;
    nombre: string;
    balanceRetirado: number;
}


export interface Transaccion extends Operacion {
    id: number;
    concepto: TipoConceptos;
    metodoPago: TipoMetodoPago;
    usuario: Usuario;
}