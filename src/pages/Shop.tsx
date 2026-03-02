import { useGameStore } from '../store/gameStore';

export default function Shop() {
  const { devices, balance, buyDevice, miningMultiplier, upgradeMiningMultiplier, adminSettings } = useGameStore();

  const upgradeMultiplierCost = Math.floor(1000 * Math.pow(1.5, miningMultiplier));
  const canUpgradeMultiplier = balance >= upgradeMultiplierCost;

  return (
    <div className="space-y-6">
      {/* Shop Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 shadow-2xl border-2 border-green-400/30">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          🏪 Mining Equipment Shop
        </h1>
        <p className="text-green-100 text-lg">
          Upgrade your mining power with cutting-edge devices
        </p>
      </div>

      {/* Multiplier Upgrade */}
      <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">⬆️ Mining Multiplier Upgrade</h2>
            <p className="text-yellow-300">Current multiplier: <span className="font-bold text-2xl">{miningMultiplier.toFixed(1)}x</span></p>
            <p className="text-yellow-400 text-sm mt-1">Increase all mining earnings by 10%</p>
          </div>
          <button
            onClick={upgradeMiningMultiplier}
            disabled={!canUpgradeMultiplier}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
              canUpgradeMultiplier
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white shadow-lg'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Upgrade for ${upgradeMultiplierCost}
          </button>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {devices.map((device) => {
          const actualCost = device.cost * adminSettings.deviceCostMultiplier;
          const canBuy = balance >= actualCost && device.owned < device.maxQuantity;
          const isMaxed = device.owned >= device.maxQuantity;

          return (
            <div
              key={device.id}
              className={`bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm border rounded-xl p-5 shadow-lg transition-all duration-300 ${
                canBuy 
                  ? 'border-green-500/50 hover:border-green-400 hover:shadow-green-500/20 transform hover:scale-105' 
                  : isMaxed
                  ? 'border-yellow-500/30'
                  : 'border-gray-700'
              }`}
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{device.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-1">{device.name}</h3>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  device.tier <= 2 ? 'bg-green-900/50 text-green-300' :
                  device.tier <= 4 ? 'bg-blue-900/50 text-blue-300' :
                  device.tier <= 6 ? 'bg-purple-900/50 text-purple-300' :
                  'bg-pink-900/50 text-pink-300'
                }`}>
                  Tier {device.tier}
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-purple-300">
                  <span>⚡ Power:</span>
                  <span className="font-bold text-white">{device.power} TH/s</span>
                </div>
                <div className="flex justify-between text-yellow-300">
                  <span>🔋 Energy Cost:</span>
                  <span className="font-bold text-white">{device.energyCost}/s</span>
                </div>
                <div className="flex justify-between text-green-300">
                  <span>💵 Cost:</span>
                  <span className="font-bold text-white">${actualCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-blue-300">
                  <span>📦 Owned:</span>
                  <span className="font-bold text-white">{device.owned}/{device.maxQuantity}</span>
                </div>
              </div>

              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
                  style={{ width: `${(device.owned / device.maxQuantity) * 100}%` }}
                />
              </div>

              <button
                onClick={() => buyDevice(device.id)}
                disabled={!canBuy}
                className={`w-full py-3 rounded-lg font-bold transition-all duration-200 ${
                  isMaxed
                    ? 'bg-yellow-900/30 text-yellow-500 cursor-not-allowed'
                    : canBuy
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isMaxed ? '✓ MAXED OUT' : canBuy ? '🛒 BUY NOW' : '🔒 INSUFFICIENT FUNDS'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
