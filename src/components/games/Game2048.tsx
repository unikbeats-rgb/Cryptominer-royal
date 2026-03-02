import React, { useState, useEffect, useCallback } from 'react';

interface Game2048Props {
  level: number;
  durationSeconds: number;
  difficulty: number;
  onGameEnd: (score: number, won: boolean) => void;
}

const Game2048: React.FC<Game2048Props> = ({ level, durationSeconds, difficulty, onGameEnd }) => {
  const [grid, setGrid] = useState<number[][]>(Array(4).fill(null).map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [started, setStarted] = useState(false);
  const [targetScore, setTargetScore] = useState(2048);

  // Adjust target score based on level and difficulty
  const difficultyMultiplier = difficulty * 0.5;
  const targetScoreForLevel = Math.floor((2048 + (level - 1) * 1024) * difficultyMultiplier);

  useEffect(() => {
    setTargetScore(targetScoreForLevel);
  }, [level, targetScoreForLevel]);

  const addRandomTile = useCallback((currentGrid: number[][]) => {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }
    if (emptyCells.length === 0) return currentGrid;

    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map(row => [...row]);
    newGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  }, []);

  const initializeGame = useCallback(() => {
    let newGrid = Array(4).fill(null).map(() => Array(4).fill(0));
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setTimeLeft(durationSeconds);
    setGameOver(false);
    setGameWon(false);
    setStarted(true);
  }, [addRandomTile, durationSeconds]);

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || gameWon || !started) return;

    setGrid(prevGrid => {
      let newGrid = prevGrid.map(row => [...row]);
      let moved = false;
      let points = 0;

      const rotateGrid = (grid: number[][]) => {
        const rotated = Array(4).fill(null).map(() => Array(4).fill(0));
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            rotated[j][3 - i] = grid[i][j];
          }
        }
        return rotated;
      };

      const moveLeft = (grid: number[][]) => {
        const result = grid.map(row => {
          const filtered = row.filter(cell => cell !== 0);
          const merged: number[] = [];
          let skip = false;

          for (let i = 0; i < filtered.length; i++) {
            if (skip) {
              skip = false;
              continue;
            }
            if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
              merged.push(filtered[i] * 2);
              points += filtered[i] * 2;
              skip = true;
            } else {
              merged.push(filtered[i]);
            }
          }

          while (merged.length < 4) {
            merged.push(0);
          }
          return merged;
        });

        const hasMoved = JSON.stringify(result) !== JSON.stringify(grid);
        return { grid: result, moved: hasMoved };
      };

      let rotations = 0;
      if (direction === 'up') rotations = 1;
      else if (direction === 'right') rotations = 2;
      else if (direction === 'down') rotations = 3;

      for (let i = 0; i < rotations; i++) {
        newGrid = rotateGrid(newGrid);
      }

      const moveResult = moveLeft(newGrid);
      newGrid = moveResult.grid;
      moved = moveResult.moved;

      for (let i = 0; i < (4 - rotations) % 4; i++) {
        newGrid = rotateGrid(newGrid);
      }

      if (moved) {
        newGrid = addRandomTile(newGrid);
        setScore(prev => prev + points);

        // Check win condition
        const hasTarget = newGrid.some(row => row.some(cell => cell >= targetScore));
        if (hasTarget && !gameWon) {
          setGameWon(true);
          setTimeout(() => onGameEnd(score + points, true), 1000);
        }

        // Check game over
        const hasEmpty = newGrid.some(row => row.some(cell => cell === 0));
        const hasMerge = newGrid.some((row, i) => 
          row.some((cell, j) => 
            (j < 3 && cell === newGrid[i][j + 1]) ||
            (i < 3 && cell === newGrid[i + 1][j])
          )
        );

        if (!hasEmpty && !hasMerge) {
          setGameOver(true);
          setTimeout(() => onGameEnd(score + points, false), 1000);
        }
      }

      return newGrid;
    });
  }, [gameOver, gameWon, started, addRandomTile, targetScore, score, onGameEnd]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!started) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          move('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          move('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          move('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          move('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, started]);

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

  const getTileColor = (value: number) => {
    const colors: { [key: number]: string } = {
      2: 'from-slate-400 to-slate-500',
      4: 'from-cyan-400 to-cyan-500',
      8: 'from-blue-400 to-blue-500',
      16: 'from-indigo-400 to-indigo-500',
      32: 'from-purple-400 to-purple-500',
      64: 'from-pink-400 to-pink-500',
      128: 'from-red-400 to-red-500',
      256: 'from-orange-400 to-orange-500',
      512: 'from-yellow-400 to-yellow-500',
      1024: 'from-green-400 to-green-500',
      2048: 'from-amber-400 to-amber-500',
    };
    return colors[value] || 'from-slate-600 to-slate-700';
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-6xl mb-4">🔢</div>
        <h2 className="text-2xl font-bold text-white mb-2">2048 Crypto</h2>
        <p className="text-gray-400 text-center mb-6">
          Merge tiles to reach {targetScore}! Use arrow keys or WASD to move.
        </p>
        <button
          onClick={initializeGame}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all"
        >
          Start Game
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
            <div className="text-xl font-bold text-cyan-400">{targetScore}</div>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-lg ${timeLeft <= 10 ? 'bg-red-500/20' : 'bg-slate-800'}`}>
          <div className="text-xs text-gray-400">Time</div>
          <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="bg-slate-800 rounded-xl p-3 inline-block">
        <div className="grid grid-cols-4 gap-2">
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center text-xl md:text-2xl font-bold transition-all ${
                  cell === 0
                    ? 'bg-slate-700'
                    : `bg-gradient-to-br ${getTileColor(cell)} text-white shadow-lg`
                }`}
              >
                {cell !== 0 && cell}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm mb-2">Use Arrow Keys or WASD to move</p>
        <div className="grid grid-cols-3 gap-2 w-32 mx-auto">
          <div></div>
          <button
            onClick={() => move('up')}
            className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg"
          >
            ↑
          </button>
          <div></div>
          <button
            onClick={() => move('left')}
            className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg"
          >
            ←
          </button>
          <button
            onClick={() => move('down')}
            className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg"
          >
            ↓
          </button>
          <button
            onClick={() => move('right')}
            className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg"
          >
            →
          </button>
        </div>
      </div>

      {/* Game Over / Win Overlay */}
      {(gameOver || gameWon) && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-8 text-center max-w-md">
            <div className="text-6xl mb-4">
              {gameWon ? '🏆' : '💔'}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {gameWon ? 'You Won!' : 'Game Over!'}
            </h2>
            <p className="text-gray-400 mb-4">
              {gameWon 
                ? `Amazing! You reached ${targetScore}!` 
                : `Time's up! Final score: ${score}`}
            </p>
            <div className="text-2xl font-bold text-cyan-400 mb-6">
              Score: {score}
            </div>
            <button
              onClick={initializeGame}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game2048;
