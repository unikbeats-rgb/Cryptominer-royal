import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Zap, AlertCircle, ChevronLeft, Sparkles } from 'lucide-react';
import FlappyRocket from '../components/games/FlappyRocket';
import SnakeGame from '../components/games/SnakeGame';
import MemoryMatch from '../components/games/MemoryMatch';
import CoinClick from '../components/games/CoinClick';
import AsteroidBlitz from '../components/games/AsteroidBlitz';
import Game2048 from '../components/games/Game2048';
import CryptoRacing from '../components/games/CryptoRacing';
import SpaceDefender from '../components/games/SpaceDefender';
import PixelJumper from '../components/games/PixelJumper';
import TowerDefense from '../components/games/TowerDefense';
import HashCrack from '../components/games/HashCrack';
import BlockDrop from '../components/games/BlockDrop';
import BitPuzzle from '../components/games/BitPuzzle';

interface GameInfo {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  reward: number;
  energyCost: number;
  cooldown: number;
  type: string;
  icon: string;
}

const games: GameInfo[] = [
  { id: 'coinclick', name: 'Coinclick Wizard', description: 'Click coins and avoid bombs falling from the wizard.', difficulty: 1, reward: 50, energyCost: 5, cooldown: 0, type: 'active', icon: '🪙' },
  { id: 'memorymatch', name: 'Memory Match', description: 'Find matching crypto pairs before the time runs out!', difficulty: 2, reward: 75, energyCost: 8, cooldown: 0, type: 'active', icon: '🧠' },
  { id: 'flappyrocket', name: 'Flappy Rocket', description: 'Fly through gaps between pipes to score points.', difficulty: 2, reward: 75, energyCost: 8, cooldown: 0, type: 'active', icon: '🚀' },
  { id: 'snake', name: 'Snake Miner', description: 'Classic snake with crypto coins to grow your tail.', difficulty: 3, reward: 100, energyCost: 10, cooldown: 0, type: 'active', icon: '🐍' },
  { id: 'asteroid', name: 'Asteroid Blitz', description: 'Defend your base from falling asteroids.', difficulty: 3, reward: 100, energyCost: 10, cooldown: 60, type: 'arcade', icon: '☄️' },
  { id: '2048', name: '2048 Crypto', description: 'Merge crypto tiles to reach the final 2048 tile.', difficulty: 3, reward: 100, energyCost: 10, cooldown: 300, type: 'puzzle', icon: '🔢' },
  { id: 'racing', name: 'Crypto Racing', description: 'Drive fast, avoid obstacles and collect coins.', difficulty: 3, reward: 100, energyCost: 10, cooldown: 60, type: 'active', icon: '🏎️' },
  { id: 'invaders', name: 'Space Defender', description: 'Protect Earth from incoming space invaders.', difficulty: 4, reward: 150, energyCost: 15, cooldown: 120, type: 'arcade', icon: '🛸' },
  { id: 'jumper', name: 'Pixel Jumper', description: 'Jump across platforms to collect rewards.', difficulty: 3, reward: 100, energyCost: 10, cooldown: 60, type: 'active', icon: '🏃' },
  { id: 'defender', name: 'Crypto Defender', description: 'Tower defense to protect your mining rig.', difficulty: 4, reward: 180, energyCost: 15, cooldown: 120, type: 'strategy', icon: '🏰' },
  { id: 'hashcrack', name: 'Hash Cracker', description: 'Solve hash codes to earn rewards.', difficulty: 4, reward: 150, energyCost: 15, cooldown: 600, type: 'puzzle', icon: '🔐' },
  { id: 'blockdrop', name: 'Block Drop', description: 'Stack blocks and clear lines strategically.', difficulty: 3, reward: 80, energyCost: 8, cooldown: 300, type: 'active', icon: '📦' },
  { id: 'bitpuzzle', name: 'Bit Puzzle', description: 'Connect blockchain nodes to finish the puzzle.', difficulty: 4, reward: 120, energyCost: 12, cooldown: 420, type: 'puzzle', icon: '🧩' },
];

interface Reward {
  cash: number;
  xp: number;
  boostPercent: number;
  parts?: { name: string; rarity: string; icon: string };
}

const Games: React.FC = () => {
  const { playMiniGame, energy, maxEnergy, user, adminSettings, gamePowerBoosts } = useGameStore();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [lastReward, setLastReward] = useState<Reward | null>(null);
  const [showReward, setShowReward] = useState(false);

  const now = Date.now();
  const activeBoosts = gamePowerBoosts.filter((b) => b.expiresAt > now);

  const handleGameEnd = (gameId: string, gameScore: number, _won: boolean) => {
    const result = playMiniGame(gameId, gameScore);
    if (result) {
      setLastReward({
        cash: result.reward,
        xp: result.xpGained,
        boostPercent: result.gameBoost.powerPercent,
        parts: result.partDrop
          ? {
              name: result.partDrop.name,
              rarity: result.partDrop.rarity,
              icon: result.partDrop.icon,
            }
          : undefined,
      });
      setShowReward(true);

      setTimeout(() => {
        setShowReward(false);
      }, 4200);
    }
  };

  const currentLevel = Math.min(adminSettings.maxGameLevels, Math.max(1, user.level));
  const gameDuration = Math.max(
    adminSettings.gameSessionMinSeconds,
    Math.min(
      adminSettings.gameSessionMaxSeconds,
      adminSettings.gameBaseDuration +
        currentLevel * adminSettings.gameDurationPerLevel,
    ),
  );

  const renderGameComponent = (game: GameInfo) => {
    switch (game.id) {
      case 'flappyrocket':
        return <FlappyRocket level={currentLevel} durationSeconds={gameDuration} difficulty={game.difficulty} onGameEnd={(score, won) => handleGameEnd(game.id, score, won)} />;
      case 'snake':
        return <SnakeGame level={currentLevel} durationSeconds={gameDuration} difficulty={game.difficulty} onGameEnd={(score, won) => handleGameEnd(game.id, score, won)} />;
      case 'memorymatch':
        return <MemoryMatch level={currentLevel} durationSeconds={gameDuration} difficulty={game.difficulty} onGameEnd={(score, won) => handleGameEnd(game.id, score, won)} />;
      case 'coinclick':
        return <CoinClick level={currentLevel} durationSeconds={gameDuration} difficulty={game.difficulty} onGameEnd={(score, won) => handleGameEnd(game.id, score, won)} />;
      case '2048':
        return <Game2048 level={currentLevel} durationSeconds={gameDuration} difficulty={Math.max(1, game.difficulty)} onGameEnd={(score, won) => handleGameEnd(game.id, score, won)} />;
      case 'asteroid':
        return <AsteroidBlitz level={currentLevel} durationSeconds={gameDuration} difficulty={Math.max(1, game.difficulty)} onGameEnd={(score, won) => handleGameEnd(game.id, score, won)} />;
      case 'racing':
        return <CryptoRacing level={currentLevel} durationSeconds={gameDuration} difficulty={Math.max(1, game.difficulty)} onGameEnd={(score, won) => handleGameEnd(game.id, score, won)} />;
      case 'invaders':
        return <SpaceDefender level={currentLevel} durationSeconds={gameDuration} difficulty={Math.max(1, game.difficulty)} onGameEnd={(score, won) => handleGameEnd(game.id, score, won)} />;
      case 'jumper':
        return <PixelJumper level={currentLevel} durationSeconds={gameDuration} difficulty={Math.max(1, game.difficulty)} onGameEnd={(score, won) => handleGameEnd(game.id, score, won)} />;
      case 'defender':
        return <TowerDefense level={currentLevel} durationSeconds={gameDuration} difficulty={Math.max(1, game.difficulty)} onGameEnd={(score, won) => handleGameEnd(game.id, score, won)} />;
      case 'hashcrack':
        return <HashCrack level={currentLevel} durationSeconds={gameDuration} difficulty={Math.max(1, game.difficulty)} onGameEnd={(score, won) => handleGameEnd(game.id, score, won)} />;
      case 'blockdrop':
        return <BlockDrop level={currentLevel} durationSeconds={gameDuration} difficulty={Math.max(1, game.difficulty)} onGameEnd={(score, won) => handleGameEnd(game.id, score, won)} />;
      case 'bitpuzzle':
        return <BitPuzzle level={currentLevel} durationSeconds={gameDuration} difficulty={Math.max(1, game.difficulty)} onGameEnd={(score, won) => handleGameEnd(game.id, score, won)} />;
      default:
        return <SnakeGame level={currentLevel} durationSeconds={gameDuration} difficulty={Math.max(1, game.difficulty)} onGameEnd={(score, won) => handleGameEnd(game.id, score, won)} />;
    }
  };

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    if (!game) return null;

    const canPlay = energy >= game.energyCost;

    return (
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => setSelectedGame(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Arcade
        </button>

        {/* Game Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-slate-700/50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{game.name}</h2>
              <p className="text-slate-400">{game.description}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                game.difficulty <= 2 ? 'bg-green-500/20 text-green-400' :
                game.difficulty <= 3 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                Difficulty: {game.difficulty}
              </span>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold capitalize">
                {game.type}
              </span>
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold">
                {gameDuration}s session
              </span>
            </div>
          </div>

          {!canPlay && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-4">
              <AlertCircle className="text-red-400" size={20} />
              <span className="text-red-400">Not enough energy! Need {game.energyCost} energy.</span>
            </div>
          )}
        </div>

        {/* Game Component */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
          {renderGameComponent(game)}
        </div>

        {/* Reward Notification */}
        {showReward && lastReward && (
          <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-yellow-300" size={24} />
                <span className="font-bold text-lg">Run Complete!</span>
              </div>
              <p className="text-white/90">+${lastReward.cash.toLocaleString()} reward</p>
              <p className="text-white/90">+{lastReward.xp} XP</p>
              <p className="text-white/90">+{lastReward.boostPercent.toFixed(2)}% mining power for 24h</p>
              {lastReward.parts && (
                <div className="mt-2 p-3 bg-white/20 rounded-lg">
                  <p className="text-sm text-white/80">Part Discovered!</p>
                  <p className="font-semibold">{lastReward.parts.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    lastReward.parts.rarity === 'legendary' ? 'bg-yellow-500/50' :
                    lastReward.parts.rarity === 'epic' ? 'bg-purple-500/50' :
                    lastReward.parts.rarity === 'rare' ? 'bg-blue-500/50' :
                    'bg-slate-500/50'
                  }`}>
                    {lastReward.parts.rarity}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* PC Info Panel */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-slate-700/50">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center text-6xl border-2 border-slate-600">
            🖥️
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              PC Power Machine / Level {user?.level || 1}
            </h2>
            <div className="space-y-2 text-slate-400 text-sm">
              <p>Power holding: 1 day</p>
              <p>PC Level Reset: Never</p>
              <p>Next PC level: After 10 win games</p>
              <p className="text-cyan-300 flex items-center gap-2 text-xs">
                <Sparkles size={14} className="text-cyan-400" />
                Active boosts: {activeBoosts.length}{' '}
                {activeBoosts.length > 0 && `(+${activeBoosts.reduce((sum, b) => sum + b.powerPercent, 0).toFixed(1)}% power)`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-slate-400 text-sm mb-3">By winning games, you have a chance to receive:</h3>
            <div className="flex flex-col gap-2 items-end">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Power</span>
                <span className="text-2xl">⚡</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Parts</span>
                <div className="flex gap-1">
                  <span className="text-xl">🔋</span>
                  <span className="text-xl">⚙️</span>
                  <span className="text-xl">🧩</span>
                  <span className="text-xl">🔌</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Energy Bar */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="text-yellow-400" size={20} />
            <span className="font-semibold text-white">Energy</span>
          </div>
          <span className="text-white font-bold font-mono text-sm">{energy.toFixed(0)} / {maxEnergy.toFixed(0)}</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all"
            style={{ width: `${(energy / Math.max(1, maxEnergy)) * 100}%` }}
          />
        </div>
      </div>

      {/* Games Grid */}
      <h2 className="text-2xl font-bold text-white mb-4">Play games to rise your power</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => setSelectedGame(game.id)}
            disabled={energy < game.energyCost}
            className="group bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed hover:transform hover:scale-[1.02]"
          >
            {/* Game Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center text-3xl border border-slate-600 group-hover:border-cyan-500/30 transition-colors">
                  {game.icon}
                </div>
                {/* Difficulty Badge */}
                <span className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                  game.difficulty <= 2 ? 'bg-green-500 text-white' :
                  game.difficulty <= 3 ? 'bg-yellow-500 text-black' :
                  'bg-red-500 text-white'
                }`}>
                  {game.difficulty}
                </span>
              </div>
              
              {/* Tags */}
              <div className="flex flex-col gap-1 items-end">
                {game.id === 'coinclick' && (
                  <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded font-bold">NEW</span>
                )}
                {game.id === 'flappyrocket' && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded font-bold">HOT</span>
                )}
                {game.id === 'snake' && (
                  <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded font-bold">POPULAR</span>
                )}
              </div>
            </div>

            {/* Game Info */}
            <h3 className="font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
              {game.name}
            </h3>
            <p className="text-slate-400 text-sm mb-3 line-clamp-2">{game.description}</p>
            
            {/* Difficulty Bar */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-slate-500">difficulty:</span>
              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    game.difficulty <= 2 ? 'bg-green-500 w-1/3' :
                    game.difficulty <= 3 ? 'bg-yellow-500 w-2/3' :
                    'bg-red-500 w-full'
                  }`}
                />
              </div>
            </div>

            {/* Start Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Zap size={12} className={energy >= game.energyCost ? 'text-yellow-400' : 'text-red-400'} />
                <span>{game.energyCost} energy</span>
              </div>
              <span className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold rounded-lg group-hover:from-cyan-400 group-hover:to-blue-400 transition-all flex items-center gap-2">
                <span className="text-lg">▶</span>
                START
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Games;
