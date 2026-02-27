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
    BITCOIN = "BITCOIN",
    USDT_ERC20 = "USDT_ERC20",
    USDT_TRC20 = "USDT_TRC20",
    SOLANA = "SOLANA"
}

// Para enums con valores, usa objetos o un objeto const
export const TipoLicencia = {
    P10: { valor: 10, nombre: "P10" },
    P25: { valor: 25, nombre: "P25" },
    P50: { valor: 50, nombre: "P50" },
    P100: { valor: 100, nombre: "P100" },
    P200: { valor: 200, nombre: "P200" },
    P500: { valor: 500, nombre: "P500" },
    P1000: { valor: 1000, nombre: "P1000" },
    P3000: { valor: 3000, nombre: "P3000" },
    P5000: { valor: 5000, nombre: "P5000" },
    P10000: { valor: 10000, nombre: "P10000" },
    P15000: { valor: 15000, nombre: "P15000" },
    P25000: { valor: 25000, nombre: "P25000" },
    P50000: { valor: 50000, nombre: "P50000" }
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
    Key: string;
}

export const TipoRango = {
    SIN_RANGO: { nombre: "SIN RANGO", numero: 0, capitalNecesario: 0.0 ,Key: "SIN_RANGO"},
    SENIOR_MANAGER: { nombre: "SENIOR MANAGER", numero: 1, capitalNecesario: 5000 ,Key: "SENIOR_MANAGER"},
    EXECUTIVE_DIRECTOR: { nombre: "EXECUTIVE DIRECTOR", numero: 2, capitalNecesario: 10000 ,Key: "EXECUTIVE_DIRECTOR"},
    DIAMOND_TEAM: { nombre: "DIAMOND TEAM", numero: 3, capitalNecesario: 25000 ,Key: "DIAMOND_TEAM"},
    DOUBLE_DIAMOND: { nombre: "DOUBLE DIAMOND", numero: 4, capitalNecesario: 50000 ,Key: "DOUBLE_DIAMOND"},
    TRIPLE_DIAMOND: { nombre: "TRIPLE DIAMOND", numero: 5, capitalNecesario: 80000 ,Key: "TRIPLE_DIAMOND"},
    PRESIDENT_TEAM: { nombre: "PRESIDENT TEAM", numero: 6, capitalNecesario: 120000 ,Key: "PRESIDENT_TEAM"},
    PRESIDENT_BLACK_DIAMOND: { nombre: "PRESIDENT BLACK DIAMOND", numero: 7, capitalNecesario: 240000 ,Key: "PRESIDENT_BLACK_DIAMOND"},
    CROWN_BLACK_DIAMOND: { nombre: "CROWN BLACK DIAMOND", numero: 8, capitalNecesario: 480000 ,Key: "CROWN_BLACK_DIAMOND"},
    AMBASSADOR: { nombre: "AMBASSADOR", numero: 9, capitalNecesario: 1000000 ,Key: "AMBASSADOR"},
    GLOBAL_AMBASSADOR: { nombre: "GLOBAL AMBASSADOR", numero: 10, capitalNecesario: 2000000 ,Key: "GLOBAL_AMBASSADOR"}
} as const;

export enum TipoWallets {
    WALLET_DIVIDENDOS = "WALLET_DIVIDENDOS",
    WALLET_COMISIONES = "WALLET_COMISIONES"
}

export enum TipoSolicitud {
    COMPRA_LICENCIA = "COMPRA_LICENCIA",
    SOLICITUD_RETIRO_WALLET_DIVIDENDOS = "SOLICITUD_RETIRO_WALLET_DIVIDENDOS",
    SOLICITUD_RETIRO_WALLET_COMISIONES = "SOLICITUD_RETIRO_WALLET_COMISIONES",
    TRANFERENCIA_USUARIO = "TRANFERENCIA_USUARIO",
    PAGO_DELEGADO = "PAGO_DELEGADO",
}

export enum EstadoOperacion {
    PENDIENTE = "PENDIENTE",
    COMPLETADA = "COMPLETADA",
    FALLIDA = "FALLIDA",
    APROBADA = "APROBADA",
    RECHAZADA = "RECHAZADA"
}

export enum EstadoTicket {
    ABIERTO = "ABIERTO",
    CERRADO = "CERRADO"
}

export enum TipoAutorTiket {
    SOLICITANTE = "SOLICITANTE",
    SOPORTE = "SOPORTE"
}

export enum TipoConceptos {
    BONO_REGISTRO_DIRECTO = "BONO_REGISTRO_DIRECTO",
    BONO_REGISTRO_INDIRECTO = "BONO_REGISTRO_INDIRECTO",
    BONO_REONOVACION_LICENCIA = "BONO_REONOVACION_LICENCIA",
    BONO_UNINIVEL = "BONO_UNINIVEL",
    BONO_RANGO = "BONO_RANGO",
    INGRESO_PASIVO = "INGRESO_PASIVO",
    BONO_ANUAL = "BONO_ANUAL",
    BONO_FUNDADOR = "BONO_FUNDADOR",
    COMPRA_LICENCIA_DELEGADA = "COMPRA_LICENCIA_DELEGADA",
    COMPRA_LICENCIA = "COMPRA_LICENCIA",
    RETIRO_FONDOS = "RETIRO_FONDOS",
    TRANSFERENCIA_ENTRE_USUARIOS = "TRANSFERENCIA_ENTRE_USUARIOS"
}

export enum TipoMetodoPago {
    TRANSFERENCIA_CRYPTO= "TRANSFERENCIA_CRYPTO",
    WALLET_DIVIDENDOS = "WALLET_DIVIDENDOS",
    WALLET_COMISIONES = "WALLET_COMISIONES"
}

export enum TipoKycFile {
    COMPROBANTE_DOMICILIO = "COMPROBANTE_DOMICILIO",
    DOCUMENTO_IDENTIDAD = "DOCUMENTO_IDENTIDAD"
}

export enum TipoRechazos {
    ARCHIVO_NO_LEGIBLE = "ARCHIVO_NO_LEGIBLE",
    INFORMACION_INCONSISTENTE = "INFORMACION_INCONSISTENTE",
    DOCUMENTO_VENCIDO = "DOCUMENTO_VENCIDO",
    DOCUMENTO_NO_VALIDO = "DOCUMENTO_NO_VALIDO"
}