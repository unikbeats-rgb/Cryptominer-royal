import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

const MergeLab = () => {
  const [mergeMode, setMergeMode] = useState<'miners' | 'parts'>('miners');
  const [selectedMiners, setSelectedMiners] = useState<string[]>([]);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  const { devices, parts, mergeMiners, mergeParts } = useGameStore();

  const ownedMiners = devices.filter(d => d.owned >= 2);
  const ownedParts = parts.filter(p => p.quantity >= 3);

  const handleSelectMiner = (deviceId: string) => {
    if (selectedMiners.includes(deviceId)) {
      setSelectedMiners(selectedMiners.filter(id => id !== deviceId));
    } else if (selectedMiners.length < 2) {
      setSelectedMiners([...selectedMiners, deviceId]);
    }
  };

  const handleSelectPart = (partId: string) => {
    if (selectedParts.includes(partId)) {
      setSelectedParts(selectedParts.filter(id => id !== partId));
    } else if (selectedParts.length < 3) {
      setSelectedParts([...selectedParts, partId]);
    }
  };

  const handleMergeMiners = () => {
    if (selectedMiners.length === 2 && selectedMiners[0] === selectedMiners[1]) {
      mergeMiners(selectedMiners[0]);
      setSelectedMiners([]);
    }
  };

  const handleMergeParts = () => {
    if (selectedParts.length === 3 && selectedParts.every(id => id === selectedParts[0])) {
      mergeParts(selectedParts[0]);
      setSelectedParts([]);
    }
  };

  const getMergePower = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return 0;
    return (device.power * 1.4).toFixed(1);
  };

  const canMergeMiners = selectedMiners.length === 2 && selectedMiners[0] === selectedMiners[1];
  const canMergeParts = selectedParts.length === 3 && selectedParts.every(id => id === selectedParts[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">🧬 Merge Lab</h2>
        <p className="text-gray-400">Combine miners and parts to create more powerful equipment</p>
      </div>

      {/* Mode Selection */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => {
            setMergeMode('miners');
            setSelectedMiners([]);
          }}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
            mergeMode === 'miners'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
              : 'bg-[#151a28] text-gray-400 border border-gray-700 hover:border-cyan-500/30'
          }`}
        >
          ⛏️ Merge Miners
        </button>
        <button
          onClick={() => {
            setMergeMode('parts');
            setSelectedParts([]);
          }}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
            mergeMode === 'parts'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-[#151a28] text-gray-400 border border-gray-700 hover:border-purple-500/30'
          }`}
        >
          🔧 Merge Parts
        </button>
      </div>

      {mergeMode === 'miners' && (
        <div className="space-y-6">
          {/* Info Panel */}
          <div className="gaming-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Miner Merging</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-gray-400 text-sm">Power Boost</div>
                <div className="text-cyan-400 font-bold">+40%</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-gray-400 text-sm">Level Up</div>
                <div className="text-purple-400 font-bold">+1 Level</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-gray-400 text-sm">Cost</div>
                <div className="text-yellow-400 font-bold">1 Miner</div>
              </div>
            </div>
          </div>

          {/* Selection Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Miners */}
            <div className="gaming-card p-6">
              <h4 className="text-lg font-bold text-white mb-4">Available Miners (2+ owned)</h4>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {ownedMiners.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2">😢</div>
                    <div>No miners available for merging</div>
                    <div className="text-sm">You need at least 2 of the same miner</div>
                  </div>
                ) : (
                  ownedMiners.map((device) => (
                    <button
                      key={device.id}
                      onClick={() => handleSelectMiner(device.id)}
                      className={`w-full p-4 rounded-lg border transition-all ${
                        selectedMiners.includes(device.id)
                          ? 'bg-cyan-500/20 border-cyan-500/50'
                          : 'bg-[#151a28] border-gray-700 hover:border-cyan-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{device.emoji}</div>
                        <div className="flex-1 text-left">
                          <div className="text-white font-bold">{device.name}</div>
                          <div className="text-sm text-gray-400">
                            Owned: <span className="text-cyan-400">{device.owned}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Current: {device.power.toFixed(1)} H/s → After merge: {getMergePower(device.id)} H/s
                          </div>
                          {(device.mergeLevel ?? 0) > 0 && (
                            <div className="badge badge-epic mt-1">Level {(device.mergeLevel ?? 0) + 1}</div>
                          )}
                        </div>
                        {selectedMiners.filter(id => id === device.id).length > 0 && (
                          <div className="text-cyan-400 font-bold">
                            ✓ {selectedMiners.filter(id => id === device.id).length}/2
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Merge Preview */}
            <div className="space-y-6">
              {/* Selected Miners */}
              <div className="gaming-card p-6">
                <h4 className="text-lg font-bold text-white mb-4">Selected for Merge</h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedMiners.map((deviceId, index) => {
                    const device = devices.find(d => d.id === deviceId);
                    return (
                      <div key={`${deviceId}-${index}`} className="bg-[#151a28] rounded-lg p-4 border border-cyan-500/30">
                        <div className="text-center">
                          <div className="text-4xl mb-2">{device?.emoji}</div>
                          <div className="text-white font-bold text-sm">{device?.name}</div>
                          <div className="text-xs text-gray-400">{device?.power.toFixed(1)} H/s</div>
                        </div>
                      </div>
                    );
                  })}
                  {Array.from({ length: 2 - selectedMiners.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="bg-[#151a28] rounded-lg p-4 border-2 border-dashed border-gray-700 flex items-center justify-center">
                      <div className="text-gray-600 text-sm">Select miner</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result Preview */}
              {canMergeMiners && (
                <div className="gaming-card p-6 border-purple-500/50">
                  <h4 className="text-lg font-bold text-white mb-4">Merge Result</h4>
                  <div className="text-center">
                    {(() => {
                      const device = devices.find(d => d.id === selectedMiners[0]);
                      return (
                        <>
                          <div className="text-5xl mb-3">{device?.emoji}</div>
                          <div className="text-white font-bold text-lg">{device?.name}</div>
                          <div className="badge badge-epic mt-2">
                            Level {(device?.mergeLevel ?? 0) + 2}
                          </div>
                          <div className="mt-4 text-green-400 font-bold">
                            {(device ? device.power * 1.4 : 0).toFixed(1)} H/s
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            +{device ? (device.power * 0.4).toFixed(1) : 0} H/s bonus
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Merge Button */}
              <button
                onClick={handleMergeMiners}
                disabled={!canMergeMiners}
                className="btn-gaming w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔥 MERGE MINERS
              </button>

              {/* Instructions */}
              <div className="gaming-card p-4 bg-yellow-500/10 border-yellow-500/30">
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400 text-xl">⚠️</span>
                  <div className="text-sm text-gray-300">
                    <div className="font-bold text-yellow-400 mb-1">Merge Rules:</div>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Select 2 of the same miner</li>
                      <li>Both miners will be consumed</li>
                      <li>Result is a more powerful version</li>
                      <li>Each merge increases the level</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mergeMode === 'parts' && (
        <div className="space-y-6">
          {/* Info Panel */}
          <div className="gaming-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Part Merging</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-gray-400 text-sm">Mining Boost</div>
                <div className="text-cyan-400 font-bold">+5%</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">♾️</div>
                <div className="text-gray-400 text-sm">Duration</div>
                <div className="text-purple-400 font-bold">Permanent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-gray-400 text-sm">Cost</div>
                <div className="text-yellow-400 font-bold">3 Parts</div>
              </div>
            </div>
          </div>

          {/* Selection Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Parts */}
            <div className="gaming-card p-6">
              <h4 className="text-lg font-bold text-white mb-4">Available Parts (3+ owned)</h4>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {ownedParts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2">😢</div>
                    <div>No parts available for merging</div>
                    <div className="text-sm">You need at least 3 of the same part</div>
                  </div>
                ) : (
                  ownedParts.map((part) => (
                    <button
                      key={part.id}
                      onClick={() => handleSelectPart(part.id)}
                      className={`w-full p-4 rounded-lg border transition-all ${
                        selectedParts.includes(part.id)
                          ? 'bg-purple-500/20 border-purple-500/50'
                          : 'bg-[#151a28] border-gray-700 hover:border-purple-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{part.icon}</div>
                        <div className="flex-1 text-left">
                          <div className="text-white font-bold">{part.name}</div>
                          <div className="text-sm text-gray-400">
                            Owned: <span className="text-purple-400">{part.quantity}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Power: +{(part.powerBonus * 100).toFixed(1)}% | Energy: {(part.energyBonus * 100).toFixed(1)}%
                          </div>
                          <div className={`badge mt-1 ${
                            part.rarity === 'legendary' ? 'badge-legendary' :
                            part.rarity === 'epic' ? 'badge-epic' :
                            part.rarity === 'rare' ? 'badge-rare' : 'badge-common'
                          }`}>
                            {part.rarity}
                          </div>
                        </div>
                        {selectedParts.filter(id => id === part.id).length > 0 && (
                          <div className="text-purple-400 font-bold">
                            ✓ {selectedParts.filter(id => id === part.id).length}/3
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Merge Preview */}
            <div className="space-y-6">
              {/* Selected Parts */}
              <div className="gaming-card p-6">
                <h4 className="text-lg font-bold text-white mb-4">Selected for Merge</h4>
                <div className="grid grid-cols-3 gap-4">
                  {selectedParts.map((partId, index) => {
                    const part = parts.find(p => p.id === partId);
                    return (
                      <div key={`${partId}-${index}`} className="bg-[#151a28] rounded-lg p-4 border border-purple-500/30">
                        <div className="text-center">
                          <div className="text-3xl mb-2">{part?.icon}</div>
                          <div className="text-white font-bold text-xs">{part?.name}</div>
                        </div>
                      </div>
                    );
                  })}
                  {Array.from({ length: 3 - selectedParts.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="bg-[#151a28] rounded-lg p-4 border-2 border-dashed border-gray-700 flex items-center justify-center">
                      <div className="text-gray-600 text-xs">Select part</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result Preview */}
              {canMergeParts && (
                <div className="gaming-card p-6 border-purple-500/50">
                  <h4 className="text-lg font-bold text-white mb-4">Merge Result</h4>
                  <div className="text-center">
                    <div className="text-5xl mb-3">⚡</div>
                    <div className="text-white font-bold text-lg">Permanent Boost</div>
                    <div className="badge badge-epic mt-2">+5% Mining Multiplier</div>
                    <div className="mt-4 text-green-400 font-bold text-sm">
                      All miners will benefit
                    </div>
                  </div>
                </div>
              )}

              {/* Merge Button */}
              <button
                onClick={handleMergeParts}
                disabled={!canMergeParts}
                className="btn-gaming w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: canMergeParts ? 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' : undefined
                }}
              >
                🔥 MERGE PARTS
              </button>

              {/* Instructions */}
              <div className="gaming-card p-4 bg-purple-500/10 border-purple-500/30">
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 text-xl">⚠️</span>
                  <div className="text-sm text-gray-300">
                    <div className="font-bold text-purple-400 mb-1">Merge Rules:</div>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Select 3 of the same part</li>
                      <li>All parts will be consumed</li>
                      <li>Get permanent +5% mining boost</li>
                      <li>Boost applies to all miners</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MergeLab;
