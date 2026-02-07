import { useState } from "react";
import { useTranslation } from "react-i18next";
import LangSelector from "../components/LangSelector";
import LoginModal from "../components/modal/LoginModal";
import RegisterModal from "../components/modal/RegisterModal";

export default function LandingPage() {
    const { t } = useTranslation();
    const [loginOpen, setLoginOpen] = useState(false);
    const [regOpen, setRegOpen] = useState(false);

    return (
        <div className="h-screen flex flex-col justify-center items-center gap-6 bg-white text-center p-4">

            <LangSelector />

            <h1 className="text-3xl font-bold">{t("landing.welcome")}</h1>

            <div className="flex gap-4">
                <button
                    className="text-white px-6 py-2 rounded shadow transition-colors hover:opacity-90"
                    style={{ backgroundColor: "#F0973C" }}
                    onClick={() => setLoginOpen(true)}
                >
                    {t("landing.login")}
                </button>

                <button
                    className="text-white px-6 py-2 rounded shadow transition-colors hover:opacity-90"
                    style={{ backgroundColor: "#69AC95" }}
                    onClick={() => setRegOpen(true)}
                >
                    {t("landing.register")}
                </button>
            </div>

            <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
            <RegisterModal open={regOpen} onClose={() => setRegOpen(false)} />
        </div>
    );
}