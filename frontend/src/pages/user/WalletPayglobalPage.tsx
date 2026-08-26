import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Clock3, Send, UserRound, WalletCards } from "lucide-react";
import { useUsuario } from "../../hooks/usuarioHook";
import { TipoConceptos, TipoWallets } from "../../type/enum";
import { useTransacciones } from "../../hooks/useTransacciones";
import { formatearFechaDate } from "../../helpers/formatHelpers";
import { useTranslation } from "react-i18next";

type TransferStep = 1 | 2 | 3;
type SourceWallet = TipoWallets.WALLET_STAKING | TipoWallets.WALLET_NETWORK;

const WalletPayglobalPage = () => {
    const { t, i18n } = useTranslation();
    const {
        usuario,
        transferenciaEntreUsuarios,
        loadingTransferenciaEntreUsuarios,
        errorTransferenciaEntreUsuarios,
    } = useUsuario();
    const { transacciones, cargarTransacciones, cargando } = useTransacciones();

    const [step, setStep] = useState<TransferStep>(1);
    const [transferUsername, setTransferUsername] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [sourceWallet, setSourceWallet] = useState<SourceWallet>(TipoWallets.WALLET_STAKING);
    const [transferError, setTransferError] = useState<string | null>(null);

    // Format currency based on current language
    const formatCurrency = (value: number) => {
        const localeMap: Record<string, string> = {
            es: "es-ES",
            en: "en-US",
            pt: "pt-BR",
            fr: "fr-FR",
            ar: "ar-AE",
        };
        const locale = localeMap[i18n.language] || "en-US";
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(value).replace(/^[A-Z]{2,3}\$?\s?/, "") + " USDT";
    };

    // Wallet labels with translations
    const walletLabels: Record<TipoWallets, string> = {
        [TipoWallets.WALLET_STAKING]: t("wallet_payglobal.wallet_staking"),
        [TipoWallets.WALLET_NETWORK]: t("wallet_payglobal.wallet_network"),
        [TipoWallets.WALLET_MINERIA]: t("wallet_payglobal.wallet_mining"),
        [TipoWallets.WALLET_PAYGLOBAL]: t("wallet_payglobal.wallet_payglobal"),
    };

    const walletBalances: Record<SourceWallet, number> = useMemo(() => ({
        [TipoWallets.WALLET_STAKING]: usuario?.wallets.find(wallet => wallet.tipo === TipoWallets.WALLET_STAKING)?.saldo ?? 0,
        [TipoWallets.WALLET_NETWORK]: usuario?.wallets.find(wallet => wallet.tipo === TipoWallets.WALLET_NETWORK)?.saldo ?? 0,
    }), [usuario]);

    const payglobalBalance = useMemo(
        () => usuario?.wallets.find(wallet => wallet.tipo === TipoWallets.WALLET_PAYGLOBAL)?.saldo ?? 0,
        [usuario]
    );

    const selectedBalance = walletBalances[sourceWallet];
    const amount = Number(transferAmount);

    useEffect(() => {
        if (usuario?.id) {
            cargarTransacciones({
                usuarioId: usuario.id,
                concepto: TipoConceptos.TRANSFERENCIA_ENTRE_USUARIOS,
                size: 8,
            });
        }
    }, [usuario?.id, cargarTransacciones]);

    const goToWalletStep = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setTransferError(null);
        if (!transferUsername.trim()) {
            setTransferError(t("wallet_payglobal.enter_recipient_username"));
            return;
        }
        setStep(2);
    };

    const goToConfirmation = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setTransferError(null);
        if (!transferAmount || !Number.isFinite(amount) || amount <= 0) {
            setTransferError(t("wallet_payglobal.amount_must_be_greater_than_zero"));
            return;
        }
        if (amount > selectedBalance) {
            setTransferError(t("wallet_payglobal.amount_exceeds_wallet_balance"));
            return;
        }
        setStep(3);
    };

    const confirmTransfer = async () => {
        try {
            await transferenciaEntreUsuarios(transferUsername.trim(), amount, sourceWallet);
            toast.success(t("wallet_payglobal.transfer_sent_successfully"));
            setTransferUsername("");
            setTransferAmount("");
            setStep(1);
            cargarTransacciones({ usuarioId: usuario?.id, concepto: TipoConceptos.TRANSFERENCIA_ENTRE_USUARIOS, size: 8 });
        } catch {
            toast.error(errorTransferenciaEntreUsuarios || t("wallet_payglobal.transfer_failed"));
        }
    };

    const resetTransfer = () => {
        setTransferError(null);
        setStep(1);
    };

    return (
        <main className="min-h-screen bg-[#081310] px-4 py-6 text-white sm:px-6 lg:px-10">
            <div className="mx-auto max-w-6xl space-y-6">
                <header className="relative overflow-hidden rounded-4xl border border-[#69AC95]/20 bg-[#10221d] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] sm:p-9">
                    <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#F0973C]/10 blur-3xl" />
                    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0973C] text-[#081310]"><Send size={22} /></div>
                            <p className="text-3xl font-bold uppercase tracking-[0.32em] text-[#F0973C]">{t("wallet_payglobal.transfers_payglobal")}</p>
                            <h1 className="mt-3 text-md font-black tracking-tight">{t("wallet_payglobal.send_balance_to_user")}</h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">{t("wallet_payglobal.transfer_usdt_description")}</p>
                        </div>
                        <div className="min-w-60 rounded-3xl border border-[#69AC95]/20 bg-[#081310]/70 p-5 lg:text-right">
                            <div className="flex items-center gap-2 text-[#69AC95] lg:justify-end"><WalletCards size={18} /><p className="text-xs font-bold uppercase tracking-[0.22em]">{t("wallet_payglobal.payglobal_balance")}</p></div>
                            <p className="mt-2 text-3xl font-black text-white">{formatCurrency(payglobalBalance)}</p>
                            <p className="mt-1 text-xs text-white/45">{t("wallet_payglobal.available_in_wallet")}</p>
                        </div>
                    </div>
                </header>

                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <section className="rounded-4xl border border-white/10 bg-[#10221d] p-5 sm:p-8">
                        <div className="mb-8 flex items-center justify-between gap-3">
                            <div><p className="text-2xl font-bold uppercase tracking-[0.25em] text-[#69AC95]">{t("wallet_payglobal.new_transfer")}</p><h2 className="mt-2 text-sm font-bold">{t("wallet_payglobal.send_balance")}</h2></div>
                            <span className="rounded-full bg-white/5 px-3 py-2 text-xs font-semibold text-white/60">{t("wallet_payglobal.zero_commission")}</span>
                        </div>

                        <div className="mb-8 grid grid-cols-3 gap-2">
                            {[{ number: 1, label: t("wallet_payglobal.step_recipient") }, { number: 2, label: t("wallet_payglobal.step_source_wallet") }, { number: 3, label: t("wallet_payglobal.step_confirmation") }].map(item => (
                                <div key={item.number} className={`border-t-2 pt-3 ${step >= item.number ? "border-[#F0973C]" : "border-white/10"}`}>
                                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step >= item.number ? "bg-[#F0973C] text-[#081310]" : "bg-white/10 text-white/50"}`}>{step > item.number ? <Check size={14} /> : item.number}</div>
                                    <p className={`mt-2 text-xs font-semibold ${step >= item.number ? "text-white" : "text-white/40"}`}>{item.label}</p>
                                </div>
                            ))}
                        </div>

                        {step === 1 && (
                            <form className="space-y-5" onSubmit={goToWalletStep}>
                                <div className="flex items-center gap-3 text-[#F0973C]"><UserRound size={20} /><h3 className="font-bold">{t("wallet_payglobal.who_to_send")}</h3></div>
                                <label className="block text-sm font-semibold text-white/75" htmlFor="recipient">{t("wallet_payglobal.username_label")}
                                    <input id="recipient" autoFocus value={transferUsername} onChange={event => setTransferUsername(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#081310] px-4 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-[#F0973C]" placeholder={t("wallet_payglobal.username_placeholder")} />
                                </label>
                                {transferError && <p className="text-sm text-[#F0973C]">{transferError}</p>}
                                <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F0973C] px-5 py-4 font-bold text-[#081310] transition hover:bg-[#ffb66c]" type="submit">{t("wallet_payglobal.continue")} <ArrowRight size={18} /></button>
                            </form>
                        )}

                        {step === 2 && (
                            <form className="space-y-5" onSubmit={goToConfirmation}>
                                <div className="flex items-center gap-3 text-[#69AC95]"><WalletCards size={20} /><h3 className="font-bold">{t("wallet_payglobal.select_source_wallet")}</h3></div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {([TipoWallets.WALLET_STAKING, TipoWallets.WALLET_NETWORK] as const).map(wallet => (
                                        <button type="button" key={wallet} onClick={() => setSourceWallet(wallet)} className={`rounded-2xl border p-4 text-left transition ${sourceWallet === wallet ? "border-[#69AC95] bg-[#69AC95]/10" : "border-white/10 bg-[#081310] hover:border-white/30"}`}>
                                            <p className="text-sm font-bold">{walletLabels[wallet]}</p><p className="mt-2 text-lg font-black text-[#69AC95]">{formatCurrency(walletBalances[wallet])}</p><p className="mt-1 text-xs text-white/45">{t("wallet_payglobal.available_balance")}</p>
                                        </button>
                                    ))}
                                </div>
                                <label className="block text-sm font-semibold text-white/75" htmlFor="amount">{t("wallet_payglobal.amount_to_transfer")}
                                    <div className="relative mt-2"><input id="amount" type="number" min="0.01" step="0.01" value={transferAmount} onChange={event => setTransferAmount(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#081310] px-4 py-4 pr-20 text-white outline-none focus:border-[#69AC95]" placeholder="0.00" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-white/40">USDT</span></div>
                                </label>
                                <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/60">{t("wallet_payglobal.remaining_balance")}: <span className="font-bold text-white">{formatCurrency(Math.max(0, selectedBalance - (Number.isFinite(amount) ? amount : 0)))}</span></div>
                                {transferError && <p className="text-sm text-[#F0973C]">{transferError}</p>}
                                <div className="flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => setStep(1)} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 text-sm font-bold text-white/70 hover:bg-white/5"><ArrowLeft size={17} /> {t("wallet_payglobal.back")}</button><button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#F0973C] px-5 py-4 font-bold text-[#081310] hover:bg-[#ffb66c]" type="submit">{t("wallet_payglobal.review_transfer")} <ArrowRight size={18} /></button></div>
                            </form>
                        )}

                        {step === 3 && (
                            <div className="space-y-5">
                                <div className="flex items-center gap-3 text-[#69AC95]"><CircleAlert size={20} /><h3 className="font-bold">{t("wallet_payglobal.confirm_data")}</h3></div>
                                <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#081310]">
                                    {[{ label: t("wallet_payglobal.recipient"), value: `@${transferUsername.trim()}` }, { label: t("wallet_payglobal.amount"), value: formatCurrency(amount) }, { label: t("wallet_payglobal.source_wallet"), value: walletLabels[sourceWallet] }, { label: t("wallet_payglobal.destination"), value: walletLabels[TipoWallets.WALLET_PAYGLOBAL] }].map(item => <div className="flex items-center justify-between gap-4 p-4" key={item.label}><span className="text-sm text-white/50">{item.label}</span><span className="text-right text-sm font-bold">{item.value}</span></div>)}
                                </div>
                                <p className="rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/10 p-4 text-sm leading-6 text-[#b9e9d2]">{t("wallet_payglobal.user_will_receive_message")}</p>
                                <p className="text-xs leading-5 text-white/45">{t("wallet_payglobal.irreversible_warning")}</p>
                                <div className="flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => setStep(2)} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 text-sm font-bold text-white/70 hover:bg-white/5"><ArrowLeft size={17} /> {t("wallet_payglobal.edit")}</button><button type="button" disabled={loadingTransferenciaEntreUsuarios} onClick={confirmTransfer} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#69AC95] px-5 py-4 font-bold text-[#081310] hover:bg-[#8be2ae] disabled:cursor-wait disabled:opacity-60">{loadingTransferenciaEntreUsuarios ? t("wallet_payglobal.sending") : t("wallet_payglobal.confirm_transfer")} <Check size={18} /></button></div>
                            </div>
                        )}
                    </section>

                    <section className="rounded-4xl border border-white/10 bg-[#10221d] p-5 sm:p-7">
                        <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F0973C]">{t("wallet_payglobal.activity")}</p><h2 className="mt-2 text-2xl font-bold">{t("wallet_payglobal.recent_transactions")}</h2></div><Clock3 className="text-[#69AC95]" size={22} /></div>
                        <div className="mt-6 space-y-3">
                            {cargando && <p className="text-sm text-white/50">{t("wallet_payglobal.loading_transactions")}</p>}
                            {!cargando && transacciones.map(transaction => <div className="rounded-2xl border border-white/10 bg-[#081310] p-4" key={transaction.id}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold">{transaction.usuario?.username ? `@${transaction.usuario.username}` : t("wallet_payglobal.payglobal_user")}</p><p className="mt-1 text-xs text-white/45">{formatearFechaDate(new Date(transaction.fecha))}</p></div><p className={`text-sm font-black ${transaction.monto >= 0 ? "text-[#69AC95]" : "text-[#F0973C]"}`}>{transaction.monto >= 0 ? "+" : ""}{formatCurrency(transaction.monto)}</p></div><div className="mt-3 flex flex-wrap gap-2 text-xs text-white/50"><span className="rounded-full bg-white/5 px-2.5 py-1">{transaction.descripcion || t("wallet_payglobal.user_transfer")}</span><span className="rounded-full bg-white/5 px-2.5 py-1">{transaction.estado}</span></div></div>)}
                            {!cargando && transacciones.length === 0 && <p className="rounded-2xl border border-dashed border-white/10 p-5 text-center text-sm text-white/50">{t("wallet_payglobal.no_transfers_yet")}</p>}
                        </div>
                    </section>
                </div>
                {step === 3 && <button type="button" onClick={resetTransfer} className="mx-auto block text-sm font-semibold text-white/45 hover:text-white">{t("wallet_payglobal.cancel_transfer")}</button>}
            </div>
        </main>
    );
};

export default WalletPayglobalPage;
