import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import es from "./es.json";
import en from "./en.json";
import fr from "./fr.json";
import ar from "./ar.json";
import pt from "./pt.json";

i18n.use(initReactI18next).init({
    resources: {
        es: { translation: es },
        en: { translation: en },
        fr: { translation: fr },
        ar: { translation: ar },
        pt: { translation: pt },
    },
    lng: "es",
    fallbackLng: "es",
    interpolation: { escapeValue: false },
});

export default i18n;