// crypto_global
import cgArabic from '../../assets/documents/crypto_global/crypto_global_framework_arabic_dubai.pdf';
import cgEnglish from '../../assets/documents/crypto_global/crypto_global_framework_english.pdf';
import cgFrench from '../../assets/documents/crypto_global/crypto_global_framework_french.pdf';
import cgGerman from '../../assets/documents/crypto_global/crypto_global_framework_german.pdf';
import cgItalian from '../../assets/documents/crypto_global/crypto_global_framework_italian.pdf';
import cgMandarin from '../../assets/documents/crypto_global/crypto_global_framework_mandarin.pdf';
import cgPortuguese from '../../assets/documents/crypto_global/crypto_global_framework_portuguese.pdf';
import cgRussian from '../../assets/documents/crypto_global/crypto_global_framework_russian.pdf';
import cgSpanish from '../../assets/documents/crypto_global/crypto_global_framework_spanish.pdf';

// help_center
import hcArabic from '../../assets/documents/help_center/help_center_crypto_520_arabic_dubai.pdf';
import hcEnglish from '../../assets/documents/help_center/help_center_crypto_520_english.pdf';
import hcFrench from '../../assets/documents/help_center/help_center_crypto_520_french.pdf';
import hcGerman from '../../assets/documents/help_center/help_center_crypto_520_german.pdf';
import hcItalian from '../../assets/documents/help_center/help_center_crypto_520_italian.pdf';
import hcMandarin from '../../assets/documents/help_center/help_center_crypto_520_mandarin.pdf';
import hcPortuguese from '../../assets/documents/help_center/help_center_crypto_520_portuguese.pdf';
import hcRussian from '../../assets/documents/help_center/help_center_crypto_520_russian.pdf';
import hcSpanish from '../../assets/documents/help_center/help_center_crypto_520_spanish.pdf';

// terms
import tcArabic from '../../assets/documents/terms/institutional_terms_arabic.pdf';
import tcEnglish from '../../assets/documents/terms/institutional_terms_english.pdf';
import tcFrench from '../../assets/documents/terms/institutional_terms_french.pdf';
import tcGerman from '../../assets/documents/terms/institutional_terms_german.pdf';
import tcItalian from '../../assets/documents/terms/institutional_terms_italian.pdf';
import tcPortuguese from '../../assets/documents/terms/institutional_terms_portuguese.pdf';
import tcSpanish from '../../assets/documents/terms/institutional_terms_spanish.pdf';

//presentacion
import presentationSpanish from '../../assets/documents/presentation/presentation_spanish.pdf';
import presentationEnglish from '../../assets/documents/presentation/presentation_english.pdf';
import presentationFrench from '../../assets/documents/presentation/presentation_french.pdf';
import presentationGerman from '../../assets/documents/presentation/presentation_german.pdf';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Download, FileText, Globe } from 'lucide-react';

const LANGUAGES = [
    { key: 'es', label: 'Español' },
    { key: 'en', label: 'English' },
    { key: 'fr', label: 'Français' },
    { key: 'de', label: 'Deutsch' },
    { key: 'it', label: 'Italiano' },
    { key: 'pt', label: 'Português' },
    { key: 'ru', label: 'Русский' },
    { key: 'zh', label: '中文' },
    { key: 'ar', label: 'العربية' },
];

interface SectionData {
    id: string;
    title: string;
    description: string;
    accentColor: string;
    docs: Partial<Record<string, string>>;
}

interface PdfAccordionProps {
    section: SectionData;
    isOpen: boolean;
    onToggle: () => void;
}

function PdfAccordion({ section, isOpen, onToggle }: PdfAccordionProps) {
    const { t } = useTranslation();
    const available = LANGUAGES.filter(l => section.docs[l.key]);

    const handleDownload = (langKey: string) => {
        const url = section.docs[langKey];
        if (!url) return;
        const lang = LANGUAGES.find(l => l.key === langKey);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${section.title.replace(/\s+/g, '_')}_${lang?.label ?? langKey}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-linear-to-br from-white/5 to-white/2 rounded-xl border border-white/10 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-white/20">
            {/* Header */}
            <button
                onClick={onToggle}
                className="w-full px-6 py-5 flex items-center justify-between transition-colors hover:bg-white/5"
            >
                <div className="flex items-center gap-4">
                    <div
                        className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${section.accentColor}22` }}
                    >
                        <FileText size={26} style={{ color: section.accentColor }} />
                    </div>
                    <div className="text-left">
                        <h3
                            className="font-black text-xl flex items-center gap-2 mb-1"
                            style={{ color: section.accentColor }}
                        >
                            {section.title}
                        </h3>
                        <p className="text-white/50 text-xs max-w-md">{section.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/70">
                        {available.length} {available.length === 1 ? t('novedades.language_singular') : t('novedades.language_plural')}
                    </span>
                    <ChevronDown
                        size={24}
                        className={`text-white/70 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Content */}
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-[200vh] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-6 pb-6 pt-4 border-t border-white/5 space-y-3">
                    {available.map(lang => (
                        <div key={lang.key} className="p-4 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-all flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${section.accentColor}22` }}
                                >
                                    <FileText size={20} style={{ color: section.accentColor }} />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">{section.title}</p>
                                    <p className="text-white/40 text-xs">{lang.label}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDownload(lang.key)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all hover:scale-105 hover:shadow-lg shrink-0"
                                style={{
                                    background: `linear-gradient(135deg, ${section.accentColor}, ${section.accentColor}dd)`,
                                    color: '#000',
                                    boxShadow: `0 2px 10px ${section.accentColor}20`
                                }}
                            >
                                <Download size={14} />
                                {t('novedades.download_pdf')}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const NovedadesPage = () => {
    const { t } = useTranslation();
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const sections: SectionData[] = [
        {
            id: 'presentacion',
            title: t('novedades.presentation_title'),
            description: t('novedades.presentation_desc'),
            accentColor: '#3B82F6',
            docs: {
                es: presentationSpanish, en: presentationEnglish, fr: presentationFrench, de: presentationGerman,
            },
        },
        {
            id: 'marco_legal',
            title: t('novedades.marco_legal_title'),
            description: t('novedades.marco_legal_desc'),
            accentColor: '#F0973C',
            docs: {
                es: cgSpanish, en: cgEnglish, fr: cgFrench, de: cgGerman,
                it: cgItalian, pt: cgPortuguese, ru: cgRussian, zh: cgMandarin, ar: cgArabic,
            },
        },
        {
            id: 'preguntas_frecuentes',
            title: t('novedades.faq_title'),
            description: t('novedades.faq_desc'),
            accentColor: '#69AC95',
            docs: {
                es: hcSpanish, en: hcEnglish, fr: hcFrench, de: hcGerman,
                it: hcItalian, pt: hcPortuguese, ru: hcRussian, zh: hcMandarin, ar: hcArabic,
            },
        },
        {
            id: 'terminos',
            title: t('novedades.terms_title'),
            description: t('novedades.terms_desc'),
            accentColor: '#F0973C',
            docs: {
                es: tcSpanish, en: tcEnglish, fr: tcFrench, de: tcGerman,
                it: tcItalian, pt: tcPortuguese, ar: tcArabic,
            },
        },
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
                            {t('novedades.institutional_documents')}
                        </span>
                    </div>
                    <h1
                        className="text-4xl md:text-5xl font-black mb-3 font-['Playfair_Display']"
                        style={{ color: '#F0973C' }}
                    >
                        {t('novedades.title')}
                    </h1>
                    <p className="text-white/50 text-sm max-w-2xl">
                        {t('novedades.subtitle')}
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-4 fade-up delay-100">
                    {sections.map(section => (
                        <PdfAccordion
                            key={section.id}
                            section={section}
                            isOpen={openAccordion === section.id}
                            onToggle={() => handleToggle(section.id)}
                        />
                    ))}
                </div>

                {/* Info Card */}
                <div className="mt-8 p-6 rounded-xl border border-white/5 bg-white/2 backdrop-blur-sm fade-up delay-200">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#F0973C]/20 flex items-center justify-center shrink-0">
                            <Globe size={20} className="text-[#F0973C]" />
                        </div>
                        <div>
                            <h3 className="text-[#e07025] font-semibold text-sm mb-2">
                                {t('novedades.info_card_title')}
                            </h3>
                            <p className="text-white/40 text-xs leading-relaxed">
                                {t('novedades.info_card_desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NovedadesPage;
