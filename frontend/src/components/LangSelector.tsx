import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const languages = [
    { code: "es", label: "España",   flag: "https://flagcdn.com/w40/es.png" },
    { code: "en", label: "UK",   flag: "https://flagcdn.com/w40/gb.png" },
    { code: "fr", label: "France",  flag: "https://flagcdn.com/w40/fr.png" },
    { code: "ar", label: "الإمارات العربية المتحدة",      flag: "https://flagcdn.com/w40/ae.png" },
    { code: "pt", label: "Portugal", flag: "https://flagcdn.com/w40/pt.png" },
];

export default function LangSelector() {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const current = languages.find((l) => l.code === i18n.language) ?? languages[1];

    const changeLang = (code: string) => {
        i18n.changeLanguage(code);
        document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
        setOpen(false);
    };

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative inline-block">
            {/* Trigger */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#F0973C]/30 bg-[#F0973C]/10 hover:bg-[#F0973C]/15 hover:border-[#F0973C]/50 text-[#F0973C] font-semibold text-sm transition-all duration-300 cursor-pointer outline-none focus:ring-2 focus:ring-[#F0973C]/20"
            >
                <img src={current.flag} alt={current.label} className="w-5 h-3.5 object-cover rounded-sm" />
                <span>{current.label}</span>
                <svg
                    className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <ul className="absolute right-0 mt-2 w-40 rounded-xl border border-[#F0973C]/20 bg-[#111]/95 backdrop-blur-md shadow-xl shadow-black/40 z-50 overflow-hidden py-1">
                    {languages.map(({ code, label, flag }) => (
                        <li key={code}>
                            <button
                                onClick={() => changeLang(code)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[#F0973C]/10 ${
                                    code === i18n.language ? "text-[#F0973C]" : "text-white/70 hover:text-white"
                                }`}
                            >
                                <img src={flag} alt={label} className="w-5 h-3.5 object-cover rounded-sm shrink-0" />
                                {label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}