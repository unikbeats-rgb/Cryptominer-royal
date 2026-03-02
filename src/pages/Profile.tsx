import { useGameStore } from '../store/gameStore';

export default function Profile() {
  const { user, balance, devices, cryptos, totalMined, achievements, quests, resetGame } = useGameStore();

  const totalPower = devices.reduce((sum, d) => sum + (d.power * d.owned), 0);
  const totalCryptoValue = cryptos.reduce((sum, c) => sum + (c.amount * c.value), 0);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const completedQuests = quests.filter(q => q.completed).length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl border-2 border-cyan-400/30">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          👤 Player Profile
        </h1>
        <p className="text-cyan-100 text-lg">{user.username}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Stats */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Statistics</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
              <div className="text-4xl mb-2">⭐</div>
              <div className="text-3xl font-bold text-white">{user.level}</div>
              <div className="text-purple-300">Level</div>
            </div>
            
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
              <div className="text-4xl mb-2">💎</div>
              <div className="text-3xl font-bold text-white">{user.xp}</div>
              <div className="text-blue-300">Experience Points</div>
            </div>
            
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
              <div className="text-4xl mb-2">💰</div>
              <div className="text-2xl font-bold text-white">${balance.toFixed(2)}</div>
              <div className="text-green-300">USD Balance</div>
            </div>
            
            <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-4">
              <div className="text-4xl mb-2">💵</div>
              <div className="text-2xl font-bold text-white">${totalCryptoValue.toFixed(2)}</div>
              <div className="text-cyan-300">Crypto Value</div>
            </div>
            
            <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-4xl mb-2">⛏️</div>
              <div className="text-2xl font-bold text-white">${totalMined.toFixed(2)}</div>
              <div className="text-yellow-300">Total Mined</div>
            </div>
            
            <div className="bg-pink-900/30 border border-pink-500/30 rounded-lg p-4">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-white">{totalPower} TH/s</div>
              <div className="text-pink-300">Mining Power</div>
            </div>
            
            <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4">
              <div className="text-4xl mb-2">🎮</div>
              <div className="text-2xl font-bold text-white">{user.gamesPlayed}</div>
              <div className="text-orange-300">Games Played</div>
            </div>
            
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-white">{unlockedAchievements}/{achievements.length}</div>
              <div className="text-red-300">Achievements</div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-8xl mb-4">👤</div>
            <h3 className="text-2xl font-bold text-white mb-2">{user.username}</h3>
            <div className="inline-block bg-purple-600 text-white px-4 py-2 rounded-full font-bold">
              Level {user.level}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-gray-400 text-sm">Member Since</div>
              <div className="text-white font-bold">{new Date(user.joinedAt).toLocaleDateString()}</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-gray-400 text-sm">Days Active</div>
              <div className="text-white font-bold">
                {Math.floor((Date.now() - user.joinedAt) / (1000 * 60 * 60 * 24))} days
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-gray-400 text-sm">Quests Completed</div>
              <div className="text-white font-bold">{completedQuests}/{quests.length}</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-purple-300 mb-2">XP Progress</div>
            <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
                style={{ width: `${(user.xp / (user.level * 1000)) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1 text-center">
              {user.xp}/{user.level * 1000} XP to next level
            </div>
          </div>

          <button
            onClick={resetGame}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105"
          >
            🔄 Reset Game
          </button>
        </div>
      </div>

      {/* Device Collection */}
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Device Collection</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {devices.map((device) => (
            <div key={device.id} className={`bg-gray-800/50 border rounded-lg p-3 text-center ${
              device.owned > 0 ? 'border-green-500/50' : 'border-gray-700 opacity-50'
            }`}>
              <div className="text-3xl mb-1">{device.emoji}</div>
              <div className="text-xs text-gray-400">{device.name}</div>
              <div className="text-sm font-bold text-white">{device.owned}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
