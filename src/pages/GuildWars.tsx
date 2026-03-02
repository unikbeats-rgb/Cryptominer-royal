import React from 'react';

const mockMatchups = [
  {
    id: 1,
    left: { name: 'Hash Kings', power: 128.4, rank: 3 },
    right: { name: 'Neon Syndicate', power: 131.9, rank: 1 },
    status: 'LIVE',
    time: '08:23 remaining',
  },
  {
    id: 2,
    left: { name: 'Quantum Miners', power: 97.2, rank: 8 },
    right: { name: 'Pool Lords', power: 102.7, rank: 6 },
    status: 'SCHEDULED',
    time: 'Starts in 2h 15m',
  },
  {
    id: 3,
    left: { name: 'Arcade Alliance', power: 73.1, rank: 12 },
    right: { name: 'Block Crushers', power: 86.5, rank: 10 },
    status: 'FINISHED',
    time: '2h ago',
  },
];

export const GuildWars: React.FC = () => {
  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide text-violet-200">Guild Wars</h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Weekly cross‑guild ladder where alliances compete for control of the global mining pool. Win matches, climb divisions and unlock seasonal trophies.
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-violet-500/40 shadow-[0_0_30px_rgba(139,92,246,0.45)] flex flex-col items-end">
          <span className="text-xs uppercase tracking-[0.2em] text-violet-300">Current Division</span>
          <span className="text-lg font-mono text-violet-100">Diamond II</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
        <section className="xl:col-span-2 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-[0_0_60px_rgba(15,23,42,0.9)] overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.16),transparent_55%)] pointer-events-none" />
          <div className="relative p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.8)]">
                <span className="text-xl">⚔️</span>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-violet-200">Weekly War Cycle</div>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-300">
                  <span>Resets in <span className="font-mono text-violet-100">3d 11h</span></span>
                  <span className="h-1 w-32 rounded-full bg-slate-800 overflow-hidden inline-block align-middle">
                    <span className="block h-full w-2/5 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-300" />
                  </span>
                  <span>Progress 40%</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl bg-slate-900/80 border border-violet-400/50 text-xs font-semibold text-violet-100 hover:bg-violet-500/20 transition-colors">
              View Season Rules
            </button>
          </div>

          <div className="relative p-5 grid md:grid-cols-3 gap-4">
            {mockMatchups.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-[0_0_25px_rgba(15,23,42,0.85)] p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{m.status}</span>
                  <span className="font-mono text-slate-200">{m.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-[11px] text-slate-400">Guild A</div>
                    <div className="font-semibold text-slate-100 flex items-center justify-between">
                      <span>{m.left.name}</span>
                      <span className="text-xs font-mono text-slate-300">{m.left.power.toFixed(1)} PH</span>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs text-slate-200 font-mono">
                    VS
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-[11px] text-slate-400">Guild B</div>
                    <div className="font-semibold text-slate-100 flex items-center justify-between">
                      <span>{m.right.name}</span>
                      <span className="text-xs font-mono text-slate-300">{m.right.power.toFixed(1)} PH</span>
                    </div>
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Ranks #{m.left.rank} & #{m.right.rank}</span>
                  <button className="px-2 py-1 rounded-lg bg-violet-500/15 border border-violet-400/40 text-[11px] text-violet-100 font-semibold hover:bg-violet-500/30">
                    Scout matchup
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-[0_0_60px_rgba(15,23,42,0.9)] p-5 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.03),transparent_55%),linear-gradient(to_bottom,_rgba(79,70,229,0.12),transparent_50%)] pointer-events-none" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Your Guild Status</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-lg font-semibold text-slate-100">Neon Syndicate</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-100 border border-violet-400/40">TOP 5%</span>
              </div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-emerald-400/40 text-right">
              <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">War Rating</div>
              <div className="text-lg font-mono text-emerald-100">2,184</div>
            </div>
          </div>

          <div className="relative mt-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Weekly contribution</span>
              <span className="font-mono text-cyan-300">+12.4 PH</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full w-3/5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-300 animate-[pulse_3s_ease-in-out_infinite]" />
            </div>
            <button className="mt-1 inline-flex justify-center items-center gap-2 text-xs font-semibold text-cyan-200 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/40 hover:bg-cyan-500/20">
              Pledge extra hash power
            </button>
          </div>

          <div className="relative mt-1 space-y-3 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span>War chests secured</span>
              <span className="font-mono text-amber-200">5 / 12</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Bonus pool share</span>
              <span className="font-mono text-emerald-300">+6.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Next milestone reward</span>
              <span className="font-mono text-violet-200">Legendary crate</span>
            </div>
          </div>

          <button className="relative mt-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 text-xs font-semibold text-slate-50 shadow-[0_18px_45px_rgba(88,28,135,0.75)] hover:scale-[1.02] active:scale-[0.98] transition-transform">
            Queue for next war
          </button>
        </aside>
      </div>
    </div>
  );
};

export default GuildWars;
