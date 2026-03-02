import { useState, useEffect, useRef } from 'react';

interface SpaceDefenderProps {
  difficulty: number;
  level: number;
  durationSeconds: number;
  onGameEnd: (score: number, won: boolean) => void;
}

export default function SpaceDefender({ difficulty, level, durationSeconds, onGameEnd }: SpaceDefenderProps) {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [playerX, setPlayerX] = useState(50);
  const [bullets, setBullets] = useState<{ x: number; y: number }[]>([]);
  const [enemies, setEnemies] = useState<{ x: number; y: number; type: number }[]>([]);
  const [powerUps, setPowerUps] = useState<{ x: number; y: number; type: number }[]>([]);
  const gameLoopRef = useRef<number | null>(null);
  const lastShotRef = useRef(0);
  const lastEnemySpawnRef = useRef(0);
  const lastPowerUpSpawnRef = useRef(0);

  const targetScore = Math.floor(200 + level * 100 + difficulty * 50);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPlayerX(prev => Math.max(5, prev - 10));
      if (e.key === 'ArrowRight') setPlayerX(prev => Math.min(95, prev + 10));
      if (e.key === ' ' || e.key === 'ArrowUp') {
        const now = Date.now();
        if (now - lastShotRef.current > 200) {
          setBullets(prev => [...prev, { x: playerX, y: 85 }]);
          lastShotRef.current = now;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, playerX]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('gameover');
          onGameEnd(score, score >= targetScore);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, score, targetScore, onGameEnd]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      const now = Date.now();

      // Spawn enemies
      if (now - lastEnemySpawnRef.current > Math.max(500, 2000 - level * 100 - difficulty * 200)) {
        setEnemies(prev => [...prev, {
          x: Math.random() * 90 + 5,
          y: 5,
          type: Math.floor(Math.random() * 3)
        }]);
        lastEnemySpawnRef.current = now;
      }

      // Spawn power-ups
      if (now - lastPowerUpSpawnRef.current > 10000) {
        setPowerUps(prev => [...prev, {
          x: Math.random() * 90 + 5,
          y: 5,
          type: Math.floor(Math.random() * 2)
        }]);
        lastPowerUpSpawnRef.current = now;
      }

      // Update bullets
      setBullets(prev => prev
        .map(b => ({ ...b, y: b.y - 2 }))
        .filter(b => b.y > 0)
      );

      // Update enemies
      setEnemies(prev => prev
        .map(e => ({ ...e, y: e.y + 0.3 + level * 0.05 + difficulty * 0.1 }))
        .filter(e => e.y < 100)
      );

      // Update power-ups
      setPowerUps(prev => prev
        .map(p => ({ ...p, y: p.y + 0.5 }))
        .filter(p => p.y < 100)
      );

      // Check collisions
      setBullets(prevBullets => {
        const remainingBullets: { x: number; y: number }[] = [];
        prevBullets.forEach(bullet => {
          let hit = false;
          setEnemies(prevEnemies => {
            const remaining: { x: number; y: number; type: number }[] = [];
            prevEnemies.forEach(enemy => {
              if (!hit && Math.abs(bullet.x - enemy.x) < 5 && Math.abs(bullet.y - enemy.y) < 5) {
                hit = true;
                setScore(s => s + 10 + enemy.type * 5);
              } else {
                remaining.push(enemy);
              }
            });
            return remaining;
          });
          if (!hit) remainingBullets.push(bullet);
        });
        return remainingBullets;
      });

      // Check power-up collisions
      setPowerUps(prev => {
        const remaining: { x: number; y: number; type: number }[] = [];
        prev.forEach(p => {
          if (Math.abs(p.x - playerX) < 5 && Math.abs(p.y - 85) < 5) {
            if (p.type === 0) {
              setLives(l => Math.min(5, l + 1));
            } else {
              setScore(s => s + 50);
            }
          } else {
            remaining.push(p);
          }
        });
        return remaining;
      });

      // Check enemy collisions
      setEnemies(prev => {
        const remaining: { x: number; y: number; type: number }[] = [];
        prev.forEach(enemy => {
          if (Math.abs(enemy.x - playerX) < 5 && Math.abs(enemy.y - 85) < 5) {
            setLives(l => {
              const newLives = l - 1;
              if (newLives <= 0) {
                setGameState('gameover');
                onGameEnd(score, score >= targetScore);
              }
              return newLives;
            });
          } else if (enemy.y > 95) {
            setLives(l => {
              const newLives = l - 1;
              if (newLives <= 0) {
                setGameState('gameover');
                onGameEnd(score, score >= targetScore);
              }
              return newLives;
            });
          } else {
            remaining.push(enemy);
          }
        });
        return remaining;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, playerX, score, targetScore, level, difficulty, onGameEnd]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setTimeLeft(durationSeconds);
    setPlayerX(50);
    setBullets([]);
    setEnemies([]);
    setPowerUps([]);
    lastShotRef.current = 0;
    lastEnemySpawnRef.current = 0;
    lastPowerUpSpawnRef.current = 0;
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 rounded-xl overflow-hidden border-2 border-purple-500/50">
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Game canvas overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        {gameState === 'menu' && (
          <div className="text-center z-10">
            <h2 className="text-4xl font-bold text-white mb-4">🚀 Space Defender</h2>
            <p className="text-cyan-300 mb-2">Level {level} - Target: {targetScore} points</p>
            <p className="text-gray-300 mb-4">Use Arrow Keys to move, Space to shoot</p>
            <p className="text-yellow-300 mb-4">Collect power-ups and destroy enemies!</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all transform hover:scale-105"
            >
              START MISSION
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <>
            {/* HUD */}
            <div className="absolute top-2 left-2 right-2 flex justify-between text-white z-10">
              <div className="bg-black/50 px-3 py-1 rounded">🎯 {score}/{targetScore}</div>
              <div className="bg-black/50 px-3 py-1 rounded">❤️ {'❤️'.repeat(lives)}</div>
              <div className="bg-black/50 px-3 py-1 rounded">⏱️ {timeLeft}s</div>
            </div>

            {/* Player ship */}
            <div
              className="absolute text-3xl transition-all duration-100"
              style={{
                left: `${playerX}%`,
                top: '85%',
                transform: 'translateX(-50%)'
              }}
            >
              🚀
            </div>

            {/* Bullets */}
            {bullets.map((b, i) => (
              <div
                key={i}
                className="absolute w-2 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  transform: 'translateX(-50%)'
                }}
              />
            ))}

            {/* Enemies */}
            {enemies.map((e, i) => (
              <div
                key={i}
                className="absolute text-xl transition-all duration-100"
                style={{
                  left: `${e.x}%`,
                  top: `${e.y}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                {e.type === 0 ? '👾' : e.type === 1 ? '🛸' : '🤖'}
              </div>
            ))}

            {/* Power-ups */}
            {powerUps.map((p, i) => (
              <div
                key={i}
                className="absolute text-xl animate-bounce"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                {p.type === 0 ? '💚' : '⚡'}
              </div>
            ))}
          </>
        )}

        {gameState === 'gameover' && (
          <div className="text-center z-10">
            <h2 className={`text-4xl font-bold mb-4 ${score >= targetScore ? 'text-green-400' : 'text-red-400'}`}>
              {score >= targetScore ? '🏆 MISSION COMPLETE!' : '💥 MISSION FAILED!'}
            </h2>
            <p className="text-white text-2xl mb-2">Final Score: {score}</p>
            <p className="text-cyan-300 mb-4">Target: {targetScore}</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-cyan-600 transition-all transform hover:scale-105"
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Mobile controls */}
      {gameState === 'playing' && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
          <button
            onTouchStart={() => setPlayerX(prev => Math.max(5, prev - 10))}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl active:bg-white/40"
          >
            ←
          </button>
          <button
            onTouchStart={() => {
              const now = Date.now();
              if (now - lastShotRef.current > 200) {
                setBullets(prev => [...prev, { x: playerX, y: 85 }]);
                lastShotRef.current = now;
              }
            }}
            className="w-16 h-16 bg-cyan-500/50 rounded-full flex items-center justify-center text-white text-2xl active:bg-cyan-500/70"
          >
            🔫
          </button>
          <button
            onTouchStart={() => setPlayerX(prev => Math.min(95, prev + 10))}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl active:bg-white/40"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
