import { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';

type UpgradeId = 'efficiency' | 'neural' | 'economy' | 'pool';

interface UpgradeDef {
  id: UpgradeId;
  name: string;
  description: string;
  baseCost: number;
  maxLevel: number;
}

const UPGRADES: UpgradeDef[] = [
  {
    id: 'efficiency',
    name: 'Reactor Efficiency',
    description: 'Reduces energy cost for mining cycles.',
    baseCost: 750,
    maxLevel: 10,
  },
  {
    id: 'neural',
    name: 'Neural XP Matrix',
    description: 'Improves XP gain from all activities.',
    baseCost: 900,
    maxLevel: 10,
  },
  {
    id: 'economy',
    name: 'Quantum Economy',
    description: 'Boosts game and quest rewards.',
    baseCost: 1250,
    maxLevel: 10,
  },
  {
    id: 'pool',
    name: 'Pool Dominance AI',
    description: 'Increases pool reward per power contribution.',
    baseCost: 1600,
    maxLevel: 10,
  },
];

function nextCost(base: number, level: number) {
  return Math.floor(base * Math.pow(1.35, level));
}

export default function ResearchLab() {
  const {
    balance,
    adminSettings,
    updateAdminSettings,
    updateBalance,
    addTransaction,
  } = useGameStore();

  const [levels, setLevels] = useState<Record<UpgradeId, number>>(() => {
    const raw = localStorage.getItem('lab:levels');
    if (!raw) return { efficiency: 0, neural: 0, economy: 0, pool: 0 };
    try {
      return JSON.parse(raw) as Record<UpgradeId, number>;
    } catch {
      return { efficiency: 0, neural: 0, economy: 0, pool: 0 };
    }
  });

  const totalLevel = useMemo(() => Object.values(levels).reduce((sum, value) => sum + value, 0), [levels]);

  const purchaseUpgrade = (upgrade: UpgradeDef) => {
    const level = levels[upgrade.id] || 0;
    if (level >= upgrade.maxLevel) return;

    const cost = nextCost(upgrade.baseCost, level);
    if (balance < cost) return;

    const updatedLevels = { ...levels, [upgrade.id]: level + 1 };
    setLevels(updatedLevels);
    localStorage.setItem('lab:levels', JSON.stringify(updatedLevels));

    updateBalance(-cost);

    if (upgrade.id === 'efficiency') {
      updateAdminSettings({ energyCostMultiplier: Math.max(0.4, adminSettings.energyCostMultiplier - 0.03) });
    }
    if (upgrade.id === 'neural') {
      updateAdminSettings({ xpGainMultiplier: Math.min(4, adminSettings.xpGainMultiplier + 0.08) });
    }
    if (upgrade.id === 'economy') {
      updateAdminSettings({
        gameRewardMultiplier: Math.min(5, adminSettings.gameRewardMultiplier + 0.06),
        questRewardMultiplier: Math.min(5, adminSettings.questRewardMultiplier + 0.04),
      });
    }
    if (upgrade.id === 'pool') {
      updateAdminSettings({ poolRewardPerPower: Math.min(3, adminSettings.poolRewardPerPower + 0.03) });
    }

    addTransaction({
      type: 'research',
      amount: -cost,
      description: `Upgraded ${upgrade.name} to level ${level + 1}`,
    });
  };

  return (
    <div className="space-y-6">
      <section className="gaming-card p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-cyan-300">Research Lab</h2>
            <p className="text-slate-400 mt-1">Permanent account progression with stackable tech upgrades.</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Lab score</p>
            <p className="text-3xl font-black text-white">LVL {totalLevel}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {UPGRADES.map((upgrade) => {
          const level = levels[upgrade.id] || 0;
          const maxed = level >= upgrade.maxLevel;
          const cost = nextCost(upgrade.baseCost, level);
          const canBuy = !maxed && balance >= cost;
          const progress = (level / upgrade.maxLevel) * 100;

          return (
            <article key={upgrade.id} className="gaming-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{upgrade.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{upgrade.description}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full border border-cyan-500/40 text-cyan-300">
                  Lv {level}/{upgrade.maxLevel}
                </span>
              </div>

              <div className="mt-4 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${progress}%` }} />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-sm text-slate-300">Cost: <span className="font-bold text-white">${cost.toLocaleString()}</span></p>
                <button
                  onClick={() => purchaseUpgrade(upgrade)}
                  disabled={!canBuy}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                    maxed
                      ? 'bg-emerald-900/40 text-emerald-300 cursor-default'
                      : canBuy
                      ? 'bg-cyan-500 text-black hover:bg-cyan-400'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {maxed ? 'Maxed' : 'Upgrade'}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
