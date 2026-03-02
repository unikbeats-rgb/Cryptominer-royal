import React from 'react';
import { useGameStore } from '../store/gameStore';

const tiers = Array.from({ length: 20 }).map((_, i) => i + 1);

export const SeasonPass: React.FC = () => {
  const { balance } = useGameStore();

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide text-cyan-200">Season Pass - Cycle One</h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Progress through levels by mining, playing arcade games and completing quests. Unlock cosmetic skins, loot crates and permanent account bonuses.
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.35)] flex flex-col items-end">
          <span className="text-xs uppercase tracking-[0.2em] text-cyan-400">Wallet</span>
          <span className="text-lg font-mono text-cyan-200">{balance.toFixed(4)} RLT</span>
        </div>
      </header>

      <div className="relative flex-1 rounded-2xl bg-slate-950/70 border border-slate-800/80 overflow-hidden shadow-[0_0_60px_rgba(15,23,42,0.9)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(147,51,234,0.12),transparent_55%)] pointer-events-none" />
        <div className="relative h-full flex flex-col">
          <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.7)]">
                <span className="text-xl">🎟️</span>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-amber-300">Season Progress</div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-64 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-1/3 bg-gradient-to-r from-amber-300 via-cyan-300 to-emerald-300 animate-[pulse_3s_ease-in-out_infinite]" />
                  </div>
                  <span className="text-sm font-mono text-slate-200">Lvl 7 / 20</span>
                </div>
              </div>
            </div>
            <button className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 text-sm font-semibold shadow-[0_12px_35px_rgba(8,47,73,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-transform">
              <span>Upgrade to Premium Track</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900/70 text-cyan-200 border border-cyan-300/40">+35% Rewards</span>
            </button>
          </div>

          <div className="relative flex-1 overflow-x-auto overflow-y-hidden px-6 py-4">
            <div className="flex gap-4 min-w-max pb-6">
              {tiers.map((level) => (
                <div
                  key={level}
                  className="w-44 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-[0_0_25px_rgba(15,23,42,0.7)] flex flex-col"
                >
                  <div className="px-3 pt-3 pb-2 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-[0.2em] text-slate-400">LVL {level}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-200">
                      {level < 5 ? 'COMMON' : level < 10 ? 'RARE' : level < 16 ? 'EPIC' : 'LEGENDARY'}
                    </span>
                  </div>
                  <div className="flex-1 grid grid-rows-2 divide-y divide-slate-800/80">
                    <div className="flex items-center justify-center gap-2 px-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                        {level % 4 === 0 ? '🪙' : level % 3 === 0 ? '📦' : '⚙️'}
                      </div>
                      <div className="text-xs text-slate-300">
                        <div className="font-semibold text-slate-100">Free Track</div>
                        <div className="text-[11px] text-slate-400">Small boost & cosmetics</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 px-3 bg-gradient-to-br from-slate-900 to-slate-950">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(251,191,36,0.75)]">
                        {level % 4 === 0 ? '💎' : level % 3 === 0 ? '🧬' : '🚀'}
                      </div>
                      <div className="text-xs text-amber-50">
                        <div className="font-semibold">Premium Track</div>
                        <div className="text-[11px] text-amber-100/80">Bigger rewards & perks</div>
                      </div>
                    </div>
                  </div>
                  <button className="m-3 mt-2 text-[11px] font-semibold text-cyan-300 hover:text-cyan-100 flex items-center justify-between">
                    <span>View details</span>
                    <span>›</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonPass;
