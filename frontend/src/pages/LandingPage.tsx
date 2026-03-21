import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Gem, Zap, Lock, Crown, BarChart3, Globe, ShieldCheck, CheckCircle, MapPin } from "lucide-react";
import LangSelector from "../components/LangSelector";
import CryptoTicker from "../components/CryptoTicker";
import LogoA from "../assets/LogoA.png";
import LogoV from "../assets/LogoV.png";
import ForexTicker from "../components/ForexTicker";
import { ROUTES } from "../routes/routes";

const ReturnsTable = () => {
    const { t } = useTranslation();
    const tableData = [
        { licenses: 50, daily: 0.25, weekly: 1.25, monthly: 5.00 },
        { licenses: 100, daily: 0.50, weekly: 2.50, monthly: 10.00 },
        { licenses: 250, daily: 1.25, weekly: 6.25, monthly: 25.00 },
        { licenses: 500, daily: 2.50, weekly: 12.50, monthly: 50.00 },
        { licenses: 1000, daily: 5.00, weekly: 25.00, monthly: 100.00 },
        { licenses: 2500, daily: 12.50, weekly: 62.50, monthly: 250.00 },
        { licenses: 5000, daily: 25.00, weekly: 125.00, monthly: 500.00 },
        { licenses: 7500, daily: 37.50, weekly: 187.50, monthly: 750.00 },
        { licenses: 10000, daily: 50.00, weekly: 250.00, monthly: 1000.00 },
        { licenses: 15000, daily: 75.00, weekly: 375.00, monthly: 1500.00 },
        { licenses: 25000, daily: 125.00, weekly: 625.00, monthly: 2500.00 },
        { licenses: 50000, daily: 250.00, weekly: 1250.00, monthly: 5000.00 },
    ];

    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-black mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#F0973C" }}>
                    {t("landing.roi_title")}
                </h3>
                <p className="text-white/60 text-xs">
                    {t("landing.roi_description")} <span className="text-[#69AC95] font-bold">0.50% {t("landing.roi_daily")}</span> {t("landing.roi_weekdays")}
                </p>
            </div>

            <div className="bg-linear-to-br from-[#F0973C]/10 to-[#69AC95]/10 rounded-2xl border border-[#F0973C]/20 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-4 gap-2 p-4 bg-linear-to-r from-[#F0973C]/20 to-[#69AC95]/20 border-b border-white/10">
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">{t("landing.roi_licenses")}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">{t("landing.roi_daily_label")}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">{t("landing.roi_weekly_label")}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">{t("landing.roi_monthly_label")}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="max-h-100 overflow-y-auto">
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
    const { ref } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (ref) {
            navigate(ROUTES.REGISTER_REF.replace(':ref', ref));
        }
    }, [ref, navigate]);

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
                        onClick={() => navigate(ROUTES.LOGIN)}
                        className="text-sm font-semibold px-5 py-2 rounded-lg border border-[#F0973C44] text-[#F0973C] transition-all hover:bg-[#F0973C]/10"
                    >
                        {t("landing.login")}
                    </button>
                    <button
                        onClick={() => navigate(ROUTES.REGISTER)}
                        className="text-sm font-bold px-5 py-2 rounded-lg text-black transition-all hover:shadow-lg hover:shadow-[#F0973C]/20 hover:scale-105 bg-linear-to-br from-[#F0973C] to-[#e8841f]"
                    >
                        {t("landing.register")}
                    </button>
                </div>
            </nav>

            {/* TICKER */}
            <CryptoTicker />

            {/* MERCADO FOREX */}
            <ForexTicker />

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

                        <div className="grid grid-cols-3 gap-3 fade-up delay-500">
                            {/* Address card */}
                            <div className="flex flex-col px-4 py-4 rounded-xl border border-[#F0973C]/20 backdrop-blur-sm bg-black/40">
                                <div className="flex items-center gap-1.5 mb-2.5">
                                    <MapPin size={11} className="text-[#F0973C] shrink-0" />
                                    <span className="text-[#F0973C] text-[9px] font-bold uppercase tracking-widest">Office</span>
                                </div>
                                {[
                                    "Unit, Almas Tower",
                                    "Jumeirah Lake Towers (JLT)",
                                    "DMCC Free Zone",
                                    "P.O. Box 123456",
                                    "Dubai",
                                    "United Arab Emirates",
                                ].map((line) => (
                                    <span key={line} className="text-white/55 text-[11px] leading-[1.6]">{line}</span>
                                ))}
                            </div>

                            {/* Daily Profit card — centro destacado */}
                            <div className="flex flex-col items-center justify-center px-4 py-4 rounded-xl border border-[#69AC95]/30 bg-[#69AC95]/5 backdrop-blur-sm text-center">
                                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/35 mb-1">{t("landing.daily_profit")}</span>
                                <span className="text-4xl font-black text-[#69AC95] font-['Playfair_Display'] leading-none">0.5%</span>
                                <span className="text-[9px] text-white/30 uppercase tracking-widest mt-2">Mon – Fri</span>
                            </div>

                            {/* Foundation card */}
                            <div className="flex flex-col items-center justify-center px-4 py-4 rounded-xl border border-[#69AC95]/20 backdrop-blur-sm bg-black/40 text-center gap-1.5">
                                <Globe size={14} className="text-[#69AC95] mb-0.5" />
                                <span className="text-white/70 text-[11px] font-semibold leading-snug">PAYGLOBAL MLM FOUNDATION</span>
                                <span className="text-white/35 text-[9px] uppercase tracking-wider">February 2026</span>
                            </div>
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
        </div>
    );
}