import React, { useState, useEffect, useRef, useCallback } from 'react';

interface FlappyRocketProps {
  level?: number;
  difficulty?: number;
  durationSeconds?: number;
  onGameEnd?: (score: number, won: boolean) => void;
  onPlayPause?: (isPlaying: boolean) => void;
}

const FlappyRocket: React.FC<FlappyRocketProps> = ({ 
  level = 1,
  difficulty = 1,
  durationSeconds = 60,
  onGameEnd = (_s: number, _w: boolean) => {},
  onPlayPause = (_p: boolean) => {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'paused' | 'gameover'>('waiting');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const [isMuted, setIsMuted] = useState(false);

  // Calculate difficulty based on level (easier at lower levels)
  const levelMultiplier = Math.max(0.5, 1 - (10 - level) * 0.05);
  
  // Game constants - Easier settings that get harder with level
  const GRAVITY = 0.15 * levelMultiplier;
  const JUMP_STRENGTH = -3.5;
  const PIPE_SPEED = 1.4 * (1 + (level - 1) * 0.08) * (1 + (difficulty - 1) * 0.05);
  const PIPE_SPAWN_RATE = 2500 - (level - 1) * 150;
  const PIPE_GAP = Math.max(180, 220 - (level - 1) * 4);
  const PIPE_WIDTH = 70;
  const ROCKET_SIZE = 35;
  const ROCKET_X = 100;

  const rocketY = useRef(300);
  const rocketVelocity = useRef(0);
  const pipes = useRef<Array<{ x: number; gapY: number; passed: boolean }>>([]);
  const lastPipeSpawn = useRef(0);

  const resetGame = useCallback(() => {
    rocketY.current = 300;
    rocketVelocity.current = 0;
    pipes.current = [];
    lastPipeSpawn.current = 0;
    setScore(0);
    setTimeLeft(durationSeconds);
    setGameState('waiting');
  }, [durationSeconds]);

  const jump = useCallback(() => {
    if (gameState === 'waiting') {
      setGameState('playing');
      onPlayPause(true);
    } else if (gameState === 'playing') {
      rocketVelocity.current = JUMP_STRENGTH;
    } else if (gameState === 'paused') {
      setGameState('playing');
      onPlayPause(true);
    }
  }, [gameState, onPlayPause]);

  const togglePause = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
      onPlayPause(false);
    } else if (gameState === 'paused') {
      setGameState('playing');
      onPlayPause(true);
    }
  }, [gameState, onPlayPause]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      jump();
    }
    if (e.code === 'KeyP') {
      e.preventDefault();
      togglePause();
    }
  }, [jump, togglePause]);

  const handleClick = useCallback(() => {
    jump();
  }, [jump]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const won = score >= 4 + level;
          setGameState('gameover');
          onPlayPause(false);
          onGameEnd(score, won);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, level, onGameEnd, onPlayPause, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawRocket = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      const rocketGradient = ctx.createLinearGradient(-ROCKET_SIZE/2, 0, ROCKET_SIZE/2, 0);
      rocketGradient.addColorStop(0, '#f97316');
      rocketGradient.addColorStop(0.5, '#fb923c');
      rocketGradient.addColorStop(1, '#fdba74');
      
      ctx.fillStyle = rocketGradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, ROCKET_SIZE/2, ROCKET_SIZE/3, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(ROCKET_SIZE/2 - 5, 0);
      ctx.lineTo(ROCKET_SIZE/2 + 10, 0);
      ctx.lineTo(ROCKET_SIZE/2 - 5, -8);
      ctx.lineTo(ROCKET_SIZE/2 - 5, 8);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(-ROCKET_SIZE/2 + 5, -ROCKET_SIZE/3);
      ctx.lineTo(-ROCKET_SIZE/2 - 5, -ROCKET_SIZE/2);
      ctx.lineTo(-ROCKET_SIZE/2 + 10, -ROCKET_SIZE/3);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-ROCKET_SIZE/2 + 5, ROCKET_SIZE/3);
      ctx.lineTo(-ROCKET_SIZE/2 - 5, ROCKET_SIZE/2);
      ctx.lineTo(-ROCKET_SIZE/2 + 10, ROCKET_SIZE/3);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(ROCKET_SIZE/4, -5, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(ROCKET_SIZE/4 + 2, -7, 3, 0, Math.PI * 2);
      ctx.fill();

      if (rocketVelocity.current < 0 && gameState === 'playing') {
        const flameLength = Math.abs(rocketVelocity.current) * 8;
        const flameGradient = ctx.createLinearGradient(-ROCKET_SIZE/2 - flameLength, 0, -ROCKET_SIZE/2, 0);
        flameGradient.addColorStop(0, 'rgba(255, 100, 0, 0)');
        flameGradient.addColorStop(0.5, 'rgba(255, 200, 0, 0.8)');
        flameGradient.addColorStop(1, 'rgba(255, 100, 0, 1)');
        
        ctx.fillStyle = flameGradient;
        ctx.beginPath();
        ctx.moveTo(-ROCKET_SIZE/2, 0);
        ctx.quadraticCurveTo(-ROCKET_SIZE/2 - flameLength, -10, -ROCKET_SIZE/2 - flameLength - 10, 0);
        ctx.quadraticCurveTo(-ROCKET_SIZE/2 - flameLength, 10, -ROCKET_SIZE/2, 0);
        ctx.fill();
      }

      ctx.restore();
    };

    const drawPipe = (x: number, gapY: number) => {
      const pipeGradient = ctx.createLinearGradient(x, 0, x + PIPE_WIDTH, 0);
      pipeGradient.addColorStop(0, '#16a34a');
      pipeGradient.addColorStop(0.5, '#22c55e');
      pipeGradient.addColorStop(1, '#16a34a');

      ctx.fillStyle = pipeGradient;
      ctx.fillRect(x, 0, PIPE_WIDTH, gapY - PIPE_GAP/2);
      
      ctx.fillStyle = '#15803d';
      ctx.fillRect(x - 5, gapY - PIPE_GAP/2 - 20, PIPE_WIDTH + 10, 20);

      ctx.fillStyle = pipeGradient;
      ctx.fillRect(x, gapY + PIPE_GAP/2, PIPE_WIDTH, canvas.height - gapY - PIPE_GAP/2);
      
      ctx.fillStyle = '#15803d';
      ctx.fillRect(x - 5, gapY + PIPE_GAP/2, PIPE_WIDTH + 10, 20);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(x + 5, 0, 10, gapY - PIPE_GAP/2);
      ctx.fillRect(x + 5, gapY + PIPE_GAP/2, 10, canvas.height - gapY - PIPE_GAP/2);
    };

    const drawBackground = () => {
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, '#0f172a');
      skyGradient.addColorStop(0.5, '#1e293b');
      skyGradient.addColorStop(1, '#334155');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      for (let i = 0; i < 50; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 23) % (canvas.height - 100);
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      const groundGradient = ctx.createLinearGradient(0, canvas.height - 50, 0, canvas.height);
      groundGradient.addColorStop(0, '#475569');
      groundGradient.addColorStop(1, '#334155');
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

      ctx.fillStyle = '#64748b';
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.fillRect(i, canvas.height - 45, 20, 5);
      }
    };

    const drawScore = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(20, 20, 100, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(score.toString(), 70, 52);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(canvas.width - 170, 20, 150, 30);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Lv ${level} | ${timeLeft}s`, canvas.width - 95, 40);
    };

    const drawMessage = (message: string, subMessage: string) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(canvas.width/2 - 200, canvas.height/2 - 80, 400, 160);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(message, canvas.width/2, canvas.height/2 - 20);
      
      ctx.fillStyle = '#94a3b8';
      ctx.font = '18px Arial';
      ctx.fillText(subMessage, canvas.width/2, canvas.height/2 + 20);
    };

    const checkCollision = (rocketY: number): boolean => {
      const rocketTop = rocketY - ROCKET_SIZE/3;
      const rocketBottom = rocketY + ROCKET_SIZE/3;
      const rocketLeft = ROCKET_X - ROCKET_SIZE/2;
      const rocketRight = ROCKET_X + ROCKET_SIZE/2;

      if (rocketTop <= 0 || rocketBottom >= canvas.height - 50) {
        return true;
      }

      for (const pipe of pipes.current) {
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + PIPE_WIDTH;
        const gapTop = pipe.gapY - PIPE_GAP/2;
        const gapBottom = pipe.gapY + PIPE_GAP/2;

        if (rocketRight > pipeLeft && rocketLeft < pipeRight) {
          if (rocketTop < gapTop || rocketBottom > gapBottom) {
            return true;
          }
        }
      }

      return false;
    };

    const update = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      lastTimeRef.current = timestamp;

      if (gameState === 'playing') {
        rocketVelocity.current += GRAVITY;
        rocketVelocity.current *= 0.98;
        rocketY.current += rocketVelocity.current;

        if (timestamp - lastPipeSpawn.current > PIPE_SPAWN_RATE) {
          const minPipeY = 100;
          const maxPipeY = canvas.height - 150;
          const gapY = Math.random() * (maxPipeY - minPipeY) + minPipeY;
          pipes.current.push({ x: canvas.width, gapY, passed: false });
          lastPipeSpawn.current = timestamp;
        }

        pipes.current.forEach(pipe => {
          pipe.x -= PIPE_SPEED;
          
          if (!pipe.passed && pipe.x + PIPE_WIDTH < ROCKET_X) {
            pipe.passed = true;
            setScore(prev => prev + 1);
          }
        });

        pipes.current = pipes.current.filter(pipe => pipe.x + PIPE_WIDTH > -50);

        if (checkCollision(rocketY.current)) {
          setGameState('gameover');
          if (score > highScore) {
            setHighScore(score);
          }
          onGameEnd(score, score >= 4 + level);
          onPlayPause(false);
        }
      }

      drawBackground();
      
      pipes.current.forEach(pipe => drawPipe(pipe.x, pipe.gapY));
      
      const angle = Math.min(Math.max(rocketVelocity.current * 0.1, -0.5), 0.5);
      drawRocket(ROCKET_X, rocketY.current, angle);
      
      drawScore();

      if (gameState === 'waiting') {
        drawMessage('Flappy Rocket', `Level ${level} | Press SPACE to Start`);
      } else if (gameState === 'paused') {
        drawMessage('PAUSED', 'Press P or Click to Resume');
      } else if (gameState === 'gameover') {
        drawMessage('Game Over!', `Score: ${score} | Best: ${highScore}`);
      }

      gameLoopRef.current = requestAnimationFrame(update);
    };

    gameLoopRef.current = requestAnimationFrame(update);

    return () => {
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, score, highScore, level, onGameEnd, onPlayPause, timeLeft]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        onClick={handleClick}
        className="w-full h-auto cursor-pointer rounded-lg"
        style={{ maxHeight: '500px' }}
      />
      
      {gameState === 'gameover' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <button
            onClick={resetGame}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all transform hover:scale-105 shadow-lg"
          >
            Play Again
          </button>
        </div>
      )}
      
      {gameState === 'paused' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <button
            onClick={togglePause}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-bold rounded-xl hover:from-green-400 hover:to-emerald-400 transition-all transform hover:scale-105 shadow-lg"
          >
            Resume Game
          </button>
        </div>
      )}
      
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); togglePause(); }}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors"
        >
          {gameState === 'paused' ? (
            <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors"
        >
          {isMuted ? (
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
        <p className="text-white text-sm">Best: <span className="font-bold text-yellow-400">{highScore}</span></p>
      </div>
    </div>
  );
};

export default FlappyRocket;
