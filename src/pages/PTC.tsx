import { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function PTC() {
  const {
    balance,
    energy,
    ptcAds,
    viewPtcAd,
    createPtcAd,
    adCooldowns,
    setAdCooldown,
    adminSettings,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'earn' | 'advertise'>('earn');
  const [newAd, setNewAd] = useState({
    title: '',
    url: '',
    reward: adminSettings.ptcMinRewardUsd,
    duration: Math.max(adminSettings.ptcMinDurationSeconds, 15),
    clicks: 100,
    platform: 'Youtube' as 'Youtube' | 'Tiktok' | 'Soundcloud' | 'Spotify' | 'Other',
  });

  const [viewingAd, setViewingAd] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeFocusSeconds, setActiveFocusSeconds] = useState(0);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const activeAd = useMemo(
    () => (viewingAd ? ptcAds.find((a) => a.id === viewingAd) ?? null : null),
    [ptcAds, viewingAd],
  );

  const duration = activeAd?.duration ?? 0;
  const remaining = Math.max(0, duration - activeFocusSeconds);
  const progressPct = duration > 0 ? (activeFocusSeconds / duration) * 100 : 0;
  const requiresFocus = adminSettings.ptcRequireTabFocus;
  const trackingActive = !!activeAd && isPlaying && (!requiresFocus || isPageVisible);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      setIsPageVisible(!document.hidden && document.hasFocus());
    };

    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    window.addEventListener('focus', updateVisibility);
    window.addEventListener('blur', updateVisibility);
    return () => {
      document.removeEventListener('visibilitychange', updateVisibility);
      window.removeEventListener('focus', updateVisibility);
      window.removeEventListener('blur', updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!activeAd || !trackingActive) return;

    const timer = setInterval(() => {
      setActiveFocusSeconds((prev) => {
        const next = prev + 1;
        if (next >= (activeAd.duration || 0)) {
          viewPtcAd(activeAd.id);
          setViewingAd(null);
          setIsPlaying(false);
          return activeAd.duration;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeAd, trackingActive, viewPtcAd]);

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = Math.max(
      adminSettings.ptcMinDurationSeconds,
      Math.min(adminSettings.ptcMaxDurationSeconds, newAd.duration),
    );
    const reward = Math.max(adminSettings.ptcMinRewardUsd, newAd.reward);
    const totalCost = reward * newAd.clicks * 1.2;

    if (balance < totalCost) {
      alert('Insufficient balance to create this ad campaign.');
      return;
    }

    createPtcAd({ ...newAd, duration, reward });
    alert('Ad campaign created successfully!');
    setNewAd({
      title: '',
      url: '',
      reward: adminSettings.ptcMinRewardUsd,
      duration: Math.max(adminSettings.ptcMinDurationSeconds, 15),
      clicks: 100,
      platform: 'Youtube',
    });
  };

  const startViewing = (adId: string, url: string) => {
    const cooldownEnd = adCooldowns[adId] || 0;
    if (Date.now() < cooldownEnd) {
      const remainingSeconds = Math.ceil((cooldownEnd - Date.now()) / 1000);
      alert(
        `Security lock active: wait ${Math.floor(remainingSeconds / 60)}m ${remainingSeconds % 60}s before retrying this link.`,
      );
      return;
    }
    if (energy < 1) {
      alert('Not enough energy to view ads.');
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
    setViewingAd(adId);
    setActiveFocusSeconds(0);
    setIsPlaying(!adminSettings.ptcRequireManualPlay);
  };

  const cancelViewing = () => {
    if (!viewingAd) return;
    setAdCooldown(viewingAd, adminSettings.ptcEarlyExitCooldownMinutes);
    setViewingAd(null);
    setActiveFocusSeconds(0);
    setIsPlaying(false);
  };

  return (
    <div className="animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-display uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Network Terminal
          </h1>
          <p className="text-gray-400 font-mono text-sm uppercase">
            Direct-link paid-to-click with anti-tab-switch security
          </p>
        </div>
        <div className="flex gap-2 bg-[#0b1120] p-1.5 rounded-xl border border-cyan-500/20 shadow-inner">
          <button
            onClick={() => setActiveTab('earn')}
            className={`px-8 py-2.5 rounded-lg transition-all font-bold uppercase tracking-widest text-xs ${
              activeTab === 'earn'
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            Verify Links
          </button>
          <button
            onClick={() => setActiveTab('advertise')}
            className={`px-8 py-2.5 rounded-lg transition-all font-bold uppercase tracking-widest text-xs ${
              activeTab === 'advertise'
                ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            Broadcast
          </button>
        </div>
      </div>

      {activeAd && (
        <div className="fixed inset-0 z-50 bg-[#030712]/95 backdrop-blur-3xl flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0b1120]/90 border border-cyan-500/30 rounded-2xl p-8 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white uppercase tracking-widest font-display">
                Link Verification Active
              </h2>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300">
                {activeAd.platform}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => setIsPlaying(true)}
                className={`px-4 py-3 rounded-lg border text-xs uppercase tracking-widest font-bold ${
                  isPlaying
                    ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                    : 'border-slate-700 text-slate-400 hover:border-emerald-500/40'
                }`}
              >
                Start Tracking
              </button>
              <button
                onClick={() => setIsPlaying(false)}
                className={`px-4 py-3 rounded-lg border text-xs uppercase tracking-widest font-bold ${
                  !isPlaying
                    ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                    : 'border-slate-700 text-slate-400 hover:border-amber-500/40'
                }`}
              >
                Pause Tracking
              </button>
              <button
                onClick={cancelViewing}
                className="px-4 py-3 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10 text-xs uppercase tracking-widest font-bold"
              >
                Terminate
              </button>
            </div>

            <div className="w-full bg-slate-900/60 rounded-xl p-5 border border-slate-700/50 mb-4 shadow-inner">
              <div className="flex justify-between items-center mb-3 text-xs uppercase tracking-widest">
                <span className="text-slate-400">Verification progress</span>
                <span className="text-cyan-300 font-mono">{Math.round(progressPct)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, progressPct))}%` }}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-black/40 rounded p-2 border border-slate-800">
                  <div className="text-slate-500">Remaining</div>
                  <div className="text-white font-mono text-lg">{remaining}s</div>
                </div>
                <div className="bg-black/40 rounded p-2 border border-slate-800">
                  <div className="text-slate-500">Active focus</div>
                  <div className="text-emerald-300 font-mono text-lg">{activeFocusSeconds}s</div>
                </div>
                <div className="bg-black/40 rounded p-2 border border-slate-800">
                  <div className="text-slate-500">Tab state</div>
                  <div className={`font-bold ${isPageVisible ? 'text-cyan-300' : 'text-red-300'}`}>
                    {isPageVisible ? 'VISIBLE' : 'HIDDEN'}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/15 p-4 text-xs text-cyan-100 leading-relaxed">
              {!trackingActive && (
                <p>
                  Timer paused. {adminSettings.ptcRequireTabFocus ? 'Keep this tab focused and visible.' : ''}{' '}
                  Press <strong>Start Tracking</strong> when media is actively playing.
                </p>
              )}
              {trackingActive && <p>Verification running: active focus and play tracking confirmed.</p>}
              {activeAd.platform === 'Spotify' && (
                <p className="mt-2 text-emerald-300 font-semibold">
                  Syncing Spotify Stream... counting only focused play-time for legitimate playback verification.
                </p>
              )}
              {(activeAd.platform === 'Youtube' || activeAd.platform === 'Soundcloud') && (
                <p className="mt-2 text-cyan-300">
                  YouTube/SoundCloud legitimacy check enabled: countdown pauses on tab switch or minimized window.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'earn' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {ptcAds
            .filter((ad) => ad.clicksLeft > 0)
            .map((ad) => {
              const cooldownEnd = adCooldowns[ad.id] || 0;
              const isLocked = currentTime < cooldownEnd;
              const remainingSeconds = isLocked
                ? Math.ceil((cooldownEnd - currentTime) / 1000)
                : 0;

              return (
                <div key={ad.id} className={`gaming-card p-6 relative ${isLocked ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white font-display">{ad.title}</h3>
                    <span className="text-emerald-300 font-mono text-sm">
                      +{ad.reward.toFixed(adminSettings.currencyPrecision)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mb-4">
                    <div>Platform: {ad.platform}</div>
                    <div>Duration: {ad.duration}s</div>
                    <div>Cycles left: {ad.clicksLeft}</div>
                    <div>Energy cost: 1</div>
                  </div>
                  <button
                    onClick={() => startViewing(ad.id, ad.url)}
                    disabled={isLocked || !!activeAd}
                    className="btn-gaming w-full"
                  >
                    {isLocked
                      ? `Locked ${Math.floor(remainingSeconds / 60)}:${(remainingSeconds % 60)
                          .toString()
                          .padStart(2, '0')}`
                      : 'Open Link + Verify'}
                  </button>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto gaming-card p-8">
          <h2 className="text-2xl font-display text-white mb-6">Create PTC Campaign</h2>
          <form onSubmit={handleCreateAd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              required
              value={newAd.title}
              onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
              placeholder="Campaign title"
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
            />
            <input
              type="url"
              required
              value={newAd.url}
              onChange={(e) => setNewAd({ ...newAd, url: e.target.value })}
              placeholder="https://..."
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
            />
            <select
              value={newAd.platform}
              onChange={(e) =>
                setNewAd({
                  ...newAd,
                  platform: e.target.value as 'Youtube' | 'Tiktok' | 'Soundcloud' | 'Spotify' | 'Other',
                })
              }
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
            >
              <option value="Youtube">YouTube</option>
              <option value="Spotify">Spotify</option>
              <option value="Soundcloud">SoundCloud</option>
              <option value="Tiktok">TikTok</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="number"
              min={adminSettings.ptcMinRewardUsd}
              step={adminSettings.ptcMinRewardUsd}
              value={newAd.reward}
              onChange={(e) =>
                setNewAd({
                  ...newAd,
                  reward: Number(e.target.value) || adminSettings.ptcMinRewardUsd,
                })
              }
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-cyan-300"
            />
            <input
              type="number"
              min={adminSettings.ptcMinDurationSeconds}
              max={adminSettings.ptcMaxDurationSeconds}
              value={newAd.duration}
              onChange={(e) => setNewAd({ ...newAd, duration: Number(e.target.value) || 10 })}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
            />
            <input
              type="number"
              min={10}
              value={newAd.clicks}
              onChange={(e) => setNewAd({ ...newAd, clicks: Number(e.target.value) || 10 })}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
            />

            <div className="md:col-span-2 rounded-lg bg-slate-900/60 border border-slate-700 p-4 text-sm text-slate-300">
              Total cost (incl. 20% fee):{' '}
              <span className="text-purple-300 font-mono">
                {(newAd.reward * newAd.clicks * 1.2).toFixed(adminSettings.currencyPrecision)}
              </span>
            </div>

            <button type="submit" className="md:col-span-2 btn-gaming py-4">
              Launch Campaign
            </button>
          </form>
        </div>
      )}
    </div>
  );
}