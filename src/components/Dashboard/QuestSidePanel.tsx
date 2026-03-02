import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CheckCircle2, Clock, Crown, Zap } from 'lucide-react';

export const QuestSidePanel: React.FC = () => {
  const { quests } = useGameStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  const filteredQuests = quests.filter(q => q.type === activeTab);

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm h-full max-h-[calc(100vh-200px)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-orbitron text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Crown size={20} />
            Weekend Quest
          </h3>
          <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full text-[10px] font-black border border-purple-500/30 animate-pulse">
            6 ACTIVE
          </span>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 group hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
              <Zap size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-tight">Earn 7 RLT</p>
              <p className="text-[10px] text-white/50">Task Wall or Surveys</p>
            </div>
          </div>
          
          <div className="relative w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-fuchsia-400 w-[15%]" />
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Progress 0/7</span>
            <button className="bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black px-4 py-1.5 rounded-lg transition-all active:scale-95 uppercase tracking-wider">
              Start Now
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('daily')}
              className={`text-sm font-black transition-all pb-1 border-b-2 ${
                activeTab === 'daily' ? 'text-cyan-400 border-cyan-400' : 'text-white/40 border-transparent hover:text-white'
              }`}
            >
              DAILY
            </button>
            <button 
              onClick={() => setActiveTab('weekly')}
              className={`text-sm font-black transition-all pb-1 border-b-2 ${
                activeTab === 'weekly' ? 'text-cyan-400 border-cyan-400' : 'text-white/40 border-transparent hover:text-white'
              }`}
            >
              WEEKLY
            </button>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-white/40 font-bold">
            <Clock size={12} />
            7h : 15m
          </div>
        </div>

        {filteredQuests.map((quest) => (
          <div key={quest.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 group hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-black text-white uppercase tracking-tight line-clamp-1">{quest.title}</p>
              {quest.completed && <CheckCircle2 size={14} className="text-green-400" />}
            </div>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-[9px] text-white/40 font-bold uppercase">Reward</span>
                  <span className="text-[10px] text-cyan-400 font-black">{quest.reward} XP / ₮{quest.reward * 0.1}</span>
                </div>
              </div>
              <button 
                disabled={quest.completed}
                className={`text-[10px] font-black px-4 py-1.5 rounded-lg transition-all active:scale-95 uppercase tracking-wider ${
                  quest.completed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {quest.completed ? 'Done' : 'Start'}
              </button>
            </div>
          </div>
        ))}

        <button className="w-full py-3 rounded-2xl border border-white/10 text-white/40 text-[11px] font-black hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest mt-2">
          More Quests
        </button>
      </div>
    </div>
  );
};