import { useTranslation } from "react-i18next";

export default function LangSelector() {
    const { i18n } = useTranslation();

    const changeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value;
        i18n.changeLanguage(lang);
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    };

    return (
        <select
            className="border rounded px-2 py-1 bg-white text-black"
            defaultValue={i18n.language}
            onChange={changeLang}
        >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">عربي</option>
            <option value="pt">Português</option>
        </select>
    );
}