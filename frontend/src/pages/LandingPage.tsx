import { useState } from "react";
import { useTranslation } from "react-i18next";
import LangSelector from "../components/LangSelector";
import LoginModal from "../components/modal/LoginModal";
import RegisterModal from "../components/modal/RegisterModal";
import LogoA from "../assets/LogoA.png";
import LogoV from "../assets/LogoV.png";

const Pyramid = () => (
    <svg viewBox="0 0 300 260" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="tier1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0973C" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#e8841f" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="tier2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0973C" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#d4721a" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="tier3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#69AC95" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#4d9278" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="tier4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#69AC95" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3a7a61" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F0973C" stopOpacity="0" />
                <stop offset="50%" stopColor="#F0973C" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#F0973C" stopOpacity="0" />
            </linearGradient>
        </defs>
        <polygon points="150,20 110,80 190,80" fill="url(#tier1)" filter="url(#glow)" />
        <line x1="110" y1="80" x2="190" y2="80" stroke="#F0973C" strokeWidth="1" opacity="0.8" />
        <polygon points="110,80 70,140 230,140" fill="url(#tier2)" />
        <line x1="70" y1="140" x2="230" y2="140" stroke="#F0973C" strokeWidth="0.8" opacity="0.5" />
        <polygon points="70,140 35,200 265,200" fill="url(#tier3)" />
        <line x1="35" y1="200" x2="265" y2="200" stroke="#69AC95" strokeWidth="0.8" opacity="0.5" />
        <polygon points="35,200 10,250 290,250" fill="url(#tier4)" />
        <polygon points="150,20 10,250 290,250" fill="none" stroke="#F0973C" strokeWidth="1.5" opacity="0.4" />
        <circle cx="150" cy="20" r="5" fill="#F0973C" filter="url(#glow)" opacity="0.9" />
        <text x="150" y="58" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" opacity="0.9">ELITE</text>
        <text x="150" y="117" textAnchor="middle" fill="white" fontSize="9" opacity="0.8">PREMIUM</text>
        <text x="150" y="177" textAnchor="middle" fill="white" fontSize="9" opacity="0.7">GOLD</text>
        <text x="150" y="230" textAnchor="middle" fill="white" fontSize="9" opacity="0.6">STARTER</text>
        <rect x="10" y="0" width="280" height="260" fill="url(#shimmer)" opacity="0.4" />
    </svg>
);

const StatCard = ({ value, label, accent }) => (
    <div className="flex flex-col items-center px-6 py-4 rounded-xl border backdrop-blur-sm" style={{ borderColor: accent + "33", background: "rgba(0,0,0,0.4)" }}>
        <span className="text-2xl font-black" style={{ color: accent, fontFamily: "'Playfair Display', serif" }}>{value}</span>
        <span className="text-white/50 text-xs mt-1 uppercase tracking-widest">{label}</span>
    </div>
);

const FeatureRow = ({ icon, title, desc, accent }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
        <div className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: accent + "22" }}>
            {icon}
        </div>
        <div>
            <h4 className="text-white font-semibold text-sm mb-0.5">{title}</h4>
            <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default function LandingPage() {
    const { t } = useTranslation();
    const [loginOpen, setLoginOpen] = useState(false);
    const [regOpen, setRegOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden relative" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
      `}</style>

            {/* Background effects */}
            <div className="fixed inset-0 grid-bg pointer-events-none" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none pulse-glow" style={{ background: "radial-gradient(ellipse, rgba(240,151,60,0.08) 0%, transparent 70%)" }} />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(105,172,149,0.05) 0%, transparent 70%)" }} />

            {/* NAV */}
            <nav className="relative z-40 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5 backdrop-blur-md bg-black/40">
                <div className="flex items-center gap-2">
                    <img src={LogoA} alt="CryptoPeak Logo" className="h-8" />
                </div>

                <LangSelector />

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setLoginOpen(true)}
                        className="text-sm font-semibold px-5 py-2 rounded-lg border transition-all hover:bg-[#F0973C]/10"
                        style={{ borderColor: "#F0973C44", color: "#F0973C" }}
                    >
                        {t("landing.login")}
                    </button>
                    <button
                        onClick={() => setRegOpen(true)}
                        className="text-sm font-bold px-5 py-2 rounded-lg text-black transition-all hover:shadow-lg hover:shadow-[#F0973C]/20 hover:scale-105"
                        style={{ background: "linear-gradient(135deg,#F0973C,#e8841f)" }}
                    >
                        {t("landing.register")}
                    </button>
                </div>
            </nav>

            {/* TICKER */}
            <div className="overflow-hidden bg-[#F0973C]/10 border-y border-[#F0973C]/10 py-2">
                <div className="ticker-wrap flex gap-16 whitespace-nowrap" style={{ width: "200%" }}>
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
                            ].map(([coin, chg, clr]) => (
                                <span key={coin} className="text-xs font-mono">
                                    <span className="text-white/60">{coin}</span>{" "}
                                    <span style={{ color: clr }}>{chg}</span>
                                </span>
                            ))}
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
                            <span className="text-[#F0973C] text-xs font-semibold uppercase tracking-widest">Plazas Exclusivas Disponibles</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black leading-[1.05] mb-4 fade-up delay-100" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {t("landing.welcome")}
                            <br />
                            <span className="shimmer-text">Capital Diario</span>
                        </h1>

                        <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-md fade-up delay-200">
                            Accede a la red de inversión piramidal más exclusiva en cripto. Rendimientos comprobados, comunidad verificada y ganancias que no paran.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10 fade-up delay-300">
                            <button
                                onClick={() => setRegOpen(true)}
                                className="group relative px-8 py-4 rounded-xl font-bold text-black text-sm uppercase tracking-wide overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#F0973C]/30"
                                style={{ background: "linear-gradient(135deg, #F0973C, #e8841f)" }}
                            >
                                <span className="relative z-10">🚀 {t("landing.register")}</span>
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
                            <StatCard value="$2.4M+" label="Capital gestionado" accent="#F0973C" />
                            <StatCard value="12%" label="Ganancia diaria" accent="#69AC95" />
                            <StatCard value="18K+" label="Inversores activos" accent="#F0973C" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center float">
                        <div className="w-full max-w-sm mx-auto">
                            <Pyramid />
                        </div>
                        <p className="mt-4 text-white/30 text-xs uppercase tracking-widest">Sistema de 4 niveles de inversión</p>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="relative z-10 px-6 md:px-12 py-20 max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                        ¿Por qué <span style={{ color: "#F0973C" }}>PAYGLOBAL</span>?
                    </h2>
                    <p className="text-white/40 text-sm max-w-md mx-auto">Un ecosistema diseñado para multiplicar tu inversión en cada nivel</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { icon: "💎", title: "Niveles Exclusivos", desc: "Cuatro capas de inversión. Cuanto más alto subes, mayor es tu retorno diario garantizado.", accent: "#F0973C" },
                        { icon: "⚡", title: "Ganancias Diarias", desc: "Recibe tu rendimiento cada 24 horas directamente en tu wallet de criptomonedas.", accent: "#69AC95" },
                        { icon: "🔒", title: "Inversión Segura", desc: "Smart contracts auditados y tecnología blockchain de última generación protegen tu capital.", accent: "#F0973C" },
                        { icon: "👑", title: "Red de Referidos", desc: "Gana comisiones por cada invitado a tu red. Construye tu propio nivel dentro de la pirámide.", accent: "#69AC95" },
                        { icon: "📊", title: "Dashboard en Tiempo Real", desc: "Monitorea tus ganancias, tu equipo y el rendimiento del mercado desde un solo panel.", accent: "#F0973C" },
                        { icon: "🌐", title: "Cripto Multi-asset", desc: "Invierte con BTC, ETH, USDT, BNB y más de 20 criptomonedas líderes del mercado.", accent: "#69AC95" },
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
                            Niveles de <span style={{ color: "#69AC95" }}>Inversión</span>
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { tier: "STARTER", min: "$100", daily: "5%", desc: "Acceso base. Comienza tu camino hacia la cima.", color: "#69AC95", icon: "🌱" },
                            { tier: "GOLD", min: "$500", daily: "8%", desc: "Mayor retorno. Acceso a mercados premium.", color: "#69AC95", icon: "🥇" },
                            { tier: "PREMIUM", min: "$2,000", daily: "10%", desc: "Posición avanzada con beneficios ampliados.", color: "#F0973C", icon: "💫" },
                            { tier: "ELITE", min: "$10,000", daily: "12%", desc: "Cumbre de la pirámide. Máximo rendimiento.", color: "#F0973C", icon: "👑" },
                        ].map((item) => (
                            <div key={item.tier} className="relative p-6 rounded-2xl border flex flex-col gap-3 hover:scale-[1.02] transition-transform" style={{ borderColor: item.color + "30", background: item.color + "08" }}>
                                <div className="text-3xl">{item.icon}</div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: item.color }}>{item.tier}</p>
                                    <p className="text-white text-2xl font-black" style={{ fontFamily: "'Playfair Display', serif" }}>{item.daily}</p>
                                    <p className="text-white/30 text-xs">diario</p>
                                </div>
                                <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
                                <div className="mt-auto pt-3 border-t border-white/5">
                                    <p className="text-white/40 text-xs">Mínimo: <span className="text-white/70 font-semibold">{item.min}</span></p>
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
                    <p className="text-[#F0973C] text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Acceso limitado</p>
                    <h2 className="text-4xl md:text-5xl font-black mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                        El momento de<br />
                        <span className="shimmer-text">invertir es ahora</span>
                    </h2>
                    <p className="text-white/40 mb-10 max-w-lg mx-auto text-sm leading-relaxed">
                        Solo aceptamos 50 nuevos miembros por semana para garantizar la exclusividad y la rentabilidad de nuestra red.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => setRegOpen(true)}
                            className="px-10 py-4 rounded-xl font-bold text-black text-sm uppercase tracking-wider transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#F0973C]/30"
                            style={{ background: "linear-gradient(135deg, #F0973C, #e8841f)" }}
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
                        <span>🔐 SSL seguro</span>
                        <span className="w-px h-4 bg-white/10" />
                        <span>✅ Auditado</span>
                        <span className="w-px h-4 bg-white/10" />
                        <span>🌐 Global</span>
                        <span className="w-px h-4 bg-white/10" />
                        <span>⚡ 24/7 activo</span>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative z-10 px-6 md:px-12 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <img src={LogoV} alt="PAYGLOBAL Logo" className="h-5" />
                </div>
                <p className="text-white/20 text-xs text-center">
                    © 2025 PAYGLOBAL. Inversiones sujetas a riesgo de mercado. Solo para inversores calificados.
                </p>
                <div className="flex gap-4 text-white/30 text-xs">
                    <a href="#" className="hover:text-white/60 transition-colors">Términos</a>
                    <a href="#" className="hover:text-white/60 transition-colors">Privacidad</a>
                    <a href="#" className="hover:text-white/60 transition-colors">Contacto</a>
                </div>
            </footer>

            <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
            <RegisterModal open={regOpen} onClose={() => setRegOpen(false)} />
        </div>
    );
}