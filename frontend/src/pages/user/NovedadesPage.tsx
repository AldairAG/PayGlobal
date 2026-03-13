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

import { useState } from 'react';
import { FileText } from 'lucide-react';

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

const sections = [
    {
        title: 'MARCO LEGAL GLOBAL PARA PLATAFORMA',
        docs: {
            es: cgSpanish, en: cgEnglish, fr: cgFrench, de: cgGerman,
            it: cgItalian, pt: cgPortuguese, ru: cgRussian, zh: cgMandarin, ar: cgArabic,
        },
    },
    {
        title: 'PREGUNTAS FRECUENTES',
        docs: {
            es: hcSpanish, en: hcEnglish, fr: hcFrench, de: hcGerman,
            it: hcItalian, pt: hcPortuguese, ru: hcRussian, zh: hcMandarin, ar: hcArabic,
        },
    },
    {
        title: 'TÉRMINOS Y CONDICIONES INSTITUCIONALES',
        docs: {
            es: tcSpanish, en: tcEnglish, fr: tcFrench, de: tcGerman,
            it: tcItalian, pt: tcPortuguese, ar: tcArabic,
        },
    },
];

function PdfSection({ title, docs }: { title: string; docs: Partial<Record<string, string>> }) {
    const available = LANGUAGES.filter(l => docs[l.key]);
    const [selected, setSelected] = useState(available[0]?.key ?? '');

    return (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-5">
            <h2 className="text-xl font-bold text-[#F0973C] flex items-center gap-2">
                <FileText size={20} className="shrink-0" />
                {title}
            </h2>

            {/* Selector de idioma */}
            <div className="flex flex-wrap gap-2">
                {available.map(lang => (
                    <button
                        key={lang.key}
                        onClick={() => setSelected(lang.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            selected === lang.key
                                ? 'bg-[#F0973C] border-[#F0973C] text-black'
                                : 'border-white/10 bg-white/5 text-white/60 hover:border-[#F0973C]/40 hover:text-white'
                        }`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>

            {/* Visor PDF */}
            {docs[selected] && (
                <iframe
                    key={selected}
                    src={docs[selected]}
                    className="w-full rounded-xl border border-white/10"
                    style={{ height: '70vh' }}
                    title={`${title} - ${selected}`}
                />
            )}
        </div>
    );
}

const NovedadesPage = () => {
    return (
        <div className="min-h-screen bg-[#000000] text-white p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[#F0973C]">Novedades</h1>
                <p className="text-white/40 mt-1 text-sm">Documentos y recursos institucionales</p>
            </div>

            {sections.map(section => (
                <PdfSection key={section.title} title={section.title} docs={section.docs} />
            ))}
        </div>
    );
};

export default NovedadesPage;
