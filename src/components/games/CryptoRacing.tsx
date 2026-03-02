import React, { useState, useEffect, useRef } from 'react';

interface CryptoRacingProps {
  level: number;
  durationSeconds: number;
  difficulty: number;
  onGameEnd: (score: number, won: boolean) => void;
}

interface Obstacle {
  x: number;
  y: number;
  type: 'coin' | 'rock' | 'enemy';
  width: number;
  height: number;
}

const CryptoRacing: React.FC<CryptoRacingProps> = ({ level, durationSeconds, difficulty, onGameEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [started, setStarted] = useState(false);
  const [playerX, setPlayerX] = useState(150);
  
  const gameLoopRef = useRef<number | null>(null);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const speedRef = useRef<number>(3 + level * 0.5);
  const targetScoreRef = useRef<number>(100 + level * 50);

  useEffect(() => {
    targetScoreRef.current = 100 + level * 50;
    speedRef.current = 3 + level * 0.5 + (difficulty * 0.3);
  }, [level, difficulty]);

  const initializeGame = () => {
    setPlayerX(150);
    setScore(0);
    setTimeLeft(durationSeconds);
    setGameOver(false);
    setGameWon(false);
    setStarted(true);
    obstaclesRef.current = [];
    keysRef.current = {};
  };

  useEffect(() => {
    if (!started || gameOver || gameWon) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [started, gameOver, gameWon]);

  useEffect(() => {
    if (!started || gameOver || gameWon) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1f2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw road
      ctx.fillStyle = '#2d3748';
      ctx.fillRect(50, 0, 200, canvas.height);
      
      // Draw road lines
      ctx.strokeStyle = '#4a5568';
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(150, 0);
      ctx.lineTo(150, canvas.height);
      ctx.stroke();

      // Update player position
      if (keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) {
        setPlayerX(prev => Math.max(60, prev - 5));
      }
      if (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) {
        setPlayerX(prev => Math.min(240, prev + 5));
      }

      // Draw player car
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(playerX - 20, canvas.height - 80, 40, 60);
      
      // Car details
      ctx.fillStyle = '#0891b2';
      ctx.fillRect(playerX - 15, canvas.height - 70, 30, 40);
      
      // Windows
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(playerX - 12, canvas.height - 65, 24, 20);

      // Spawn obstacles
      if (Math.random() < 0.02 * difficulty) {
        const types: ('coin' | 'rock' | 'enemy')[] = ['coin', 'coin', 'coin', 'rock', 'enemy'];
        const type = types[Math.floor(Math.random() * types.length)];
        const lane = Math.floor(Math.random() * 3);
        const laneX = 80 + lane * 60;
        
        obstaclesRef.current.push({
          x: laneX,
          y: -50,
          type,
          width: type === 'coin' ? 30 : 40,
          height: type === 'coin' ? 30 : 40,
        });
      }

      // Update and draw obstacles
      obstaclesRef.current = obstaclesRef.current.filter(obs => {
        obs.y += speedRef.current;

        // Draw obstacle
        if (obs.type === 'coin') {
          // Draw coin
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Check collision
          if (
            playerX - 20 < obs.x + obs.width &&
            playerX + 20 > obs.x &&
            canvas.height - 80 < obs.y + obs.height &&
            canvas.height - 20 > obs.y
          ) {
            setScore(prev => prev + 10);
            return false;
          }
        } else if (obs.type === 'rock') {
          // Draw rock
          ctx.fillStyle = '#6b7280';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          
          ctx.fillStyle = '#4b5563';
          ctx.fillRect(obs.x + 5, obs.y + 5, obs.width - 10, obs.height - 10);
          
          // Check collision
          if (
            playerX - 20 < obs.x + obs.width &&
            playerX + 20 > obs.x &&
            canvas.height - 80 < obs.y + obs.height &&
            canvas.height - 20 > obs.y
          ) {
            setGameOver(true);
            setTimeout(() => onGameEnd(score, false), 500);
            return false;
          }
        } else {
          // Draw enemy car
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(obs.x, obs.y, obs.width, 50);
          
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(obs.x + 5, obs.y + 5, obs.width - 10, 40);
          
          // Check collision
          if (
            playerX - 20 < obs.x + obs.width &&
            playerX + 20 > obs.x &&
            canvas.height - 80 < obs.y + 50 &&
            canvas.height - 20 > obs.y
          ) {
            setGameOver(true);
            setTimeout(() => onGameEnd(score, false), 500);
            return false;
          }
        }

        return obs.y < canvas.height;
      });

      // Draw score
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`Score: ${score}`, 10, 30);
      ctx.fillText(`Target: ${targetScoreRef.current}`, 10, 55);

      // Check win condition
      if (score >= targetScoreRef.current && !gameWon) {
        setGameWon(true);
        setTimeout(() => onGameEnd(score, true), 500);
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [started, gameOver, gameWon, playerX, score, difficulty, onGameEnd]);

  useEffect(() => {
    if (!started || gameOver || gameWon) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          setTimeout(() => onGameEnd(score, false), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, gameOver, gameWon, score, onGameEnd]);

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-6xl mb-4">🏎️</div>
        <h2 className="text-2xl font-bold text-white mb-2">Crypto Racing</h2>
        <p className="text-gray-400 text-center mb-6">
          Race and collect coins! Avoid rocks and enemy cars. Use Left/Right arrows or A/D.
        </p>
        <button
          onClick={initializeGame}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all"
        >
          Start Race
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <div className="bg-slate-800 rounded-lg px-4 py-2">
            <div className="text-xs text-gray-400">Score</div>
            <div className="text-xl font-bold text-white">{score}</div>
          </div>
          <div className="bg-slate-800 rounded-lg px-4 py-2">
            <div className="text-xs text-gray-400">Target</div>
            <div className="text-xl font-bold text-cyan-400">{targetScoreRef.current}</div>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-lg ${timeLeft <= 10 ? 'bg-red-500/20' : 'bg-slate-800'}`}>
          <div className="text-xs text-gray-400">Time</div>
          <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={300}
          height={500}
          className="border-2 border-slate-700 rounded-lg bg-slate-900"
        />
      </div>

      {/* Controls */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm mb-2">Use Left/Right Arrows or A/D to move</p>
        <div className="flex justify-center gap-4">
          <button
            onTouchStart={() => keysRef.current['ArrowLeft'] = true}
            onTouchEnd={() => keysRef.current['ArrowLeft'] = false}
            onMouseDown={() => keysRef.current['ArrowLeft'] = true}
            onMouseUp={() => keysRef.current['ArrowLeft'] = false}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            ← Left
          </button>
          <button
            onTouchStart={() => keysRef.current['ArrowRight'] = true}
            onTouchEnd={() => keysRef.current['ArrowRight'] = false}
            onMouseDown={() => keysRef.current['ArrowRight'] = true}
            onMouseUp={() => keysRef.current['ArrowRight'] = false}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            Right →
          </button>
        </div>
      </div>

      {/* Game Over / Win Overlay */}
      {(gameOver || gameWon) && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-8 text-center max-w-md">
            <div className="text-6xl mb-4">
              {gameWon ? '🏆' : '💥'}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {gameWon ? 'Victory!' : 'Crashed!'}
            </h2>
            <p className="text-gray-400 mb-4">
              {gameWon 
                ? `Amazing race! You collected ${score} coins!` 
                : `Game over! Final score: ${score}`}
            </p>
            <div className="text-2xl font-bold text-cyan-400 mb-6">
              Score: {score}
            </div>
            <button
              onClick={initializeGame}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all"
            >
              Race Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoRacing;
