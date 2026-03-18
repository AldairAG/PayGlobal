import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Download, FileText, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import arbitrajeDiciembre from '../../assets/documents/crypto_arbitraje/december_2025_crypto_arbitrage_report.pdf';
import arbitrajeNoviembre from '../../assets/documents/crypto_arbitraje/november_2025_crypto_arbitrage_report.pdf';
import arbitrajeOctubre from '../../assets/documents/crypto_arbitraje/october_2025_crypto_arbitrage_report.pdf';
import arbitrajeEnero from '../../assets/documents/crypto_arbitraje/january_2026_crypto_arbitrage_institutional_report.pdf';
import arbitrajeFebrero from '../../assets/documents/crypto_arbitraje/february_2026_crypto_arbitrage_reports_pro.pdf';

interface Document {
    title: string;
    month: string;
    description: string;
    pdfUrl: string;
}

interface SectionAccordionProps {
    title: string;
    description: string;
    documents: Document[];
    isOpen: boolean;
    onToggle: () => void;
    accentColor: string;
}

const DocumentItem = ({ doc, accentColor }: { doc: Document; accentColor: string }) => {
    const { t } = useTranslation();

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = doc.pdfUrl;
        link.download = `${doc.title.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-4 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1"
                        style={{ backgroundColor: `${accentColor}22` }}
                    >
                        <FileText size={20} style={{ color: accentColor }} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm mb-1">{doc.title}</h4>
                        <p className="text-white/40 text-xs flex items-center gap-1 mb-2">
                            <Calendar size={12} />
                            {doc.month}
                        </p>
                        <p className="text-white/50 text-xs leading-relaxed">{doc.description}</p>
                    </div>
                </div>
                <button
                    onClick={handleDownload}
                    className="group flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all hover:scale-105 hover:shadow-lg shrink-0"
                    style={{
                        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                        color: '#000',
                        boxShadow: `0 2px 10px ${accentColor}20`
                    }}
                >
                    <Download size={14} />
                    {t('reports.download_pdf')}
                </button>
            </div>
        </div>
    );
};

const SectionAccordion = ({ title, description, documents, isOpen, onToggle, accentColor }: SectionAccordionProps) => {
    const { t } = useTranslation();

    return (
        <div className="bg-linear-to-br from-white/5 to-white/2 rounded-xl border border-white/10 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-white/20">
            {/* Header */}
            <button
                onClick={onToggle}
                className="w-full px-6 py-5 flex items-center justify-between transition-colors hover:bg-white/5"
            >
                <div className="flex items-center gap-4">
                    <div 
                        className="w-14 h-14 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${accentColor}22` }}
                    >
                        <TrendingUp size={26} style={{ color: accentColor }} />
                    </div>
                    <div className="text-left">
                        <h3 
                            className="font-black text-xl flex items-center gap-2 mb-1"
                            style={{ color: accentColor }}
                        >
                            {title}
                        </h3>
                        <p className="text-white/50 text-xs max-w-md">
                            {description}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {documents.length > 0 ? (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/70">
                            {documents.length} {documents.length === 1 ? 'documento' : 'documentos'}
                        </span>
                    ) : (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                            {t('reports.coming_soon')}
                        </span>
                    )}
                    <ChevronDown
                        size={24}
                        className={`text-white/70 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Content */}
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-200 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-6 pb-6 pt-2 border-t border-white/5">
                    {documents.length > 0 ? (
                        <div className="space-y-3">
                            {documents.map((doc, idx) => (
                                <DocumentItem key={idx} doc={doc} accentColor={accentColor} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-6 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                            <AlertCircle size={24} className="text-yellow-400 shrink-0" />
                            <div>
                                <p className="text-white/70 text-sm font-semibold mb-1">
                                    {t('reports.coming_soon')}
                                </p>
                                <p className="text-white/40 text-xs">
                                    {t('reports.no_documents_available')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const NewsReports = () => {
    const { t } = useTranslation();
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const sections = [
        {
            id: 'cryptocurrencies',
            title: t('reports.cryptocurrencies'),
            description: t('reports.cryptocurrencies_desc'),
            documents: [],
            accentColor: '#F0973C'
        },
        {
            id: 'forex_pool',
            title: t('reports.forex_pool'),
            description: t('reports.forex_pool_desc'),
            documents: [],
            accentColor: '#69AC95'
        },
        {
            id: 'staking',
            title: t('reports.staking'),
            description: t('reports.staking_desc'),
            documents: [],
            accentColor: '#F0973C'
        },
        {
            id: 'arbitrage',
            title: t('reports.arbitrage'),
            description: t('reports.arbitrage_desc'),
            documents: [
                {
                    title: t('reports.october_2025_report'),
                    month: t('reports.october_2025'),
                    description: t('reports.october_description'),
                    pdfUrl: arbitrajeOctubre
                },
                {
                    title: t('reports.november_2025_report'),
                    month: t('reports.november_2025'),
                    description: t('reports.november_description'),
                    pdfUrl: arbitrajeNoviembre
                },
                {
                    title: t('reports.december_2025_report'),
                    month: t('reports.december_2025'),
                    description: t('reports.december_description'),
                    pdfUrl: arbitrajeDiciembre
                },
                {
                    title: t('reports.january_2026_report'),
                    month: t('reports.january_2026'),
                    description: t('reports.january_description'),
                    pdfUrl: arbitrajeEnero
                },
                {
                    title: t('reports.february_2026_report'),
                    month: t('reports.february_2026'),
                    description: t('reports.february_description'),
                    pdfUrl: arbitrajeFebrero
                }
            ],
            accentColor: '#69AC95'
        },
        {
            id: 'real_state_development',
            title: t('reports.real_state_development'),
            description: t('reports.real_state_development_desc'),
            documents: [],
            accentColor: '#F0973C'
        },
        {
            id: 'foundation',
            title: t('reports.foundation'),
            description: t('reports.foundation_desc'),
            documents: [],
            accentColor: '#69AC95'
        },
        {
            id: 'mining_btc',
            title: t('reports.mining_btc'),
            description: t('reports.mining_btc_desc'),
            documents: [],
            accentColor: '#F0973C'
        },
        {
            id: 'real_state',
            title: t('reports.real_state'),
            description: t('reports.real_state_desc'),
            documents: [],
            accentColor: '#69AC95'
        },
        {
            id: 'debit_card',
            title: t('reports.debit_card'),
            description: t('reports.debit_card_desc'),
            documents: [],
            accentColor: '#F0973C'
        }
    ];

    const handleToggle = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
                
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                }
                .fade-up { animation: fadeInUp 0.6s ease forwards; }
                .delay-100 { animation-delay: 0.1s; opacity: 0; }
                .delay-200 { animation-delay: 0.2s; opacity: 0; }
                .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
            `}</style>

            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-10 fade-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F0973C]/30 bg-[#F0973C]/10 mb-4">
                        <span className="w-2 h-2 rounded-full bg-[#F0973C] pulse-glow" />
                        <span className="text-[#F0973C] text-xs font-semibold uppercase tracking-widest">
                            {t('reports.institutional_reports')}
                        </span>
                    </div>
                    
                    <h1 
                        className="text-4xl md:text-5xl font-black mb-3 font-['Playfair_Display']"
                        style={{ color: '#F0973C' }}
                    >
                        {t('reports.news_and_reports')}
                    </h1>
                    <p className="text-white/50 text-sm max-w-2xl">
                        {t('reports.access_detailed_reports')}
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-4 fade-up delay-100">
                    {sections.map((section) => (
                        <SectionAccordion
                            key={section.id}
                            title={section.title}
                            description={section.description}
                            documents={section.documents}
                            isOpen={openAccordion === section.id}
                            onToggle={() => handleToggle(section.id)}
                            accentColor={section.accentColor}
                        />
                    ))}
                </div>

                {/* Info Card */}
                <div className="mt-8 p-6 rounded-xl border border-white/5 bg-white/2 backdrop-blur-sm fade-up delay-200">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#F0973C]/20 flex items-center justify-center shrink-0">
                            <TrendingUp size={20} className="text-[#F0973C]" />
                        </div>
                        <div>
                            <h3 className="text-[#e07025] font-semibold text-sm mb-2">
                                {t('reports.about_reports_title')}
                            </h3>
                            <p className="text-white/40 text-xs leading-relaxed">
                                {t('reports.about_reports_description')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewsReports;