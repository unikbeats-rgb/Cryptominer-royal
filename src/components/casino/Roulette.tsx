import { useState } from 'react';

interface RouletteProps {
  onWin: (amount: number) => void;
  balance: number;
}

export default function Roulette({ onWin, balance }: RouletteProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [betType, setBetType] = useState<'red' | 'black' | 'green' | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
    5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];

  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

  const spin = () => {
    if (!betType || betAmount > balance || betAmount <= 0) return;
    
    setSpinning(true);
    setResult(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      const resultNumber = numbers[randomIndex];
      setResult(resultNumber);
      setHistory(prev => [resultNumber, ...prev.slice(0, 9)]);

      let won = false;
      if (betType === 'green' && resultNumber === 0) won = true;
      else if (betType === 'red' && redNumbers.includes(resultNumber)) won = true;
      else if (betType === 'black' && resultNumber !== 0 && !redNumbers.includes(resultNumber)) won = true;

      if (won) {
        const multiplier = betType === 'green' ? 35 : 2;
        onWin(betAmount * multiplier);
      }

      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-br from-red-900 via-gray-900 to-black rounded-xl p-6 border-4 border-yellow-600">
      <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center">🎰 Roulette</h3>
      
      {/* Wheel */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        <div className={`absolute inset-0 rounded-full border-8 border-yellow-600 bg-gradient-to-br from-red-800 to-black flex items-center justify-center ${spinning ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
          <div className="text-4xl">🎡</div>
        </div>
        {result !== null && (
          <div className={`absolute inset-0 flex items-center justify-center text-4xl font-bold ${result === 0 ? 'text-green-500' : redNumbers.includes(result) ? 'text-red-500' : 'text-gray-300'}`}>
            {result}
          </div>
        )}
      </div>

      {/* History */}
      <div className="flex gap-2 justify-center mb-6">
        {history.map((num, i) => (
          <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            num === 0 ? 'bg-green-600' : redNumbers.includes(num) ? 'bg-red-600' : 'bg-gray-700'
          } text-white`}>
            {num}
          </div>
        ))}
      </div>

      {/* Bet controls */}
      <div className="mb-4">
        <label className="text-white mb-2 block">Bet Amount:</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 0))}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-yellow-500 outline-none"
          min="1"
          max={balance}
        />
      </div>

      {/* Bet buttons */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <button
          onClick={() => setBetType('red')}
          disabled={spinning}
          className={`py-3 rounded-lg font-bold transition-all ${
            betType === 'red' ? 'bg-red-600 ring-4 ring-yellow-400' : 'bg-red-800 hover:bg-red-700'
          } ${spinning ? 'opacity-50' : ''} text-white`}
        >
          RED (2x)
        </button>
        <button
          onClick={() => setBetType('green')}
          disabled={spinning}
          className={`py-3 rounded-lg font-bold transition-all ${
            betType === 'green' ? 'bg-green-600 ring-4 ring-yellow-400' : 'bg-green-800 hover:bg-green-700'
          } ${spinning ? 'opacity-50' : ''} text-white`}
        >
          GREEN (35x)
        </button>
        <button
          onClick={() => setBetType('black')}
          disabled={spinning}
          className={`py-3 rounded-lg font-bold transition-all ${
            betType === 'black' ? 'bg-gray-700 ring-4 ring-yellow-400' : 'bg-gray-800 hover:bg-gray-700'
          } ${spinning ? 'opacity-50' : ''} text-white`}
        >
          BLACK (2x)
        </button>
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={spinning || !betType || betAmount > balance}
        className={`w-full py-4 rounded-lg font-bold text-xl transition-all ${
          spinning || !betType || betAmount > balance
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105'
        } text-white`}
      >
        {spinning ? 'SPINNING...' : 'SPIN!'}
      </button>
    </div>
  );
}
