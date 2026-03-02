import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export const CMRTokenSystem: React.FC = () => {
  const { balance, cmrBalance, cmrStaked, updateBalance, addTransaction, addNotification, gainXP } = useGameStore();
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [exchangeRate] = useState(100); // 1 CMR = $100 USD

  const handleExchange = () => {
    const amount = parseFloat(exchangeAmount);
    if (isNaN(amount) || amount <= 0) {
      addNotification('error', 'Please enter a valid amount');
      return;
    }

    const cmrAmount = amount / exchangeRate;
    const usdAmount = cmrAmount * exchangeRate;

    if (balance < usdAmount) {
      addNotification('error', 'Insufficient USD balance');
      return;
    }

    updateBalance(-usdAmount);
    // Update CMR balance (this would need to be added to store)
    addNotification('success', `Exchanged $${usdAmount.toFixed(2)} for ${cmrAmount.toFixed(6)} CMR`);
    addTransaction({
      type: 'cmr-exchange',
      amount: -usdAmount,
      description: `Exchanged for ${cmrAmount.toFixed(6)} CMR`,
    });
    gainXP(50);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
          <span className="text-3xl">🪙</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">CMR Token System</h2>
          <p className="text-slate-400">CryptoMine Royale Token</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">USD Balance</p>
          <p className="text-2xl font-bold text-emerald-400">${balance.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">CMR Balance</p>
          <p className="text-2xl font-bold text-cyan-400">{cmrBalance?.toFixed(6) || '0.000000'}</p>
        </div>
        <div className="bg-slate-900/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">CMR Staked</p>
          <p className="text-2xl font-bold text-purple-400">{cmrStaked?.toFixed(6) || '0.000000'}</p>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Exchange USD to CMR</h3>
        <p className="text-slate-400 mb-4">Exchange Rate: 1 CMR = ${exchangeRate}</p>
        
        <div className="flex gap-4">
          <input
            type="number"
            value={exchangeAmount}
            onChange={(e) => setExchangeAmount(e.target.value)}
            placeholder="Enter USD amount"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleExchange}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            Exchange
          </button>
        </div>
      </div>
    </div>
  );
};
