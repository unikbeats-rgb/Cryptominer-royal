import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

const Guilds: React.FC = () => {
  const { user, devices, balance, totalMined } = useGameStore();

  const [guildName, setGuildName] = useState('Solo Syndicate');
  const [editingName, setEditingName] = useState(false);
  const [guildLevel, setGuildLevel] = useState(3);
  const [guildXP, setGuildXP] = useState(4200);
  const [xpToNext, setXpToNext] = useState(6000);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'perks' | 'upgrades'>('overview');

  const totalPower = devices.reduce((sum, d) => sum + d.power * d.owned, 0);
  const guildMembers = [
    {
      name: user.username,
      role: 'Guild Master',
      level: user.level,
      contribution: totalPower + totalMined,
      online: true,
    },
    {
      name: 'HashFury',
      role: 'Officer',
      level: 27,
      contribution: 128_500,
      online: false,
    },
    {
      name: 'BlockWizard',
      role: 'Veteran',
      level: 21,
      contribution: 87_200,
      online: true,
    },
    {
      name: 'CoinPilot',
      role: 'Member',
      level: 14,
      contribution: 34_900,
      online: false,
    },
  ];

  const guildPower = guildMembers.reduce((sum, m) => sum + m.contribution, 0);

  const handleContribute = () => {
    const gained = Math.max(250, Math.round(totalPower * 0.1));
    let newXP = guildXP + gained;
    let newLevel = guildLevel;
    let newXpToNext = xpToNext;

    while (newXP >= newXpToNext) {
      newXP -= newXpToNext;
      newLevel += 1;
      newXpToNext = Math.round(newXpToNext * 1.35);
    }

    setGuildXP(newXP);
    setGuildLevel(newLevel);
    setXpToNext(newXpToNext);
  };

  const guildProgress = Math.min(100, (guildXP / xpToNext) * 100);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <span className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 items-center justify-center text-2xl shadow-[0_0_25px_rgba(56,189,248,0.6)] border border-white/20">
              🛡️
            </span>
            <span className="flex items-center gap-2">
              {editingName ? (
                <input
                  value={guildName}
                  onChange={(e) => setGuildName(e.target.value.slice(0, 24))}
                  onBlur={() => setEditingName(false)}
                  autoFocus
                  className="bg-black/40 border border-cyan-500/40 rounded-lg px-3 py-1 text-lg md:text-2xl font-bold text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                />
              ) : (
                <button
                  onClick={() => setEditingName(true)}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-purple-300 hover:from-cyan-200 hover:to-emerald-300 transition-colors"
                >
                  {guildName}
                </button>
              )}
              <span className="badge badge-legendary">Level {guildLevel}</span>
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl">
            Coordinate with other miners, share boosts and rule the global mining pool as a unified guild.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900/70 border border-cyan-500/40 flex flex-col text-right min-w-[130px]">
            <span className="text-[11px] uppercase tracking-[0.2em] text-cyan-400">Members</span>
            <span className="text-xl font-bold text-white">{guildMembers.length}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900/70 border border-emerald-500/40 flex flex-col text-right min-w-[150px]">
            <span className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">Guild power</span>
            <span className="text-xl font-mono text-emerald-200">{guildPower.toLocaleString()} PH/s</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900/70 border border-yellow-500/40 flex flex-col text-right min-w-[130px]">
            <span className="text-[11px] uppercase tracking-[0.2em] text-yellow-300">Treasury</span>
            <span className="text-xl font-mono text-yellow-200">₮ {balance.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#020617]/70 border border-slate-800 rounded-2xl p-2 flex flex-wrap gap-2">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'members', label: 'Members' },
          { id: 'perks', label: 'Perks' },
          { id: 'upgrades', label: 'Upgrades' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold tracking-[0.15em] uppercase transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500/60 to-emerald-500/70 text-slate-950 shadow-[0_0_20px_rgba(45,212,191,0.4)]'
                : 'text-slate-400 hover:text-cyan-200 hover:bg-slate-900/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Guild Progress */}
          <div className="xl:col-span-2 gaming-card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Guild Progress</h2>
                <p className="text-slate-400 text-sm">
                  Contribute your hash power to push the guild into the next tier of rewards.
                </p>
              </div>
              <button
                onClick={handleContribute}
                className="btn-gaming whitespace-nowrap"
              >
                ⚡ Contribute Hash Power
              </button>
            </div>

            <div className="space-y-4 mt-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Level {guildLevel}</span>
                <span>{guildXP.toLocaleString()} / {xpToNext.toLocaleString()} Guild XP</span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700/80">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 transition-all duration-500"
                  style={{ width: `${guildProgress}%` }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/60">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-1">Global bonus</div>
                  <div className="text-lg font-mono text-emerald-300">+{(guildLevel * 1.5).toFixed(1)}% power</div>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/60">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-1">Pool share boost</div>
                  <div className="text-lg font-mono text-cyan-300">+{(guildLevel * 0.8).toFixed(1)}% pool</div>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/60">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-1">Member slots</div>
                  <div className="text-lg font-mono text-yellow-200">{8 + guildLevel * 2} members</div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Snapshot */}
          <div className="gaming-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-white mb-1">Activity Snapshot</h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Online members</span>
                <span className="text-emerald-300 font-mono">
                  {guildMembers.filter((m) => m.online).length}/{guildMembers.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Today&apos;s guild earnings</span>
                <span className="text-cyan-300 font-mono">₮ {(guildLevel * 2500).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Blocks secured</span>
                <span className="text-yellow-300 font-mono">{24 + guildLevel * 3}</span>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-800 pt-4 text-xs text-slate-400">
              <p>
                Guild boosts apply automatically to all members and stack with personal game boosts
                and part bonuses.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="gaming-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Members</h2>
            <span className="text-xs text-slate-400">
              {guildMembers.filter((m) => m.online).length} online now
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guildMembers.map((member) => (
              <div
                key={member.name}
                className="bg-slate-900/70 border border-slate-700/70 rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg font-bold text-white">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      {member.name}
                      {member.role === 'Guild Master' && (
                        <span className="badge badge-legendary text-[9px]">GM</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{member.role}</span>
                      <span className="text-slate-600">•</span>
                      <span>LVL {member.level}</span>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-[11px]">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        member.online ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-500'
                      }`}
                    />
                    <span className="text-slate-400">{member.online ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between items-center">
                  <span>Lifetime contribution</span>
                  <span className="font-mono text-emerald-300">{member.contribution.toLocaleString()} PH</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'perks' && (
        <div className="gaming-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Guild Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-900/70 border border-emerald-500/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚡</span>
                <h3 className="font-semibold text-emerald-300">Unified Hash Surge</h3>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                All guild members gain a permanent +{(guildLevel * 1.5).toFixed(1)}% boost to mining power.
              </p>
              <span className="badge badge-epic">Active</span>
            </div>

            <div className="bg-slate-900/70 border border-cyan-500/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🌀</span>
                <h3 className="font-semibold text-cyan-300">Pool Share Priority</h3>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                Increases global mining pool reward share by {(guildLevel * 0.8).toFixed(1)}%.
              </p>
              <span className="badge badge-rare">Active</span>
            </div>

            <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-4 opacity-60">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🎮</span>
                <h3 className="font-semibold text-slate-300">Guild Arcade Boost</h3>
              </div>
              <p className="text-xs text-slate-400 mb-2">
                Future perk: extra rewards from all mini-games for guild members.
              </p>
              <span className="badge badge-locked">Locked – requires Level 5</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'upgrades' && (
        <div className="gaming-card p-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-2">Guild Upgrades</h2>
          <p className="text-xs text-slate-400 mb-4">
            Spend guild energy and coordination to unlock permanent bonuses for all members.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-900/70 border border-emerald-500/40 rounded-xl p-4 flex flex-col gap-3">
              <div>
                <h3 className="font-semibold text-emerald-300 flex items-center gap-2 mb-1">
                  ⚙️ Rig Coordination
                </h3>
                <p className="text-xs text-slate-300">
                  +2% global mining power per guild level.
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Current bonus</span>
                <span className="font-mono text-emerald-300">+{(guildLevel * 2).toFixed(1)}%</span>
              </div>
              <button className="btn-gaming-secondary mt-auto">Upgrade (visual only)</button>
            </div>

            <div className="bg-slate-900/70 border border-cyan-500/40 rounded-xl p-4 flex flex-col gap-3">
              <div>
                <h3 className="font-semibold text-cyan-300 flex items-center gap-2 mb-1">
                  🧱 Pool Authority
                </h3>
                <p className="text-xs text-slate-300">
                  Increases the guild&apos;s weight in global blocks.
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Pool influence</span>
                <span className="font-mono text-cyan-300">Tier {(guildLevel / 2).toFixed(1)}</span>
              </div>
              <button className="btn-gaming-secondary mt-auto">Upgrade (visual only)</button>
            </div>

            <div className="bg-slate-900/70 border border-purple-500/40 rounded-xl p-4 flex flex-col gap-3 opacity-70">
              <div>
                <h3 className="font-semibold text-purple-300 flex items-center gap-2 mb-1">
                  🎁 Guild Crates
                </h3>
                <p className="text-xs text-slate-300">
                  Unlocks weekly crates for all members based on guild performance.
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Status</span>
                <span className="font-mono text-yellow-300">Locked (Lv. 7)</span>
              </div>
              <button className="btn-gaming-secondary mt-auto opacity-60 cursor-not-allowed">
                Coming soon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guilds;
