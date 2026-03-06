import { useState, useEffect } from 'react';

export interface CryptoPrice {
    id: string;
    symbol: string;
    price: number;
    change24h: number;
}

const COINS = [
    { id: 'bitcoin',      symbol: 'BTC/USD' },
    { id: 'ethereum',     symbol: 'ETH/USD' },
    { id: 'solana',       symbol: 'SOL/USD' },
    { id: 'binancecoin',  symbol: 'BNB/USD' },
    { id: 'cardano',      symbol: 'ADA/USD' },
    { id: 'dogecoin',     symbol: 'DOGE/USD' },
    { id: 'ripple',       symbol: 'XRP/USD' },
];

const IDS = COINS.map(c => c.id).join(',');

export function useCryptoPrices() {
    const [prices, setPrices] = useState<CryptoPrice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchPrices = async () => {
            try {
                const res = await fetch(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${IDS}&vs_currencies=usd&include_24hr_change=true`
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (cancelled) return;
                setPrices(
                    COINS.map(coin => ({
                        id: coin.id,
                        symbol: coin.symbol,
                        price: data[coin.id]?.usd ?? 0,
                        change24h: data[coin.id]?.usd_24h_change ?? 0,
                    }))
                );
                setError(null);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : 'Error');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 60_000);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    return { prices, loading, error };
}
