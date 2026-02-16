export enum CodigoTipoWallets {
    WD,
    WC
}

export enum TipoBono {
    BONO_INSCRIPCION,
    BONO_RENOVACION,
    BONO_UNINIVEL,
    BONO_POOL_ANUAL,
    BONO_FUNDADOR,
    BONO_RANGO
}

export enum TipoCrypto {
    BITCOIN="BITCOIN",
    USDT_ERC20="USDT_ERC20",
    USDT_TRC20="USDT_TRC20",
    SOLANA="SOLANA"
}

// Para enums con valores, usa objetos o un objeto const
export const TipoLicencia = {
    P10: { valor: 10 ,nombre: "P10"},
    P25: { valor: 25 ,nombre: "P25"},
    P50: { valor: 50 ,nombre: "P50"},
    P100: { valor: 100 ,nombre: "P100"},
    P200: { valor: 200 ,nombre: "P200"},
    P500: { valor: 500 ,nombre: "P500"},
    P1000: { valor: 1000 ,nombre: "P1000"},
    P3000: { valor: 3000 ,nombre: "P3000"},
    P5000: { valor: 5000 ,nombre: "P5000"},
    P10000: { valor: 10000 ,nombre: "P10000"},
    P15000: { valor: 15000 ,nombre: "P15000"},
    P25000: { valor: 25000 ,nombre: "P25000"},
    P50000: { valor: 50000 ,nombre: "P50000"}
} as const;

export enum CodigoTipoBono {
    BI,
    BR,
    BU,
    BPA,
    BF,
    BRG
}

export interface TipoRango {
    nombre: string;
    numero: number;
    capitalNecesario: number;
}

export const TipoRango = {
    RANGO_0: { nombre: "Rango 0", numero: 0, capitalNecesario: 0.0 },
    RANGO_1: { nombre: "Rango 1", numero: 1, capitalNecesario: 10.0 },
    RANGO_2: { nombre: "Rango 2", numero: 2, capitalNecesario: 20.0 },
    RANGO_3: { nombre: "Rango 3", numero: 3, capitalNecesario: 30.0 },
    RANGO_4: { nombre: "Rango 4", numero: 4, capitalNecesario: 40.0 },
    RANGO_5: { nombre: "Rango 5", numero: 5, capitalNecesario: 50.0 },
    RANGO_6: { nombre: "Rango 6", numero: 6, capitalNecesario: 60.0 },
    RANGO_7: { nombre: "Rango 7", numero: 7, capitalNecesario: 70.0 },
    RANGO_8: { nombre: "Rango 8", numero: 8, capitalNecesario: 80.0 },
    RANGO_9: { nombre: "Rango 9", numero: 9, capitalNecesario: 90.0 },
    RANGO_10: { nombre: "Rango 10", numero: 10, capitalNecesario: 100.0 }
} as const;

export enum TipoWallets {
    WALLET_DIVIDENDOS = "WALLET_DIVIDENDOS",
    WALLET_COMISIONES = "WALLET_COMISIONES"
}

export enum TipoSolicitud {
    COMPRA_LICENCIA="COMPRA_LICENCIA",
    SOLICITUD_RETIRO_WALLET_DIVIDENDOS="SOLICITUD_RETIRO_WALLET_DIVIDENDOS",
    SOLICITUD_RETIRO_WALLET_COMISIONES="SOLICITUD_RETIRO_WALLET_COMISIONES",
    TRANFERENCIA_USUARIO="TRANFERENCIA_USUARIO",
    PAGO_DELEGADO="PAGO_DELEGADO",
}

export enum EstadoOperacion{
    PENDIENTE="PENDIENTE",
    COMPLETADA="COMPLETADA",
    FALLIDA="FALLIDA",
    APROBADA="APROBADA",
    RECHAZADA="RECHAZADA"
}

export enum EstadoTicket {
    ABIERTO = "abierto",
    CERRADO = "cerrado"
}
