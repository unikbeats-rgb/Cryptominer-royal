import React, { useEffect, useRef, useState } from 'react';

interface BlockDropProps {
  level: number;
  durationSeconds: number;
  difficulty: number;
  onGameEnd: (score: number, won: boolean) => void;
}

const COLS = 10;
const ROWS = 18;
const BLOCK_SIZE = 24;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
];

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#f97316', '#ef4444'];

const BlockDrop: React.FC<BlockDropProps> = ({ level, durationSeconds, difficulty, onGameEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<number[][]>(() => Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [current, setCurrent] = useState<{ shape: number[][]; x: number; y: number; color: number } | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [state, setState] = useState<'menu' | 'playing' | 'gameover'>('menu');

  const fallSpeed = Math.max(300, 800 - level * 40 - difficulty * 80);
  const targetScore = 200 + level * 50;

  const spawnPiece = () => {
    const idx = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[idx];
    setCurrent({ shape, x: Math.floor(COLS / 2) - 1, y: 0, color: idx + 1 });
  };

  const resetGame = () => {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setScore(0);
    setTimeLeft(durationSeconds);
    setState('playing');
    spawnPiece();
  };

  const mergePiece = (piece: { shape: number[][]; x: number; y: number; color: number }) => {
    setGrid(prev => {
      const g = prev.map(row => [...row]);
      piece.shape.forEach((row, dy) => {
        row.forEach((v, dx) => {
          if (v) {
            const y = piece.y + dy;
            const x = piece.x + dx;
            if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
              g[y][x] = piece.color;
            }
          }
        });
      });
      return g;
    });
  };

  const collides = (piece: { shape: number[][]; x: number; y: number; color: number }, offsetX: number, offsetY: number) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (!piece.shape[y][x]) continue;
        const newX = piece.x + x + offsetX;
        const newY = piece.y + y + offsetY;
        if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
        if (newY >= 0 && grid[newY][newX]) return true;
      }
    }
    return false;
  };

  const rotate = (shape: number[][]) => {
    const rows = shape.length;
    const cols = shape[0].length;
    const res = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        res[x][rows - 1 - y] = shape[y][x];
      }
    }
    return res;
  };

  useEffect(() => {
    if (state !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastFall = 0;
    let animationId: number;

    const draw = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // grid background
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          ctx.strokeStyle = '#1e293b';
          ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          const colorIndex = grid[y][x];
          if (colorIndex) {
            const color = COLORS[colorIndex - 1];
            ctx.fillStyle = color;
            ctx.fillRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
          }
        }
      }

      if (current) {
        current.shape.forEach((row, dy) => {
          row.forEach((v, dx) => {
            if (!v) return;
            const x = (current.x + dx) * BLOCK_SIZE;
            const y = (current.y + dy) * BLOCK_SIZE;
            const color = COLORS[current.color - 1];
            ctx.fillStyle = color;
            ctx.fillRect(x + 1, y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
          });
        });
      }
    };

    const loop = (timestamp: number) => {
      if (!lastFall) lastFall = timestamp;
      const delta = timestamp - lastFall;

      if (delta >= fallSpeed && current) {
        lastFall = timestamp;
        if (!collides(current, 0, 1)) {
          setCurrent(prev => (prev ? { ...prev, y: prev.y + 1 } : prev));
        } else {
          mergePiece(current);
          // clear lines
          setGrid(prev => {
            const newGrid = prev.filter(row => !row.every(v => v !== 0));
            const cleared = ROWS - newGrid.length;
            if (cleared > 0) {
              const bonus = cleared * 100;
              setScore(s => s + bonus);
              while (newGrid.length < ROWS) {
                newGrid.unshift(Array(COLS).fill(0));
              }
            }
            return newGrid;
          });
          // spawn next
          const newPieceIndex = Math.floor(Math.random() * SHAPES.length);
          const shape = SHAPES[newPieceIndex];
          const nextPiece = { shape, x: Math.floor(COLS / 2) - 1, y: 0, color: newPieceIndex + 1 };
          if (collides(nextPiece, 0, 0)) {
            setState('gameover');
            return;
          }
          setCurrent(nextPiece);
        }
      }

      draw();
      if (state === 'playing') {
        animationId = requestAnimationFrame(loop);
      }
    };

    animationId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationId);
  }, [state, current, grid, fallSpeed]);

  useEffect(() => {
    if (state !== 'playing') return;
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id);
          setState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state]);

  useEffect(() => {
    if (state === 'gameover') {
      onGameEnd(score, score >= targetScore);
    }
  }, [state]);

  useEffect(() => {
    if (state !== 'playing') return;

    const handleKey = (e: KeyboardEvent) => {
      if (!current) return;
      if (e.key === 'ArrowLeft') {
        if (!collides(current, -1, 0)) setCurrent(prev => (prev ? { ...prev, x: prev.x - 1 } : prev));
      } else if (e.key === 'ArrowRight') {
        if (!collides(current, 1, 0)) setCurrent(prev => (prev ? { ...prev, x: prev.x + 1 } : prev));
      } else if (e.key === 'ArrowDown') {
        if (!collides(current, 0, 1)) setCurrent(prev => (prev ? { ...prev, y: prev.y + 1 } : prev));
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        const rotated = rotate(current.shape);
        const rotatedPiece = { ...current, shape: rotated };
        if (!collides(rotatedPiece, 0, 0)) setCurrent(rotatedPiece);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state, current, grid]);

  if (state === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="text-5xl mb-4">📦</div>
        <h2 className="text-2xl font-bold text-white mb-2">Block Drop</h2>
        <p className="text-slate-400 mb-4 text-center max-w-sm">Drop blocks to clear full lines. Use arrow keys to move and rotate. Reach {targetScore} points before time runs out!</p>
        <button
          onClick={resetGame}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (state === 'gameover') {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="text-5xl mb-4">{score >= targetScore ? '🏆' : '🧱'}</div>
        <h2 className="text-2xl font-bold text-white mb-2">{score >= targetScore ? 'Well Played!' : 'Board Filled'}</h2>
        <p className="text-slate-400 mb-4">Final score: <span className="text-emerald-400 font-bold">{score}</span></p>
        <button
          onClick={resetGame}
          className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-lg font-bold text-white">Block Drop</h2>
          <p className="text-xs text-slate-400">Clear lines, earn points. Target: {targetScore}</p>
        </div>
        <div className="flex gap-3">
          <div className="px-3 py-1 rounded-lg bg-slate-800 text-xs text-slate-300">
            Score <span className="font-mono text-emerald-400 ml-1">{score}</span>
          </div>
          <div className={`px-3 py-1 rounded-lg bg-slate-800 text-xs ${timeLeft <= 10 ? 'text-red-400' : 'text-slate-300'}`}>
            Time <span className="font-mono ml-1">{timeLeft}s</span>
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={COLS * BLOCK_SIZE}
        height={ROWS * BLOCK_SIZE}
        className="border border-slate-700 rounded-lg bg-slate-900 w-full max-w-[240px] mx-auto"
      />
    </div>
  );
};

export default BlockDrop;
