import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Clock3, Send, UserRound, WalletCards } from "lucide-react";
import { useUsuario } from "../../hooks/usuarioHook";
import { TipoConceptos, TipoWallets } from "../../type/enum";
import { useTransacciones } from "../../hooks/useTransacciones";
import { formatearFechaDate } from "../../helpers/formatHelpers";

const formatCurrency = (value: number) => new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
}).format(value).replace("US$", "") + " USDT";

type TransferStep = 1 | 2 | 3;
type SourceWallet = TipoWallets.WALLET_STAKING | TipoWallets.WALLET_NETWORK;

const walletLabels: Record<TipoWallets, string> = {
    [TipoWallets.WALLET_STAKING]: "Wallet Staking",
    [TipoWallets.WALLET_NETWORK]: "Wallet Network",
    [TipoWallets.WALLET_MINERIA]: "Wallet Minería",
    [TipoWallets.WALLET_PAYGLOBAL]: "Wallet PayGlobal",
};

const WalletPayglobalPage = () => {
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
    }, [usuario?.id]);

    const goToWalletStep = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setTransferError(null);
        if (!transferUsername.trim()) {
            setTransferError("Ingresa el nombre de usuario del destinatario.");
            return;
        }
        setStep(2);
    };

    const goToConfirmation = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setTransferError(null);
        if (!transferAmount || !Number.isFinite(amount) || amount <= 0) {
            setTransferError("El monto debe ser mayor a 0.");
            return;
        }
        if (amount > selectedBalance) {
            setTransferError("El monto supera el saldo disponible de esta wallet.");
            return;
        }
        setStep(3);
    };

    const confirmTransfer = async () => {
        try {
            await transferenciaEntreUsuarios(transferUsername.trim(), amount, sourceWallet);
            toast.success("Transferencia enviada correctamente.");
            setTransferUsername("");
            setTransferAmount("");
            setStep(1);
            cargarTransacciones({ usuarioId: usuario?.id, concepto: TipoConceptos.TRANSFERENCIA_ENTRE_USUARIOS, size: 8 });
        } catch (error) {
            toast.error(errorTransferenciaEntreUsuarios || "No se pudo completar la transferencia.");
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
                            <p className="text-3xl font-bold uppercase tracking-[0.32em] text-[#F0973C]">Transferencias PayGlobal</p>
                            <h1 className="mt-3 text-md font-black tracking-tight">Envía saldo a otro usuario</h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">Transfiere USDT desde tu Wallet Staking o Wallet Network de forma rápida y segura.</p>
                        </div>
                        <div className="min-w-60 rounded-3xl border border-[#69AC95]/20 bg-[#081310]/70 p-5 lg:text-right">
                            <div className="flex items-center gap-2 text-[#69AC95] lg:justify-end"><WalletCards size={18} /><p className="text-xs font-bold uppercase tracking-[0.22em]">Saldo PayGlobal</p></div>
                            <p className="mt-2 text-3xl font-black text-white">{formatCurrency(payglobalBalance)}</p>
                            <p className="mt-1 text-xs text-white/45">Disponible en tu wallet</p>
                        </div>
                    </div>
                </header>

                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <section className="rounded-4xl border border-white/10 bg-[#10221d] p-5 sm:p-8">
                        <div className="mb-8 flex items-center justify-between gap-3">
                            <div><p className="text-2xl font-bold uppercase tracking-[0.25em] text-[#69AC95]">Nueva transferencia</p><h2 className="mt-2 text-sm font-bold">Envía saldo</h2></div>
                            <span className="rounded-full bg-white/5 px-3 py-2 text-xs font-semibold text-white/60">0% comisión</span>
                        </div>

                        <div className="mb-8 grid grid-cols-3 gap-2">
                            {[{ number: 1, label: "Destinatario" }, { number: 2, label: "Wallet origen" }, { number: 3, label: "Confirmación" }].map(item => (
                                <div key={item.number} className={`border-t-2 pt-3 ${step >= item.number ? "border-[#F0973C]" : "border-white/10"}`}>
                                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step >= item.number ? "bg-[#F0973C] text-[#081310]" : "bg-white/10 text-white/50"}`}>{step > item.number ? <Check size={14} /> : item.number}</div>
                                    <p className={`mt-2 text-xs font-semibold ${step >= item.number ? "text-white" : "text-white/40"}`}>{item.label}</p>
                                </div>
                            ))}
                        </div>

                        {step === 1 && (
                            <form className="space-y-5" onSubmit={goToWalletStep}>
                                <div className="flex items-center gap-3 text-[#F0973C]"><UserRound size={20} /><h3 className="font-bold">¿A quién quieres enviar?</h3></div>
                                <label className="block text-sm font-semibold text-white/75" htmlFor="recipient">Nombre de usuario
                                    <input id="recipient" autoFocus value={transferUsername} onChange={event => setTransferUsername(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#081310] px-4 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-[#F0973C]" placeholder="Ej. usuario123" />
                                </label>
                                {transferError && <p className="text-sm text-[#F0973C]">{transferError}</p>}
                                <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F0973C] px-5 py-4 font-bold text-[#081310] transition hover:bg-[#ffb66c]" type="submit">Continuar <ArrowRight size={18} /></button>
                            </form>
                        )}

                        {step === 2 && (
                            <form className="space-y-5" onSubmit={goToConfirmation}>
                                <div className="flex items-center gap-3 text-[#69AC95]"><WalletCards size={20} /><h3 className="font-bold">Selecciona la wallet de origen</h3></div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {[TipoWallets.WALLET_STAKING, TipoWallets.WALLET_NETWORK].map(wallet => (
                                        <button type="button" key={wallet} onClick={() => setSourceWallet(wallet)} className={`rounded-2xl border p-4 text-left transition ${sourceWallet === wallet ? "border-[#69AC95] bg-[#69AC95]/10" : "border-white/10 bg-[#081310] hover:border-white/30"}`}>
                                            <p className="text-sm font-bold">{walletLabels[wallet]}</p><p className="mt-2 text-lg font-black text-[#69AC95]">{formatCurrency(walletBalances[wallet])}</p><p className="mt-1 text-xs text-white/45">Saldo disponible</p>
                                        </button>
                                    ))}
                                </div>
                                <label className="block text-sm font-semibold text-white/75" htmlFor="amount">Monto a transferir
                                    <div className="relative mt-2"><input id="amount" type="number" min="0.01" step="0.01" value={transferAmount} onChange={event => setTransferAmount(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#081310] px-4 py-4 pr-20 text-white outline-none focus:border-[#69AC95]" placeholder="0.00" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-white/40">USDT</span></div>
                                </label>
                                <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/60">Saldo restante: <span className="font-bold text-white">{formatCurrency(Math.max(0, selectedBalance - (Number.isFinite(amount) ? amount : 0)))}</span></div>
                                {transferError && <p className="text-sm text-[#F0973C]">{transferError}</p>}
                                <div className="flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => setStep(1)} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 text-sm font-bold text-white/70 hover:bg-white/5"><ArrowLeft size={17} /> Atrás</button><button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#F0973C] px-5 py-4 font-bold text-[#081310] hover:bg-[#ffb66c]" type="submit">Revisar transferencia <ArrowRight size={18} /></button></div>
                            </form>
                        )}

                        {step === 3 && (
                            <div className="space-y-5">
                                <div className="flex items-center gap-3 text-[#69AC95]"><CircleAlert size={20} /><h3 className="font-bold">Confirma los datos</h3></div>
                                <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#081310]">
                                    {[{ label: "Destinatario", value: `@${transferUsername.trim()}` }, { label: "Monto", value: formatCurrency(amount) }, { label: "Wallet origen", value: walletLabels[sourceWallet] }, { label: "Destino", value: "Wallet PayGlobal" }].map(item => <div className="flex items-center justify-between gap-4 p-4" key={item.label}><span className="text-sm text-white/50">{item.label}</span><span className="text-right text-sm font-bold">{item.value}</span></div>)}
                                </div>
                                <p className="rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/10 p-4 text-sm leading-6 text-[#b9e9d2]">El usuario recibirá la transferencia en su Wallet PayGlobal.</p>
                                <p className="text-xs leading-5 text-white/45">Las transferencias son irreversibles. Verifica el usuario y el monto antes de confirmar.</p>
                                <div className="flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => setStep(2)} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 text-sm font-bold text-white/70 hover:bg-white/5"><ArrowLeft size={17} /> Editar</button><button type="button" disabled={loadingTransferenciaEntreUsuarios} onClick={confirmTransfer} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#69AC95] px-5 py-4 font-bold text-[#081310] hover:bg-[#8be2ae] disabled:cursor-wait disabled:opacity-60">{loadingTransferenciaEntreUsuarios ? "Enviando..." : "Confirmar transferencia"} <Check size={18} /></button></div>
                            </div>
                        )}
                    </section>

                    <section className="rounded-4xl border border-white/10 bg-[#10221d] p-5 sm:p-7">
                        <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F0973C]">Actividad</p><h2 className="mt-2 text-2xl font-bold">Transacciones recientes</h2></div><Clock3 className="text-[#69AC95]" size={22} /></div>
                        <div className="mt-6 space-y-3">
                            {cargando && <p className="text-sm text-white/50">Cargando transacciones...</p>}
                            {!cargando && transacciones.map(transaction => <div className="rounded-2xl border border-white/10 bg-[#081310] p-4" key={transaction.id}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold">{transaction.usuario?.username ? `@${transaction.usuario.username}` : "Usuario PayGlobal"}</p><p className="mt-1 text-xs text-white/45">{formatearFechaDate(new Date(transaction.fecha))}</p></div><p className={`text-sm font-black ${transaction.monto >= 0 ? "text-[#69AC95]" : "text-[#F0973C]"}`}>{transaction.monto >= 0 ? "+" : ""}{formatCurrency(transaction.monto)}</p></div><div className="mt-3 flex flex-wrap gap-2 text-xs text-white/50"><span className="rounded-full bg-white/5 px-2.5 py-1">{transaction.descripcion || "Transferencia entre usuarios"}</span><span className="rounded-full bg-white/5 px-2.5 py-1">{transaction.estado}</span></div></div>)}
                            {!cargando && transacciones.length === 0 && <p className="rounded-2xl border border-dashed border-white/10 p-5 text-center text-sm text-white/50">Aún no tienes transferencias entre usuarios.</p>}
                        </div>
                    </section>
                </div>
                {step === 3 && <button type="button" onClick={resetTransfer} className="mx-auto block text-sm font-semibold text-white/45 hover:text-white">Cancelar transferencia</button>}
            </div>
        </main>
    );
};

export default WalletPayglobalPage;
