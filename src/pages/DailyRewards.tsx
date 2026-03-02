import { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';

const DAY_REWARDS = [15, 25, 40, 60, 90, 140, 250];

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function DailyRewards() {
  const { updateBalance, gainXP, addTransaction, adminSettings } = useGameStore();
  const [lastClaim, setLastClaim] = useState<string>(() => localStorage.getItem('daily:lastClaim') || '');
  const [streak, setStreak] = useState<number>(() => Number(localStorage.getItem('daily:streak') || '0'));
  const [claimFx, setClaimFx] = useState(false);

  const today = getTodayKey();
  const canClaim = lastClaim !== today;
  const dayIndex = Math.min(6, streak % 7);

  const currentReward = useMemo(() => {
    return Number((DAY_REWARDS[dayIndex] * adminSettings.dailyBonusMultiplier).toFixed(adminSettings.currencyPrecision));
  }, [dayIndex, adminSettings.dailyBonusMultiplier, adminSettings.currencyPrecision]);

  const claimReward = () => {
    if (!canClaim) return;

    const newStreak = streak + 1;
    const newDayIndex = Math.min(6, (newStreak - 1) % 7);
    const reward = Number((DAY_REWARDS[newDayIndex] * adminSettings.dailyBonusMultiplier).toFixed(adminSettings.currencyPrecision));
    const xp = 25 + newDayIndex * 10;

    updateBalance(reward);
    gainXP(xp);
    addTransaction({
      type: 'daily',
      amount: reward,
      description: `Claimed daily reward (day ${newDayIndex + 1})`,
    });

    const todayKey = getTodayKey();
    setLastClaim(todayKey);
    setStreak(newStreak);
    localStorage.setItem('daily:lastClaim', todayKey);
    localStorage.setItem('daily:streak', String(newStreak));

    setClaimFx(true);
    setTimeout(() => setClaimFx(false), 1200);
  };

  return (
    <div className="space-y-6">
      <section className="gaming-card p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-cyan-300">Daily Rewards Terminal</h2>
            <p className="text-slate-400 mt-1">Log in every day to grow your streak and claim bigger payouts.</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current streak</p>
            <p className="text-3xl font-black text-emerald-300">{streak} days</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {DAY_REWARDS.map((base, i) => {
          const scaled = Number((base * adminSettings.dailyBonusMultiplier).toFixed(adminSettings.currencyPrecision));
          const claimed = i < (streak % 7) && !canClaim;
          const active = i === dayIndex;
          return (
            <div
              key={i}
              className={`rounded-xl border p-4 transition-all ${
                active ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(34,211,238,0.18)]' : 'border-slate-700 bg-slate-900/40'
              }`}
            >
              <p className="text-xs uppercase tracking-widest text-slate-500">Day {i + 1}</p>
              <p className="text-lg font-bold text-white mt-2">${scaled.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-1">Base ${base}</p>
              {claimed && <p className="text-xs text-emerald-400 mt-2">Claimed</p>}
            </div>
          );
        })}
      </section>

      <section className="gaming-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-slate-400 text-sm">Today reward</p>
          <p className="text-3xl font-black text-white">${currentReward.toLocaleString()}</p>
        </div>
        <button
          onClick={claimReward}
          disabled={!canClaim}
          className={`px-6 py-3 rounded-lg font-black uppercase tracking-wider transition-all ${
            canClaim
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-[0_0_22px_rgba(16,185,129,0.45)]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          } ${claimFx ? 'scale-105' : ''}`}
        >
          {canClaim ? 'Claim now' : 'Claimed today'}
        </button>
      </section>
    </div>
  );
}
