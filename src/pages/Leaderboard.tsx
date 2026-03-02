import { useGameStore } from '../store/gameStore';

// Mock leaderboard data
const mockPlayers = [
  { id: 1, username: 'CryptoKing', level: 45, totalMined: 1500000, power: 15000, rank: 1 },
  { id: 2, username: 'MiningPro', level: 42, totalMined: 1200000, power: 12000, rank: 2 },
  { id: 3, username: 'HashMaster', level: 38, totalMined: 950000, power: 10000, rank: 3 },
  { id: 4, username: 'BlockBuilder', level: 35, totalMined: 800000, power: 8500, rank: 4 },
  { id: 5, username: 'CoinCollector', level: 32, totalMined: 700000, power: 7500, rank: 5 },
  { id: 6, username: 'ChainRunner', level: 30, totalMined: 600000, power: 6800, rank: 6 },
  { id: 7, username: 'BitHunter', level: 28, totalMined: 500000, power: 6000, rank: 7 },
  { id: 8, username: 'SatoshiFan', level: 25, totalMined: 450000, power: 5500, rank: 8 },
  { id: 9, username: 'EtherLord', level: 22, totalMined: 400000, power: 5000, rank: 9 },
  { id: 10, username: 'DogeWhale', level: 20, totalMined: 350000, power: 4500, rank: 10 },
];

export default function Leaderboard() {
  const { user, totalMined, devices } = useGameStore();

  const totalPower = devices.reduce((sum, d) => sum + (d.power * d.owned), 0);

  // Find current user's rank
  const currentUser = {
    id: 999,
    username: user.username,
    level: user.level,
    totalMined: totalMined,
    power: totalPower,
    rank: mockPlayers.length + 1,
  };

  const allPlayers = [...mockPlayers, currentUser]
    .sort((a, b) => b.totalMined - a.totalMined)
    .map((player, index) => ({ ...player, rank: index + 1 }));

  const currentUserRank = allPlayers.find(p => p.id === 999)?.rank || allPlayers.length;

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { emoji: '🥇', color: 'from-yellow-400 to-yellow-600' };
    if (rank === 2) return { emoji: '🥈', color: 'from-gray-300 to-gray-400' };
    if (rank === 3) return { emoji: '🥉', color: 'from-amber-600 to-amber-800' };
    return { emoji: `#${rank}`, color: 'from-[#d4af37] to-[#c9a227]' };
  };

  return (
    <div className="space-y-6">
      {/* Leaderboard Header */}
      <div className="bg-gradient-to-r from-[#d4af37] via-[#f5e6d3] to-[#c9a227] rounded-2xl p-8 shadow-2xl border-2 border-[#d4af37]/50">
        <h1 className="text-4xl font-luxe text-[#0a0f0d] mb-2">
          🏆 Global Leaderboard
        </h1>
        <p className="text-[#1a1f1c] text-lg">
          Compete with miners worldwide and climb the ranks
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="card-premium p-6">
        <h2 className="text-2xl font-luxe text-[#f5e5bc] mb-6 text-center">🌟 Top 3 Miners</h2>
        <div className="flex justify-center items-end gap-4">
          {/* 2nd Place */}
          <div className="text-center">
            <div className="text-5xl mb-2">🥈</div>
            <div className="bg-gradient-to-br from-gray-300 to-gray-400 text-black font-bold px-4 py-2 rounded-lg">
              {allPlayers[1]?.username}
            </div>
            <div className="text-[#b9ad8d] text-sm mt-2">Level {allPlayers[1]?.level}</div>
            <div className="text-[#f5e5bc] font-bold">${allPlayers[1]?.totalMined.toLocaleString()}</div>
          </div>

          {/* 1st Place */}
          <div className="text-center transform scale-110">
            <div className="text-6xl mb-2">🥇</div>
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold px-4 py-3 rounded-lg text-lg">
              {allPlayers[0]?.username}
            </div>
            <div className="text-[#b9ad8d] text-sm mt-2">Level {allPlayers[0]?.level}</div>
            <div className="text-[#f5e5bc] font-bold text-lg">${allPlayers[0]?.totalMined.toLocaleString()}</div>
          </div>

          {/* 3rd Place */}
          <div className="text-center">
            <div className="text-5xl mb-2">🥉</div>
            <div className="bg-gradient-to-br from-amber-600 to-amber-800 text-white font-bold px-4 py-2 rounded-lg">
              {allPlayers[2]?.username}
            </div>
            <div className="text-[#b9ad8d] text-sm mt-2">Level {allPlayers[2]?.level}</div>
            <div className="text-[#f5e5bc] font-bold">${allPlayers[2]?.totalMined.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Current User Position */}
      <div className="card-premium p-6 border-[#d4af37]/50">
        <h2 className="text-2xl font-luxe text-[#f5e5bc] mb-4">👤 Your Position</h2>
        <div className="bg-gradient-to-br from-[#1a2437] to-[#0f1724] rounded-xl p-6 border border-[#d4af37]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{getRankBadge(currentUserRank).emoji}</div>
              <div>
                <div className="text-[#b9ad8d] text-sm">Your Rank</div>
                <div className="text-4xl font-luxe text-[#f5e5bc]">#{currentUserRank}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[#b9ad8d] text-sm">Total Mined</div>
              <div className="text-3xl font-luxe text-[#f5e5bc]">${totalMined.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="card-premium p-6">
        <h2 className="text-2xl font-luxe text-[#f5e5bc] mb-6">📊 Full Rankings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#d4af37]/20">
                <th className="text-left p-4 text-[#b9ad8d]">Rank</th>
                <th className="text-left p-4 text-[#b9ad8d]">Player</th>
                <th className="text-right p-4 text-[#b9ad8d]">Level</th>
                <th className="text-right p-4 text-[#b9ad8d]">Hash Rate</th>
                <th className="text-right p-4 text-[#b9ad8d]">Total Mined</th>
              </tr>
            </thead>
            <tbody>
              {allPlayers.map((player) => {
                const isCurrentUser = player.id === 999;
                const rankBadge = getRankBadge(player.rank);
                
                return (
                  <tr
                    key={player.id}
                    className={`border-b border-[#d4af37]/10 transition-all ${
                      isCurrentUser
                        ? 'bg-[#d4af37]/20'
                        : 'hover:bg-[#d4af37]/10'
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${rankBadge.color} flex items-center justify-center text-black font-bold`}>
                          {player.rank <= 3 ? rankBadge.emoji : player.rank}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`font-semibold ${isCurrentUser ? 'text-[#f5e5bc]' : 'text-[#b9ad8d]'}`}>
                        {player.username}
                        {isCurrentUser && <span className="ml-2 text-xs text-[#d4af37]">(You)</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right text-[#b9ad8d]">
                      {player.level}
                    </td>
                    <td className="p-4 text-right text-[#b9ad8d]">
                      {player.power.toLocaleString()} TH/s
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-[#f5e5bc] font-bold">
                        ${player.totalMined.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-premium p-6">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-[#b9ad8d] text-sm mb-1">Total Players</div>
          <div className="text-3xl font-luxe text-[#f5e5bc]">{allPlayers.length}</div>
        </div>
        <div className="card-premium p-6">
          <div className="text-4xl mb-2">⚡</div>
          <div className="text-[#b9ad8d] text-sm mb-1">Your Hash Rate</div>
          <div className="text-3xl font-luxe text-[#f5e5bc]">{totalPower.toLocaleString()} TH/s</div>
        </div>
        <div className="card-premium p-6">
          <div className="text-4xl mb-2">📈</div>
          <div className="text-[#b9ad8d] text-sm mb-1">Rank Progress</div>
          <div className="text-3xl font-luxe text-[#f5e5bc]">Top {Math.ceil((currentUserRank / allPlayers.length) * 100)}%</div>
        </div>
      </div>
    </div>
  );
}
