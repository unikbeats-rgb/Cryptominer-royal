import React, { useState } from 'react';

interface DiceProps {
  balance: number;
  onWin: (amount: number) => void;
}

const Dice: React.FC<DiceProps> = ({ balance, onWin }) => {
  const [betAmount, setBetAmount] = useState(10);
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState(1);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const rollDice = () => {
    if (balance < betAmount || isRolling) return;
    setIsRolling(true);
    onWin(-betAmount);
    setResultMessage(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceResult(roll);
      setIsRolling(false);
      if (roll >= 4) {
        onWin(betAmount * 2);
        setResultMessage(`SUCCESS! Rolled ${roll}. Won ${betAmount * 2} ₮`);
      } else {
        setResultMessage(`FAILED! Rolled ${roll}.`);
      }
    }, 800);
  };

  return (
    <div className="bg-[#0f172a] rounded-3xl p-10 border-2 border-orange-500/30 shadow-2xl flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-orange-400 mb-12 text-center font-orbitron">CYBER DICE</h2>
      
      <div className={`text-[12rem] mb-16 transition-all duration-700 transform ${isRolling ? 'rotate-180 animate-bounce scale-110' : 'rotate-0 scale-100'}`}>
        {isRolling ? '🎲' : ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][diceResult - 1]}
      </div>

      <div className="w-full max-w-sm space-y-6">
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
           <p className="text-slate-400 text-sm mb-4">Roll <span className="text-orange-400 font-bold uppercase">4 or higher</span> for 2x Payout</p>
           <div className="flex justify-center gap-4 mb-4">
            {[10, 50, 100, 500, 1000].map(amt => (
              <button 
                key={amt} 
                onClick={() => setBetAmount(amt)}
                className={`w-14 h-10 rounded-lg font-bold transition-all border ${betAmount === amt ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-400 border-white/5'}`}
              >
                {amt}
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={isRolling || balance < betAmount}
          onClick={rollDice}
          className="w-full py-6 rounded-2xl bg-gradient-to-r from-orange-600 to-yellow-500 text-white text-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-600/20 disabled:opacity-50"
        >
          {isRolling ? 'ROLLING...' : `ROLL DICE (${betAmount} ₮)`}
        </button>
      </div>

      {resultMessage && (
        <div className="mt-8 animate-bounce py-2 px-8 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 font-bold">
          {resultMessage}
        </div>
      )}
    </div>
  );
};

export default Dice;
