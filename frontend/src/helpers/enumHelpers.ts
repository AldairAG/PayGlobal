import { TipoCrypto } from "../type/enum";

export const cryptoLabels: Record<TipoCrypto, string> = {
    [TipoCrypto.BITCOIN]: "Bitcoin (BTC)",
    [TipoCrypto.USDT_ERC20]: "USDT (ERC20)",
    [TipoCrypto.USDT_TRC20]: "USDT (TRC20)",
    [TipoCrypto.SOLANA]: "Solana (SOL)",
};