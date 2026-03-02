import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function Inventory() {
  const { devices, parts } = useGameStore();
  const [activeTab, setActiveTab] = useState<'miners' | 'parts'>('miners');

  const ownedDevices = devices.filter(d => d.owned > 0);
  const ownedParts = parts.filter(p => p.quantity > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 neon-text uppercase tracking-widest">
            Storage Vault
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage your owned equipment and parts.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('miners')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'miners' 
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Miners ({ownedDevices.length})
        </button>
        <button
          onClick={() => setActiveTab('parts')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'parts' 
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Parts ({ownedParts.length})
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {activeTab === 'miners' && (
          ownedDevices.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              No miners in storage. Visit the shop!
            </div>
          ) : (
            ownedDevices.map(device => (
              <div key={device.id} className="p-4 rounded-xl bg-[#1e2538]/60 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center text-2xl border border-white/5">
                    {device.emoji}
                  </div>
                  <span className="px-2 py-1 rounded bg-slate-900 text-xs font-bold text-cyan-400 border border-cyan-500/30">
                    x{device.owned}
                  </span>
                </div>
                <h3 className="text-white font-bold mb-1">{device.name}</h3>
                <div className="space-y-1 text-xs text-slate-400">
                  <p>Power: <span className="text-emerald-400">{device.power} TH/s</span></p>
                  <p>Energy: <span className="text-yellow-400">{device.energyCost} ⚡/s</span></p>
                  <p>Tier: {device.tier} {device.mergeLevel ? `(Merge Lv.${device.mergeLevel})` : ''}</p>
                </div>
              </div>
            ))
          )
        )}

        {activeTab === 'parts' && (
          ownedParts.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              No parts in storage. Play games or open crates!
            </div>
          ) : (
            ownedParts.map(part => (
              <div key={part.id} className="p-4 rounded-xl bg-[#1e2538]/60 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center text-2xl border border-white/5">
                    {part.icon}
                  </div>
                  <span className="px-2 py-1 rounded bg-slate-900 text-xs font-bold text-purple-400 border border-purple-500/30">
                    x{part.quantity}
                  </span>
                </div>
                <h3 className="text-white font-bold mb-1">{part.name}</h3>
                <div className="space-y-1 text-xs text-slate-400">
                  <p>Rarity: <span className="uppercase text-white/70">{part.rarity}</span></p>
                  <p>Power Bonus: <span className="text-emerald-400">+{part.powerBonus * 100}%</span></p>
                  <p>Energy Red.: <span className="text-yellow-400">{part.energyBonus * 100}%</span></p>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
