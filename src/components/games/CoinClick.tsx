import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RotateCcw, Timer } from 'lucide-react';

interface CoinClickProps {
  onGameEnd: (score: number, won: boolean) => void;
  difficulty?: number;
  level?: number;
  durationSeconds?: number;
}

type ItemType = 'coin' | 'bomb';

interface FallingItem {
  id: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  type: ItemType;
  size: number; // px
  speedY: number; // percentage per tick
  value: number; // only for coins
}

const CoinClick: React.FC<CoinClickProps> = ({
  onGameEnd,
  difficulty = 1,
  level = 1,
  durationSeconds = 60,
}) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [wizardX, setWizardX] = useState(0.5); // 0-1 fraction
  const [reason, setReason] = useState<'time' | 'bomb' | 'none'>('none');
  const [resultMessage, setResultMessage] = useState<string>('');
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('coinClickHighScore');
    return saved ? Number(saved) : 0;
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const nextItemId = useRef(1);
  const hasEndedRef = useRef(false);
  const wizardXRef = useRef(0.5);
  const wizardDirRef = useRef<1 | -1>(1);

  const levelFactor = Math.max(1, level);
  const GAME_DURATION = Math.max(30, Math.min(120, durationSeconds));

  // Target score is intentionally easy and scales gently with level
  const TARGET_SCORE = 20 + levelFactor * 15;

  // Difficulty curves (kept gentle so the game is fun and not punishing)
  const spawnInterval = Math.max(750, 1300 - levelFactor * 70 - difficulty * 40); // ms
  const baseFallSpeed = 0.6 + levelFactor * 0.08 + difficulty * 0.05; // percentage per tick
  const bombChance = Math.min(0.35, 0.12 + (levelFactor - 1) * 0.025 + difficulty * 0.02);

  const resetGameState = useCallback(() => {
    hasEndedRef.current = false;
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setItems([]);
    setReason('none');
    setResultMessage('');
    nextItemId.current = 1;
    wizardXRef.current = 0.5;
    wizardDirRef.current = Math.random() > 0.5 ? 1 : -1;
    setWizardX(0.5);
  }, [GAME_DURATION]);

  const finalizeGame = useCallback(
    (finalScore: number, cause: 'time' | 'bomb') => {
      if (hasEndedRef.current) return;
      hasEndedRef.current = true;

      const won = cause === 'time' && finalScore >= TARGET_SCORE;

      setGameState('gameOver');
      setItems([]);
      setReason(cause);
      setResultMessage(
        won
          ? 'Level cleared!'
          : cause === 'bomb'
          ? 'You tapped a bomb!'
          : 'Time is up!'
      );

      if (finalScore > highScore) {
        setHighScore(finalScore);
        localStorage.setItem('coinClickHighScore', String(finalScore));
      }

      onGameEnd(finalScore, won);
    },
    [TARGET_SCORE, highScore, onGameEnd]
  );

  const startGame = useCallback(() => {
    resetGameState();
    setGameState('playing');
  }, [resetGameState]);

  // Global timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const id = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finalizeGame(score, 'time');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [gameState, finalizeGame, score]);

  // Wizard movement + falling items
  useEffect(() => {
    if (gameState !== 'playing') return;

    const tickMs = 50; // 20 fps
    const id = window.setInterval(() => {
      // Wizard moves smoothly left/right with some randomness
      const speedFrac = 0.01 + levelFactor * 0.002;
      let x = wizardXRef.current;
      let dir = wizardDirRef.current;

      x += dir * speedFrac;

      if (x < 0.08) {
        x = 0.08;
        dir = 1;
      } else if (x > 0.92) {
        x = 0.92;
        dir = -1;
      } else if (Math.random() < 0.03) {
        // occasional random direction switch
        dir = dir === 1 ? -1 : 1;
      }

      wizardXRef.current = x;
      wizardDirRef.current = dir;
      setWizardX(x);

      // Move items downward
      setItems(prev =>
        prev
          .map(item => ({ ...item, y: item.y + item.speedY }))
          .filter(item => item.y < 120) // remove once they leave the screen
      );
    }, tickMs);

    return () => window.clearInterval(id);
  }, [gameState, levelFactor]);

  // Spawn coins & bombs falling from the wizard
  useEffect(() => {
    if (gameState !== 'playing') return;

    const id = window.setInterval(() => {
      const baseX = wizardXRef.current * 100;
      const jitter = (Math.random() - 0.5) * 12; // small horizontal spread around wizard
      const spawnX = Math.max(8, Math.min(92, baseX + jitter));

      const isBomb = Math.random() < bombChance;
      const size = isBomb ? 40 : 34;
      const value = isBomb ? 0 : 5 + Math.floor(Math.random() * 6);

      const newItem: FallingItem = {
        id: nextItemId.current++,
        x: spawnX,
        y: 20, // just below the wizard
        type: isBomb ? 'bomb' : 'coin',
        size,
        speedY: baseFallSpeed,
        value,
      };

      setItems(prev => [...prev, newItem]);
    }, spawnInterval);

    return () => window.clearInterval(id);
  }, [gameState, spawnInterval, baseFallSpeed, bombChance]);

  const handleBackgroundClick = () => {
    // no penalty for missed clicks in this version to keep it casual
  };

  const handleItemClick = (item: FallingItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameState !== 'playing') return;

    if (item.type === 'bomb') {
      finalizeGame(score, 'bomb');
      return;
    }

    setItems(prev => prev.filter(i => i.id !== item.id));
    setScore(prev => prev + item.value);
  };

  const levelLabel = `Level ${levelFactor}`;

  return (
    <div className="relative">
      {/* Game Area */}
      <div
        ref={containerRef}
        className="relative h-96 rounded-xl overflow-hidden bg-gradient-to-b from-orange-500/50 via-slate-800 to-slate-950 shadow-xl border border-slate-700/80"
        onClick={handleBackgroundClick}
      >
        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/60 via-orange-400/20 to-transparent pointer-events-none" />

        {/* Brick wall */}
        <div
          className="absolute inset-x-0 bottom-10 top-24 opacity-90"
          style={{
            backgroundImage:
              'linear-gradient(#3b3346 1px, transparent 1px), linear-gradient(90deg, #3b3346 1px, transparent 1px)',
            backgroundSize: '32px 24px',
            backgroundColor: '#272334',
          }}
        />

        {/* Ground */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700" />

        {/* HUD */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 text-xs">
          <div className="flex gap-3">
            <div className="px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 flex items-center gap-2 shadow-md">
              <span className="text-amber-300 text-lg">🪙</span>
              <div>
                <div className="text-[10px] uppercase tracking-wide text-slate-400">Score</div>
                <div className="text-lg font-bold text-amber-300">{score}</div>
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-slate-900/70 border border-indigo-600/70 flex items-center gap-2 shadow-md">
              <span className="text-purple-300 text-lg">🌀</span>
              <div>
                <div className="text-[10px] uppercase tracking-wide text-slate-400">Stage</div>
                <div className="text-sm font-semibold text-purple-200">{levelLabel}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-lg bg-slate-900/80 border border-cyan-500/70 flex items-center gap-2 shadow-md">
              <Timer size={16} className={timeLeft <= 5 ? 'text-red-400' : 'text-cyan-300'} />
              <div>
                <div className="text-[10px] uppercase tracking-wide text-slate-400">Time</div>
                <div
                  className={`text-lg font-bold ${
                    timeLeft <= 5 ? 'text-red-400' : 'text-cyan-200'
                  }`}
                >
                  {timeLeft}s
                </div>
              </div>
            </div>

            <div className="px-3 py-2 rounded-lg bg-slate-900/70 border border-emerald-500/70 text-right shadow-md">
              <div className="text-[10px] uppercase tracking-wide text-slate-400">Target</div>
              <div className="text-sm font-semibold text-emerald-300">{TARGET_SCORE}</div>
            </div>
          </div>
        </div>

        {/* Wizard */}
        <div className="absolute top-14 left-0 right-0 z-10 pointer-events-none">
          <div className="relative w-full" style={{ height: '72px' }}>
            <div
              className="absolute -top-2 transform -translate-x-1/2 transition-transform duration-75"
              style={{ left: `${wizardX * 100}%` }}
            >
              <div className="w-20 h-20 rounded-full bg-slate-900/90 border border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.6)] flex flex-col items-center justify-center">
                <div className="text-3xl mb-1 select-none">🧙‍♂️</div>
                <div className="text-[10px] font-semibold tracking-wide text-purple-200 uppercase">
                  Coin Mage
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Falling coins & bombs */}
        {items.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={e => handleItemClick(item, e)}
            className="absolute rounded-full flex items-center justify-center shadow-lg border border-white/20 hover:scale-110 active:scale-95 transition-transform"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: item.size,
              height: item.size,
              transform: 'translate(-50%, -50%)',
              background:
                item.type === 'coin'
                  ? 'radial-gradient(circle at 30% 30%, #fef3c7, #fbbf24, #b45309)'
                  : 'radial-gradient(circle at 30% 30%, #f9fafb, #111827, #020617)',
            }}
          >
            <span className="text-xl select-none">{item.type === 'coin' ? '🟡' : '💣'}</span>
          </button>
        ))}

        {/* Start screen */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-30">
            <div className="text-6xl mb-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">🧙‍♂️</div>
            <h2 className="text-3xl font-extrabold text-amber-300 tracking-wide mb-2">
              Coinclick Wizard
            </h2>
            <p className="text-slate-300 text-sm mb-1">Catch the falling coins.</p>
            <p className="text-slate-400 text-xs mb-4">But beware of the bombs!</p>
            <button
              type="button"
              onClick={startGame}
              className="mt-2 inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-900 font-bold shadow-[0_0_25px_rgba(251,191,36,0.8)] hover:shadow-[0_0_35px_rgba(251,191,36,1)] hover:scale-105 active:scale-95 transition-transform"
            >
              <span className="text-lg">▶</span>
              <span>START LEVEL</span>
            </button>
            <div className="mt-4 text-xs text-slate-400">
              High Score: <span className="font-semibold text-amber-300">{highScore}</span>
            </div>
          </div>
        )}

        {/* Game over overlay */}
        {gameState === 'gameOver' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm z-30">
            <div className="text-5xl mb-3">
              {reason === 'bomb' ? '💣' : score >= TARGET_SCORE ? '🏆' : '🤔'}
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{resultMessage}</h3>
            <p className="text-sm text-slate-400 mb-4">
              Score {score} / Target {TARGET_SCORE}
            </p>
            <div className="flex gap-4 mb-6 text-xs">
              <div className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-center min-w-[110px]">
                <div className="text-slate-400">Final Score</div>
                <div className="text-lg font-bold text-amber-300">{score}</div>
              </div>
              <div className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-center min-w-[110px]">
                <div className="text-slate-400">Best Run</div>
                <div className="text-lg font-bold text-emerald-300">{highScore}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={startGame}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-900 font-bold shadow-[0_0_25px_rgba(251,191,36,0.8)] hover:shadow-[0_0_35px_rgba(251,191,36,1)] hover:scale-105 active:scale-95 transition-transform"
            >
              <RotateCcw size={18} />
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-slate-300">
        <h4 className="text-sm font-semibold text-white mb-2">How to play Coinclick Wizard</h4>
        <ul className="space-y-1 list-disc list-inside">
          <li>Tap the glowing coins as they fall from the wizard to earn points.</li>
          <li>
            Avoid the <span className="text-red-400 font-semibold">bombs</span>; if you tap one, the run ends instantly.
          </li>
          <li>Each level gently increases speed, bomb chance, and the target score.</li>
          <li>The game is tuned to stay casual and winnable even on higher levels.</li>
        </ul>
      </div>
    </div>
  );
};

export default CoinClick;
