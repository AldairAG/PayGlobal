import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { PiArrowUpRight, PiBank, PiWarningCircle, PiWalletBold } from "react-icons/pi";
import { useUsuario } from "../../hooks/usuarioHook";
import { TipoConceptos, TipoWallets } from "../../type/enum";
import type { SolicitudTransferenciaPayglobalRequest } from "../../type/requestTypes";
import { useTransacciones } from "../../hooks/useTransacciones";
import { formatearFecha, formatearFechaDate } from "../../helpers/formatHelpers"

const formatCurrency = (value: number) => {
    //Agregar usdt al final
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(value).replace("US$", "") + " USDT";
};

const WalletPayglobalPage = () => {
    const {
        usuario,
        hacerTransferenciaAWalletPayGlobal,
        loadingTransferenciaAWalletPayGlobal,
        errorTransferenciaAWalletPayGlobal,
        transferenciaEntreUsuarios,
        loadingTransferenciaEntreUsuarios,
        errorTransferenciaEntreUsuarios
    } = useUsuario()

    const { transacciones, cargarTransacciones, cargando, error } = useTransacciones()

    const [stakingTransferAmount, setStakingTransferAmount] = useState(0);
    const [networkTransferAmount, setNetworkTransferAmount] = useState(0);
    const [transferUsername, setTransferUsername] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [transferError, setTransferError] = useState<string | null>(null);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferPreview, setTransferPreview] = useState<{ username: string; amount: number; remaining: number; } | null>(null);
    const [alertMessage] = useState<string | null>(null);

    const [transactions, setTransactions] = useState([
        { id: "1", date: "08/08/2026", type: "Transferencia enviada", user: "soporte_payglobal", amount: -185.00, origin: "PayGlobal", destination: "@andres23", status: "Enviada" },
        { id: "2", date: "07/08/2026", type: "Transferencia desde Staking", user: "-", amount: 240.00, origin: "Wallet Staking", destination: "PayGlobal", status: "Completada" },
        { id: "3", date: "06/08/2026", type: "Activación de licencia", user: "-", amount: -50.00, origin: "PayGlobal", destination: "Licencia P50", status: "Completada" },
        { id: "4", date: "05/08/2026", type: "Transferencia desde Network", user: "-", amount: 135.00, origin: "Wallet Network", destination: "PayGlobal", status: "Completada" },
        { id: "5", date: "04/08/2026", type: "Transferencia recibida", user: "@mariana14", amount: 105.20, origin: "@mariana14", destination: "PayGlobal", status: "Recibida" },
    ]);

    const walletTransactions = useMemo(
        () => transactions.filter((transaction) =>
            transaction.type.includes("Transferencia desde") ||
            transaction.destination === "PayGlobal"
        ),
        [transactions]
    );

    const userTransactions = useMemo(
        () => transactions.filter((transaction) =>
            transaction.type.includes("Transferencia enviada") ||
            transaction.type.includes("Transferencia recibida")
        ),
        [transactions]
    );

    const payglobalBalance = useMemo(() => {
        const payglobalWallet = usuario?.wallets.find(wallet => wallet.tipo === TipoWallets.WALLET_PAYGLOBAL);
        return payglobalWallet ? payglobalWallet.saldo : 0;
    }, [usuario]);

    const stakingBalance = useMemo(() => {
        const stakingWallet = usuario?.wallets.find(wallet => wallet.tipo === TipoWallets.WALLET_STAKING);
        return stakingWallet ? stakingWallet.saldo : 0;
    }, [usuario]);

    const networkBalance = useMemo(() => {
        const networkWallet = usuario?.wallets.find(wallet => wallet.tipo === TipoWallets.WALLET_NETWORK);
        return networkWallet ? networkWallet.saldo : 0;
    }, [usuario]);

    const stakingRemaining = useMemo(() => Math.max(0, stakingBalance - stakingTransferAmount), [stakingBalance, stakingTransferAmount]);
    const networkRemaining = useMemo(() => Math.max(0, networkBalance - networkTransferAmount), [networkBalance, networkTransferAmount]);
    const transferAmountNumber = Number(transferAmount);

    const transferRemaining = useMemo(() =>
        Math.max(0, payglobalBalance - transferAmountNumber),
        [payglobalBalance, transferAmountNumber]);

    const handleTransferirAWalletPayGlobal = async (walletTipo: TipoWallets) => {
        try {
            const request: SolicitudTransferenciaPayglobalRequest = {
                tipoWallet: walletTipo,
                monto: walletTipo === TipoWallets.WALLET_STAKING ? stakingTransferAmount : networkTransferAmount,
            };

            await hacerTransferenciaAWalletPayGlobal(request);
            toast.success("Transferencia a Wallet PayGlobal completada.");
        } catch (error) {
            toast.error(errorTransferenciaAWalletPayGlobal);
        }
    };

    const handlePrepareTransfer = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setTransferError(null);

        if (!transferUsername.trim()) {
            setTransferError("El username es obligatorio.");
            return;
        }
        if (!transferAmount || isNaN(transferAmountNumber) || transferAmountNumber <= 0) {
            setTransferError("La cantidad debe ser mayor a 0.");
            return;
        }
        if (transferAmountNumber > payglobalBalance) {
            setTransferError("No puedes transferir más del saldo disponible.");
            return;
        }

        setTransferPreview({
            username: transferUsername.trim(),
            amount: transferAmountNumber,
            remaining: payglobalBalance - transferAmountNumber,
        });
        setShowTransferModal(true);
    };

    const confirmPayglobalTransfer = () => {
        if (!transferPreview) return;
        const amount = transferPreview.amount;
        const username = transferPreview.username;


        transferenciaEntreUsuarios(username, amount, TipoWallets.WALLET_PAYGLOBAL)

        if (errorTransferenciaEntreUsuarios) {
            toast.error(errorTransferenciaEntreUsuarios)
            return
        }
        toast.success("Transferencia PayGlobal enviada correctamente.");
        setTransferPreview(null);

        setShowTransferModal(false);
        setTransferUsername("");
        setTransferAmount("");

    };

    const [activeTab, setActiveTab] = useState<"wallet" | "user">("wallet");

    useEffect(() => {
        const concepto = activeTab == "wallet" ? TipoConceptos.TRANSFERENCIA_A_WALLET_PAYGLOBAL : TipoConceptos.TRANSFERENCIA_ENTRE_USUARIOS;

        cargarTransacciones({ usuarioId: usuario?.id, concepto: concepto, size: 3 });
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-[#000000] text-white px-4 py-6 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-3xl uppercase tracking-[0.35em] text-[#F0973C] font-semibold mb-2">Wallet PayGlobal</p>
                            <h1 className="text-md font-bold text-white">Administrar saldo PayGlobal</h1>
                            <p className="mt-3 max-w-2xl text-sm text-white/60 leading-7">
                                Gestiona tus fondos PayGlobal, transfiere entre wallets, envía saldo a otro usuario y activa licencias usando tu balance.
                                Recuerda que las transferencias son irreversibles y solo entre otro usuario con cuenta PayGlobal activa. Asegúrate de ingresar correctamente el username del destinatario.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-[#69AC95]/20 bg-[#69AC95]/5 p-5 max-w-sm">
                            <p className="text-sm uppercase tracking-[0.35em] text-[#F0973C] mb-2">Saldo disponible</p>
                            <p className="text-4xl font-black text-[#69AC95]">{formatCurrency(payglobalBalance)}</p>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="rounded-[1.75rem] border border-white/10 bg-[#111111] p-4 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.35em] text-[#F0973C]">Operaciones</p>
                                <h2 className="mt-2 text-xl font-bold text-white">Selecciona una sección</h2>
                                <p className="mt-2 text-sm text-white/60 max-w-2xl">Cambia entre transferir a PayGlobal y transferir a usuario. Cada pestaña incluye el historial relacionado.</p>
                            </div>
                            <div className="flex flex-wrap gap-3 rounded-3xl bg-white/5 p-1">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("wallet")}
                                    className={`rounded-3xl px-5 py-3 text-sm font-semibold transition ${activeTab === "wallet" ? "bg-[#69AC95] text-black" : "bg-transparent text-white/80 hover:bg-white/10"}`}
                                >
                                    Transferir a PayGlobal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("user")}
                                    className={`rounded-3xl px-5 py-3 text-sm font-semibold transition ${activeTab === "user" ? "bg-[#F0973C] text-black" : "bg-transparent text-white/80 hover:bg-white/10"}`}
                                >
                                    Transferir a usuario
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        {activeTab === "wallet" ? (
                            <>
                                <div className="space-y-6">
                                    <div className="grid gap-6 lg:grid-cols-2">
                                        <div className="rounded-[1.75rem] border border-[#69AC95]/10 bg-[#111111] p-8 shadow-sm">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.35em] text-[#F0973C]">Transferir desde Staking</p>
                                                    <p className="mt-2 text-sm text-white/60 leading-6">Envía saldo desde tu wallet de staking a PayGlobal.</p>
                                                </div>
                                                <PiBank className="h-8 w-8 text-[#69AC95]" />
                                            </div>
                                            <div className="mt-8 space-y-6">
                                                <div>
                                                    <label className="text-sm font-semibold text-[#F0973C]">Saldo disponible</label>
                                                    <p className="mt-3 text-3xl font-bold text-[#69AC95]">{formatCurrency(stakingBalance)}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-white/80 mb-3">Cantidad</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={stakingTransferAmount || ""}
                                                        onChange={(e) => setStakingTransferAmount(Number(e.target.value))}
                                                        className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-[#69AC95]/50 focus:ring-2 focus:ring-[#69AC95]/10"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70">
                                                    Saldo restante: <span className="font-semibold text-white">{formatCurrency(stakingRemaining)}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleTransferirAWalletPayGlobal(TipoWallets.WALLET_STAKING)}
                                                    className="w-full rounded-3xl bg-[#69AC95] px-5 py-4 text-base font-semibold text-black transition hover:bg-[#8be2ae] disabled:opacity-50"
                                                >
                                                    Transferir a PayGlobal
                                                </button>
                                            </div>
                                        </div>

                                        <div className="rounded-[1.75rem] border border-[#F0973C]/10 bg-[#111111] p-8 shadow-sm">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.35em] text-[#F0973C]">Transferir desde Network</p>
                                                    <p className="mt-2 text-sm text-white/60 leading-6">Mueve saldo desde tu wallet Network a PayGlobal.</p>
                                                </div>
                                                <PiArrowUpRight className="h-8 w-8 text-[#F0973C]" />
                                            </div>
                                            <div className="mt-8 space-y-6">
                                                <div>
                                                    <label className="text-sm font-semibold text-[#F0973C]">Saldo disponible</label>
                                                    <p className="mt-3 text-3xl font-bold text-[#69AC95]">{formatCurrency(networkBalance)}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-white/80 mb-3">Cantidad</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={networkTransferAmount || ""}
                                                        onChange={(e) => setNetworkTransferAmount(Number(e.target.value))}
                                                        className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-[#F0973C]/50 focus:ring-2 focus:ring-[#F0973C]/10"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70">
                                                    Saldo restante: <span className="font-semibold text-white">{formatCurrency(networkRemaining)}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleTransferirAWalletPayGlobal(TipoWallets.WALLET_NETWORK)}
                                                    className="w-full rounded-3xl bg-[#F0973C] px-5 py-4 text-base font-semibold text-black transition hover:bg-[#e8841f] disabled:opacity-50"
                                                >
                                                    Transferir a PayGlobal
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="rounded-[1.75rem] border border-white/10 bg-[#111111] p-6 shadow-sm">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.35em] text-[#F0973C]">Resumen de movimientos</p>
                                                <h2 className="mt-3 text-xl font-bold text-white">Historial reciente</h2>
                                            </div>
                                            {/* <div className="rounded-full bg-[#F0973C]/10 px-3 py-2 text-xs font-semibold text-[#F0973C]">Ver todo</div> */}
                                        </div>
                                        <div className="mt-6 space-y-4">
                                            {transacciones.slice(0, 4).map((transaction) => (
                                                <div key={transaction.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <p className="text-sm font-semibold text-white">{transaction.concepto}</p>
                                                            <p className="text-xs text-white/50">{formatearFechaDate(new Date(transaction.fecha))} • {transaction.metodoPago} → Wallet Payglobal</p>
                                                        </div>
                                                        <p className={`text-lg font-bold ${transaction.monto > 0 ? "text-[#69AC95]" : "text-[#F0973C]"}`}>
                                                            {transaction.monto > 0 ? "+" : ""}{formatCurrency(transaction.monto)}
                                                        </p>
                                                    </div>
                                                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/50">
                                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Estado: {transaction.estado}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {walletTransactions.length === 0 && (
                                                <p className="text-sm text-white/60">No hay movimientos de wallet PayGlobal recientes.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-6">
                                    <div className="rounded-[1.75rem] border border-white/10 bg-[#111111] p-6 shadow-sm">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-md uppercase tracking-[0.35em] text-[#F0973C]">Enviar saldo a usuario</p>
                                            </div>
                                            <PiWalletBold className="h-6 w-6 text-[#69AC95]" />
                                        </div>
                                        <form className="mt-6 space-y-5" onSubmit={handlePrepareTransfer}>
                                            <div>
                                                <label className="block text-sm font-semibold text-white/80 mb-2">Username destinatario</label>
                                                <input
                                                    type="text"
                                                    value={transferUsername}
                                                    onChange={(e) => setTransferUsername(e.target.value)}
                                                    className={`w-full rounded-2xl border px-4 py-3 bg-white/5 text-white outline-none transition focus:ring-2 focus:ring-[#69AC95]/10 ${transferError && !transferUsername ? "border-[#BC2020]" : "border-white/10"}`}
                                                    placeholder="Ej. @usuario123"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-white/80 mb-2">Cantidad a transferir</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={transferAmount}
                                                    onChange={(e) => setTransferAmount(e.target.value)}
                                                    className={`w-full rounded-2xl border px-4 py-3 bg-white/5 text-white outline-none transition focus:ring-2 focus:ring-[#69AC95]/10 ${transferError && (!transferAmount || parseFloat(transferAmount) <= 0) ? "border-[#BC2020]" : "border-white/10"}`}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                                                Saldo disponible: <span className="font-semibold text-white">{formatCurrency(payglobalBalance)}</span>
                                                <br />
                                                Saldo tras transferencia: <span className="font-semibold text-white">{formatCurrency(transferRemaining)}</span>
                                            </div>
                                            {transferError && (
                                                <p className="text-sm text-[#F0973C]">{transferError}</p>
                                            )}
                                            <button
                                                type="submit"
                                                className="w-full rounded-2xl bg-[#69AC95] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#8be2ae]"
                                            >
                                                Revisar transferencia
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="rounded-[1.75rem] border border-white/10 bg-[#111111] p-6 shadow-sm">
                                        <h2 className="text-xl font-bold text-white">Historial de transacciones</h2>
                                        <div className="mt-5 overflow-x-auto">
                                            <table className="min-w-full table-auto border-separate border-spacing-y-3 text-sm">
                                                <thead>
                                                    <tr className="text-left text-xs uppercase tracking-[0.35em] text-white/40">
                                                        <th className="px-3 py-3">Fecha</th>
                                                        <th className="px-3 py-3">Movimiento</th>
                                                        <th className="px-3 py-3">Usuario</th>
                                                        <th className="px-3 py-3">Monto</th>
                                                        <th className="px-3 py-3">Origen / Destino</th>
                                                        <th className="px-3 py-3">Estado</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {userTransactions.length > 0 ? userTransactions.map((transaction) => (
                                                        <tr key={transaction.id} className="bg-white/5">
                                                            <td className="px-3 py-4 text-white/70">{transaction.date}</td>
                                                            <td className="px-3 py-4 text-white">{transaction.type}</td>
                                                            <td className="px-3 py-4 text-white/70">{transaction.user}</td>
                                                            <td className={`px-3 py-4 font-semibold ${transaction.amount > 0 ? "text-[#69AC95]" : "text-[#F0973C]"}`}>
                                                                {transaction.amount > 0 ? "+" : ""}{formatCurrency(transaction.amount)}
                                                            </td>
                                                            <td className="px-3 py-4 text-white/70">{transaction.origin} / {transaction.destination}</td>
                                                            <td className="px-3 py-4">
                                                                <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${transaction.type.includes("recibida") || transaction.amount > 0 ? "bg-[#69AC95]/15 text-[#69AC95]" : "bg-[#F0973C]/15 text-[#F0973C]"}`}>
                                                                    {transaction.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan={6} className="px-3 py-4 text-center text-white/60">No hay transacciones de usuario por mostrar.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {alertMessage && (
                    <div className="rounded-2xl border border-[#69AC95]/20 bg-[#69AC95]/5 p-4 text-sm text-[#E7F9ED]">
                        {alertMessage}
                    </div>
                )}
            </div>

            {showTransferModal && transferPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
                    <div className="relative w-full max-w-2xl rounded-4xl border border-white/10 bg-[#111111] p-6 shadow-[0_35px_120px_rgba(0,0,0,0.5)]">
                        <button
                            onClick={() => setShowTransferModal(false)}
                            className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
                        >
                            ✕
                        </button>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0973C]/15 text-[#F0973C]">
                                    <PiWarningCircle className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-sm uppercase tracking-[0.35em] text-[#F0973C]">Confirmación de transferencia</p>
                                    <h2 className="text-2xl font-bold text-white">Revisa antes de confirmar</h2>
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-sm text-white/50">Usuario destinatario</p>
                                    <p className="mt-2 text-lg font-semibold text-white">@{transferPreview.username}</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-sm text-white/50">Cantidad a enviar</p>
                                    <p className="mt-2 text-lg font-semibold text-white">{formatCurrency(transferPreview.amount)}</p>
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-sm text-white/50">Wallet origen</p>
                                    <p className="mt-2 text-lg font-semibold text-white">PayGlobal</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-sm text-white/50">Saldo restante</p>
                                    <p className="mt-2 text-lg font-semibold text-white">{formatCurrency(transferPreview.remaining)}</p>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-[#F0973C]/20 bg-[#F0973C]/5 p-4 text-sm text-[#FFECB7]">
                                <p className="font-semibold">Advertencia:</p>
                                <p>Las transferencias son <span className="font-bold">irreversibles</span> y solo pueden enviarse a otros usuarios con cuenta PayGlobal activa.</p>
                            </div>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-white/60">Transferencia usuario a usuario con <span className="font-semibold text-white">0% de comisión</span>.</p>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <button
                                        onClick={() => setShowTransferModal(false)}
                                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmPayglobalTransfer}
                                        className="rounded-2xl bg-[#69AC95] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#8be2ae]"
                                    >
                                        Confirmar transferencia
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletPayglobalPage;
