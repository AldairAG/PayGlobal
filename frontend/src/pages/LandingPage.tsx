import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Rocket, Gem, Zap, Lock, Crown, BarChart3, Globe, Sprout, Award, Sparkles, ShieldCheck, CheckCircle } from "lucide-react";
import LangSelector from "../components/LangSelector";
import LoginModal from "../components/modal/LoginModal";
import RegisterModal from "../components/modal/RegisterModal";
import LogoA from "../assets/LogoA.png";
import LogoV from "../assets/LogoV.png";

const ReturnsTable = () => {
    const tableData = [
        { licenses: 10, daily: 0.05, weekly: 0.25, monthly: 1.00 },
        { licenses: 25, daily: 0.125, weekly: 0.625, monthly: 2.50 },
        { licenses: 50, daily: 0.25, weekly: 1.25, monthly: 5.00 },
        { licenses: 100, daily: 0.50, weekly: 2.50, monthly: 10.00 },
        { licenses: 250, daily: 1.25, weekly: 6.25, monthly: 25.00 },
        { licenses: 500, daily: 2.50, weekly: 12.50, monthly: 50.00 },
        { licenses: 1000, daily: 5.00, weekly: 25.00, monthly: 100.00 },
        { licenses: 2500, daily: 12.50, weekly: 62.50, monthly: 250.00 },
        { licenses: 5000, daily: 25.00, weekly: 125.00, monthly: 500.00 },
        { licenses: 10000, daily: 50.00, weekly: 250.00, monthly: 1000.00 },
        { licenses: 25000, daily: 125.00, weekly: 625.00, monthly: 2500.00 },
        { licenses: 50000, daily: 250.00, weekly: 1250.00, monthly: 5000.00 },
        { licenses: 100000, daily: 500.00, weekly: 2500.00, monthly: 10000.00 },
    ];

    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-black mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#F0973C" }}>
                    RETORNO DE INVERSIÓN
                </h3>
                <p className="text-white/60 text-xs">
                    La tabla representa el <span className="text-[#69AC95] font-bold">0.50% diario</span> de lunes a viernes
                </p>
            </div>

            <div className="bg-gradient-to-br from-[#F0973C]/10 to-[#69AC95]/10 rounded-2xl border border-[#F0973C]/20 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-4 gap-2 p-4 bg-gradient-to-r from-[#F0973C]/20 to-[#69AC95]/20 border-b border-white/10">
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">Licencias</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">Diario</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">Semanal</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">Mensual</p>
                    </div>
                </div>

                {/* Body */}
                <div className="max-h-[400px] overflow-y-auto">
                    {tableData.map((row, idx) => (
                        <div
                            key={idx}
                            className={`grid grid-cols-4 gap-2 p-4 ${idx % 2 === 0 ? "bg-white/5" : "bg-transparent"}`}
                        >
                            <div className="text-center">
                                <p className="text-sm font-bold text-white">
                                    {row.licenses >= 1000 ? `${(row.licenses / 1000).toFixed(0)}K` : row.licenses}
                                </p>

                            </div>
                            <div className="text-center">
                                <p className="text-sm text-[#69AC95] font-semibold">${row.daily.toFixed(2)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-white/70">${row.weekly.toFixed(2)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-[#F0973C] font-semibold">
                                    ${row.monthly >= 1000 ? `${(row.monthly / 1000).toFixed(1)}K` : row.monthly.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ value, label, accent }: { value: string; label: string; accent: string }) => {
    const borderColor = accent === '#F0973C' ? 'border-[#F0973C33]' : 'border-[#69AC9533]';
    const textColor = accent === '#F0973C' ? 'text-[#F0973C]' : 'text-[#69AC95]';

    return (
        <div className={`flex flex-col items-center px-6 py-4 rounded-xl border backdrop-blur-sm bg-black/40 ${borderColor}`}>
            <span className={`text-2xl font-black font-['Playfair_Display'] ${textColor}`}>{value}</span>
            <span className="text-white/50 text-xs mt-1 uppercase tracking-widest">{label}</span>
        </div>
    );
};

const FeatureRow = ({ icon: Icon, title, desc, accent }: { icon: React.ElementType; title: string; desc: string; accent: string }) => {
    const bgColor = accent === '#F0973C' ? 'bg-[#F0973C22]' : 'bg-[#69AC9522]';
    const textColor = accent === '#F0973C' ? 'text-[#F0973C]' : 'text-[#69AC95]';

    return (
        <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition-colors">
            <div className={`text-2xl w-10 h-10 flex items-center justify-center rounded-lg shrink-0 ${bgColor}`}>
                <Icon size={24} className={textColor} />
            </div>
            <div>
                <h4 className="text-white font-semibold text-sm mb-0.5">{title}</h4>
                <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
            </div>
        </div>
    );
};

export default function LandingPage() {
    const { t } = useTranslation();
    const [loginOpen, setLoginOpen] = useState(false);
    const [regOpen, setRegOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden relative font-['DM_Sans']">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer-move {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .float { animation: float 6s ease-in-out infinite; }
        .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .ticker-wrap { animation: ticker 20s linear infinite; }
        .fade-up { animation: fadeInUp 0.8s ease forwards; }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
        .shimmer-text {
          background: linear-gradient(90deg, #F0973C, #fff, #F0973C, #fff, #F0973C);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-move 4s linear infinite;
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(240,151,60,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240,151,60,0.06) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .landing-lang-selector select {
          background: rgba(240, 151, 60, 0.1);
          border: 1px solid rgba(240, 151, 60, 0.3);
          color: #F0973C;
          padding: 0.5rem 2rem 0.5rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23F0973C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 1rem;
        }
        .landing-lang-selector select:hover {
          background: rgba(240, 151, 60, 0.15);
          border-color: rgba(240, 151, 60, 0.5);
          box-shadow: 0 0 0 3px rgba(240, 151, 60, 0.1);
        }
        .landing-lang-selector select:focus {
          outline: none;
          background: rgba(240, 151, 60, 0.15);
          border-color: #F0973C;
          box-shadow: 0 0 0 3px rgba(240, 151, 60, 0.2);
        }
        .landing-lang-selector select option {
          background: #1a1a1a;
          color: white;
          padding: 0.5rem;
        }
      `}</style>

            {/* Background effects */}
            <div className="fixed inset-0 grid-bg pointer-events-none" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-200 h-125 rounded-full pointer-events-none pulse-glow bg-[radial-gradient(ellipse,rgba(240,151,60,0.08)_0%,transparent_70%)]" />
            <div className="fixed bottom-0 left-0 w-100 h-100 rounded-full pointer-events-none bg-[radial-gradient(ellipse,rgba(105,172,149,0.05)_0%,transparent_70%)]" />

            {/* NAV */}
            <nav className="relative z-40 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5 backdrop-blur-md bg-black/40">
                <div className="flex items-center gap-2">
                    <img src={LogoA} alt="CryptoPeak Logo" className="h-8" />
                </div>

                <div></div>


                <div className="flex items-center gap-3">
                    <div className="landing-lang-selector"><LangSelector /></div>
                    <button
                        onClick={() => setLoginOpen(true)}
                        className="text-sm font-semibold px-5 py-2 rounded-lg border border-[#F0973C44] text-[#F0973C] transition-all hover:bg-[#F0973C]/10"
                    >
                        {t("landing.login")}
                    </button>
                    <button
                        onClick={() => setRegOpen(true)}
                        className="text-sm font-bold px-5 py-2 rounded-lg text-black transition-all hover:shadow-lg hover:shadow-[#F0973C]/20 hover:scale-105 bg-linear-to-br from-[#F0973C] to-[#e8841f]"
                    >
                        {t("landing.register")}
                    </button>
                </div>
            </nav>

            {/* TICKER */}
            <div className="overflow-hidden bg-[#F0973C]/10 border-y border-[#F0973C]/10 py-2">
                <div className="ticker-wrap flex gap-16 whitespace-nowrap w-[200%]">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex gap-16">
                            {[
                                ["BTC/USD", "+3.24%", "#F0973C"],
                                ["ETH/USD", "+1.87%", "#69AC95"],
                                ["SOL/USD", "+5.41%", "#F0973C"],
                                ["BNB/USD", "+2.10%", "#69AC95"],
                                ["ADA/USD", "-0.32%", "#BC2020"],
                                ["DOGE/USD", "+8.73%", "#F0973C"],
                                ["XRP/USD", "+4.15%", "#69AC95"],
                            ].map(([coin, chg, clr]) => {
                                const color = clr === '#F0973C' ? 'text-[#F0973C]' : clr === '#69AC95' ? 'text-[#69AC95]' : 'text-[#BC2020]';
                                return (
                                    <span key={coin} className="text-xs font-mono">
                                        <span className="text-white/60">{coin}</span>{" "}
                                        <span className={color}>{chg}</span>
                                    </span>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* HERO */}
            <section className="relative z-10 px-6 md:px-12 pt-20 pb-16 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F0973C]/30 bg-[#F0973C]/10 mb-6 fade-up">
                            <span className="w-2 h-2 rounded-full bg-[#F0973C] pulse-glow" />
                            <span className="text-[#F0973C] text-xs font-semibold uppercase tracking-widest">{t("landing.exclusive_places")}</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black leading-[1.05] mb-4 fade-up delay-100 font-['Playfair_Display']">
                            {t("landing.welcome")}
                            <br />
                            <span className="shimmer-text">{t("landing.daily_capital")}</span>
                        </h1>

                        <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-md fade-up delay-200">
                            {t("landing.access_the_network")}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10 fade-up delay-300">
                            <button
                                onClick={() => setRegOpen(true)}
                                className="group relative px-8 py-4 rounded-xl font-bold text-black text-sm uppercase tracking-wide overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#F0973C]/30 bg-linear-to-br from-[#F0973C] to-[#e8841f]"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2"><Rocket size={18} /> {t("landing.register")}</span>
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                            </button>
                            <button
                                onClick={() => setLoginOpen(true)}
                                className="px-8 py-4 rounded-xl font-semibold text-sm uppercase tracking-wide border border-white/10 text-white/70 hover:border-white/20 hover:text-white transition-all"
                            >
                                {t("landing.login")} →
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3 fade-up delay-500">
                            <StatCard value="$2.4M+" label={t("landing.managed_capital")} accent="#F0973C" />
                            <StatCard value="0.5%" label={t("landing.daily_profit")} accent="#69AC95" />
                            <StatCard value="18K+" label={t("landing.active_investors")} accent="#F0973C" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center float">
                        <div className="w-full max-w-2xl mx-auto">
                            <ReturnsTable />
                        </div>
                        <p className="mt-4 text-white/30 text-xs uppercase tracking-widest">{t("landing.returns_calculated_with")}</p>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="relative z-10 px-6 md:px-12 py-20 max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {t("landing.because")} <span style={{ color: "#F0973C" }}>{t("landing.PAYGLOBAL")}</span>{t("landing.?")}
                    </h2>
                    <p className="text-white/40 text-sm max-w-md mx-auto">{t("landing.an_ecosystem_designed")}</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { icon: Gem, title: t("landing.exclusive_levels"), desc: t("landing.the_higher_you_climb"), accent: "#F0973C" },
                        { icon: Zap, title: t("landing.daily_earnings"), desc: t("landing.receive_your_return"), accent: "#69AC95" },
                        { icon: Lock, title: t("landing.secure_investment"), desc: t("landing.audited_smart_contracts"), accent: "#F0973C" },
                        { icon: Crown, title: t("landing.referral_network"), desc: t("landing.earn_commissions"), accent: "#69AC95" },
                        { icon: BarChart3, title: t("landing.real-time_dashboard"), desc: t("landing.track_your_investments"), accent: "#F0973C" },
                        { icon: Globe, title: t("landing.cripto_multi-asset"), desc: t("landing.invest_with_BTC_USDT_TRC20_USDT_ERC20_SOLANA"), accent: "#69AC95" },
                    ].map((f) => (
                        <FeatureRow key={f.title} {...f} />
                    ))}
                </div>
            </section>

            {/* TIERS */}
            <section className="relative z-10 px-6 md:px-12 py-20 border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {t("landing.levels_of")} <span style={{ color: "#69AC95" }}>{t("landing.investment")}</span>
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { tier: "P200", licenses: "250", daily: "$1.25", weekly: "$6.25", monthly: "$25.00", desc: t("landing.initial_investment"), color: "#69AC95", icon: Sprout },
                            { tier: "P500", licenses: "500", daily: "$2.50", weekly: "$12.50", monthly: "$50.00", desc: t("landing.double_your_daily_earnings"), color: "#69AC95", icon: Award },
                            { tier: "P2000", licenses: "2,500", daily: "$12.50", weekly: "$62.50", monthly: "$250.00", desc: t("landing.significant_returns"), color: "#F0973C", icon: Sparkles },
                            { tier: "P10000", licenses: "10,000", daily: "$50.00", weekly: "$250.00", monthly: "$1,000.00", desc: t("landing.maximum_performance"), color: "#F0973C", icon: Crown },
                        ].map((item) => (
                            <div key={item.tier} className="relative p-6 rounded-2xl border flex flex-col gap-3 hover:scale-[1.02] transition-transform" style={{ borderColor: item.color + "30", background: item.color + "08" }}>
                                <item.icon size={32} style={{ color: item.color }} />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: item.color }}>{item.tier}</p>
                                    <p className="text-white text-2xl font-black" style={{ fontFamily: "'Playfair Display', serif" }}>{item.daily}</p>
                                    <p className="text-white/30 text-xs">{t("landing.daily")}</p>
                                </div>
                                <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
                                <div className="mt-auto pt-3 border-t border-white/5 space-y-1">
                                    <p className="text-white/40 text-xs">{t("landing.licenses")}: <span className="text-white/70 font-semibold">{item.licenses}</span></p>
                                    <p className="text-white/40 text-xs">{t("landing.weekly")}: <span className="text-[#69AC95] font-semibold">{item.weekly}</span></p>
                                    <p className="text-white/40 text-xs">{t("landing.monthly")}: <span className="text-[#F0973C] font-semibold">{item.monthly}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="relative z-10 px-6 md:px-12 py-24 overflow-hidden">
                <div className="max-w-2xl mx-auto text-center relative">
                    <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(240,151,60,0.12) 0%, transparent 70%)" }} />
                    <p className="text-[#F0973C] text-xs uppercase tracking-[0.3em] mb-4 font-semibold">{t("landing.limited_access")}</p>
                    <h2 className="text-4xl md:text-5xl font-black mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {t("landing.the_moment_of")}<br />
                        <span className="shimmer-text">{t("landing.investing_is_now")}</span>
                    </h2>
                    <p className="text-white/40 mb-10 max-w-lg mx-auto text-sm leading-relaxed">
                        {t("landing.join_payglobal")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => setRegOpen(true)}
                            className="px-10 py-4 rounded-xl font-bold text-black text-sm uppercase tracking-wider transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#F0973C]/30 bg-linear-to-br from-[#F0973C] to-[#e8841f]"
                        >
                            {t("landing.register")} →
                        </button>
                        <button
                            onClick={() => setLoginOpen(true)}
                            className="px-10 py-4 rounded-xl font-semibold text-sm uppercase tracking-wide border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
                        >
                            {t("landing.login")}
                        </button>
                    </div>
                    <div className="mt-12 flex items-center justify-center gap-6 text-xs text-white/30">
                        <span className="flex items-center gap-1"><ShieldCheck size={14} /> {t("landing.secure_SSL")}</span>
                        <span className="w-px h-4 bg-white/10" />
                        <span className="flex items-center gap-1"><CheckCircle size={14} /> {t("landing.audited")}</span>
                        <span className="w-px h-4 bg-white/10" />
                        <span className="flex items-center gap-1"><Globe size={14} /> {t("landing.global")}</span>
                        <span className="w-px h-4 bg-white/10" />
                        <span className="flex items-center gap-1"><Zap size={14} /> {t("landing.24_7_Support")}</span>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative z-10 px-6 md:px-12 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <img src={LogoV} alt="PAYGLOBAL Logo" className="h-5" />
                </div>
                <p className="text-white/20 text-xs text-center">
                    {t("landing.2025_PAYGLOBAL")}
                </p>
                <div className="flex gap-4 text-white/30 text-xs">
                    <a href="#" className="hover:text-white/60 transition-colors">{t("landing.terms")}</a>
                    <a href="#" className="hover:text-white/60 transition-colors">{t("landing.privacy")}</a>
                    <a href="#" className="hover:text-white/60 transition-colors">{t("landing.contact")}</a>
                </div>
            </footer>

            <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
            <RegisterModal open={regOpen} onClose={() => setRegOpen(false)} />
        </div>
    );
}