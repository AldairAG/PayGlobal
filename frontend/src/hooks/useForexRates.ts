import { useState, useEffect } from 'react';

export interface ForexRate {
    pair: string;
    rate: number;
}

// Pairs displayed and how to compute them from a USD base response
// "invert" means the pair is XXX/USD, so rate = 1 / rates[XXX]
// "direct" means the pair is USD/XXX, so rate = rates[XXX]
const PAIRS: { pair: string; target: string; invert: boolean }[] = [
    { pair: 'EUR/USD', target: 'EUR', invert: true },
    { pair: 'GBP/USD', target: 'GBP', invert: true },
    { pair: 'USD/JPY', target: 'JPY', invert: false },
    { pair: 'USD/CHF', target: 'CHF', invert: false },
    { pair: 'AUD/USD', target: 'AUD', invert: true },
    { pair: 'USD/CAD', target: 'CAD', invert: false },
    { pair: 'USD/CNY', target: 'CNY', invert: false },
    { pair: 'USD/MXN', target: 'MXN', invert: false },
];

const TARGETS = PAIRS.map(p => p.target).join(',');

export function useForexRates() {
    const [rates, setRates] = useState<ForexRate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchRates = async () => {
            try {
                const res = await fetch(
                    `https://api.frankfurter.app/latest?from=USD&to=${TARGETS}`
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data: { rates: Record<string, number> } = await res.json();
                if (cancelled) return;
                setRates(
                    PAIRS.map(({ pair, target, invert }) => ({
                        pair,
                        rate: invert ? 1 / data.rates[target] : data.rates[target],
                    }))
                );
                setError(null);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : 'Error');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchRates();
        // ECB updates once per day; refresh every 30 min is more than enough
        const interval = setInterval(fetchRates, 30 * 60_000);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    return { rates, loading, error };
}
