import { useForexRates } from '../hooks/useForexRates';

const PLACEHOLDER = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF',
    'AUD/USD', 'USD/CAD', 'USD/CNY', 'USD/MXN',
];

const formatRate = ( rate: number): string => {
    // JPY, CNY, MXN pairs typically show 2 decimals at large values
    if (rate >= 100) return rate.toFixed(2);
    return rate.toFixed(4);
};

export default function ForexTicker() {
    const { rates, loading } = useForexRates();

    const items = loading || rates.length === 0 ? PLACEHOLDER.map(p => ({ pair: p, rate: null })) : rates;

    return (
        <>
            <style>{`
                @keyframes forex-ticker {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
                .forex-ticker-anim { animation: forex-ticker 32s linear infinite; }
            `}</style>
            <div className="overflow-hidden border-b border-white/5 bg-white/[0.03] py-2">
                <div className="flex items-center gap-3 px-4 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 shrink-0">Forex</span>
                    <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="forex-ticker-anim flex gap-12 whitespace-nowrap w-[200%]">
                    {[0, 1].map(pass => (
                        <div key={pass} className="flex gap-12">
                            {items.map((item, i) => (
                                <span key={`${pass}-${i}`} className="text-xs font-mono">
                                    <span className="text-white/50">{item.pair}</span>{' '}
                                    {item.rate !== null
                                        ? <span className="text-[#A5D6C8] font-semibold">{formatRate( item.rate as number)}</span>
                                        : <span className="text-white/20">—</span>
                                    }
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
