import { TipoCrypto,TipoRango } from "../type/enum";

export const cryptoLabels: Record<TipoCrypto, string> = {
    [TipoCrypto.USDT_ERC20]: "USDT (ERC20)",
    [TipoCrypto.USDT_TRC20]: "USDT (TRC20)",
    [TipoCrypto.SOLANA]: "Solana (SOL)",
    [TipoCrypto.USDT_BEP20]: "USDT (BEP20)"
};

export const obtenerRangoPorNombre = (nombre: string): TipoRango | null => {
    let resultado: TipoRango | null = null;
    Object.values(TipoRango).forEach(rango => {
        if (rango.nombre.toLocaleLowerCase() === nombre.toLowerCase()) {
            resultado = rango;
        }
    });
    return resultado;
}