import { useEffect, useState, FC } from 'react';
import { useGameStore, GameNotification } from './store/gameStore';

import Dashboard from './pages/Dashboard';

const NotificationCenter: FC = () => {
  const notifications = useGameStore((state) => state.notifications);
  const removeNotification = useGameStore((state) => state.removeNotification);

  return (
    <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {notifications.map((notif: GameNotification) => (
        <div
          key={notif.id}
          className={`pointer-events-auto min-w-[280px] p-4 rounded-xl border-l-4 shadow-2xl backdrop-blur-xl animate-notif-in flex items-center justify-between gap-4 transition-all hover:translate-x-[-4px] ${
            notif.type === 'success' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' :
            notif.type === 'error' ? 'bg-rose-500/10 border-rose-500 text-rose-400' :
            notif.type === 'warning' ? 'bg-amber-500/10 border-amber-500 text-amber-400' :
            'bg-blue-500/10 border-blue-500 text-blue-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {notif.type === 'success' ? '✅' :
               notif.type === 'error' ? '❌' :
               notif.type === 'warning' ? '⚠️' :
               'ℹ️'}
            </span>
            <p className="text-sm font-bold tracking-tight">{notif.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notif.id)}
            className="text-white/20 hover:text-white transition-colors p-1"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
import Mining from './pages/Mining';
import Shop from './pages/Shop';
import Games from './pages/Games';
import Marketplace from './pages/Marketplace';
import Quests from './pages/Quests';
import MergeLab from './pages/MergeLab';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Stats from './pages/Stats';
import Leaderboard from './pages/Leaderboard';
import PTC from './pages/PTC';
import Lootboxes from './pages/Lootboxes';
import Inventory from './pages/Inventory';
import Guilds from './pages/Guilds';
import Casino from './pages/Casino';
import DailyRewards from './pages/DailyRewards';
import Payments from './pages/Payments';
import CMRTokens from './pages/CMRTokens';
import ResearchLab from './pages/ResearchLab';
import SeasonPass from './pages/SeasonPass';
import GuildWars from './pages/GuildWars';
import AdvancedFeatures from './pages/AdvancedFeatures';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAdmin, setShowAdmin] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { 
    user, 
    balance, 
    energy, 
    maxEnergy, 
    isMining, 
    updateEnergy, 
    mine,
    updateCryptoPrices,
    resolveGlobalMiningPool,
    updateGeoMiningPower,
    adminSettings,
    devices,
  } = useGameStore();

  const totalHashrate = devices.reduce((sum, d) => sum + (d.power * d.owned), 0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (energy < maxEnergy) {
        updateEnergy(0.5 * adminSettings.energyRegenRate);
      }
    }, adminSettings.energyRegenTickRate);
    return () => clearInterval(interval);
  }, [energy, maxEnergy, updateEnergy, adminSettings.energyRegenRate, adminSettings.energyRegenTickRate]);

  useEffect(() => {
    if (isMining) {
      const interval = setInterval(() => {
        mine();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isMining, mine]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateCryptoPrices();
    }, 30000);
    return () => clearInterval(interval);
  }, [updateCryptoPrices]);

  useEffect(() => {
    const interval = setInterval(() => {
      resolveGlobalMiningPool();
    }, 1000);
    return () => clearInterval(interval);
  }, [resolveGlobalMiningPool]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateGeoMiningPower();
    }, 10000);
    return () => clearInterval(interval);
  }, [updateGeoMiningPower]);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠', color: 'cyan' },
    { id: 'mining', name: 'Mining Room', icon: '⛏️', color: 'cyan' },
    { id: 'games', name: 'Arcade', icon: '🎮', color: 'purple' },
    { id: 'shop', name: 'Shop', icon: '🛒', color: 'yellow' },
    { id: 'lootboxes', name: 'Crates', icon: '🎁', color: 'purple', badge: 'HOT' },
    { id: 'ptc', name: 'Earn Links', icon: '🔗', color: 'green', badge: 'NEW' },
    { id: 'marketplace', name: 'Market', icon: '💱', color: 'blue' },
    { id: 'merge', name: 'Merge Lab', icon: '🧬', color: 'pink' },
    { id: 'inventory', name: 'Storage', icon: '📦', color: 'cyan' },
    { id: 'guilds', name: 'Guilds', icon: '👥', color: 'purple' },
    { id: 'casino', name: 'Casino', icon: '🎰', color: 'orange', badge: 'NEW' },
    { id: 'cmr', name: 'CMR Hub', icon: '🪙', color: 'yellow', badge: 'TOKEN' },
    { id: 'payments', name: 'Payments', icon: '💳', color: 'emerald', badge: 'NEW' },
    { id: 'daily', name: 'Daily Rewards', icon: '📅', color: 'green' },
    { id: 'season', name: 'Season Pass', icon: '🎟️', color: 'amber', badge: 'S1' },
    { id: 'lab', name: 'Research Lab', icon: '🧪', color: 'blue', badge: 'UP' },
    { id: 'guildwars', name: 'Guild Wars', icon: '⚔️', color: 'purple', badge: 'LIVE' },
    { id: 'quests', name: 'Quests', icon: '📋', color: 'cyan' },
    { id: 'achievements', name: 'Trophies', icon: '🏆', color: 'yellow' },
    { id: 'stats', name: 'Statistics', icon: '📊', color: 'cyan' },
    { id: 'leaderboard', name: 'Rankings', icon: '🏅', color: 'blue' },
    { id: 'advanced', name: 'Advanced', icon: '⭐', color: 'cyan', badge: 'NEW' },
    { id: 'profile', name: 'Profile', icon: '👤', color: 'cyan' },
  ];

  const f = adminSettings.features || {};
  const filteredNavigation = navigation.filter(item => {
    if (item.id === 'mining') return f.mining;
    if (item.id === 'games') return f.arcade;
    if (item.id === 'shop') return f.shop;
    if (item.id === 'lootboxes') return f.lootboxes;
    if (item.id === 'ptc') return f.ptc;
    if (item.id === 'marketplace') return f.marketplace;
    if (item.id === 'merge') return f.mergeLab;
    if (item.id === 'inventory') return f.inventory;
    if (item.id === 'guilds') return f.guilds;
    if (item.id === 'casino') return f.casino;
    if (item.id === 'cmr') return f.cmrToken;
    if (item.id === 'daily') return f.dailyRewards;
    if (item.id === 'season') return f.seasonPass;
    if (item.id === 'lab') return f.researchLab;
    if (item.id === 'guildwars') return f.guildWars;
    if (item.id === 'quests') return f.quests;
    if (item.id === 'achievements') return f.achievements;
    if (['dashboard', 'stats', 'leaderboard', 'advanced', 'profile'].includes(item.id)) return true;
    return true;
  });

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'mining': return <Mining />;
      case 'shop': return <Shop />;
      case 'games': return <Games />;
      case 'lootboxes': return <Lootboxes />;
      case 'inventory': return <Inventory />;
      case 'merge': return <MergeLab />;
      case 'marketplace': return <Marketplace />;
      case 'ptc': return <PTC />;
      case 'quests': return <Quests />;
      case 'achievements': return <Achievements />;
      case 'stats': return <Stats />;
      case 'leaderboard': return <Leaderboard />;
      case 'guilds': return <Guilds />;
      case 'casino': return <Casino />;
      case 'cmr': return <CMRTokens />;
      case 'payments': return <Payments />;
      case 'daily': return <DailyRewards />;
      case 'season': return <SeasonPass />;
      case 'lab': return <ResearchLab />;
      case 'guildwars': return <GuildWars />;
      case 'advanced': return <AdvancedFeatures />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="gaming-shell min-h-screen bg-[#1a1f2e]">
      <NotificationCenter />
      {/* Admin Modal */}
      {showAdmin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1e2538] border border-cyan-500/30 shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-cyan-500/20">
              <h2 className="text-2xl font-bold text-cyan-400">Admin Control Panel</h2>
              <button
                onClick={() => setShowAdmin(false)}
                className="h-10 w-10 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <AdminPanel />
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b border-cyan-500/30 z-40 px-4 flex items-center justify-between cyber-scan">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-cyan-500/20 rounded-lg transition-all text-cyan-400 group"
          >
            <span className="text-2xl group-hover:rotate-180 transition-transform duration-500">☰</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(6,182,212,0.6)] animate-pulse border border-white/20">
              ⛁
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-600 neon-text">
                CRYPTOMINE ROYALE
              </h1>
              <div className="flex items-center gap-2">
                <div className="h-1 w-24 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${(user.xp / (user.level * 1000)) * 100}%` }} />
                </div>
                <p className="text-[10px] font-black text-cyan-400/80 uppercase tracking-widest">LVL {user.level}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Currency Display */}
          <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-cyan-500/30 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)] group cursor-help">
            <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
              <span className="text-cyan-400 font-black text-xs group-hover:scale-125 transition-transform">₮</span>
            </div>
            <span className="text-white font-mono font-bold tracking-tight text-sm">
              {balance.toLocaleString(undefined, {
                minimumFractionDigits: adminSettings.currencyPrecision,
                maximumFractionDigits: adminSettings.currencyPrecision,
              })}
            </span>
          </div>

          {/* Energy Bar */}
          <div className="hidden md:flex items-center gap-3 bg-slate-900/60 px-4 py-2 rounded-xl border border-yellow-500/30 group">
            <span className="text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] group-hover:animate-bounce">⚡</span>
            <div className="w-20 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 animate-pulse"
                style={{ width: `${(energy / maxEnergy) * 100}%` }}
              />
            </div>
          </div>

          {/* Admin Button */}
          <button
            onClick={() => setShowAdmin(true)}
            className="hidden lg:block px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/40 rounded-lg text-[10px] text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all font-black uppercase tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.2)] animate-pulse-cyan"
          >
            Terminal
          </button>

          {/* Profile */}
          <div className="relative group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[2px] cursor-pointer shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
              <div className="w-full h-full rounded-[9px] bg-[#0d111c] flex items-center justify-center text-white font-black text-sm group-hover:bg-transparent transition-all border border-white/5">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
            {/* Quick dropdown hover effect hint */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#161b29] border border-cyan-500/20 rounded-xl p-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
              <p className="text-[10px] text-gray-500 font-bold uppercase p-2 border-b border-white/5">{user.username}</p>
              <div className="p-2 text-xs text-white">Security Cleared: LVL {user.level}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Left Sidebar */}
        <aside className={`fixed left-0 top-16 bottom-0 glass-panel border-r border-cyan-500/30 transition-all duration-500 z-30 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}>
          <div className="flex flex-col h-full">
            <nav className="flex-1 p-3 space-y-2 overflow-y-auto no-scrollbar">
              {filteredNavigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    if (window.innerWidth < 768) setSidebarCollapsed(true);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-transparent border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                      : 'text-slate-500 hover:bg-white/5 hover:text-cyan-300'
                  }`}
                >
                  {currentPage === item.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_15px_#06b6d4]" />
                  )}
                  
                  <span className={`text-2xl transition-all duration-500 ${
                    currentPage === item.id 
                      ? 'scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' 
                      : 'group-hover:scale-110 group-hover:rotate-12'
                  }`}>
                    {item.icon}
                  </span>
                  
                  {!sidebarCollapsed && (
                    <div className="flex flex-col items-start gap-0.5">
                      <span className={`font-black text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                        currentPage === item.id ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-200'
                      }`}>
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="text-[8px] font-black bg-emerald-500 text-black px-1.5 py-0.5 rounded-sm animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {!sidebarCollapsed && currentPage === item.id && (
                    <div className="ml-auto flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
                      <div className="w-1 h-1 rounded-full bg-cyan-400 opacity-50" />
                    </div>
                  )}
                </button>
              ))}
            </nav>

            {!sidebarCollapsed && (
              <div className="p-4 m-3 bg-black/40 rounded-2xl border border-cyan-500/20 futuristic-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-tighter tracking-widest">
                    Network Status
                  </div>
                  <div className={`w-2 h-2 rounded-full ${isMining ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'} animate-pulse`} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-400 uppercase">Power</span>
                    <span className="text-cyan-400 font-bold">{totalHashrate.toFixed(2)} TH/s</span>
                  </div>
                  <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 w-[70%]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="p-4 md:p-6">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
