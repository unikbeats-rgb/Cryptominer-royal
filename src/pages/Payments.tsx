import { useState } from 'react';
import { useGameStore, PaymentMethodId, PaymentDirection } from '../store/gameStore';

const methods: { id: PaymentMethodId; name: string; description: string }[] = [
  { id: 'faucetpay', name: 'FaucetPay', description: 'Micro-crypto wallet for faucets and games.' },
  { id: 'payeer', name: 'Payeer', description: 'Multi-currency e-wallet (USD/EUR/RUB/etc.).' },
  { id: 'direct', name: 'Direct Wallet', description: 'Direct on-chain crypto wallet address.' },
];

export default function Payments() {
  const {
    balance,
    adminSettings,
    payments,
    createPaymentRequest,
  } = useGameStore();

  const [method, setMethod] = useState<PaymentMethodId>('faucetpay');
  const [type, setType] = useState<PaymentDirection>('withdraw');
  const [amount, setAmount] = useState(5);
  const [currency, setCurrency] = useState('USD');
  const [address, setAddress] = useState('');

  const minAmount = type === 'withdraw'
    ? adminSettings.minWithdrawAmount
    : adminSettings.minDepositAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPaymentRequest({ method, type, amount, currency, addressOrTag: address || undefined });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
          <h1 className="text-2xl font-black text-cyan-300 mb-1">Payments & Cashier</h1>
          <p className="text-xs text-slate-400 mb-4">Create secure deposits and withdrawals via FaucetPay, Payeer, or direct wallet. This is a front-end simulation only - no real money moves.</p>

          {!adminSettings.paymentsEnabled && (
            <div className="mb-4 p-3 rounded-lg border border-amber-500/50 bg-amber-500/10 text-amber-200 text-xs font-semibold">
              Payments are currently disabled by the administrator.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all ${
                    method === m.id
                      ? 'border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                      : 'border-slate-700 bg-black/20 text-slate-300 hover:border-cyan-500/60 hover:text-cyan-100'
                  }`}
                >
                  <div className="font-bold text-sm mb-1">{m.name}</div>
                  <p className="text-[10px] opacity-80">{m.description}</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setType('withdraw')}
                className={`py-2 rounded-lg font-semibold border ${
                  type === 'withdraw'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200'
                    : 'border-slate-700 text-slate-300 hover:border-emerald-500/60'
                }`}
              >
                Withdraw
              </button>
              <button
                type="button"
                onClick={() => setType('deposit')}
                className={`py-2 rounded-lg font-semibold border ${
                  type === 'deposit'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-200'
                    : 'border-slate-700 text-slate-300 hover:border-blue-500/60'
                }`}
              >
                Deposit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-300 mb-1 block">Amount</label>
                <input
                  type="number"
                  min={minAmount}
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                />
                <p className="text-[10px] text-slate-500 mt-1">Min {minAmount} {currency}</p>
              </div>
              <div>
                <label className="text-slate-300 mb-1 block">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                >
                  <option value="USD">USD</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 mb-1 block">Destination (wallet, email, or tag)</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={
                    method === 'faucetpay'
                      ? 'FaucetPay username or email'
                      : method === 'payeer'
                      ? 'Payeer ID or email'
                      : 'Wallet address'
                  }
                  className="w-full bg-[#020617] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!adminSettings.paymentsEnabled}
              className="w-full py-3 rounded-xl mt-2 text-sm font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create {type === 'withdraw' ? 'Withdrawal' : 'Deposit'} Request
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-[#020617] border border-cyan-500/30 rounded-2xl p-4 shadow-xl text-xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">Wallet Balance</span>
              <span className="font-mono text-cyan-300 font-bold">${balance.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-slate-500">Use FaucetPay/Payeer/direct wallet to move funds in and out of your in-game treasury. This UI is simulation-only.</p>
          </div>

          <div className="bg-[#020617] border border-slate-700 rounded-2xl p-4 shadow-xl text-xs max-h-72 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-semibold">Recent Requests</span>
              <span className="text-[10px] text-slate-500">{payments.length} total</span>
            </div>
            {payments.length === 0 && (
              <p className="text-[11px] text-slate-500">No payment requests yet.</p>
            )}
            {payments.map((p) => (
              <div key={p.id} className="border-b border-slate-800 py-2 last:border-0">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-slate-200">
                    {p.type === 'withdraw' ? 'Withdraw' : 'Deposit'} {p.amount} {p.currency}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      p.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40'
                        : p.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {p.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>{p.method.toUpperCase()}</span>
                  <span>{new Date(p.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
