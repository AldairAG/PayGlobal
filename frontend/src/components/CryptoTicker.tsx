import { useCryptoPrices } from '../hooks/useCryptoPrices';

const formatPrice = (price: number): string => {
    if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1)    return price.toFixed(4);
    return price.toFixed(6);
};

export default function CryptoTicker() {
    const { prices, loading } = useCryptoPrices();

    const items = loading || prices.length === 0
        ? [
            { id: 'btc',  symbol: 'BTC/USD',  price: null, change24h: 0 },
            { id: 'eth',  symbol: 'ETH/USD',  price: null, change24h: 0 },
            { id: 'sol',  symbol: 'SOL/USD',  price: null, change24h: 0 },
            { id: 'bnb',  symbol: 'BNB/USD',  price: null, change24h: 0 },
            { id: 'ada',  symbol: 'ADA/USD',  price: null, change24h: 0 },
            { id: 'doge', symbol: 'DOGE/USD', price: null, change24h: 0 },
            { id: 'xrp',  symbol: 'XRP/USD',  price: null, change24h: 0 },
        ]
        : prices;

    return (
        <>
            <style>{`
                @keyframes crypto-ticker {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
                .crypto-ticker-anim { animation: crypto-ticker 28s linear infinite; }
            `}</style>
            <div className="overflow-hidden bg-[#F0973C]/10 border-y border-[#F0973C]/10 py-2">
                <div className="crypto-ticker-anim flex gap-16 whitespace-nowrap w-[200%]">
                    {[0, 1].map(pass => (
                        <div key={pass} className="flex gap-16">
                            {items.map(coin => {
                                const positive = coin.change24h >= 0;
                                const changeColor = positive ? 'text-[#69AC95]' : 'text-[#BC2020]';
                                return (
                                    <span key={`${pass}-${coin.id}`} className="text-xs font-mono">
                                        <span className="text-white/60">{coin.symbol}</span>{' '}
                                        {coin.price !== null
                                            ? <>
                                                <span className="text-white/90 font-semibold">${formatPrice(coin.price as number)}</span>{' '}
                                                <span className={changeColor}>
                                                    {positive ? '+' : ''}{coin.change24h.toFixed(2)}%
                                                </span>
                                              </>
                                            : <span className="text-white/30">—</span>
                                        }
                                    </span>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
