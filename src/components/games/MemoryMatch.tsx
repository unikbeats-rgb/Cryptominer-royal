import React, { useEffect, useState, useCallback } from 'react';
import { Trophy, RotateCcw, Play, Timer } from 'lucide-react';

interface MemoryMatchProps {
  onGameEnd: (score: number, won: boolean) => void;
  difficulty?: number;
  level?: number;
  durationSeconds?: number;
}

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SYMBOLS = ['💎', '🪙', '💰', '⚡', '🔷', '🚀', '🎯', '💎'];

const MemoryMatch: React.FC<MemoryMatchProps> = ({ onGameEnd, difficulty = 1, level = 1, durationSeconds = 60 }) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('memoryMatchHighScore');
    return saved ? Number(saved) : 0;
  });
  
  // Initialize game
  const initGame = useCallback(() => {
    const shuffledSymbols = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffledSymbols);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimeLeft(Math.max(30, durationSeconds - (difficulty - 1) * 4));
    setScore(0);
  }, [difficulty, durationSeconds]);
  
  // Start game
  const startGame = useCallback(() => {
    initGame();
    setGameState('playing');
  }, [initGame]);
  
  // Handle card click
  const handleCardClick = useCallback((id: number) => {
    if (flippedCards.length >= 2) return;
    if (cards[id].isFlipped || cards[id].isMatched) return;
    
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);
    
    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ));
    
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].symbol === cards[second].symbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true } 
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false } 
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [cards, flippedCards]);
  
  // Game over
  const endGame = useCallback((won: boolean) => {
    setGameState('gameOver');
    const baseScore = matches * 100;
    const timeBonus = timeLeft * 5;
    const movesBonus = Math.max(0, 100 - moves * 5);
    const finalScore = baseScore + timeBonus + movesBonus;
    
    setScore(finalScore);
    
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('memoryMatchHighScore', finalScore.toString());
    }
    
    setTimeout(() => {
      onGameEnd(finalScore, won);
    }, 1500);
  }, [highScore, matches, moves, onGameEnd, timeLeft]);
  
  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState, endGame]);
  
  // Check win condition
  useEffect(() => {
    if (gameState === 'playing' && matches === SYMBOLS.length) {
      endGame(true);
    }
  }, [matches, gameState, endGame]);
  
  return (
    <div className="relative">
      {/* Game Board */}
      <div className="bg-slate-800/50 p-6 rounded-xl">
        {gameState === 'menu' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-3xl font-bold text-white mb-2">Memory Match</h2>
            <p className="text-slate-400 mb-2">Match the crypto symbols</p>
          <p className="text-slate-500 text-sm mb-6">Find all pairs before time runs out! Lv.{level}</p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white hover:from-purple-400 hover:to-pink-400 transition-all transform hover:scale-105"
            >
              <Play size={24} />
              START GAME
            </button>
            <div className="mt-4 text-slate-500">
              High Score: <span className="text-yellow-400 font-bold">{highScore}</span>
            </div>
          </div>
        )}
        
        {gameState === 'playing' && (
          <>
            {/* Stats Bar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-slate-700 rounded-lg">
                  <span className="text-slate-400 text-sm">Moves</span>
                  <div className="text-xl font-bold text-white">{moves}</div>
                </div>
                <div className="px-4 py-2 bg-slate-700 rounded-lg">
                  <span className="text-slate-400 text-sm">Matches</span>
                  <div className="text-xl font-bold text-green-400">{matches}/{SYMBOLS.length}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg">
                <Timer size={20} className={timeLeft <= 10 ? 'text-red-400' : 'text-cyan-400'} />
                <span className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
            
            {/* Card Grid */}
            <div className="grid grid-cols-4 gap-3">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isFlipped || card.isMatched || flippedCards.length >= 2}
                  className={`
                    aspect-square rounded-xl text-4xl font-bold transition-all duration-300 transform
                    ${card.isMatched 
                      ? 'bg-green-500/20 border-2 border-green-500 scale-95' 
                      : card.isFlipped
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-500 rotate-y-0'
                        : 'bg-slate-700 hover:bg-slate-600 hover:scale-105'
                    }
                  `}
                  style={{
                    transform: card.isFlipped || card.isMatched ? 'rotateY(0deg)' : 'rotateY(180deg)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      opacity: card.isFlipped || card.isMatched ? 1 : 0,
                      transition: 'opacity 0.3s'
                    }}
                  >
                    {card.symbol}
                  </div>
                  {!card.isFlipped && !card.isMatched && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-2xl">
                      ?
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
        
        {gameState === 'gameOver' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">{matches === SYMBOLS.length ? '🎉' : '⏰'}</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {matches === SYMBOLS.length ? 'Victory!' : 'Time\'s Up!'}
            </h2>
            <div className="text-5xl font-bold text-cyan-400 mb-2">{score}</div>
            <p className="text-slate-400 mb-6">points scored</p>
            
            <div className="flex gap-4 mb-6">
              <div className="text-center px-4 py-2 bg-slate-700 rounded-lg">
                <div className="text-sm text-slate-400">Moves</div>
                <div className="text-xl font-bold text-white">{moves}</div>
              </div>
              <div className="text-center px-4 py-2 bg-slate-700 rounded-lg">
                <div className="text-sm text-slate-400">Matches</div>
                <div className="text-xl font-bold text-green-400">{matches}/{SYMBOLS.length}</div>
              </div>
              <div className="text-center px-4 py-2 bg-slate-700 rounded-lg">
                <div className="text-sm text-slate-400">Time Left</div>
                <div className="text-xl font-bold text-white">{timeLeft}s</div>
              </div>
            </div>
            
            {matches === SYMBOLS.length && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500 rounded-lg mb-4">
                <Trophy size={20} className="text-green-400" />
                <span className="text-green-400 font-semibold">You Won! +50 XP</span>
              </div>
            )}
            
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white hover:from-purple-400 hover:to-pink-400 transition-all transform hover:scale-105"
            >
              <RotateCcw size={24} />
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div className="mt-4 p-4 bg-slate-800/50 rounded-xl">
        <h4 className="text-white font-semibold mb-2">How to Play:</h4>
        <ul className="text-slate-400 text-sm space-y-1">
          <li>• Click cards to flip them over</li>
          <li>• Find matching pairs of crypto symbols</li>
          <li>• Match all pairs before time runs out</li>
          <li>• Fewer moves = higher score bonus!</li>
        </ul>
      </div>
    </div>
  );
};

export default MemoryMatch;
