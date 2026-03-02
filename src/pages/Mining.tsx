import { useGameStore } from '../store/gameStore';
import { 
  Zap, 
  Battery, 
  Cpu, 
  Shield, 
  Activity, 
  TrendingUp, 
  Plus, 
  Settings, 
  Layout, 
  ChevronRight,
  Wind
} from 'lucide-react';

export default function Mining() {
  const {
    devices,
    cryptos,
    selectedCrypto,
    setSelectedCrypto,
    isMining,
    setMining,
    energy,
    parts,
    gamePowerBoosts,
    globalMiningPool,
  } = useGameStore();

  const totalBasePower = devices.reduce((sum, d) => sum + d.power * d.owned, 0);
  const totalBaseEnergy = devices.reduce(
    (sum, d) => sum + d.energyCost * d.owned,
    0,
  );

  const powerBonus = parts.reduce(
    (sum, p) => sum + p.powerBonus * p.quantity,
    0,
  );
  const energyBonus = parts.reduce(
    (sum, p) => sum + p.energyBonus * p.quantity,
    0,
  );

  const effectivePower = totalBasePower * (1 + powerBonus);
  const effectiveEnergyCost = totalBaseEnergy * Math.max(0.4, 1 + energyBonus);

  const now = Date.now();
  const activeBoosts = gamePowerBoosts.filter((boost) => boost.expiresAt > now);
  const poolSecondsLeft = Math.max(
    0,
    Math.floor((globalMiningPool.nextBlockAt - now) / 1000),
  );
  const poolMinutesLeft = Math.floor(poolSecondsLeft / 60);
  const poolDisplaySeconds = String(poolSecondsLeft % 60).padStart(2, '0');

  const canMine = effectivePower > 0 && energy >= effectiveEnergyCost;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-[1400px] mx-auto px-4 md:px-8">
      {/* Header Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MiningStatCard 
          label="Effective Power" 
          value={`${effectivePower.toFixed(2)} PH/s`} 
          subValue={`+${(powerBonus * 100).toFixed(1)}% from parts`}
          icon={<Zap size={24} className="text-cyan-400" />}
          color="cyan"
        />
        <MiningStatCard 
          label="Energy Efficiency" 
          value={`${((1 - Math.max(0.4, 1 + energyBonus)) * 100).toFixed(1)}%`} 
          subValue="Consumption offset"
          icon={<Battery size={24} className="text-emerald-400" />}
          color="emerald"
        />
        <MiningStatCard 
          label="Daily Est. Profit" 
          value={`₮ ${(effectivePower * 0.00015).toFixed(4)}`} 
          subValue="Based on current difficulty"
          icon={<TrendingUp size={24} className="text-amber-400" />}
          color="amber"
        />
        <MiningStatCard 
          label="Pool Position" 
          value={`#${Math.floor(Math.random() * 100) + 1}`} 
          subValue="Global ranking"
          icon={<Shield size={24} className="text-purple-400" />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Main Mining Room Interface */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
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
                <button 
                  onClick={() => setMining(!isMining)}
                  disabled={!canMine && !isMining}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black transition-all active:scale-95 uppercase tracking-widest shadow-xl flex items-center gap-2 ${
                    isMining 
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                      : 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-cyan-500/20'
                  }`}
                >
                  <Activity size={16} className={isMining ? 'animate-pulse' : ''} />
                  {isMining ? 'Stop Mining' : 'Start Mining'}
                </button>
                <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all">
                  <Settings size={20} />
                </button>
                <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all">
                  <Layout size={20} />
                </button>
              </div>
            </div>

            {/* Visual Room Canvas */}
            <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden bg-[#0a0c10] border border-white/5 group shadow-inner">
              <div className="absolute inset-0 opacity-20" 
                style={{ 
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
                  backgroundSize: '40px 40px' 
                }} 
              />
              
              {/* Animated Scene Elements */}
              <div className="absolute top-10 left-10 text-6xl opacity-30 blur-[2px] animate-float">🪴</div>
              <div className="absolute top-10 right-20 text-5xl opacity-20">💡</div>
              <div className="absolute bottom-10 right-10 text-7xl opacity-10">🖥️</div>

              {/* Mining Farm Racks Grid */}
              <div className="absolute inset-0 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[0, 1, 2, 3, 4, 5].map((rackIndex) => {
                  const rackSlots = 6;
                  const rackDevices = devices.filter(d => d.owned > 0).slice(rackIndex * rackSlots, (rackIndex + 1) * rackSlots);
                  const isPrimary = rackIndex === 0;

                  return (
                    <div
                      key={`rack-${rackIndex}`}
                      className={`relative h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-black/60 overflow-hidden shadow-xl flex flex-col`}
                    >
                      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Rack {rackIndex + 1}</span>
                          {isPrimary && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[9px] font-black text-cyan-300">Main</span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-white/40">{rackDevices.length}/{rackSlots} slots</span>
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-2 p-3">
                        {rackDevices.map((device, idx) => (
                          <div
                            key={`${device.id}-${idx}`}
                            className={`relative aspect-[3/4] bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-xl flex flex-col items-center justify-center p-2 transition-all group/miner hover:-translate-y-1 hover:border-cyan-400/50 shadow-lg ${isMining ? 'animate-pulse' : ''}`}
                          >
                            <div className="text-2xl mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{device.emoji}</div>
                            <div className="text-[8px] font-black text-white/40 uppercase tracking-tight mb-0.5 truncate w-full text-center">
                              {device.name}
                            </div>
                            <div className="text-[9px] font-black text-cyan-400 font-mono tracking-tight">
                              {(device.power * device.owned).toFixed(1)} TH/s
                            </div>
                            {device.mergeLevel && device.mergeLevel > 0 && (
                              <div className="absolute -top-1 -right-1 bg-purple-600 text-[7px] font-black px-1 py-0.5 rounded-md border border-purple-400 shadow-xl">
                                Lv. {device.mergeLevel + 1}
                              </div>
                            )}
                            <div className={`absolute bottom-1 flex gap-0.5 ${isMining ? 'opacity-100' : 'opacity-20'}`}>
                              <div className={`w-1 h-1 rounded-full ${isMining ? 'bg-cyan-400 animate-pulse' : 'bg-white/20'}`} />
                              <div className={`w-1 h-1 rounded-full ${isMining ? 'bg-cyan-400 animate-pulse delay-75' : 'bg-white/20'}`} />
                              <div className={`w-1 h-1 rounded-full ${isMining ? 'bg-cyan-400 animate-pulse delay-150' : 'bg-white/20'}`} />
                            </div>
                          </div>
                        ))}

                        {rackDevices.length < rackSlots &&
                          Array.from({ length: rackSlots - rackDevices.length }).map((_, i) => (
                            <div
                              key={`rack-${rackIndex}-empty-${i}`}
                              className="aspect-[3/4] bg-white/[0.02] border border-dashed border-white/5 rounded-xl flex items-center justify-center group/empty hover:bg-white/5 transition-all"
                            >
                              <Plus size={14} className="text-white/10 group-hover/empty:text-white/40 transition-colors" />
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mining Status Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-5 bg-cyan-500/5 rounded-3xl border border-cyan-500/10">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/20">
                  <Wind size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">Cooling Performance</p>
                  <p className="text-sm text-white/80 font-medium leading-relaxed">
                    Systems operating at <span className="text-cyan-400 font-black">Optimum Temp</span>. Cooling efficiency is at <span className="text-cyan-400 font-black">98.2%</span>.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-purple-500/5 rounded-3xl border border-purple-500/10">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/20">
                  <Zap size={18} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">Energy Sync</p>
                  <p className="text-sm text-white/80 font-medium leading-relaxed">
                    Grid load is <span className="text-purple-400 font-black">Balanced</span>. Next automatic discharge in <span className="text-purple-400 font-black">04:22</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mining Farm Building & Global Pool */}
          <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 backdrop-blur-xl border border-blue-500/20 rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-white/10 flex flex-col justify-between py-6 px-4">
              <div>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-2">Farm Building</p>
                <p className="text-xs font-black text-white">Skyline Facility</p>
                <p className="text-[10px] text-blue-300/70 mt-1">3 Floors • 6 Racks each</p>
              </div>
              <div className="space-y-1 text-[9px] text-white/40 font-mono">
                <p>Rooms: <span className="text-white/80 font-bold">5</span></p>
                <p>Racks: <span className="text-white/80 font-bold">18</span></p>
                <p>Slots: <span className="text-white/80 font-bold">108</span></p>
                <p className="text-emerald-400 font-bold mt-1 flex items-center gap-1"><Cpu size={10}/> Farm Online</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <Activity size={120} />
            </div>
            <div className="relative z-10 pl-40">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-black font-orbitron text-white uppercase tracking-tight mb-1">Global Mining Pool</h3>
                  <p className="text-sm text-blue-300/60 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    Block #{globalMiningPool.currentBlock} • Shared mining active
                  </p>
                </div>
                <div className="px-6 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 text-blue-300 font-black text-xs font-mono">
                  {poolMinutesLeft}:{poolDisplaySeconds} REMAINING
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PoolStat label="Current Pool Pot" value={`$${globalMiningPool.rewardPot.toFixed(2)}`} icon={<TrendingUp size={16} />} />
                <PoolStat label="Your Share Est." value={`${globalMiningPool.userContribution > 0 ? ((globalMiningPool.userContribution / (globalMiningPool.userContribution + globalMiningPool.networkContribution)) * 100).toFixed(4) : '0.0000'}%`} icon={<Activity size={16} />} />
                <PoolStat label="Network Power" value={`${(globalMiningPool.networkContribution / 1000).toFixed(2)} EH/s`} icon={<Cpu size={16} />} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Crypto Selection & Parts */}
        <div className="xl:col-span-4 space-y-6">
          {/* Target Crypto Selector */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl">
            <h3 className="text-lg font-black font-orbitron text-white uppercase tracking-tighter mb-4 flex items-center gap-2">
              <ChevronRight size={20} className="text-cyan-400" />
              Mine Currency
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {cryptos.map((crypto) => (
                <button
                  key={crypto.id}
                  onClick={() => setSelectedCrypto(crypto.id)}
                  className={`w-full group flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    crypto.id === selectedCrypto 
                      ? 'bg-cyan-500/10 border-cyan-500/40' 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl group-hover:scale-110 transition-transform">{crypto.icon}</div>
                    <div className="text-left">
                      <p className="text-sm font-black text-white">{crypto.symbol}</p>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{crypto.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black font-mono text-white">${crypto.value.toLocaleString()}</p>
                    <p className="text-[9px] text-cyan-400 font-bold">Bal: {crypto.amount.toFixed(4)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Parts & Boosts */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl">
            <h3 className="text-lg font-black font-orbitron text-white uppercase tracking-tighter mb-4 flex items-center gap-2">
              <Layout size={20} className="text-purple-400" />
              Efficiency Gear
            </h3>
            <div className="space-y-3">
              {parts.filter(p => p.quantity > 0).slice(0, 4).map((part) => (
                <div key={part.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{part.icon}</span>
                    <div>
                      <p className="text-xs font-black text-white">{part.name}</p>
                      <p className="text-[9px] text-white/40 font-bold">+{ (part.powerBonus * 100).toFixed(1) }% Power</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-purple-400 font-mono">x{part.quantity}</span>
                </div>
              ))}
              {parts.filter(p => p.quantity > 0).length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-xs text-white/20 font-bold italic">No efficiency gear installed</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Boosts */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl">
            <h3 className="text-lg font-black font-orbitron text-white uppercase tracking-tighter mb-4 flex items-center gap-2">
              <Zap size={20} className="text-amber-400" />
              Active Boosts
            </h3>
            <div className="space-y-3">
              {activeBoosts.map((boost) => (
                <div key={boost.id} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 blur-2xl -mr-8 -mt-8" />
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-black text-white">{boost.sourceGameName}</span>
                    <span className="text-xs font-black text-amber-400 font-mono">+{boost.powerPercent.toFixed(2)}%</span>
                  </div>
                  <div className="h-1 bg-black/40 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-amber-500 animate-shimmer w-[60%]" />
                  </div>
                  <div className="flex justify-between mt-2 text-[9px] font-black text-white/40 uppercase tracking-widest">
                    <span>Expiring Soon</span>
                    <span>{Math.max(0, Math.floor((boost.expiresAt - now) / (60 * 60 * 1000)))}h left</span>
                  </div>
                </div>
              ))}
              {activeBoosts.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-xs text-white/20 font-bold italic">Play arcade games for power boosts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MiningStatCard = ({ label, value, subValue, icon, color }: any) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] flex flex-col gap-1 group hover:bg-white/10 transition-all duration-500 relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/5 blur-3xl -mr-12 -mt-12 group-hover:bg-${color}-500/10 transition-all duration-700`} />
    <div className={`w-12 h-12 rounded-2xl bg-${color}-500/20 flex items-center justify-center mb-3 border border-${color}-500/30 group-hover:scale-110 transition-transform duration-500`}>
      {icon}
    </div>
    <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">{label}</p>
    <p className={`text-2xl font-black font-mono tracking-tight text-white group-hover:text-${color}-400 transition-colors`}>{value}</p>
    <p className="text-[10px] text-white/30 font-medium mt-1">{subValue}</p>
  </div>
);

const PoolStat = ({ label, value, icon }: any) => (
  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
    <div className="flex items-center gap-2 text-blue-400 mb-1">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-lg font-black font-mono text-white tracking-tight">{value}</p>
  </div>
);