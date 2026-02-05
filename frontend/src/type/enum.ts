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
    BITCOIN,
    USDT_ERC20,
    USDT_TRC20,
    SOLANA
}

// Para enums con valores, usa objetos o un objeto const
export const TipoLicencia = {
    LICENCIA1: { valor: 100 },
    LICENCIA2: { valor: 200 },
    LICENCIA3: { valor: 500 },
    LICENCIA4: { valor: 1000 },
    LICENCIA5: { valor: 3000 },
    LICENCIA6: { valor: 5000 },
    LICENCIA7: { valor: 10000 },
    LICENCIA8: { valor: 15000 },
    LICENCIA9: { valor: 25000 },
    LICENCIA10: { valor: 50000 }
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
    WALLET_DIVIDENDOS,
    WALLET_COMISIONES
}
