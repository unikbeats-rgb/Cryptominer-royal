import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function Lootboxes() {
  const { lootboxes, balance, openLootbox, devices, parts } = useGameStore();
  const [openingBox, setOpeningBox] = useState<string | null>(null);
  const [reward, setReward] = useState<{ name: string; icon: string; type: string } | null>(null);

  const handleOpen = (boxId: string, cost: number) => {
    if (balance < cost || openingBox) return;

    setOpeningBox(boxId);
    setReward(null);

    // Simulate opening animation delay
    setTimeout(() => {
      const result = openLootbox(boxId);
      if (result) {
        const item = result.itemType === 'device' 
          ? devices.find(d => d.id === result.itemId) 
          : parts.find(p => p.id === result.itemId);

        if (item) {
          setReward({
            name: item.name,
            icon: 'emoji' in item ? item.emoji : item.icon,
            type: result.itemType,
          });
        }
      }
      setOpeningBox(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 neon-text uppercase tracking-widest">
            Mystery Crates
          </h1>
          <p className="text-slate-400 text-sm mt-1">Unlock high-tier miners and rare parts.</p>
        </div>
      </div>

      {reward && (
        <div className="p-6 rounded-2xl bg-[#1e2538]/80 border border-purple-500/50 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.2)] text-center animate-slide-in-bottom">
          <div className="text-4xl mb-3 animate-bounce">{reward.icon}</div>
          <h3 className="text-xl font-bold text-white mb-1">You won: {reward.name}!</h3>
          <p className="text-purple-400 text-sm uppercase tracking-wider">Item added to your inventory</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lootboxes.map((box) => (
          <div 
            key={box.id}
            className={`relative p-6 rounded-2xl bg-[#1e2538]/60 border border-slate-700 backdrop-blur-sm overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            style={{ '--box-color': box.color } as React.CSSProperties}
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[var(--box-color)] opacity-10 blur-[50px] pointer-events-none" />
            
            <div className={`text-6xl text-center mb-4 transition-transform duration-300 ${openingBox === box.id ? 'animate-shake' : 'group-hover:scale-110'}`}>
              {box.icon}
            </div>
            
            <h3 className="text-xl font-bold text-white text-center mb-2" style={{ color: box.color }}>
              {box.name}
            </h3>
            
            <p className="text-slate-400 text-xs text-center mb-6 min-h-[40px]">
              {box.description}
            </p>

            <div className="space-y-2 mb-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Drop Chances</p>
              <div className="bg-black/40 rounded-xl p-3 space-y-1">
                {box.dropRates.map((drop, idx) => {
                  const item = drop.type === 'device' 
                    ? devices.find(d => d.id === drop.itemId) 
                    : parts.find(p => p.id === drop.itemId);
                  
                  return (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-slate-300 truncate max-w-[120px]">{item?.name || 'Unknown'}</span>
                      <span className="text-cyan-400 font-mono">{(drop.chance * 100).toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => handleOpen(box.id, box.cost)}
              disabled={balance < box.cost || openingBox !== null}
              className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                balance >= box.cost && !openingBox
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/50'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {openingBox === box.id ? 'Opening...' : `Open for ₮${box.cost}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
