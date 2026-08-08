import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { PiArrowUpRight, PiBank, PiCheckCircle, PiSparkle, PiWarningCircle, PiWalletBold } from "react-icons/pi";

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(value);
};

const WalletPayglobalPage = () => {
    const [payglobalBalance, setPayglobalBalance] = useState(2890.45);
    const [stakingBalance, setStakingBalance] = useState(1245.75);
    const [networkBalance, setNetworkBalance] = useState(860.65);
    const [stakingTransferAmount, setStakingTransferAmount] = useState(0);
    const [networkTransferAmount, setNetworkTransferAmount] = useState(0);
    const [transferUsername, setTransferUsername] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [transferError, setTransferError] = useState<string | null>(null);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferPreview, setTransferPreview] = useState<{ username: string; amount: number; remaining: number; } | null>(null);
    const [selectedLicenseId, setSelectedLicenseId] = useState("P50");
    const [showLicenseModal, setShowLicenseModal] = useState(false);
    const [alertMessage] = useState<string | null>(null);

    const licenses = [
        { id: "P20", name: "Licencia P20", price: 20, description: "Activación rápida con acceso básico." },
        { id: "P50", name: "Licencia P50", price: 50, description: "Balance ideal para comenzar con PayGlobal." },
        { id: "P100", name: "Licencia P100", price: 100, description: "Mayor capacidad de retiro y transferencias." },
    ];

    const [transactions, setTransactions] = useState([
        { id: "1", date: "08/08/2026", type: "Transferencia enviada", user: "soporte_payglobal", amount: -185.00, origin: "PayGlobal", destination: "@andres23", status: "Enviada" },
        { id: "2", date: "07/08/2026", type: "Transferencia desde Staking", user: "-", amount: 240.00, origin: "Wallet Staking", destination: "PayGlobal", status: "Completada" },
        { id: "3", date: "06/08/2026", type: "Activación de licencia", user: "-", amount: -50.00, origin: "PayGlobal", destination: "Licencia P50", status: "Completada" },
        { id: "4", date: "05/08/2026", type: "Transferencia desde Network", user: "-", amount: 135.00, origin: "Wallet Network", destination: "PayGlobal", status: "Completada" },
        { id: "5", date: "04/08/2026", type: "Transferencia recibida", user: "@mariana14", amount: 105.20, origin: "@mariana14", destination: "PayGlobal", status: "Recibida" },
    ]);

    const selectedLicense = licenses.find((license) => license.id === selectedLicenseId) ?? licenses[1];

    const stakingRemaining = useMemo(() => Math.max(0, stakingBalance - stakingTransferAmount), [stakingBalance, stakingTransferAmount]);
    const networkRemaining = useMemo(() => Math.max(0, networkBalance - networkTransferAmount), [networkBalance, networkTransferAmount]);
    const transferAmountNumber = Number(transferAmount);
    const transferRemaining = useMemo(() => Math.max(0, payglobalBalance - transferAmountNumber), [payglobalBalance, transferAmountNumber]);
    const licenseRemaining = Math.max(0, payglobalBalance - selectedLicense.price);

    const handleStakingTransfer = () => {
        if (stakingTransferAmount <= 0 || stakingTransferAmount > stakingBalance) {
            toast.error("Cantidad inválida para transferencia desde Staking.");
            return;
        }
        setStakingBalance((prev) => prev - stakingTransferAmount);
        setPayglobalBalance((prev) => prev + stakingTransferAmount);
        setTransactions((prev) => [
            { id: `${Date.now()}`, date: new Date().toLocaleDateString("es-ES"), type: "Transferencia desde Staking", user: "-", amount: stakingTransferAmount, origin: "Wallet Staking", destination: "PayGlobal", status: "Completada" },
            ...prev,
        ]);
        toast.success("Transferencia desde Staking a PayGlobal completada.");
        setStakingTransferAmount(0);
    };

    const handleNetworkTransfer = () => {
        if (networkTransferAmount <= 0 || networkTransferAmount > networkBalance) {
            toast.error("Cantidad inválida para transferencia desde Network.");
            return;
        }
        setNetworkBalance((prev) => prev - networkTransferAmount);
        setPayglobalBalance((prev) => prev + networkTransferAmount);
        setTransactions((prev) => [
            { id: `${Date.now()}`, date: new Date().toLocaleDateString("es-ES"), type: "Transferencia desde Network", user: "-", amount: networkTransferAmount, origin: "Wallet Network", destination: "PayGlobal", status: "Completada" },
            ...prev,
        ]);
        toast.success("Transferencia desde Network a PayGlobal completada.");
        setNetworkTransferAmount(0);
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
        setPayglobalBalance((prev) => prev - amount);
        setTransactions((prev) => [
            { id: `${Date.now()}`, date: new Date().toLocaleDateString("es-ES"), type: "Transferencia enviada", user: `@${username}`, amount: -amount, origin: "PayGlobal", destination: `@${username}`, status: "Enviada" },
            ...prev,
        ]);
        setShowTransferModal(false);
        setTransferUsername("");
        setTransferAmount("");
        toast.success("Transferencia PayGlobal enviada correctamente.");
        setTransferPreview(null);
    };

    const handleLicenseActivation = () => {
        if (selectedLicense.price > payglobalBalance) {
            toast.error("Saldo insuficiente para activar la licencia.");
            return;
        }
        setShowLicenseModal(true);
    };

    const confirmLicenseActivation = () => {
        setPayglobalBalance((prev) => prev - selectedLicense.price);
        setTransactions((prev) => [
            { id: `${Date.now()}`, date: new Date().toLocaleDateString("es-ES"), type: "Activación de licencia", user: "-", amount: -selectedLicense.price, origin: "PayGlobal", destination: selectedLicense.name, status: "Completada" },
            ...prev,
        ]);
        setShowLicenseModal(false);
        toast.success(`Licencia ${selectedLicense.name} activada con PayGlobal.`);
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white px-4 py-6 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.35em] text-[#F0973C] font-semibold mb-2">Wallet PayGlobal</p>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">Administrar saldo PayGlobal</h1>
                            <p className="mt-3 max-w-2xl text-sm text-white/60 leading-7">
                                Gestiona tus fondos PayGlobal, transfiere entre wallets, envía saldo a otro usuario y activa licencias usando tu balance.
                                Recuerda que las transferencias son irreversibles y solo entre otro usuario con cuenta PayGlobal activa. Asegúrate de ingresar correctamente el username del destinatario.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-[#69AC95]/20 bg-[#69AC95]/5 p-5 max-w-sm">
                            <p className="text-sm uppercase tracking-[0.35em] text-white/50 mb-2">Saldo disponible</p>
                            <p className="text-4xl font-black text-[#69AC95]">{formatCurrency(payglobalBalance)}</p>
                            <p className="mt-3 text-sm text-white/60">
                                Estado de la wallet: <span className="font-semibold text-white">Activa</span>
                            </p>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F0973C] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#e8841f]">
                                    Transferir PayGlobal
                                </button>
                                <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                                    Activar licencia
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-[1.75rem] border border-white/10 bg-[#111111] p-6 shadow-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.35em] text-white/40">Wallet PayGlobal</p>
                                        <h2 className="mt-3 text-2xl font-bold text-white">{formatCurrency(payglobalBalance)}</h2>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-[#69AC95]/10 px-3 py-2 text-xs font-semibold text-[#69AC95]">
                                        Activa
                                    </span>
                                </div>
                                <div className="mt-6 space-y-2 text-sm text-white/60">
                                    <p>Saldo hardcodeado para pruebas.</p>
                                    <p>Puede usarse para transferencias y activación de licencias.</p>
                                </div>
                            </div>
                            <div className="rounded-[1.75rem] border border-white/10 bg-[#111111] p-6 shadow-sm">
                                <p className="text-xs uppercase tracking-[0.35em] text-white/40">Origen de fondos</p>
                                <div className="mt-5 space-y-4">
                                    <div className="rounded-2xl border border-[#69AC95]/10 bg-[#69AC95]/5 p-4">
                                        <p className="text-sm uppercase tracking-[0.3em] text-white/50">Wallet Staking</p>
                                        <p className="mt-3 text-2xl font-bold text-white">{formatCurrency(stakingBalance)}</p>
                                    </div>
                                    <div className="rounded-2xl border border-[#F0973C]/10 bg-[#F0973C]/5 p-4">
                                        <p className="text-sm uppercase tracking-[0.3em] text-white/50">Wallet Network</p>
                                        <p className="mt-3 text-2xl font-bold text-white">{formatCurrency(networkBalance)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[1.75rem] border border-[#69AC95]/10 bg-[#111111] p-6 shadow-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.35em] text-white/40">Transferir desde Staking</p>
                                        <p className="mt-2 text-sm text-white/60">Envía saldo a tu Wallet PayGlobal.</p>
                                    </div>
                                    <PiBank className="h-6 w-6 text-[#69AC95]" />
                                </div>
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-white/80">Saldo disponible</label>
                                        <p className="mt-2 text-3xl font-bold text-white">{formatCurrency(stakingBalance)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-white/80 mb-2">Cantidad</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={stakingTransferAmount || ""}
                                            onChange={(e) => setStakingTransferAmount(Number(e.target.value))}
                                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#69AC95]/50 focus:ring-2 focus:ring-[#69AC95]/10"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                                        Saldo restante: <span className="font-semibold text-white">{formatCurrency(stakingRemaining)}</span>
                                    </div>
                                    <button
                                        onClick={handleStakingTransfer}
                                        className="w-full rounded-2xl bg-[#69AC95] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#8be2ae] disabled:opacity-50"
                                    >
                                        Transferir a PayGlobal
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-[1.75rem] border border-[#F0973C]/10 bg-[#111111] p-6 shadow-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.35em] text-white/40">Transferir desde Network</p>
                                        <p className="mt-2 text-sm text-white/60">Mueve saldo de tu Wallet Network a PayGlobal.</p>
                                    </div>
                                    <PiArrowUpRight className="h-6 w-6 text-[#F0973C]" />
                                </div>
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-white/80">Saldo disponible</label>
                                        <p className="mt-2 text-3xl font-bold text-white">{formatCurrency(networkBalance)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-white/80 mb-2">Cantidad</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={networkTransferAmount || ""}
                                            onChange={(e) => setNetworkTransferAmount(Number(e.target.value))}
                                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#F0973C]/50 focus:ring-2 focus:ring-[#F0973C]/10"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                                        Saldo restante: <span className="font-semibold text-white">{formatCurrency(networkRemaining)}</span>
                                    </div>
                                    <button
                                        onClick={handleNetworkTransfer}
                                        className="w-full rounded-2xl bg-[#F0973C] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#e8841f] disabled:opacity-50"
                                    >
                                        Transferir a PayGlobal
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[1.75rem] border border-white/10 bg-[#111111] p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">Enviar PayGlobal a usuario</p>
                                    <h2 className="mt-3 text-xl font-bold text-white">Transferencia interna</h2>
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

                        <div className="rounded-[1.75rem] border border-white/10 bg-[#111111] p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">Activar licencia</p>
                                    <h2 className="mt-3 text-xl font-bold text-white">Usa PayGlobal para activar</h2>
                                </div>
                                <PiSparkle className="h-6 w-6 text-[#F0973C]" />
                            </div>
                            <div className="mt-6 space-y-4">
                                <div className="grid gap-4 sm:grid-cols-3">
                                    {licenses.map((license) => (
                                        <button
                                            key={license.id}
                                            type="button"
                                            onClick={() => setSelectedLicenseId(license.id)}
                                            className={`rounded-2xl border p-4 text-left transition ${selectedLicenseId === license.id ? "border-[#69AC95] bg-[#69AC95]/10" : "border-white/10 bg-white/5 hover:border-[#69AC95]/20 hover:bg-white/10"}`}
                                        >
                                            <p className="text-sm uppercase tracking-[0.35em] text-white/40">{license.id}</p>
                                            <p className="mt-3 text-lg font-bold text-white">{formatCurrency(license.price)}</p>
                                            <p className="mt-2 text-sm text-white/60">{license.description}</p>
                                        </button>
                                    ))}
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                                    Licencia seleccionada: <span className="font-semibold text-white">{selectedLicense.name}</span>
                                    <br />
                                    Precio: <span className="font-semibold text-white">{formatCurrency(selectedLicense.price)}</span>
                                    <br />
                                    Saldo restante después de activar: <span className="font-semibold text-white">{formatCurrency(licenseRemaining)}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLicenseActivation}
                                    className="w-full rounded-2xl bg-[#F0973C] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#e8841f]"
                                >
                                    Activar licencia con PayGlobal
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-[1.75rem] border border-white/10 bg-[#111111] p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">Resumen de movimientos</p>
                                    <h2 className="mt-3 text-xl font-bold text-white">Historial reciente</h2>
                                </div>
                                <div className="rounded-full bg-[#F0973C]/10 px-3 py-2 text-xs font-semibold text-[#F0973C]">Ir a listado</div>
                            </div>
                            <div className="mt-6 space-y-4">
                                {transactions.slice(0, 4).map((transaction) => (
                                    <div key={transaction.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-white">{transaction.type}</p>
                                                <p className="text-xs text-white/50">{transaction.date} • {transaction.origin} → {transaction.destination}</p>
                                            </div>
                                            <p className={`text-lg font-bold ${transaction.amount > 0 ? "text-[#69AC95]" : "text-[#F0973C]"}`}>
                                                {transaction.amount > 0 ? "+" : ""}{formatCurrency(transaction.amount)}
                                            </p>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/50">
                                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Usuario: {transaction.user}</span>
                                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Estado: {transaction.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

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
                                        {transactions.map((transaction) => (
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
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

            {showLicenseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
                    <div className="relative w-full max-w-2xl rounded-4xl border border-white/10 bg-[#111111] p-6 shadow-[0_35px_120px_rgba(0,0,0,0.5)]">
                        <button
                            onClick={() => setShowLicenseModal(false)}
                            className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
                        >
                            ✕
                        </button>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#69AC95]/15 text-[#69AC95]">
                                    <PiCheckCircle className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-sm uppercase tracking-[0.35em] text-[#69AC95]">Confirmación de licencia</p>
                                    <h2 className="text-2xl font-bold text-white">Activar nueva licencia</h2>
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-sm text-white/50">Licencia</p>
                                    <p className="mt-2 text-lg font-semibold text-white">{selectedLicense.name}</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-sm text-white/50">Precio</p>
                                    <p className="mt-2 text-lg font-semibold text-white">{formatCurrency(selectedLicense.price)}</p>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                                <p>Saldo actual: <span className="font-semibold text-white">{formatCurrency(payglobalBalance)}</span></p>
                                <p className="mt-2">Saldo restante después de activar: <span className="font-semibold text-white">{formatCurrency(licenseRemaining)}</span></p>
                            </div>
                            <div className="rounded-2xl border border-[#F0973C]/20 bg-[#F0973C]/5 p-4 text-sm text-[#FFECB7]">
                                <p className="font-semibold">Advertencia:</p>
                                <p>La activación de licencia consume tu saldo PayGlobal y no puede deshacerse.</p>
                            </div>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <button
                                    onClick={() => setShowLicenseModal(false)}
                                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmLicenseActivation}
                                    className="rounded-2xl bg-[#F0973C] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#e8841f]"
                                >
                                    Confirmar activación
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletPayglobalPage;
