import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

const AdvancedFeatures: React.FC = () => {
  const { cards, lands, pets, balance, buyLand, adoptPet, drawCard } = useGameStore();
  const [activeTab, setActiveTab] = useState<'cards' | 'lands' | 'pets' | 'raids' | 'pvp'>('cards');

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-wrap gap-4 mb-8">
        {(['cards', 'lands', 'pets', 'raids', 'pvp'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === tab
                ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'cards' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Trading Cards</h2>
              <p className="text-slate-400">Collect and upgrade cards to boost your mining potential.</p>
            </div>
            <button
              onClick={() => drawCard()}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold text-black hover:scale-105 transition-transform"
            >
              Draw Pack (1000₮)
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`group relative aspect-[2/3] rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                  card.rarity === 'legendary' ? 'border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.3)]' :
                  card.rarity === 'epic' ? 'border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.3)]' :
                  card.rarity === 'rare' ? 'border-blue-500' : 'border-slate-700'
                }`}
              >
                <img src={card.image} alt={card.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    card.rarity === 'legendary' ? 'bg-yellow-500 text-black' :
                    card.rarity === 'epic' ? 'bg-purple-500 text-white' :
                    card.rarity === 'rare' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-white'
                  }`}>
                    {card.rarity}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{card.name}</h3>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-slate-400">{card.type}</span>
                    <span className="text-cyan-400 font-bold">+{card.power} TH/s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'lands' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
          {lands.map((land) => (
            <div key={land.id} className={`relative p-8 rounded-3xl border-2 transition-all duration-500 ${
              land.purchased ? 'bg-slate-900/80 border-cyan-500/50' : 'bg-slate-900/40 border-slate-800'
            }`}>
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-3xl">
                  {land.id === 'l1' ? '🏠' : land.id === 'l2' ? '🏢' : '☁️'}
                </div>
                {land.purchased && <span className="text-xs font-bold bg-cyan-500 text-black px-3 py-1 rounded-full uppercase">Owned</span>}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{land.name}</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Capacity for {land.size} racks with a base efficiency of {land.efficiency}x.
              </p>
              {!land.purchased ? (
                <button
                  onClick={() => buyLand(land.id)}
                  disabled={balance < land.cost}
                  className="w-full py-4 bg-slate-800 rounded-2xl font-bold text-white hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-50 disabled:hover:bg-slate-800 disabled:hover:text-white"
                >
                  Purchase for {land.cost}₮
                </button>
              ) : (
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <span className="text-sm uppercase tracking-tighter">Ready for expansion</span>
                  <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-cyan-500 animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pets' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-6">Adopt a Companion</h2>
              <div className="grid grid-cols-2 gap-4">
                {['Cyber-Cat', 'Neon-Hedgehog', 'Robot-Pup', 'Ether-Owl'].map((pet) => (
                  <button
                    key={pet}
                    onClick={() => adoptPet(pet)}
                    className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl text-center hover:border-cyan-500 transition-all group"
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                      {pet === 'Cyber-Cat' ? '🐈' : pet === 'Neon-Hedgehog' ? '🦔' : pet === 'Robot-Pup' ? '🐶' : '🦉'}
                    </div>
                    <span className="font-bold text-white block">{pet}</span>
                    <span className="text-xs text-slate-400 mt-2 block">2500₮</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">Your Pets ({pets.length})</h2>
              {pets.map((pet) => (
                <div key={pet.id} className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-4xl shadow-inner">
                    {pet.type.includes('Cat') ? '🐈' : pet.type.includes('Hedgehog') ? '🦔' : pet.type.includes('Pup') ? '🐶' : '🦉'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold text-white">{pet.name}</h3>
                      <span className="text-cyan-400 font-bold">Lvl {pet.level}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-cyan-500" style={{ width: `${pet.experience % 100}%` }} />
                    </div>
                    <p className="text-xs text-slate-400">Mining Bonus: +{(pet.bonus * 100).toFixed(1)}% Hashpower</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'raids' || activeTab === 'pvp') && (
        <div className="h-96 flex flex-col items-center justify-center text-center space-y-4 bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-800">
          <div className="text-6xl animate-bounce">⚡</div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">System Synchronizing</h2>
          <p className="text-slate-400 max-w-md italic">
            {activeTab === 'raids' ? 'Global boss raid "Mega-Server Omega" is currently spawning in the network...' : 'PvP matchmaking servers are being secured for high-stakes competition.'}
          </p>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFeatures;
