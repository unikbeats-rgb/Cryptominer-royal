import { useGameStore } from '../store/gameStore';

export default function Achievements() {
  const { achievements } = useGameStore();
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 shadow-2xl border-2 border-purple-400/30">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          🏆 Achievements
        </h1>
        <p className="text-purple-100 text-lg">
          {unlockedCount}/{achievements.length} Unlocked
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm border rounded-xl p-6 shadow-lg transition-all duration-300 ${
              achievement.unlocked
                ? 'border-yellow-500/50 hover:shadow-yellow-500/20'
                : 'border-gray-700 opacity-60'
            }`}
          >
            <div className="text-center mb-4">
              <div className={`text-6xl mb-3 ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{achievement.title}</h3>
              <p className="text-gray-400 text-sm">{achievement.description}</p>
            </div>

            <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-3 mb-4">
              <div className="text-green-300 text-sm">💰 Reward</div>
              <div className="text-white font-bold text-lg">${achievement.reward}</div>
            </div>

            {achievement.unlocked ? (
              <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-3 text-center">
                <div className="text-yellow-400 font-bold">✓ UNLOCKED</div>
                <div className="text-gray-400 text-xs mt-1">
                  {achievement.unlockedAt && new Date(achievement.unlockedAt).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-3 text-center">
                <div className="text-gray-500 font-bold">🔒 LOCKED</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
