import React, { useEffect, useState } from 'react';

interface BitPuzzleProps {
  level: number;
  durationSeconds: number;
  difficulty: number;
  onGameEnd: (score: number, won: boolean) => void;
}

interface Node {
  id: number;
  label: string;
  active: boolean;
}

const BitPuzzle: React.FC<BitPuzzleProps> = ({ level, durationSeconds, difficulty, onGameEnd }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [targetValue, setTargetValue] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [score, setScore] = useState(0);
  const [state, setState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [won, setWon] = useState(false);

  const bitsCount = Math.min(8, 4 + Math.floor(level / 2));

  const initPuzzle = () => {
    const baseTarget = Math.floor(bitsCount * 8 + difficulty * 6 + level * 4);
    const maxValue = Math.pow(2, bitsCount) - 1;
    const clampedTarget = Math.min(maxValue, baseTarget);
    const newNodes: Node[] = Array.from({ length: bitsCount }, (_v, i) => ({
      id: i,
      label: `2^${bitsCount - 1 - i}`,
      active: false,
    }));

    setNodes(newNodes);
    setTargetValue(clampedTarget);
    setTimeLeft(durationSeconds);
    setScore(0);
    setWon(false);
  };

  const currentValue = nodes.reduce((acc, n, idx) => {
    if (!n.active) return acc;
    const bitPos = bitsCount - 1 - idx;
    return acc + Math.pow(2, bitPos);
  }, 0);

  const startGame = () => {
    initPuzzle();
    setState('playing');
  };

  const finishGame = (didWin: boolean) => {
    setWon(didWin);
    const diff = Math.abs(targetValue - currentValue);
    const baseScore = Math.max(0, 200 - diff * 4);
    const timeBonus = timeLeft * 3;
    const finalScore = Math.max(0, baseScore + timeBonus);
    setScore(finalScore);
    setState('gameover');
    onGameEnd(finalScore, didWin);
  };

  useEffect(() => {
    if (state !== 'playing') return;
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id);
          finishGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state]);

  const toggleNode = (id: number) => {
    if (state !== 'playing') return;
    setNodes(prev => prev.map(n => (n.id === id ? { ...n, active: !n.active } : n)));
  };

  if (state === 'menu') {
    return (
      <div className="p-6 flex flex-col items-center justify-center">
        <div className="text-5xl mb-4">🧩</div>
        <h2 className="text-2xl font-bold text-white mb-2">Bit Puzzle</h2>
        <p className="text-slate-400 mb-4 text-center max-w-sm">
          Toggle bits on the chain to match the target decimal value. Higher levels add more bits but you still get
          plenty of time.
        </p>
        <button
          onClick={startGame}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold hover:from-purple-400 hover:to-pink-400 transition-all"
        >
          Start Puzzle
        </button>
      </div>
    );
  }

  if (state === 'gameover') {
    return (
      <div className="p-6 flex flex-col items-center justify-center">
        <div className="text-5xl mb-4">{won ? '🎉' : '📉'}</div>
        <h2 className="text-2xl font-bold text-white mb-2">{won ? 'Perfect Match' : 'Puzzle Complete'}</h2>
        <p className="text-slate-300 mb-2">Target: <span className="font-mono text-cyan-300">{targetValue}</span></p>
        <p className="text-slate-300 mb-2">Your value: <span className="font-mono text-emerald-300">{currentValue}</span></p>
        <p className="text-slate-400 mb-4">Score: <span className="text-emerald-400 font-bold">{score}</span></p>
        <button
          onClick={startGame}
          className="px-8 py-3 bg-slate-800 rounded-xl text-white font-bold hover:bg-slate-700 transition-all"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">Bit Puzzle</h2>
          <p className="text-xs text-slate-400">Toggle bits to match the target value. Time left: {timeLeft}s</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Target</div>
          <div className="text-xl font-mono text-cyan-400">{targetValue}</div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-2 flex-wrap justify-center">
          {nodes.map((node, idx) => {
            const bitPos = bitsCount - 1 - idx;
            const bitValue = Math.pow(2, bitPos);
            return (
              <button
                key={node.id}
                onClick={() => toggleNode(node.id)}
                className={`px-3 py-2 rounded-lg border text-sm font-mono transition-all min-w-[80px] ${
                  node.active
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-200'
                }`}
              >
                <div className="flex justify-between">
                  <span>{node.label}</span>
                  <span>{node.active ? '1' : '0'}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{bitValue}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <div className="text-xs text-slate-400 mb-1">Current Value</div>
          <div className="text-2xl font-mono text-emerald-400">{currentValue}</div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => finishGame(currentValue === targetValue)}
          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all"
        >
          Submit Value
        </button>
        <div className="text-xs text-slate-500">
          Hint: aim within ±5 of the target for a good score.
        </div>
      </div>
    </div>
  );
};

export default BitPuzzle;
