import { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';

type Tab = 'exchange' | 'staking' | 'geo' | 'market';

export default function CMRTokens() {
  const {
    adminSettings,
    balance,
    cmrBalance,
    cmrStaked,
    cmrEarned,
    user,
    stakingPools,
    tokenListings,
    exchangeUSDToCMR,
    exchangeCMRToUSD,
    stakeCMR,
    unstakeCMR,
    claimStakingRewards,
    createTokenListing,
    buyTokens,
    cancelTokenListing,
    enableGeoMining,
    disableGeoMining,
    addNotification,
  } = useGameStore();

  const [tab, setTab] = useState<Tab>('exchange');
  const [usdAmount, setUsdAmount] = useState('10');
  const [cmrAmount, setCmrAmount] = useState('10');
  const [stakeAmount, setStakeAmount] = useState('25');
  const [listAmount, setListAmount] = useState('10');
  const [listPrice, setListPrice] = useState('0.2');

  const rate = adminSettings.cmrExchangeRate;
  const myListings = tokenListings.filter((l) => l.seller === user.username);
  const publicListings = tokenListings.filter((l) => l.seller !== user.username);

  const geoStatus = useMemo(() => {
    if (!adminSettings.geoMiningEnabled) return 'Disabled by admin';
    if (!user.geoMiningEnabled) return 'Inactive';
    return `Active (${user.geoMiningPower.toFixed(2)} TH/s bonus)`;
  }, [adminSettings.geoMiningEnabled, user.geoMiningEnabled, user.geoMiningPower]);

  const activateGeo = () => {
    if (!navigator.geolocation) {
      addNotification('error', 'Geolocation is not supported on this device');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => enableGeoMining(pos.coords.latitude, pos.coords.longitude),
      () => addNotification('error', 'Location permission denied'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="space-y-6">
      <div className="gaming-card p-6">
        <h1 className="text-3xl font-black text-white mb-2">CMR Token Hub</h1>
        <p className="text-slate-400 text-sm">Internal token economy: exchange, staking, GEO mining, and token market.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
            <p className="text-xs text-slate-300">USD Treasury</p>
            <p className="text-xl font-bold text-white">${balance.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-xs text-slate-300">CMR Balance</p>
            <p className="text-xl font-bold text-amber-300">{cmrBalance.toFixed(6)}</p>
          </div>
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
            <p className="text-xs text-slate-300">CMR Staked</p>
            <p className="text-xl font-bold text-purple-300">{cmrStaked.toFixed(6)}</p>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-xs text-slate-300">CMR Earned</p>
            <p className="text-xl font-bold text-emerald-300">{cmrEarned.toFixed(6)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ['exchange', 'Exchange'],
          ['staking', 'Staking'],
          ['geo', 'GEO Mining'],
          ['market', 'Token Market'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id as Tab)}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest ${
              tab === id
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'exchange' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="gaming-card p-6 space-y-3">
            <h3 className="text-xl text-white font-bold">USD → CMR</h3>
            <p className="text-xs text-slate-400">Rate: 1 CMR = ${rate.toFixed(4)}</p>
            <input
              type="number"
              value={usdAmount}
              min={0.01}
              onChange={(e) => setUsdAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
            <button
              onClick={() => exchangeUSDToCMR(Number(usdAmount) || 0)}
              className="btn-gaming w-full"
            >
              Buy CMR
            </button>
          </div>
          <div className="gaming-card p-6 space-y-3">
            <h3 className="text-xl text-white font-bold">CMR → USD</h3>
            <p className="text-xs text-slate-400">Rate: 1 CMR = ${rate.toFixed(4)}</p>
            <input
              type="number"
              value={cmrAmount}
              min={0.000001}
              onChange={(e) => setCmrAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
            <button
              onClick={() => exchangeCMRToUSD(Number(cmrAmount) || 0)}
              className="btn-gaming w-full"
            >
              Sell CMR
            </button>
          </div>
        </div>
      )}

      {tab === 'staking' && (
        <div className="space-y-4">
          {stakingPools.map((pool) => (
            <div key={pool.id} className="gaming-card p-6">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div>
                  <h3 className="text-white text-lg font-bold">{pool.name}</h3>
                  <p className="text-xs text-slate-400">
                    APY {pool.apy}% • Min {pool.minStake} CMR • Lock {(pool.lockPeriod / (24 * 60 * 60 * 1000)).toFixed(0)} days
                  </p>
                </div>
                <div className="text-xs text-slate-300">You staked: <span className="text-purple-300 font-bold">{pool.userStaked.toFixed(6)}</span></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
                <button className="btn-gaming" onClick={() => stakeCMR(Number(stakeAmount) || 0, pool.id)}>Stake</button>
                <button className="btn-gaming-secondary" onClick={() => unstakeCMR(Number(stakeAmount) || 0, pool.id)}>Unstake</button>
                <button className="btn-gaming" onClick={() => claimStakingRewards(pool.id)}>Claim Rewards</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'geo' && (
        <div className="gaming-card p-6 space-y-4">
          <h3 className="text-xl text-white font-bold">GEO Mining</h3>
          <p className="text-sm text-slate-400">Location-based mining with device GPS. Bonus power updates in intervals.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-xs text-slate-500">Status</p>
              <p className="text-sm font-bold text-cyan-300">{geoStatus}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-xs text-slate-500">Power Multiplier</p>
              <p className="text-sm font-bold text-cyan-300">{adminSettings.geoMiningPowerMultiplier.toFixed(2)}x</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-xs text-slate-500">Location Radius</p>
              <p className="text-sm font-bold text-cyan-300">{adminSettings.geoMiningLocationRadius} km</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn-gaming" onClick={activateGeo}>Enable with GPS</button>
            <button className="btn-gaming-secondary" onClick={disableGeoMining}>Disable GEO Mining</button>
          </div>
          {user.geoMiningLocation && (
            <p className="text-xs text-slate-500">
              Current location: {user.geoMiningLocation.lat.toFixed(4)}, {user.geoMiningLocation.lng.toFixed(4)}
            </p>
          )}
        </div>
      )}

      {tab === 'market' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="gaming-card p-6 space-y-3">
            <h3 className="text-xl text-white font-bold">Create Listing</h3>
            <input type="number" value={listAmount} onChange={(e) => setListAmount(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Amount CMR" />
            <input type="number" value={listPrice} onChange={(e) => setListPrice(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="USD per CMR" />
            <button className="btn-gaming w-full" onClick={() => createTokenListing(Number(listAmount) || 0, Number(listPrice) || 0)}>List Tokens</button>
            <p className="text-xs text-slate-500">Marketplace fee: {(adminSettings.tokenMarketplaceFee * 100).toFixed(2)}%</p>
          </div>
          <div className="gaming-card p-6 space-y-3">
            <h3 className="text-xl text-white font-bold">My Listings ({myListings.length})</h3>
            {myListings.length === 0 && <p className="text-slate-500 text-sm">No listings yet.</p>}
            {myListings.map((l) => (
              <div key={l.id} className="rounded-lg border border-slate-700 p-3 text-sm flex justify-between items-center">
                <div>
                  <p className="text-white font-semibold">{l.amount.toFixed(6)} CMR</p>
                  <p className="text-slate-400 text-xs">${l.pricePerToken.toFixed(4)} / CMR</p>
                </div>
                <button className="btn-gaming-secondary" onClick={() => cancelTokenListing(l.id)}>Cancel</button>
              </div>
            ))}
          </div>

          <div className="xl:col-span-2 gaming-card p-6 space-y-3">
            <h3 className="text-xl text-white font-bold">Public Listings ({publicListings.length})</h3>
            {publicListings.length === 0 && <p className="text-slate-500 text-sm">No public listings right now.</p>}
            {publicListings.map((l) => (
              <div key={l.id} className="rounded-lg border border-slate-700 p-3 text-sm flex justify-between items-center">
                <div>
                  <p className="text-white font-semibold">{l.amount.toFixed(6)} CMR • ${l.totalPrice.toFixed(2)}</p>
                  <p className="text-slate-400 text-xs">Seller: {l.seller} • ${l.pricePerToken.toFixed(4)} per CMR</p>
                </div>
                <button className="btn-gaming" onClick={() => buyTokens(l.id)}>Buy</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
