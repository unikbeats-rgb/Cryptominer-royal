import React from 'react';
import { useGameStore } from '../store/gameStore';
import { EventCarousel } from '../components/Dashboard/EventCarousel';
import { QuestSidePanel } from '../components/Dashboard/QuestSidePanel';
import { Cpu, Zap, Battery, Info, Plus, Settings, Layout, ArrowRight, Trophy } from 'lucide-react';

const Dashboard = () => {
  const { 
    balance, 
    energy, 
    maxEnergy, 
    isMining, 
    devices,
  } = useGameStore();

  const totalHashrate = devices.reduce((sum, d) => sum + (d.power * d.owned), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Top Event Banners */}
      <EventCarousel />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Quest Panel & User Stats */}
        <div className="lg:col-span-3 space-y-6">
          {/* Airdrop Faucet Card */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-xl border border-indigo-500/30 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-indigo-500/40" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-2xl mb-3 border border-indigo-400/30">
                💧
              </div>
              <h3 className="text-white font-black font-orbitron text-lg mb-1">Crypto Faucet</h3>
              <p className="text-xs text-white/60 mb-4">Claim free tokens every hour.</p>
              
              <button 
                onClick={() => {
                  const reward = useGameStore.getState().claimFaucet();
                  if (reward) {
                    alert(`Successfully claimed ${reward.toFixed(2)} ₮!`);
                  } else {
                    alert(`Faucet is cooling down or disabled.`);
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 border border-white/10"
              >
                Claim Airdrop
              </button>
            </div>
          </div>

          {/* Main Quest Panel */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-all duration-700" />
            <QuestSidePanel />
          </div>

          {/* User Status / Rank Panel */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl overflow-hidden relative group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-500">
                🛡️
              </div>
              <div className="flex-1">
                <h4 className="text-amber-400 font-black font-orbitron text-xl tracking-tighter">GOLD II</h4>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Current Rank</p>
              </div>
            </div>

            {/* VIP Status */}
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest">VIP Level {useGameStore(s => s.user.vipLevel || 0)}</span>
                <span className="text-[10px] font-mono text-purple-300">{useGameStore(s => s.user.vipPoints || 0)} / {((useGameStore(s => s.user.vipLevel || 0) + 1) * 1000)} PTS</span>
              </div>
              <div className="h-1.5 bg-black/40 rounded-full overflow-hidden p-[1px] border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-400 rounded-full" 
                  style={{ width: `${((useGameStore(s => s.user.vipPoints || 0) % 1000) / 1000) * 100}%` }} 
                />
              </div>
              <p className="text-[9px] text-white/40 mt-2 font-medium tracking-wide">
                +{(useGameStore(s => s.user.vipLevel || 0) * 10).toFixed(0)}% Bonus on Airdrops & Faucets
              </p>
            </div>

            <div className="space-y-5">
              {/* Battery / Energy */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-widest flex items-center gap-1">
                    <Battery size={12} className="text-emerald-400" />
                    Battery Status
                  </span>
                  <span className="text-sm font-black text-emerald-400 font-mono">92%</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden p-[1px] border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.3)]" 
                    style={{ width: `${(energy / maxEnergy) * 100}%` }} 
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] font-black text-white/20 uppercase tracking-tighter">
                  <span>Syncing...</span>
                  <span className="font-mono">15:22:11</span>
                </div>
              </div>

              {/* Power Readout */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-widest flex items-center gap-1">
                    <Zap size={12} className="text-cyan-400" />
                    My Power
                  </span>
                  <button className="text-white/20 hover:text-white transition-colors">
                    <Info size={12} />
                  </button>
                </div>
                <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                  <p className="text-cyan-400 font-black font-mono text-base tracking-tighter">
                    +501.68% / {totalHashrate.toFixed(3)} PH/s
                  </p>
                  <p className="text-[10px] text-white/40 font-bold mt-1">
                    Total: <span className="text-white/60">{totalHashrate.toFixed(3)} PH/s</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Column: Mining Room & Controls */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mr-2">Rooms</span>
                {[0, 1, 2, 3, 4].map((room) => (
                  <button
                    key={room}
                    className={`w-10 h-10 rounded-xl font-black text-xs transition-all flex items-center justify-center border ${
                      room === 1 
                        ? 'bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/20 scale-110' 
                        : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20 uppercase tracking-widest flex items-center gap-2">
                  <Plus size={14} /> FREE CMR
                </button>
                <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black rounded-xl border border-white/10 transition-all uppercase tracking-widest flex items-center gap-2">
                  <Settings size={14} /> Edit
                </button>
                <button className="px-6 py-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 text-[10px] font-black rounded-xl border border-cyan-500/30 transition-all uppercase tracking-widest flex items-center gap-2">
                  <Layout size={14} /> Autoset
                </button>
              </div>
            </div>

            {/* Room Canvas Area */}
            <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden bg-[#0d1117] border border-white/5 group">
              <div className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ 
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
                  backgroundSize: '32px 32px' 
                }} 
              />
              
              {/* Virtual Room Furniture/Decor */}
              <div className="absolute top-10 left-10 text-6xl opacity-40 blur-[1px] group-hover:scale-105 transition-transform duration-1000">🛋️</div>
              <div className="absolute top-10 right-10 text-6xl opacity-40 blur-[1px]">🪴</div>
              <div className="absolute bottom-10 left-20 text-6xl opacity-20">🖥️</div>

              {/* Miner Racks Visual */}
              <div className="absolute inset-0 p-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
                {devices.filter(d => d.owned > 0).slice(0, 12).map((device, idx) => (
                  <div 
                    key={`${device.id}-${idx}`}
                    className="relative aspect-square bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 hover:border-cyan-400/50 transition-all group/miner hover:-translate-y-1"
                  >
                    <div className="text-4xl mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{device.emoji}</div>
                    <div className="text-[9px] font-black text-white/30 uppercase tracking-tighter mb-1 truncate w-full text-center">
                      {device.name}
                    </div>
                    <div className="text-[10px] font-black text-cyan-400 font-mono tracking-tighter">
                      {device.power.toFixed(1)} TH/s
                    </div>
                    {(device.mergeLevel ?? 0) > 0 && (
                      <div className="absolute -top-2 -right-2 bg-purple-500 text-[8px] font-black px-1.5 py-0.5 rounded-md border border-purple-400 shadow-lg">
                        Lvl {(device.mergeLevel ?? 0) + 1}
                      </div>
                    )}
                    <div className="absolute inset-x-2 bottom-1 h-[2px] bg-cyan-500/20 rounded-full overflow-hidden opacity-0 group-hover/miner:opacity-100 transition-opacity">
                      <div className="h-full bg-cyan-500 w-full animate-shimmer" />
                    </div>
                  </div>
                ))}

                {/* Empty Slots to maintain grid */}
                {Array.from({ length: Math.max(0, 12 - devices.filter(d => d.owned > 0).length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square bg-white/[0.02] border border-dashed border-white/5 rounded-2xl flex items-center justify-center">
                    <span className="text-[8px] font-black text-white/5 uppercase tracking-widest">Empty Slot</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="mt-8 flex items-start gap-4 p-5 bg-white/5 rounded-[1.5rem] border border-white/5">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/30">
                <Info size={18} className="text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/60 leading-relaxed font-medium">
                  Welcome back, Miner! Your hash rate is currently <span className="text-cyan-400 font-bold">stable</span>. 
                  Remember to charge your batteries every 24 hours to maintain peak efficiency. 
                  You can now place <span className="text-purple-400 font-bold">racks</span> and furniture in Room 1 to customize your setup.
                </p>
                <button className="mt-3 text-cyan-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                  Show detailed room statistics <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard label="Hashrate" value={`${totalHashrate.toFixed(2)} PH/s`} icon={<Cpu size={20} />} color="cyan" />
            <SummaryCard label="Active Miners" value={devices.filter(d => d.owned > 0).length.toString()} icon={<Zap size={20} />} color="emerald" />
            <SummaryCard label="Treasury" value={`₮ ${balance.toFixed(4)}`} icon={<Trophy size={20} />} color="amber" />
            <SummaryCard label="Status" value={isMining ? 'Online' : 'Standby'} icon={<Activity size={20} />} color={isMining ? 'cyan' : 'red'} pulse={isMining} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, icon, color, pulse = false }: any) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] flex flex-col gap-1 group hover:bg-white/10 transition-all duration-300">
    <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center mb-2 border border-${color}-500/30 group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon, { className: `text-${color}-400 ${pulse ? 'animate-pulse' : ''}` })}
    </div>
    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{label}</p>
    <p className={`text-xl font-black font-mono tracking-tight text-white group-hover:text-${color}-400 transition-colors`}>{value}</p>
  </div>
);

const Activity = ({ className, size }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export default Dashboard;