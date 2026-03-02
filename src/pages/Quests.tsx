import { useGameStore } from '../store/gameStore';

export default function Quests() {
  const { quests, completeQuest } = useGameStore();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-2xl p-8 shadow-2xl border-2 border-yellow-400/30">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          📜 Quest Board
        </h1>
        <p className="text-yellow-100 text-lg">Complete quests to earn massive rewards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quests.map((quest) => {
          const progress = Math.min((quest.progress / quest.target) * 100, 100);
          const canComplete = quest.progress >= quest.target && !quest.completed;

          return (
            <div key={quest.id} className={`bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm border rounded-xl p-6 shadow-lg ${
              quest.completed ? 'border-green-500/50' : canComplete ? 'border-yellow-500/50' : 'border-purple-500/30'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{quest.title}</h3>
                  <p className="text-gray-400">{quest.description}</p>
                </div>
                {quest.completed && <div className="text-4xl">✅</div>}
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-purple-300">Progress</span>
                  <span className="text-white font-bold">{quest.progress.toFixed(0)}/{quest.target}</span>
                </div>
                <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      quest.completed ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-yellow-400 to-orange-400'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-3">
                  <div className="text-green-300 text-sm">💰 Reward</div>
                  <div className="text-white font-bold text-lg">${quest.reward}</div>
                </div>
                {quest.cryptoReward && (
                  <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-3">
                    <div className="text-blue-300 text-sm">🎁 Bonus</div>
                    <div className="text-white font-bold text-lg">
                      {quest.cryptoReward.amount} {quest.cryptoReward.symbol}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => completeQuest(quest.id)}
                disabled={!canComplete}
                className={`w-full py-3 rounded-lg font-bold transition-all duration-200 ${
                  quest.completed
                    ? 'bg-green-900/30 text-green-500 cursor-not-allowed'
                    : canComplete
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white shadow-lg transform hover:scale-105'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {quest.completed ? '✓ COMPLETED' : canComplete ? '🎁 CLAIM REWARD' : '🔒 IN PROGRESS'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
