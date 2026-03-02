import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface HashCrackProps {
  level: number;
  durationSeconds: number;
  difficulty: number;
  onGameEnd: (score: number, won: boolean) => void;
}

interface GuessResult {
  guess: string;
  exact: number;
  partial: number;
}

const HEX_CHARS = '0123456789ABCDEF';

const HashCrack: React.FC<HashCrackProps> = ({ level, durationSeconds, difficulty, onGameEnd }) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [secret, setSecret] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const endedRef = useRef(false);

  const maxAttempts = useMemo(() => {
    const base = 8; // generous base
    const diffPenalty = Math.max(0, difficulty - 1);
    const levelBonus = Math.max(0, 3 - Math.floor(level / 3));
    return base + levelBonus - diffPenalty;
  }, [difficulty, level]);

  const generateSecret = useCallback(() => {
    let s = '';
    for (let i = 0; i < 4; i++) {
      s += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
    }
    return s;
  }, []);

  const startGame = useCallback(() => {
    setSecret(generateSecret());
    setCurrentGuess('');
    setGuesses([]);
    setAttemptsLeft(maxAttempts);
    setTimeLeft(durationSeconds);
    setScore(0);
    setWon(false);
    endedRef.current = false;
    setGameState('playing');
  }, [durationSeconds, generateSecret, maxAttempts]);

  const finishGame = useCallback(
    (finalScore: number, didWin: boolean) => {
      if (endedRef.current) return;
      endedRef.current = true;
      setScore(finalScore);
      setWon(didWin);
      setGameState('gameover');
      onGameEnd(finalScore, didWin);
    },
    [onGameEnd],
  );

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id);
          finishGame(score, false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [gameState, finishGame, score]);

  const evaluateGuess = (guess: string): GuessResult => {
    let exact = 0;
    let partial = 0;

    const secretCounts: Record<string, number> = {};
    const guessCounts: Record<string, number> = {};

    for (let i = 0; i < 4; i++) {
      const sCh = secret[i];
      const gCh = guess[i];
      if (gCh === sCh) {
        exact++;
      } else {
        secretCounts[sCh] = (secretCounts[sCh] || 0) + 1;
        guessCounts[gCh] = (guessCounts[gCh] || 0) + 1;
      }
    }

    Object.keys(guessCounts).forEach(ch => {
      if (secretCounts[ch]) {
        partial += Math.min(secretCounts[ch], guessCounts[ch]);
      }
    });

    return { guess, exact, partial };
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (gameState !== 'playing') return;
    const guess = currentGuess.toUpperCase().trim();
    if (guess.length !== 4 || !/^([0-9A-F]{4})$/.test(guess)) return;

    const result = evaluateGuess(guess);
    const guessScore = result.exact * 50 + result.partial * 10;
    const newScore = score + guessScore;
    setScore(newScore);
    setGuesses(prev => [result, ...prev]);
    setCurrentGuess('');

    if (result.exact === 4) {
      // bonus for remaining time and attempts
      const timeBonus = timeLeft * 5;
      const attemptsBonus = attemptsLeft * 20;
      finishGame(newScore + timeBonus + attemptsBonus, true);
      return;
    }

    if (attemptsLeft - 1 <= 0) {
      finishGame(newScore, false);
    } else {
      setAttemptsLeft(prev => prev - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleInputChange = (value: string) => {
    const upper = value.toUpperCase().replace(/[^0-9A-F]/g, '');
    if (upper.length <= 4) {
      setCurrentGuess(upper);
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="p-6 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-3xl font-bold text-white mb-2">Hash Cracker</h2>
        <p className="text-slate-400 mb-4 text-center max-w-md">
          Crack the 4-digit hex hash. Use hints about exact and partial matches. You have {maxAttempts} attempts
          and {durationSeconds}s.
        </p>
        <button
          onClick={startGame}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white font-bold hover:from-cyan-400 hover:to-blue-400 transition-all"
        >
          Start Cracking
        </button>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <div className="p-6 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">{won ? '🎉' : '🧊'}</div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {won ? 'Hash Cracked!' : 'Hash Locked'}
        </h2>
        <p className="text-slate-300 mb-2">Secret hash was: <span className="font-mono text-cyan-300">{secret}</span></p>
        <p className="text-slate-400 mb-4">Final score: <span className="text-emerald-400 font-bold">{score}</span></p>
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
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Hash Cracker <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">Lv {level}</span>
          </h2>
          <p className="text-slate-400 text-sm">Guess the 4-digit hex hash. Exact = right char &amp; position, Partial = right char, wrong spot.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-3 py-2 rounded-lg bg-slate-800 text-right">
            <div className="text-xs text-slate-400">Attempts</div>
            <div className="text-lg font-mono text-white">{attemptsLeft} / {maxAttempts}</div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-slate-800 text-right">
            <div className="text-xs text-slate-400">Time</div>
            <div className={`text-lg font-mono ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-slate-800 text-right">
            <div className="text-xs text-slate-400">Score</div>
            <div className="text-lg font-mono text-emerald-400">{score}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex flex-col">
          <label className="text-xs text-slate-400 mb-1">Enter Hex Guess</label>
          <input
            value={currentGuess}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={4}
            className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-mono tracking-[0.4em] text-lg focus:outline-none focus:border-cyan-500"
            placeholder="AB3F"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentGuess.length !== 4 || attemptsLeft <= 0}
        >
          Crack
        </button>
      </form>

      <div className="mt-4 border-t border-slate-700 pt-4">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Guess History</span>
          <span>Exact = 🔵 | Partial = 🟡</span>
        </div>
        {guesses.length === 0 ? (
          <p className="text-slate-500 text-sm">No guesses yet. Try something like <span className="font-mono">{secret.slice(0, 2)}FF</span>…</p>
        ) : (
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {guesses.map((g, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center px-3 py-2 rounded-lg bg-slate-900/70 border border-slate-700/60"
              >
                <span className="font-mono text-lg text-cyan-200">{g.guess}</span>
                <div className="flex gap-3 text-sm">
                  <span className="flex items-center gap-1 text-blue-300">
                    🔵 <span className="font-mono">{g.exact}</span>
                  </span>
                  <span className="flex items-center gap-1 text-amber-300">
                    🟡 <span className="font-mono">{g.partial}</span>
                  </span>
                  <span className="text-slate-500">+{g.exact * 50 + g.partial * 10}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HashCrack;
