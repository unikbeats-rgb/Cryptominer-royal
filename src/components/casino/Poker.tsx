import React, { useState } from 'react';

interface PokerProps {
  balance: number;
  onWin: (amount: number) => void;
}

const HAND_RANKINGS = [
  { name: 'Royal Flush', multiplier: 800 },
  { name: 'Straight Flush', multiplier: 50 },
  { name: 'Four of a Kind', multiplier: 25 },
  { name: 'Full House', multiplier: 9 },
  { name: 'Flush', multiplier: 6 },
  { name: 'Straight', multiplier: 4 },
  { name: 'Three of a Kind', multiplier: 3 },
  { name: 'Two Pair', multiplier: 2 },
  { name: 'Jacks or Better', multiplier: 1 },
];

const Poker: React.FC<PokerProps> = ({ balance, onWin }) => {
  const [betAmount, setBetAmount] = useState(10);
  const [gameState, setGameState] = useState<'betting' | 'dealing' | 'finished'>('betting');
  const [hand, setHand] = useState<any[]>([]);
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
  const [message, setMessage] = useState('');

  const generateCard = () => {
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['♠', '♥', '♦', '♣'];
    return {
      value: values[Math.floor(Math.random() * values.length)],
      suit: suits[Math.floor(Math.random() * suits.length)],
    };
  };

  const deal = () => {
    if (balance < betAmount) return;
    onWin(-betAmount);
    setHand(Array.from({ length: 5 }, generateCard));
    setHeld([false, false, false, false, false]);
    setGameState('dealing');
    setMessage('Select cards to HOLD');
  };

  const draw = () => {
    const newHand = hand.map((card, i) => (held[i] ? card : generateCard()));
    setHand(newHand);
    setGameState('finished');
    evaluateHand();
  };

  const evaluateHand = () => {
    // Simplified poker hand evaluation
    const roll = Math.random();
    let wonAmount = 0;
    if (roll < 0.001) {
      setMessage('ROYAL FLUSH!');
      wonAmount = betAmount * 800;
    } else if (roll < 0.01) {
      setMessage('FOUR OF A KIND!');
      wonAmount = betAmount * 25;
    } else if (roll < 0.05) {
      setMessage('FULL HOUSE!');
      wonAmount = betAmount * 9;
    } else if (roll < 0.15) {
      setMessage('TWO PAIR!');
      wonAmount = betAmount * 2;
    } else if (roll < 0.3) {
      setMessage('JACKS OR BETTER!');
      wonAmount = betAmount * 1;
    } else {
      setMessage('No win. Try again!');
    }

    if (wonAmount > 0) onWin(wonAmount);
  };

  return (
    <div className="bg-[#0f172a] rounded-3xl p-8 border-2 border-blue-500/30 shadow-2xl">
      <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center font-orbitron">VIDEO POKER</h2>
      
      <div className="grid grid-cols-5 gap-4 mb-12">
        {hand.length > 0 ? hand.map((card, i) => (
          <div 
            key={i} 
            onClick={() => gameState === 'dealing' && setHeld(h => h.map((v, idx) => idx === i ? !v : v))}
            className={`h-40 bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-105 border-4 ${held[i] ? 'border-yellow-400 shadow-lg' : 'border-transparent'}`}
          >
            <div className={`text-4xl font-bold ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'}`}>{card.value}</div>
            <div className={`text-5xl ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'}`}>{card.suit}</div>
            {held[i] && <div className="absolute -top-4 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">HELD</div>}
          </div>
        )) : Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-40 bg-blue-900/30 border-2 border-dashed border-blue-500/30 rounded-xl flex items-center justify-center text-blue-500/30 text-4xl">?</div>
        ))}
      </div>

      <div className="text-center mb-8">
        <p className="text-blue-300 font-bold mb-4">{message || 'Place your bet to start'}</p>
        <div className="flex justify-center gap-4 mb-8">
          {[10, 50, 100, 500].map(amt => (
            <button 
              key={amt} 
              onClick={() => setBetAmount(amt)}
              className={`w-16 h-10 rounded-lg font-bold transition-all border ${betAmount === amt ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400 border-white/5'}`}
            >
              {amt}
            </button>
          ))}
        </div>

        {gameState === 'betting' && (
          <button onClick={deal} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl shadow-lg shadow-blue-600/20 transition-all">
            DEAL CARDS
          </button>
        )}
        {gameState === 'dealing' && (
          <button onClick={draw} className="w-full py-5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-2xl font-bold text-xl shadow-lg shadow-yellow-500/20 transition-all">
            DRAW NEW CARDS
          </button>
        )}
        {gameState === 'finished' && (
          <button onClick={() => { setHand([]); setGameState('betting'); setMessage(''); }} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xl transition-all">
            PLAY AGAIN
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {HAND_RANKINGS.map(rank => (
          <div key={rank.name} className="bg-black/40 p-2 rounded-lg border border-white/5 flex justify-between text-[10px]">
            <span className="text-slate-400">{rank.name}</span>
            <span className="text-yellow-400 font-bold">x{rank.multiplier}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Poker;
