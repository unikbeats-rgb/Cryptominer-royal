import { useGameStore } from '../store/gameStore';

export default function Stats() {
  const { user, devices, cryptos, transactions, quests, achievements, balance, totalMined } = useGameStore();

  const totalPower = devices.reduce((sum, d) => sum + (d.power * d.owned), 0);
  const totalCryptoValue = cryptos.reduce((sum, c) => sum + (c.amount * c.value), 0);
  const totalDevices = devices.reduce((sum, d) => sum + d.owned, 0);
  const completedQuests = quests.filter(q => q.completed).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const recentTransactions = transactions.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="bg-gradient-to-r from-[#d4af37] via-[#f5e6d3] to-[#c9a227] rounded-2xl p-8 shadow-2xl border-2 border-[#d4af37]/50">
        <h1 className="text-4xl font-luxe text-[#0a0f0d] mb-2">
          📊 Analytics Dashboard
        </h1>
        <p className="text-[#1a1f1c] text-lg">
          Comprehensive statistics and performance metrics
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-premium p-6">
          <div className="text-4xl mb-2">💰</div>
          <div className="text-sm text-[#b9ad8d] mb-1">Total Treasury</div>
          <div className="text-3xl font-luxe text-[#f5e5bc]">${balance.toFixed(2)}</div>
        </div>
        <div className="card-premium p-6">
          <div className="text-4xl mb-2">⛏️</div>
          <div className="text-sm text-[#b9ad8d] mb-1">Total Mined</div>
          <div className="text-3xl font-luxe text-[#f5e5bc]">${totalMined.toFixed(2)}</div>
        </div>
        <div className="card-premium p-6">
          <div className="text-4xl mb-2">⚡</div>
          <div className="text-sm text-[#b9ad8d] mb-1">Hash Rate</div>
          <div className="text-3xl font-luxe text-[#f5e5bc]">{totalPower} TH/s</div>
        </div>
        <div className="card-premium p-6">
          <div className="text-4xl mb-2">💎</div>
          <div className="text-sm text-[#b9ad8d] mb-1">Crypto Portfolio</div>
          <div className="text-3xl font-luxe text-[#f5e5bc]">${totalCryptoValue.toFixed(2)}</div>
        </div>
      </div>

      {/* Player Progress */}
      <div className="card-premium p-6">
        <h2 className="text-2xl font-luxe text-[#f5e5bc] mb-6">👤 Player Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0f1724] rounded-xl p-4 border border-[#d4af37]/20">
            <div className="text-[#b9ad8d] text-sm mb-1">Level</div>
            <div className="text-3xl font-luxe text-[#f5e5bc]">{user.level}</div>
            <div className="mt-3 h-2 rounded-full bg-black/30 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#d4af37] to-[#f5e6d3] transition-all duration-300"
                style={{ width: `${(user.xp / (user.level * 1000)) * 100}%` }}
              />
            </div>
            <div className="text-xs text-[#b9ad8d] mt-1">{user.xp} / {user.level * 1000} XP</div>
          </div>
          <div className="bg-[#0f1724] rounded-xl p-4 border border-[#d4af37]/20">
            <div className="text-[#b9ad8d] text-sm mb-1">Games Played</div>
            <div className="text-3xl font-luxe text-[#f5e5bc]">{user.gamesPlayed}</div>
            <div className="text-xs text-[#b9ad8d] mt-1">Total mini-games completed</div>
          </div>
          <div className="bg-[#0f1724] rounded-xl p-4 border border-[#d4af37]/20">
            <div className="text-[#b9ad8d] text-sm mb-1">Member Since</div>
            <div className="text-xl font-luxe text-[#f5e5bc]">
              {new Date(user.joinedAt).toLocaleDateString()}
            </div>
            <div className="text-xs text-[#b9ad8d] mt-1">Account creation date</div>
          </div>
        </div>
      </div>

      {/* Mining Equipment */}
      <div className="card-premium p-6">
        <h2 className="text-2xl font-luxe text-[#f5e5bc] mb-6">🖥️ Mining Equipment</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className={`bg-[#0f1724] rounded-lg p-3 border ${
                device.owned > 0 ? 'border-[#d4af37]/50' : 'border-[#d4af37]/10 opacity-60'
              }`}
            >
              <div className="text-2xl mb-1">{device.emoji}</div>
              <div className="text-xs text-[#b9ad8d] truncate">{device.name}</div>
              <div className="text-lg font-bold text-[#f5e5bc]">{device.owned}</div>
              <div className="text-xs text-[#b9ad8d]">{device.power} TH/s</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center bg-[#0f1724] rounded-lg p-4 border border-[#d4af37]/20">
          <div>
            <div className="text-[#b9ad8d] text-sm">Total Devices</div>
            <div className="text-2xl font-luxe text-[#f5e5bc]">{totalDevices}</div>
          </div>
          <div>
            <div className="text-[#b9ad8d] text-sm">Total Hash Rate</div>
            <div className="text-2xl font-luxe text-[#f5e5bc]">{totalPower} TH/s</div>
          </div>
        </div>
      </div>

      {/* Cryptocurrency Holdings */}
      <div className="card-premium p-6">
        <h2 className="text-2xl font-luxe text-[#f5e5bc] mb-6">💎 Cryptocurrency Holdings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cryptos.map((crypto) => (
            <div
              key={crypto.id}
              className="bg-[#0f1724] rounded-lg p-4 border border-[#d4af37]/20"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className="text-3xl"
                  style={{ color: crypto.color }}
                >
                  {crypto.icon}
                </div>
                <div>
                  <div className="text-[#f5e5bc] font-bold">{crypto.symbol}</div>
                  <div className="text-[#b9ad8d] text-sm">{crypto.name}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#b9ad8d]">Price:</span>
                  <span className="text-[#f5e5bc] font-bold">${crypto.value.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#b9ad8d]">Holdings:</span>
                  <span className="text-[#f5e5bc] font-bold">{crypto.amount.toFixed(8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#b9ad8d]">Value:</span>
                  <span className="text-[#2ecc71] font-bold">
                    ${(crypto.amount * crypto.value).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quests & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-premium p-6">
          <h2 className="text-2xl font-luxe text-[#f5e5bc] mb-4">📜 Quests Progress</h2>
          <div className="space-y-3">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className="bg-[#0f1724] rounded-lg p-3 border border-[#d4af37]/20"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-[#f5e5bc] font-semibold">{quest.title}</div>
                  {quest.completed && (
                    <span className="badge-premium">✓ Complete</span>
                  )}
                </div>
                <div className="text-xs text-[#b9ad8d] mb-2">{quest.description}</div>
                <div className="h-2 rounded-full bg-black/30 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#d4af37] to-[#f5e6d3] transition-all duration-300"
                    style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                  />
                </div>
                <div className="text-xs text-[#b9ad8d] mt-1">
                  {quest.progress} / {quest.target}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <div className="text-[#b9ad8d] text-sm">Completed Quests</div>
            <div className="text-3xl font-luxe text-[#f5e5bc]">
              {completedQuests} / {quests.length}
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <h2 className="text-2xl font-luxe text-[#f5e5bc] mb-4">🏆 Achievements</h2>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-[#0f1724] rounded-lg p-3 border ${
                  achievement.unlocked
                    ? 'border-[#d4af37]/50'
                    : 'border-[#d4af37]/10 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="text-[#f5e5bc] font-semibold">{achievement.title}</div>
                    <div className="text-xs text-[#b9ad8d]">{achievement.description}</div>
                  </div>
                  {achievement.unlocked && (
                    <div className="text-[#d4af37]">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <div className="text-[#b9ad8d] text-sm">Unlocked Achievements</div>
            <div className="text-3xl font-luxe text-[#f5e5bc]">
              {unlockedAchievements} / {achievements.length}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card-premium p-6">
        <h2 className="text-2xl font-luxe text-[#f5e5bc] mb-6">📋 Recent Transactions</h2>
        <div className="space-y-2">
          {recentTransactions.length === 0 ? (
            <div className="text-center text-[#b9ad8d] py-8">
              No transactions yet
            </div>
          ) : (
            recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-[#0f1724] rounded-lg p-4 border border-[#d4af37]/20 flex justify-between items-center"
              >
                <div>
                  <div className="text-[#f5e5bc] font-semibold">{tx.description}</div>
                  <div className="text-xs text-[#b9ad8d]">
                    {new Date(tx.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className={`text-lg font-bold ${
                  tx.amount > 0 ? 'text-[#2ecc71]' : 'text-[#e74c3c]'
                }`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
