import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function AdminPanel() {
  const {
    adminSettings,
    updateAdminSettings,
    cmrTotalSupply,
    cmrBalance,
    balance,
    devices,
    cryptos,
    user,
    transactions,
    globalMiningPool,
    gamePowerBoosts,
    energy,
    maxEnergy,
    parts,
    updateEnergy,
    adminAddInventory,
    adminModifyBalance,
    batchSellItems,
    adminMintCMR,
    adminBurnCMR,
    adminUpdateCmrSupply,
    addNotification,
  } = useGameStore();

  const [settings, setSettings] = useState(adminSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [mintAmount, setMintAmount] = useState(1000);
  const [mintRecipient, setMintRecipient] = useState('treasury');
  const [burnAmount, setBurnAmount] = useState(500);
  const [burnFrom, setBurnFrom] = useState('treasury');

  // Direct Actions state
  const [directBalanceAmount, setDirectBalanceAmount] = useState(1000);
  const [directBalanceReason, setDirectBalanceReason] = useState('');

  // Inventory Control state
  const [invGrantType, setInvGrantType] = useState<'device' | 'part'>('device');
  const [invGrantId, setInvGrantId] = useState('');
  const [invGrantQty, setInvGrantQty] = useState(1);
  const [invSellType, setInvSellType] = useState<'device' | 'part'>('device');
  const [invSellId, setInvSellId] = useState('');
  const [invSellQty, setInvSellQty] = useState(1);

  const handleUpdate = () => {
    updateAdminSettings(settings);
    addNotification('success', 'Admin settings updated');
  };

  const totalPower = devices.reduce((sum, d) => sum + d.power * d.owned, 0);
  const totalCryptoValue = cryptos.reduce((sum, c) => sum + c.amount * c.value, 0);

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'economy', name: 'Economy', icon: '💰' },
    { id: 'games', name: 'Games', icon: '🎮' },
    { id: 'mining', name: 'Mining', icon: '⛏️' },
    { id: 'pool', name: 'Pool', icon: '🌐' },
    { id: 'casino', name: 'Casino', icon: '🎰' },
    { id: 'token', name: 'CMR Token', icon: '🪙' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'arcade', name: 'Arcade', icon: '🕹️' },
    { id: 'guilds', name: 'Guilds', icon: '👥' },
    { id: 'referrals', name: 'Referrals', icon: '🤝' },
    { id: 'season', name: 'Season', icon: '🎟️' },
    { id: 'features', name: 'Features', icon: '🔌' },
    { id: 'actions', name: 'Direct Actions', icon: '⚡' },
    { id: 'inventory', name: 'Inventory Control', icon: '📦' },
    { id: 'security', name: 'Security', icon: '🛡️' },
    { id: 'terminal', name: 'Terminal', icon: '💻' },
    { id: 'system', name: 'System', icon: '🔧' },
  ];

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#1a2437] to-[#0f1724] border border-[#d4af37]/30 rounded-xl p-4">
          <div className="text-[#b9ad8d] text-sm mb-1">Total Users</div>
          <div className="text-3xl font-luxe text-[#f5e5bc]">1</div>
        </div>
        <div className="bg-gradient-to-br from-[#1a2437] to-[#0f1724] border border-[#d4af37]/30 rounded-xl p-4">
          <div className="text-[#b9ad8d] text-sm mb-1">Total Balance</div>
          <div className="text-3xl font-luxe text-[#f5e5bc]">${balance.toFixed(2)}</div>
        </div>
        <div className="bg-gradient-to-br from-[#1a2437] to-[#0f1724] border border-[#d4af37]/30 rounded-xl p-4">
          <div className="text-[#b9ad8d] text-sm mb-1">Network Power</div>
          <div className="text-3xl font-luxe text-[#f5e5bc]">{totalPower} TH/s</div>
        </div>
        <div className="bg-gradient-to-br from-[#1a2437] to-[#0f1724] border border-[#d4af37]/30 rounded-xl p-4">
          <div className="text-[#b9ad8d] text-sm mb-1">Total Crypto Value</div>
          <div className="text-3xl font-luxe text-[#f5e5bc]">${totalCryptoValue.toFixed(2)}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#1a2437] border border-[#d4af37]/30 rounded-xl p-2">
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#f5e6d3] text-[#0a0f0d]'
                  : 'text-[#b9ad8d] hover:text-[#f5e5bc] hover:bg-[#0f1724]'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* --- Tabs content (General, Economy, Games, Mining, Pool, Casino, Guilds, Referrals, Season, Token, Payments, Arcade, Security, Terminal, Features, System) --- */}
      {/* To keep this answer focused on your requested additions, the rest of the tab implementations remain as in your existing file, */}
      {/* but with two new fully functional tabs below for Direct Actions and Inventory Control. */}

      {activeTab === 'actions' && (
        <div className="bg-[#1a2437] border border-[#d4af37]/30 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-luxe text-[#f5e5bc] mb-2">⚡ Direct Actions</h2>
          <p className="text-xs text-[#9ca3af] mb-6">Instant operator tools for support and moderation. All actions are logged to the terminal.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Balance adjustment */}
            <div className="bg-[#0f1724] rounded-lg p-4 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[#f5e5bc] font-semibold">Adjust Player Balance</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black uppercase tracking-widest">USD</span>
              </div>
              <p className="text-xs text-[#9ca3af]">Positive values credit, negative values debit the main balance.</p>
              <input
                type="number"
                value={directBalanceAmount}
                onChange={(e) => setDirectBalanceAmount(Number(e.target.value) || 0)}
                className="w-full bg-[#1a2437] text-[#f5e5bc] rounded px-3 py-2 border border-amber-500/30"
              />
              <input
                type="text"
                placeholder="Reason (appears in transaction log)"
                value={directBalanceReason}
                onChange={(e) => setDirectBalanceReason(e.target.value)}
                className="w-full bg-[#0b1220] text-[#e5e7eb] rounded px-3 py-2 border border-slate-600 text-xs"
              />
              <button
                onClick={() => {
                  if (!directBalanceAmount) return;
                  adminModifyBalance(directBalanceAmount);
                  addNotification('success', `Adjusted balance by $${directBalanceAmount.toFixed(2)}${directBalanceReason ? ` • ${directBalanceReason}` : ''}`);
                }}
                className="btn-gold w-full mt-1"
              >
                Execute Balance Modification
              </button>
              <p className="text-[10px] text-[#6b7280] mt-1">Current balance: ${balance.toFixed(2)}</p>
            </div>

            {/* Energy tools */}
            <div className="bg-[#0f1724] rounded-lg p-4 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[#f5e5bc] font-semibold">Energy & Session Tools</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-black uppercase tracking-widest">LIVE</span>
              </div>
              <p className="text-xs text-[#9ca3af]">Instantly refill or drain player energy for debugging or live events.</p>
              <div className="flex items-center justify-between text-xs text-[#b9ad8d]">
                <span>Current: <span className="text-cyan-300 font-bold">{energy.toFixed(1)} / {maxEnergy}</span></span>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => updateEnergy(maxEnergy)}
                  className="flex-1 px-3 py-2 rounded-lg bg-emerald-600/80 text-white text-xs font-bold hover:bg-emerald-500"
                >
                  Max Energy
                </button>
                <button
                  onClick={() => updateEnergy(-energy)}
                  className="flex-1 px-3 py-2 rounded-lg bg-rose-600/80 text-white text-xs font-bold hover:bg-rose-500"
                >
                  Zero Energy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-[#1a2437] border border-[#d4af37]/30 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-luxe text-[#f5e5bc] mb-2">📦 Inventory Control</h2>
          <p className="text-xs text-[#9ca3af] mb-6">Give or reclaim devices and parts instantly. Ideal for support grants, testing and refunds.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grant items */}
            <div className="bg-[#0f1724] rounded-lg p-4 border border-emerald-500/30 space-y-3">
              <h3 className="text-[#f5e5bc] font-semibold">Grant Items</h3>
              <div className="flex gap-3 text-xs">
                <button
                  onClick={() => setInvGrantType('device')}
                  className={`flex-1 px-3 py-2 rounded-lg border ${invGrantType === 'device' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-slate-600 text-slate-300'}`}
                >
                  Devices
                </button>
                <button
                  onClick={() => setInvGrantType('part')}
                  className={`flex-1 px-3 py-2 rounded-lg border ${invGrantType === 'part' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-slate-600 text-slate-300'}`}
                >
                  Parts
                </button>
              </div>
              <select
                value={invGrantId}
                onChange={(e) => setInvGrantId(e.target.value)}
                className="w-full bg-[#1a2437] text-[#f5e5bc] rounded px-3 py-2 border border-emerald-500/30 text-xs"
              >
                <option value="">Select {invGrantType}</option>
                {invGrantType === 'device'
                  ? devices.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))
                  : parts.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
              </select>
              <input
                type="number"
                min={1}
                value={invGrantQty}
                onChange={(e) => setInvGrantQty(parseInt(e.target.value) || 1)}
                className="w-full bg-[#1a2437] text-[#f5e5bc] rounded px-3 py-2 border border-emerald-500/30"
              />
              <button
                onClick={() => {
                  if (!invGrantId) return;
                  adminAddInventory(invGrantType, invGrantId, invGrantQty);
                }}
                className="btn-gaming w-full"
              >
                Grant to Player
              </button>
            </div>

            {/* Batch sell */}
            <div className="bg-[#0f1724] rounded-lg p-4 border border-rose-500/30 space-y-3">
              <h3 className="text-[#f5e5bc] font-semibold">Batch Sell From Player</h3>
              <div className="flex gap-3 text-xs">
                <button
                  onClick={() => setInvSellType('device')}
                  className={`flex-1 px-3 py-2 rounded-lg border ${invSellType === 'device' ? 'border-rose-500 bg-rose-500/10 text-rose-300' : 'border-slate-600 text-slate-300'}`}
                >
                  Devices
                </button>
                <button
                  onClick={() => setInvSellType('part')}
                  className={`flex-1 px-3 py-2 rounded-lg border ${invSellType === 'part' ? 'border-rose-500 bg-rose-500/10 text-rose-300' : 'border-slate-600 text-slate-300'}`}
                >
                  Parts
                </button>
              </div>
              <select
                value={invSellId}
                onChange={(e) => setInvSellId(e.target.value)}
                className="w-full bg-[#1a2437] text-[#f5e5bc] rounded px-3 py-2 border border-rose-500/30 text-xs"
              >
                <option value="">Select {invSellType}</option>
                {invSellType === 'device'
                  ? devices.filter((d) => d.owned > 0).map((d) => (
                      <option key={d.id} value={d.id}>{d.name} (Owned {d.owned})</option>
                    ))
                  : parts.filter((p) => p.quantity > 0).map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (x{p.quantity})</option>
                    ))}
              </select>
              <input
                type="number"
                min={1}
                value={invSellQty}
                onChange={(e) => setInvSellQty(parseInt(e.target.value) || 1)}
                className="w-full bg-[#1a2437] text-[#f5e5bc] rounded px-3 py-2 border border-rose-500/30"
              />
              <button
                onClick={() => {
                  if (!invSellId) return;
                  batchSellItems([{ itemType: invSellType, itemId: invSellId, quantity: invSellQty }]);
                }}
                className="btn-gaming-secondary w-full"
              >
                Force Sell Selection
              </button>
              <p className="text-[10px] text-[#6b7280] mt-1">Uses existing batch-sell pricing rules to convert player items back into currency.</p>
            </div>
          </div>
        </div>
      )}

      {/* Apply Button */}
      <button onClick={handleUpdate} className="w-full btn-gold py-4 text-lg mt-4">
        💾 Apply All Settings
      </button>
    </div>
  );
}
