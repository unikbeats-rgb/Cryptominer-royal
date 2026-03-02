import { useState } from 'react';

interface BlackjackProps {
  onWin: (amount: number) => void;
  balance: number;
}

export default function Blackjack({ onWin, balance }: BlackjackProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'finished'>('betting');
  const [playerHand, setPlayerHand] = useState<number[]>([]);
  const [dealerHand, setDealerHand] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [deck, setDeck] = useState<number[]>([]);

  const createDeck = () => {
    const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const newDeck: number[] = [];
    for (let i = 0; i < 4; i++) {
      for (let value of values) {
        newDeck.push(value);
      }
    }
    return newDeck.sort(() => Math.random() - 0.5);
  };

  const getCardValue = (card: number) => {
    if (card >= 10) return 10;
    if (card === 14) return 11; // Ace
    return card;
  };

  const calculateHand = (hand: number[]) => {
    let sum = 0;
    let aces = 0;
    hand.forEach(card => {
      const value = getCardValue(card);
      sum += value;
      if (card === 14) aces++;
    });
    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces--;
    }
    return sum;
  };

  const dealGame = () => {
    if (betAmount > balance || betAmount <= 0) return;
    
    const newDeck = createDeck();
    const player = [newDeck.pop()!, newDeck.pop()!];
    const dealer = [newDeck.pop()!, newDeck.pop()!];
    
    setDeck(newDeck);
    setPlayerHand(player);
    setDealerHand(dealer);
    setGameState('playing');
    setMessage('');

    if (calculateHand(player) === 21) {
      endGame(player, dealer);
    }
  };

  const hit = () => {
    const newCard = deck.pop()!;
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    
    if (calculateHand(newHand) > 21) {
      endGame(newHand, dealerHand);
    }
  };

  const stand = () => {
    setGameState('dealerTurn');
    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];
    
    while (calculateHand(currentDealerHand) < 17) {
      currentDealerHand.push(currentDeck.pop()!);
    }
    
    setDealerHand(currentDealerHand);
    endGame(playerHand, currentDealerHand);
  };

  const endGame = (player: number[], dealer: number[]) => {
    const playerSum = calculateHand(player);
    const dealerSum = calculateHand(dealer);
    
    let won = false;
    let multiplier = 1;
    
    if (playerSum > 21) {
      setMessage('Bust! You lose.');
    } else if (dealerSum > 21) {
      won = true;
      multiplier = 2;
      setMessage('Dealer busts! You win!');
    } else if (playerSum > dealerSum) {
      won = true;
      multiplier = playerSum === 21 && player.length === 2 ? 2.5 : 2;
      setMessage(playerSum === 21 && player.length === 2 ? 'Blackjack! You win!' : 'You win!');
    } else if (playerSum === dealerSum) {
      multiplier = 1;
      setMessage('Push! Bet returned.');
    } else {
      setMessage('Dealer wins.');
    }
    
    if (won) {
      onWin(betAmount * multiplier);
    }
    
    setGameState('finished');
  };

  const resetGame = () => {
    setGameState('betting');
    setPlayerHand([]);
    setDealerHand([]);
    setDeck([]);
    setMessage('');
  };

  const renderCard = (card: number, hidden = false) => {
    if (hidden) {
      return <div className="w-16 h-24 bg-red-800 rounded-lg flex items-center justify-center text-2xl">🂠</div>;
    }
    
    const value = card >= 10 ? '10' : card === 14 ? 'A' : card;
    const suit = ['♥', '♦', '♣', '♠'][Math.floor(card / 13)];
    const isRed = suit === '♥' || suit === '♦';
    
    return (
      <div className={`w-16 h-24 bg-white rounded-lg flex flex-col items-center justify-center border-2 border-gray-300 ${isRed ? 'text-red-600' : 'text-black'}`}>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-2xl">{suit}</div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-green-800 via-green-900 to-black rounded-xl p-6 border-4 border-yellow-600">
      <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center">🃏 Blackjack</h3>
      
      {/* Dealer hand */}
      <div className="mb-6">
        <p className="text-white mb-2">Dealer: {gameState === 'playing' ? '?' : calculateHand(dealerHand)}</p>
        <div className="flex gap-2">
          {dealerHand.map((card, i) => (
            <div key={i}>{renderCard(card, gameState === 'playing' && i === 1)}</div>
          ))}
        </div>
      </div>

      {/* Player hand */}
      <div className="mb-6">
        <p className="text-white mb-2">You: {calculateHand(playerHand)}</p>
        <div className="flex gap-2">
          {playerHand.map((card, i) => (
            <div key={i}>{renderCard(card)}</div>
          ))}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`text-xl font-bold mb-4 text-center ${message.includes('win') || message.includes('Push') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </div>
      )}

      {/* Betting phase */}
      {gameState === 'betting' && (
        <>
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
          <button
            onClick={dealGame}
            disabled={betAmount > balance || betAmount <= 0}
            className={`w-full py-4 rounded-lg font-bold text-xl transition-all ${
              betAmount > balance || betAmount <= 0
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105'
            } text-white`}
          >
            DEAL
          </button>
        </>
      )}

      {/* Playing phase */}
      {gameState === 'playing' && (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={hit}
            className="py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-white transition-all transform hover:scale-105"
          >
            HIT
          </button>
          <button
            onClick={stand}
            className="py-4 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-white transition-all transform hover:scale-105"
          >
            STAND
          </button>
        </div>
      )}

      {/* Finished phase */}
      {gameState === 'finished' && (
        <button
          onClick={resetGame}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 rounded-lg font-bold text-xl text-white transition-all transform hover:scale-105"
        >
          PLAY AGAIN
        </button>
      )}
    </div>
  );
}
