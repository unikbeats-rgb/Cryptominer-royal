import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';

interface SnakeGameProps {
  onGameEnd?: (score: number, won: boolean) => void;
  onPlayPause?: (isPlaying: boolean) => void;
  difficulty?: number;
  level?: number;
  durationSeconds?: number;
}

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 25;
const CANVAS_WIDTH = GRID_SIZE * CELL_SIZE;
const CANVAS_HEIGHT = GRID_SIZE * CELL_SIZE;

const SnakeGame: React.FC<SnakeGameProps> = ({ 
  onGameEnd = () => {}, 
  onPlayPause = () => {},
  difficulty = 1,
  level = 1,
  durationSeconds = 60,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? Number(saved) : 0;
  });
  
  // Game state refs
  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Position>({ x: 15, y: 15 });
  const directionRef = useRef<Position>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<Position>({ x: 1, y: 0 });
  const gameStateRef = useRef(gameState);
  const scoreRef = useRef(0);
  
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  
  // Generate random food position
  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);
  
  // Start game
  const startGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    foodRef.current = generateFood();
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(durationSeconds);
    setGameState('playing');
    onPlayPause(true);
  }, [durationSeconds, generateFood, onPlayPause]);
  
  // Game over
  const gameOver = useCallback(() => {
    setGameState('gameOver');
    onPlayPause(false);
    const finalScore = scoreRef.current;
    const won = finalScore >= 10 + level * 3;
    
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('snakeHighScore', finalScore.toString());
    }
    
    setTimeout(() => {
      if (onGameEnd) {
        onGameEnd(finalScore, won);
      }
    }, 1000);
  }, [highScore, level, onGameEnd, onPlayPause]);
  
  // Toggle pause
  const togglePause = useCallback(() => {
    setGameState(prev => {
      const next = prev === 'playing' ? 'paused' : 'playing';
      onPlayPause(next === 'playing');
      return next;
    });
  }, [onPlayPause]);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current !== 'playing' && gameStateRef.current !== 'paused') {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
          e.preventDefault();
          if (gameStateRef.current === 'menu' || gameStateRef.current === 'gameOver') {
            startGame();
          }
        }
        return;
      }
      
      e.preventDefault();
      
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
          break;
        case 'Escape':
          togglePause();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startGame, togglePause]);
  
  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let lastTime = 0;
    const baseSpeed = Math.max(90, 180 - difficulty * 15 - level * 6);
    
    const render = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      
      // Clear canvas
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CANVAS_HEIGHT);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CANVAS_WIDTH, i * CELL_SIZE);
        ctx.stroke();
      }
      
      if (gameStateRef.current === 'playing') {
        if (deltaTime >= baseSpeed) {
          lastTime = currentTime;
          
          // Update direction
          directionRef.current = nextDirectionRef.current;
          
          // Move snake
          const head = { ...snakeRef.current[0] };
          head.x += directionRef.current.x;
          head.y += directionRef.current.y;
          
          // Check wall collision
          if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            gameOver();
          }
          
          // Check self collision
          if (snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
          }
          
          snakeRef.current.unshift(head);
          
          // Check food collision
          if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
            scoreRef.current += 10;
            setScore(scoreRef.current);
            foodRef.current = generateFood();
          } else {
            snakeRef.current.pop();
          }
        }
      }
      
      if (gameStateRef.current === 'playing' || gameStateRef.current === 'paused') {
        // Draw food
        const food = foodRef.current;
        const foodGradient = ctx.createRadialGradient(
          food.x * CELL_SIZE + CELL_SIZE / 2,
          food.y * CELL_SIZE + CELL_SIZE / 2,
          2,
          food.x * CELL_SIZE + CELL_SIZE / 2,
          food.y * CELL_SIZE + CELL_SIZE / 2,
          CELL_SIZE / 2
        );
        foodGradient.addColorStop(0, '#fbbf24');
        foodGradient.addColorStop(1, '#f59e0b');
        ctx.fillStyle = foodGradient;
        ctx.beginPath();
        ctx.arc(
          food.x * CELL_SIZE + CELL_SIZE / 2,
          food.y * CELL_SIZE + CELL_SIZE / 2,
          CELL_SIZE / 2 - 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        
        // Draw snake
        snakeRef.current.forEach((segment, index) => {
          const x = segment.x * CELL_SIZE;
          const y = segment.y * CELL_SIZE;
          
          if (index === 0) {
            // Head
            const headGradient = ctx.createLinearGradient(x, y, x + CELL_SIZE, y + CELL_SIZE);
            headGradient.addColorStop(0, '#22d3ee');
            headGradient.addColorStop(1, '#0891b2');
            ctx.fillStyle = headGradient;
            ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
            
            // Eyes
            ctx.fillStyle = '#ffffff';
            const eyeSize = 4;
            if (directionRef.current.x === 1) {
              ctx.fillRect(x + CELL_SIZE - 8, y + 4, eyeSize, eyeSize);
              ctx.fillRect(x + CELL_SIZE - 8, y + CELL_SIZE - 8, eyeSize, eyeSize);
            } else if (directionRef.current.x === -1) {
              ctx.fillRect(x + 4, y + 4, eyeSize, eyeSize);
              ctx.fillRect(x + 4, y + CELL_SIZE - 8, eyeSize, eyeSize);
            } else if (directionRef.current.y === -1) {
              ctx.fillRect(x + 4, y + 4, eyeSize, eyeSize);
              ctx.fillRect(x + CELL_SIZE - 8, y + 4, eyeSize, eyeSize);
            } else {
              ctx.fillRect(x + 4, y + CELL_SIZE - 8, eyeSize, eyeSize);
              ctx.fillRect(x + CELL_SIZE - 8, y + CELL_SIZE - 8, eyeSize, eyeSize);
            }
          } else {
            // Body
            const bodyGradient = ctx.createLinearGradient(x, y, x + CELL_SIZE, y + CELL_SIZE);
            const greenValue = Math.max(100, 200 - index * 5);
            bodyGradient.addColorStop(0, `rgb(34, ${greenValue + 50}, 200)`);
            bodyGradient.addColorStop(1, `rgb(20, ${greenValue}, 180)`);
            ctx.fillStyle = bodyGradient;
            ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
          }
        });
        
        // Draw score
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'left';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 10;
        ctx.fillText(`Score: ${scoreRef.current}`, 10, 30);
        ctx.shadowBlur = 0;
        
        // Pause overlay
        if (gameStateRef.current === 'paused') {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 36px Inter';
          ctx.textAlign = 'center';
          ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
          ctx.font = '20px Inter';
          ctx.fillText('Press ESC to resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
        }
      }
      
      animationRef.current = requestAnimationFrame(render);
    };
    
    animationRef.current = requestAnimationFrame(render);
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [difficulty, gameOver, generateFood, level]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          gameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, gameState]);
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="rounded-xl cursor-pointer shadow-2xl border-2 border-slate-700"
        tabIndex={0}
      />
      
      {/* Menu Overlay */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 rounded-xl">
          <div className="text-6xl mb-4">🐍</div>
          <h2 className="text-3xl font-bold text-white mb-2">Snake Miner</h2>
          <p className="text-slate-400 mb-2">Use Arrow Keys to move</p>
          <p className="text-slate-500 text-sm mb-6">Eat coins to grow and score!</p>
          <button
            onClick={startGame}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold text-white hover:from-green-400 hover:to-emerald-400 transition-all transform hover:scale-105"
          >
            <Play size={24} />
            START GAME
          </button>
          <div className="mt-4 text-slate-500">
            High Score: <span className="text-yellow-400 font-bold">{highScore}</span>
          </div>
          <div className="text-slate-500 text-xs mt-1">Timer: {durationSeconds}s</div>
        </div>
      )}
      
      {/* Game Over Overlay */}
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 rounded-xl">
          <div className="text-6xl mb-4">💀</div>
          <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
          <div className="text-5xl font-bold text-green-400 mb-2">{score}</div>
          <p className="text-slate-400 mb-6">points scored</p>
          
          {score >= 120 + level * 15 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500 rounded-lg mb-4">
              <Trophy size={20} className="text-green-400" />
              <span className="text-green-400 font-semibold">You Won! +50 XP</span>
            </div>
          )}
          
          <button
            onClick={startGame}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold text-white hover:from-green-400 hover:to-emerald-400 transition-all transform hover:scale-105"
          >
            <RotateCcw size={24} />
            PLAY AGAIN
          </button>
        </div>
      )}
      
      {/* Pause Button */}
      {gameState === 'playing' && (
        <>
          <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-slate-900/80 text-cyan-300 text-sm border border-cyan-700/50">
            {timeLeft}s
          </div>
          <button
            onClick={togglePause}
            className="absolute top-4 right-4 p-3 bg-slate-800/80 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Pause size={20} className="text-white" />
          </button>
        </>
      )}
      
      {/* Instructions */}
      <div className="mt-4 p-4 bg-slate-800/50 rounded-xl">
        <h4 className="text-white font-semibold mb-2">How to Play:</h4>
        <ul className="text-slate-400 text-sm space-y-1">
          <li>• Use Arrow Keys to control the snake</li>
          <li>• Eat golden coins to grow and score</li>
          <li>• Don't hit the walls or yourself</li>
          <li>• Score 150+ points to win rewards!</li>
        </ul>
      </div>
    </div>
  );
};

export default SnakeGame;
