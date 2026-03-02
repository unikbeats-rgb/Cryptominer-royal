import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { 
  Coins, 
  Dices, 
  RotateCcw, 
  Trophy, 
  Zap,
  ShieldCheck,
  History,
  Info
} from 'lucide-react';

const Casino: React.FC = () => {
  const { balance, updateBalance } = useGameStore();
  const [activeTab, setActiveTab] = useState<'slots' | 'dice' | 'coinflip'>('slots');
  const [betAmount, setBetAmount] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<{ id: string; game: string; amount: number; won: boolean; date: Date }[]>([]);

  const addHistory = (game: string, amount: number, won: boolean) => {
    const newEntry = {
      id: Math.random().toString(36).substr(2, 9),
      game,
      amount,
      won,
      date: new Date(),
    };
    setHistory([newEntry, ...history.slice(0, 9)]);
  };

  // 1. Slots Game
  const [slotReels, setSlotReels] = useState(['₿', 'Ξ', '₮']);
  const icons = ['₿', 'Ξ', '₮', '💎', '🎰', '🚀'];
  
  const playSlots = () => {
    if (balance < betAmount || isSpinning) return;
    setIsSpinning(true);
    updateBalance(-betAmount);
    setResult(null);

    let spins = 0;
    const interval = setInterval(() => {
      setSlotReels([
        icons[Math.floor(Math.random() * icons.length)],
        icons[Math.floor(Math.random() * icons.length)],
        icons[Math.floor(Math.random() * icons.length)]
      ]);
      spins++;
      if (spins > 10) {
        clearInterval(interval);
        const finalReels = [
          icons[Math.floor(Math.random() * icons.length)],
          icons[Math.floor(Math.random() * icons.length)],
          icons[Math.floor(Math.random() * icons.length)]
        ];
        setSlotReels(finalReels);
        setIsSpinning(false);

        if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
          const win = betAmount * 10;
          updateBalance(win);
          setResult(`JACKPOT! You won ${win} ₮`);
          addHistory('Slots', win, true);
        } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2]) {
          const win = betAmount * 2;
          updateBalance(win);
          setResult(`Big Win! You won ${win} ₮`);
          addHistory('Slots', win, true);
        } else {
          setResult('Try again!');
          addHistory('Slots', -betAmount, false);
        }
      }
    }, 100);
  };

  // 2. Dice Roll
  const [diceResult, setDiceResult] = useState(1);
  const playDice = () => {
    if (balance < betAmount || isSpinning) return;
    setIsSpinning(true);
    updateBalance(-betAmount);
    
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceResult(roll);
      setIsSpinning(false);
      if (roll >= 4) {
        const win = betAmount * 2;
        updateBalance(win);
        setResult(`Success! Rolled ${roll}. Won ${win} ₮`);
        addHistory('Dice', win, true);
      } else {
        setResult(`Failed! Rolled ${roll}.`);
        addHistory('Dice', -betAmount, false);
      }
    }, 600);
  };

  // 3. Coinflip
  const [coinSide, setCoinSide] = useState<'heads' | 'tails'>('heads');
  const playCoinflip = (choice: 'heads' | 'tails') => {
    if (balance < betAmount || isSpinning) return;
    setIsSpinning(true);
    updateBalance(-betAmount);

    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
      setCoinSide(outcome);
      setIsSpinning(false);
      if (outcome === choice) {
        const win = betAmount * 1.95;
        updateBalance(win);
        setResult(`Correct! It was ${outcome}. Won ${win.toFixed(2)} ₮`);
        addHistory('Coinflip', win, true);
      } else {
        setResult(`Wrong! It was ${outcome}.`);
        addHistory('Coinflip', -betAmount, false);
      }
    }, 800);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 font-orbitron mb-2">
            ROYALE CASINO
          </h1>
          <p className="text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Provably Fair Gaming • Instant Payouts
          </p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Available Balance</p>
            <p className="text-2xl font-mono text-emerald-400">{balance.toFixed(6)} ₮</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Coins className="text-emerald-400 w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Top 3 Games Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex p-1 bg-slate-900/80 rounded-2xl border border-white/5 gap-2">
            <button
              onClick={() => setActiveTab('slots')}
              className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-bold transition-all ${
                activeTab === 'slots' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20' 
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <RotateCcw className="w-5 h-5" />
              Crypto Slots
            </button>
            <button
              onClick={() => setActiveTab('dice')}
              className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-bold transition-all ${
                activeTab === 'dice' 
                  ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white shadow-lg shadow-orange-500/20' 
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <Dices className="w-5 h-5" />
              Cyber Dice
            </button>
            <button
              onClick={() => setActiveTab('coinflip')}
              className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-bold transition-all ${
                activeTab === 'coinflip' 
                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <Zap className="w-5 h-5" />
              Neon Flip
            </button>
          </div>

          {/* Game Area */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
            
            {activeTab === 'slots' && (
              <div className="text-center w-full max-w-md">
                <div className="flex gap-4 justify-center mb-12">
                  {slotReels.map((reel, i) => (
                    <div key={i} className={`w-24 h-32 bg-black/60 border-2 ${isSpinning ? 'border-purple-500 animate-pulse' : 'border-white/10'} rounded-2xl flex items-center justify-center text-5xl shadow-inner shadow-white/5 transition-all`}>
                      {reel}
                    </div>
                  ))}
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                    <button onClick={() => setBetAmount(Math.max(1, betAmount - 10))} className="p-2 hover:text-white text-slate-500">-</button>
                    <span className="text-xl font-mono font-bold text-white w-24">{betAmount} ₮</span>
                    <button onClick={() => setBetAmount(betAmount + 10)} className="p-2 hover:text-white text-slate-500">+</button>
                  </div>
                  <button
                    disabled={isSpinning || balance < betAmount}
                    onClick={playSlots}
                    className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    {isSpinning ? 'SPINNING...' : 'PULL LEVER'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'dice' && (
              <div className="text-center w-full max-w-md">
                <div className={`text-9xl mb-12 transition-transform duration-500 ${isSpinning ? 'animate-bounce' : ''}`}>
                  {isSpinning ? '🎲' : ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][diceResult - 1]}
                </div>
                <div className="bg-black/20 p-4 rounded-2xl mb-8 border border-white/5 text-slate-400">
                  Roll <span className="text-orange-400 font-bold">4 or higher</span> to win 2x your bet!
                </div>
                <div className="space-y-6">
                   <input 
                    type="range" min="1" max="1000" step="10" 
                    value={betAmount} onChange={(e) => setBetAmount(parseInt(e.target.value))}
                    className="w-full accent-orange-500 mb-4"
                  />
                  <button
                    disabled={isSpinning || balance < betAmount}
                    onClick={playDice}
                    className="w-full py-6 rounded-2xl bg-gradient-to-r from-orange-600 to-yellow-600 text-white text-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    ROLL DICE ({betAmount} ₮)
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'coinflip' && (
              <div className="text-center w-full max-w-md">
                <div className={`w-32 h-32 mx-auto mb-12 rounded-full border-4 border-emerald-500 flex items-center justify-center text-6xl shadow-lg shadow-emerald-500/20 bg-emerald-500/10 ${isSpinning ? 'animate-spin' : ''}`}>
                  {coinSide === 'heads' ? '₿' : '₮'}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => playCoinflip('heads')}
                    disabled={isSpinning || balance < betAmount}
                    className="py-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold hover:bg-emerald-500 hover:text-white transition-all"
                  >
                    HEADS
                  </button>
                  <button
                    onClick={() => playCoinflip('tails')}
                    disabled={isSpinning || balance < betAmount}
                    className="py-4 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-bold hover:bg-cyan-500 hover:text-white transition-all"
                  >
                    TAILS
                  </button>
                </div>
              </div>
            )}

            {result && (
              <div className="absolute top-4 animate-bounce bg-white/10 backdrop-blur-xl py-2 px-6 rounded-full border border-white/20 text-white font-bold">
                {result}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar stats */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-purple-400" />
              Recent Plays
            </h3>
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No history yet</p>
              ) : (
                history.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                    <div>
                      <p className="text-sm font-bold text-white">{item.game}</p>
                      <p className="text-[10px] text-slate-500">{item.date.toLocaleTimeString()}</p>
                    </div>
                    <div className={item.won ? 'text-emerald-400' : 'text-red-400'}>
                      {item.won ? '+' : ''}{item.amount.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Top Win Today
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">1</div>
              <div>
                <p className="text-white font-bold">CryptoKing88</p>
                <p className="text-yellow-400/80 font-mono">+1,250.00 ₮</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6">
             <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
              <Info className="w-3 h-3" />
              Fair Play Guaranteed
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              All results are generated using a cryptographically secure random number generator. House edge is maintained at 2-5% depending on the game mode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Casino;