import React, { useEffect, useRef, useState } from 'react';

interface PixelJumperProps {
  level: number;
  durationSeconds: number;
  difficulty: number;
  onGameEnd: (score: number, won: boolean) => void;
}

const PixelJumper: React.FC<PixelJumperProps> = ({ level, durationSeconds, difficulty: _difficulty, onGameEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  // Game Constants
  const GRAVITY = 0.5;
  const JUMP_FORCE = -10;
  const PLAYER_SIZE = 30;
  const PLATFORM_HEIGHT = 20;

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let player = {
      x: 50,
      y: canvas.height - PLAYER_SIZE - 50,
      vx: 0,
      vy: 0,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      grounded: false
    };

    let platforms = [
      { x: 0, y: canvas.height - 40, width: canvas.width, height: 40 },
      { x: 200, y: canvas.height - 120, width: 150, height: PLATFORM_HEIGHT },
      { x: 450, y: canvas.height - 200, width: 150, height: PLATFORM_HEIGHT },
      { x: 100, y: canvas.height - 280, width: 150, height: PLATFORM_HEIGHT },
      { x: 400, y: canvas.height - 360, width: 200, height: PLATFORM_HEIGHT },
    ];

    let coins = [
      { x: 250, y: canvas.height - 150, radius: 10, collected: false },
      { x: 500, y: canvas.height - 230, radius: 10, collected: false },
      { x: 150, y: canvas.height - 310, radius: 10, collected: false },
      { x: 450, y: canvas.height - 400, radius: 10, collected: false },
    ];

    let keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => { keys[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationFrameId: number;

    const gameLoop = () => {
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Input
      if (keys['ArrowLeft'] || keys['KeyA']) player.vx = -5;
      else if (keys['ArrowRight'] || keys['KeyD']) player.vx = 5;
      else player.vx = 0;

      if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && player.grounded) {
        player.vy = JUMP_FORCE;
        player.grounded = false;
      }

      // Physics
      player.vy += GRAVITY;
      player.x += player.vx;
      player.y += player.vy;

      // Bound checking
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
      if (player.y > canvas.height) {
         setGameState('gameover');
         return;
      }

      player.grounded = false;
      platforms.forEach(p => {
        if (
          player.x < p.x + p.width &&
          player.x + player.width > p.x &&
          player.y + player.height > p.y &&
          player.y + player.height < p.y + p.height + player.vy
        ) {
          player.grounded = true;
          player.vy = 0;
          player.y = p.y - player.height;
        }

        // Draw Platform
        ctx.fillStyle = '#334155';
        ctx.fillRect(p.x, p.y, p.width, p.height);
        ctx.strokeStyle = '#64748b';
        ctx.strokeRect(p.x, p.y, p.width, p.height);
      });

      // Coins
      coins.forEach(c => {
        if (!c.collected) {
           const dx = (player.x + player.width/2) - c.x;
           const dy = (player.y + player.height/2) - c.y;
           const dist = Math.sqrt(dx*dx + dy*dy);
           if (dist < player.width/2 + c.radius) {
             c.collected = true;
             setScore(s => s + 100);
           }

           // Draw Coin
           ctx.beginPath();
           ctx.arc(c.x, c.y, c.radius, 0, Math.PI*2);
           ctx.fillStyle = '#f59e0b';
           ctx.fill();
           ctx.strokeStyle = '#fbbf24';
           ctx.lineWidth = 2;
           ctx.stroke();
           ctx.closePath();
        }
      });

      // Draw Player
      ctx.fillStyle = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#06b6d4';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setGameState('gameover');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'gameover') {
      const targetScore = 300 + level * 50;
      onGameEnd(score, score >= targetScore);
    }
  }, [gameState]);

  return (
    <div className="relative w-full h-[500px] bg-slate-900 overflow-hidden">
      <canvas ref={canvasRef} width={800} height={500} className="w-full h-full" />
      
      {gameState === 'start' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
          <h3 className="text-4xl font-bold text-cyan-400 mb-4 neon-text">Pixel Jumper</h3>
          <p className="text-white mb-6 text-center max-w-md px-4">Jump across platforms and collect coins. Don't fall!</p>
          <button 
            onClick={() => setGameState('playing')}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            START RUN
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <span className="text-gray-400 text-xs uppercase block">Score</span>
            <span className="text-white font-mono text-xl">{score}</span>
          </div>
          <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <span className="text-gray-400 text-xs uppercase block">Time</span>
            <span className={`font-mono text-xl ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-10">
          <h3 className="text-4xl font-bold text-white mb-2">Run Complete</h3>
          <div className="text-cyan-400 text-2xl font-mono mb-6">{score} pts</div>
          <button 
            onClick={() => {
              setGameState('start');
              setScore(0);
              setTimeLeft(durationSeconds);
            }}
            className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
};

export default PixelJumper;
