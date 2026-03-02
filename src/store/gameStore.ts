import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Types -----------------------------------------------------------------

export interface Device {
  id: string;
  name: string;
  power: number;
  energyCost: number;
  cost: number;
  maxQuantity: number;
  owned: number;
  emoji: string;
  tier: number;
  mergeLevel?: number;
}

export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  color: string;
  icon: string;
}

export interface MiniGame {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: number;
  cooldown: number;
  lastPlayed?: number;
}

export interface GamePowerBoost {
  id: string;
  sourceGameId: string;
  sourceGameName: string;
  powerPercent: number;
  earnedAt: number;
  expiresAt: number;
}

export interface MiniGameResult {
  reward: number;
  xpGained: number;
  partDrop: Part | null;
  gameBoost: GamePowerBoost;
}

export interface PtcAd {
  id: string;
  title: string;
  url: string;
  reward: number;
  duration: number;
  clicksLeft: number;
  platform: 'Youtube' | 'Tiktok' | 'Soundcloud' | 'Spotify' | 'Other';
  seller: string;
  thumbnail?: string;
}

export interface GlobalMiningPool {
  currentBlock: number;
  blockStartedAt: number;
  nextBlockAt: number;
  userContribution: number;
  networkContribution: number;
  rewardPot: number;
  lastBlockReward: number;
  lastWinnerShare: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  cryptoReward?: { symbol: string; amount: number };
  progress: number;
  target: number;
  completed: boolean;
  type: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  reward: number;
}

export interface GameNotification {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  message: string;
  timestamp: number;
}

export type PaymentMethodId = 'faucetpay' | 'payeer' | 'direct';
export type PaymentDirection = 'deposit' | 'withdraw';

export interface PaymentRequest {
  id: string;
  method: PaymentMethodId;
  type: PaymentDirection;
  amount: number;
  currency: string;
  addressOrTag?: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: number;
  processedAt?: number;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  crypto?: string;
  description: string;
  timestamp: number;
}

export interface Lootbox {
  id: string;
  name: string;
  cost: number;
  icon: string;
  color: string;
  description: string;
  dropRates: { type: 'device' | 'part', itemId: string, chance: number }[];
}

export interface User {
  username: string;
  level: number;
  xp: number;
  joinedAt: number;
  totalMined: number;
  gamesPlayed: number;
  maxEnergy?: number;
  vipLevel: number;
  vipPoints: number;
  lastFaucetClaim: number;
  // CMR Token System
  cmrBalance: number;
  cmrStaked: number;
  cmrEarned: number;
  // GEO Mining
  geoMiningEnabled: boolean;
  geoMiningLocation: { lat: number; lng: number } | null;
  geoMiningPower: number;
  geoMiningLastUpdate: number;
}

export interface TradingCard {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  power: number;
  type: 'miner' | 'booster' | 'shield' | 'hacker';
  image: string;
}

export interface LandPlot {
  id: string;
  name: string;
  size: number;
  efficiency: number;
  cost: number;
  purchased: boolean;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  level: number;
  bonus: number;
  experience: number;
}

export type PartRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Part {
  id: string;
  name: string;
  rarity: PartRarity;
  icon: string;
  powerBonus: number;
  energyBonus: number;
  quantity: number;
}

export type MarketplaceItemType = 'device' | 'part';

export interface MarketplaceListing {
  id: string;
  itemType: MarketplaceItemType;
  itemId: string;
  itemName: string;
  icon: string;
  price: number;
  quantity: number;
  seller: string;
  isMine: boolean;
  createdAt: number;
}

// Token Marketplace Types
export interface TokenListing {
  id: string;
  seller: string;
  amount: number;
  pricePerToken: number;
  totalPrice: number;
  createdAt: number;
}

// Staking Types
export interface StakingPool {
  id: string;
  name: string;
  apy: number;
  minStake: number;
  lockPeriod: number;
  totalStaked: number;
  userStaked: number;
}

interface AdminSettings {
  globalMiningRate: number;
  energyRegenRate: number;
  gameRewardMultiplier: number;
  deviceCostMultiplier: number;
  questRewardMultiplier: number;
  achievementRewardMultiplier: number;
  energyCostMultiplier: number;
  xpGainMultiplier: number;
  dailyBonusMultiplier: number;
  autoSaveInterval: number;
  energyRegenTickRate: number;
  cryptoPriceVolatility: boolean;
  maxEnergy: number;
  
  // Game Difficulty Settings
  gameBaseDuration: number;
  gameDurationPerLevel: number;
  gameDifficultyMultiplier: number;
  maxGameLevels: number;
  gameBaseReward: number;
  gameRewardPerLevel: number;
  gameSessionMinSeconds: number;
  gameSessionMaxSeconds: number;
  
  // PTC Settings
  ptcBaseDuration: number;
  ptcEarlyExitCooldownMinutes: number;
  ptcRewardMultiplier: number;
  ptcMinDurationSeconds: number;
  ptcMaxDurationSeconds: number;
  ptcMinRewardUsd: number;
  ptcRequireTabFocus: boolean;
  ptcRequireManualPlay: boolean;
  ptcSpotifyStrictSync: boolean;

  // Currency & display
  currencyPrecision: number;

  // Shared pool & boost settings
  poolBlockIntervalMinMinutes: number;
  poolBlockIntervalMaxMinutes: number;
  poolRewardBase: number;
  poolRewardPerPower: number;
  poolSimulatedNetworkPower: number;
  gameBoostBasePowerPercent: number;
  gameBoostScoreScaling: number;
  gameBoostDurationHours: number;
  gamePartDropChance: number;

  // Payments / gateways
  paymentsEnabled: boolean;
  minWithdrawAmount: number;
  minDepositAmount: number;
  faucetPayApiKey?: string;
  faucetPayUsername?: string;
  payeerMerchantId?: string;
  payeerSecret?: string;
  directWalletAddress?: string;

  // Terminal tuning
  terminalRefreshRateMs: number;
  terminalLogLimit: number;
  antiCheatSensitivity: number;

  // --- NEW SETTINGS FOR FULL VERSION ---
  houseEdgeGlobal: number;
  maxWinLimit: number;
  slotsRtp: number;
  diceHouseEdge: number;
  blackjackPayout: number;
  rouletteZeroRules: boolean;
  pokerRoyalFlushMultiplier: number;
  arcadeEnergyCost: number;
  arcadeCooldownSeconds: number;
  arcadeLevelScalingRate: number;
  arcadeHighScoreRewardsEnabled: boolean;
  guildCreationCost: number;
  guildMaxMembers: number;
  guildXpMultiplier: number;
  guildTaxPercentage: number;
  referralRewardPercentL1: number;
  referralRewardPercentL2: number;
  referralRewardPercentL3: number;
  referralMinWithdraw: number;
  seasonDurationDays: number;
  seasonXpPerLevel: number;
  seasonTotalLevels: number;
  seasonPremiumPrice: number;
  maxTransactionsPerMinute: number;
  withdrawalCooldownHours: number;
  antiCheatIpRestriction: boolean;
  antiCheatDeviceFingerprinting: boolean;
  vipSystemEnabled: boolean;
  vipPointsMultiplier: number;
  faucetEnabled: boolean;
  faucetCooldownMinutes: number;
  faucetMinReward: number;
  faucetMaxReward: number;
  
  // CMR Token Settings
  cmrEnabled: boolean;
  cmrExchangeRate: number;
  cmrMiningReward: number;
  cmrStakingAPY: number;
  cmrMaxSupply: number;
  cmrTotalMinted: number;
  
  // GEO Mining Settings
  geoMiningEnabled: boolean;
  geoMiningPowerMultiplier: number;
  geoMiningLocationRadius: number;
  geoMiningUpdateInterval: number;
  
  // Token Marketplace Settings
  tokenMarketplaceEnabled: boolean;
  tokenMarketplaceFee: number;
  tokenMinListing: number;
  
  // Staking Settings
  stakingEnabled: boolean;
  stakingMinAmount: number;
  stakingMaxAPY: number;
  
  // Admin Token Management
  adminCanMint: boolean;
  adminCanBurn: boolean;
  adminMintLimit: number;
  
  features: {
    mining: boolean;
    arcade: boolean;
    shop: boolean;
    marketplace: boolean;
    mergeLab: boolean;
    casino: boolean;
    ptc: boolean;
    lootboxes: boolean;
    inventory: boolean;
    dailyRewards: boolean;
    seasonPass: boolean;
    researchLab: boolean;
    guilds: boolean;
    guildWars: boolean;
    pvpBattles: boolean;
    bossRaids: boolean;
    tradingCards: boolean;
    pets: boolean;
    landOwnership: boolean;
    crafting: boolean;
    quests: boolean;
    achievements: boolean;
    staking: boolean;
    referrals: boolean;
    cmrToken: boolean;
    geoMining: boolean;
    tokenMarketplace: boolean;
  };
}

interface GameState {
  // User
  user: User;
  balance: number;

  // Mining
  devices: Device[];
  cryptos: Crypto[];
  selectedCrypto: string;
  isMining: boolean;
  energy: number;
  maxEnergy: number;
  miningMultiplier: number;
  totalMined: number;

  // Games
  miniGames: MiniGame[];
  gamePowerBoosts: GamePowerBoost[];
  globalMiningPool: GlobalMiningPool;

  // Parts & Merging
  parts: Part[];

  // Marketplace
  marketplaceListings: MarketplaceListing[];

  // PTC
  ptcAds: PtcAd[];

  // Quests & Achievements
  quests: Quest[];
  achievements: Achievement[];

  // Transactions
  transactions: Transaction[];
  notifications: GameNotification[];

  // Payments
  payments: PaymentRequest[];

  // PTC Cooldowns
  adCooldowns: Record<string, number>;

  // Lootboxes
  lootboxes: Lootbox[];

  cards: TradingCard[];
  lands: LandPlot[];
  pets: Pet[];

  // CMR Token System
  cmrBalance: number;
  cmrStaked: number;
  cmrEarned: number;
  cmrTotalSupply: number;
  tokenListings: TokenListing[];
  stakingPools: StakingPool[];

  // Admin Settings
  adminSettings: AdminSettings;

  // Actions
  setMining: (mining: boolean) => void;
  setAdCooldown: (adId: string, durationMinutes: number) => void;
  setSelectedCrypto: (crypto: string) => void;
  buyDevice: (deviceId: string) => void;
  upgradeMiningMultiplier: () => void;
  updateEnergy: (delta: number) => void;
  mine: () => void;
  playMiniGame: (gameId: string, score: number) => MiniGameResult | null;
  completeQuest: (questId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateCryptoPrices: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  addNotification: (type: GameNotification['type'], message: string) => void;
  removeNotification: (id: string) => void;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  gainXP: (amount: number) => void;
  resetGame: () => void;

  // Parts & merging
  addPart: (partId: string, quantity?: number) => Part | null;
  mergeMiners: (deviceId: string) => void;
  mergeParts: (partId: string) => void;
  updateBalance: (amount: number) => void;

  // Marketplace
  createListing: (payload: { itemType: MarketplaceItemType; itemId: string; price: number; quantity: number }) => void;
  buyListing: (listingId: string) => void;
  cancelListing: (listingId: string) => void;
  viewPtcAd: (adId: string) => void;
  createPtcAd: (ad: Omit<PtcAd, 'id' | 'clicksLeft' | 'seller'> & { clicks: number }) => void;
  resolveGlobalMiningPool: () => void;
  openLootbox: (boxId: string) => { itemType: 'device' | 'part', itemId: string } | null;

  buyLand: (landId: string) => void;
  adoptPet: (petType: string) => void;
  drawCard: () => TradingCard;
  claimFaucet: () => number | null;
  addVipPoints: (points: number) => void;

  // New Admin & Batch Actions
  adminAddInventory: (itemType: 'device' | 'part', itemId: string, quantity?: number) => void;
  adminModifyBalance: (amount: number) => void;
  batchSellItems: (items: { itemType: 'device' | 'part', itemId: string, quantity: number }[]) => void;

  // Payments
  createPaymentRequest: (payload: { method: PaymentMethodId; type: PaymentDirection; amount: number; currency: string; addressOrTag?: string }) => void;
  markPaymentProcessed: (id: string, status: 'completed' | 'rejected') => void;

  // CMR Token Actions
  exchangeUSDToCMR: (usdAmount: number) => void;
  exchangeCMRToUSD: (cmrAmount: number) => void;
  stakeCMR: (amount: number, poolId: string) => void;
  unstakeCMR: (amount: number, poolId: string) => void;
  claimStakingRewards: (poolId: string) => void;
  
  // GEO Mining Actions
  enableGeoMining: (latitude: number, longitude: number) => void;
  disableGeoMining: () => void;
  updateGeoMiningPower: () => void;
  
  // Token Marketplace Actions
  createTokenListing: (amount: number, pricePerToken: number) => void;
  buyTokens: (listingId: string) => void;
  cancelTokenListing: (listingId: string) => void;
  
  // Admin Token Management
  adminMintCMR: (amount: number, recipient: string) => void;
  adminBurnCMR: (amount: number, from: string) => void;
  adminUpdateCmrSupply: (newSupply: number) => void;
}

// --- Initial Data ----------------------------------------------------------

const initialDevices: Device[] = [
  { id: 'd1', name: 'Basic CPU', power: 1, energyCost: 5, cost: 100, maxQuantity: 5, owned: 0, emoji: '💻', tier: 1, mergeLevel: 0 },
  { id: 'd2', name: 'Gaming GPU', power: 5, energyCost: 10, cost: 500, maxQuantity: 5, owned: 0, emoji: '🎮', tier: 2, mergeLevel: 0 },
  { id: 'd3', name: 'ASIC Miner', power: 20, energyCost: 25, cost: 2000, maxQuantity: 5, owned: 0, emoji: '⚡', tier: 3, mergeLevel: 0 },
  { id: 'd4', name: 'Mining Rig', power: 50, energyCost: 50, cost: 5000, maxQuantity: 3, owned: 0, emoji: '🏭', tier: 4, mergeLevel: 0 },
  { id: 'd5', name: 'Quantum Processor', power: 150, energyCost: 100, cost: 15000, maxQuantity: 3, owned: 0, emoji: '🔮', tier: 5, mergeLevel: 0 },
  { id: 'd6', name: 'Fusion Reactor', power: 400, energyCost: 200, cost: 50000, maxQuantity: 2, owned: 0, emoji: '☢️', tier: 6, mergeLevel: 0 },
  { id: 'd7', name: 'AI Supercomputer', power: 1000, energyCost: 400, cost: 150000, maxQuantity: 2, owned: 0, emoji: '🤖', tier: 7, mergeLevel: 0 },
  { id: 'd8', name: 'Alien Tech', power: 3000, energyCost: 800, cost: 500000, maxQuantity: 1, owned: 0, emoji: '👽', tier: 8, mergeLevel: 0 },
  // New high-end miners for expanded mining farm
  { id: 'd9', name: 'Solar Farm Array', power: 4500, energyCost: 600, cost: 900000, maxQuantity: 2, owned: 0, emoji: '☀️', tier: 9, mergeLevel: 0 },
  { id: 'd10', name: 'Hydro Dam Node', power: 8000, energyCost: 1200, cost: 1800000, maxQuantity: 2, owned: 0, emoji: '💧', tier: 10, mergeLevel: 0 },
  { id: 'd11', name: 'Orbital Miner', power: 15000, energyCost: 2200, cost: 3500000, maxQuantity: 1, owned: 0, emoji: '🛰️', tier: 11, mergeLevel: 0 },
  { id: 'd12', name: 'Multiverse Extractor', power: 40000, energyCost: 5000, cost: 10000000, maxQuantity: 1, owned: 0, emoji: '🌌', tier: 12, mergeLevel: 0 },
];

const initialCryptos: Crypto[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', amount: 0, value: 45000, color: '#F7931A', icon: '₿' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', amount: 0, value: 3000, color: '#627EEA', icon: 'Ξ' },
  { id: 'ltc', name: 'Litecoin', symbol: 'LTC', amount: 0, value: 150, color: '#345D9D', icon: 'Ł' },
  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', amount: 0, value: 0.25, color: '#C2A633', icon: 'Ð' },
  { id: 'xrp', name: 'Ripple', symbol: 'XRP', amount: 0, value: 0.8, color: '#23292F', icon: '✕' },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', amount: 0, value: 1.2, color: '#0033AD', icon: '₳' },
];

const initialMiniGames: MiniGame[] = [
  { id: 'coinclick', name: 'Coinclick Wizard', description: 'Tap coins and avoid bombs.', icon: '🪙', reward: 18, cooldown: 60000 },
  { id: 'memorymatch', name: 'Memory Match', description: 'Find matching pairs quickly.', icon: '🧠', reward: 20, cooldown: 90000 },
  { id: 'flappyrocket', name: 'Flappy Rocket', description: 'Fly through gaps and survive.', icon: '🚀', reward: 22, cooldown: 90000 },
  { id: 'snake', name: 'Snake Miner', description: 'Classic snake game - collect blocks!', icon: '🐍', reward: 24, cooldown: 90000 },
  { id: '2048', name: '2048 Crypto', description: 'Merge tiles and grow value.', icon: '🔢', reward: 24, cooldown: 120000 },
  { id: 'cryptominer', name: 'Crypto Miner', description: 'Collect blocks in a timed run.', icon: '⛏️', reward: 18, cooldown: 60000 },
  { id: 'hashcrack', name: 'Hash Cracker', description: 'Decode under pressure.', icon: '🔐', reward: 26, cooldown: 120000 },
  { id: 'blockdrop', name: 'Block Drop', description: 'Stack and clear lines.', icon: '📦', reward: 20, cooldown: 90000 },
  { id: 'cryptorun', name: 'Crypto Run', description: 'Dash and collect tokens.', icon: '🏃', reward: 20, cooldown: 90000 },
  { id: 'bitpuzzle', name: 'Bit Puzzle', description: 'Solve chain logic puzzles.', icon: '🧩', reward: 25, cooldown: 120000 },
];

const initialQuests: Quest[] = [
  { id: 'q1', title: 'First Steps', description: 'Mine for 5 minutes', reward: 500, progress: 0, target: 300, completed: false, type: 'mining' },
  { id: 'q2', title: 'Device Collector', description: 'Own 3 different devices', reward: 1000, progress: 0, target: 3, completed: false, type: 'devices' },
  { id: 'q3', title: 'Game Master', description: 'Play 10 mini-games', reward: 800, progress: 0, target: 10, completed: false, type: 'games' },
  { id: 'q4', title: 'Crypto Baron', description: 'Earn 1000 total USD', reward: 2000, cryptoReward: { symbol: 'BTC', amount: 0.001 }, progress: 0, target: 1000, completed: false, type: 'earnings' },
  { id: 'q5', title: 'Power User', description: 'Reach total mining power of 100 TH/s', reward: 1500, progress: 0, target: 100, completed: false, type: 'power' },
];

const initialAchievements: Achievement[] = [
  { id: 'a1', title: 'Getting Started', description: 'Make your first purchase', icon: '🎯', unlocked: false, reward: 100 },
  { id: 'a2', title: 'Power Miner', description: 'Reach 500 TH/s total power', icon: '⚡', unlocked: false, reward: 500 },
  { id: 'a3', title: 'Millionaire', description: 'Accumulate $1,000,000', icon: '💰', unlocked: false, reward: 5000 },
  { id: 'a4', title: 'Game Addict', description: 'Play 50 mini-games', icon: '🎮', unlocked: false, reward: 1000 },
  { id: 'a5', title: 'Crypto Whale', description: 'Own 1 BTC', icon: '🐋', unlocked: false, reward: 2000 },
  { id: 'a6', title: 'Marathon Miner', description: 'Mine for 100 hours total', icon: '🏃', unlocked: false, reward: 3000 },
  { id: 'a7', title: 'Elite Collector', description: 'Own all device types', icon: '👑', unlocked: false, reward: 10000 },
];

const initialParts: Part[] = [
  { id: 'cooling-fan', name: 'Quantum Cooling Fan', rarity: 'common', icon: '🌀', powerBonus: 0.01, energyBonus: -0.005, quantity: 0 },
  { id: 'overclock-chip', name: 'Overclock Chip', rarity: 'rare', icon: '💿', powerBonus: 0.02, energyBonus: 0.0, quantity: 0 },
  { id: 'golden-rack', name: 'Golden Rack', rarity: 'epic', icon: '🪙', powerBonus: 0.03, energyBonus: -0.01, quantity: 0 },
  { id: 'lucky-charm', name: 'Lucky Charm', rarity: 'legendary', icon: '🍀', powerBonus: 0.015, energyBonus: 0.0, quantity: 0 },
];

const initialLootboxes: Lootbox[] = [
  {
    id: 'basic-crate',
    name: 'Basic Crate',
    cost: 500,
    icon: '📦',
    color: '#0ea5e9',
    description: 'A standard issue crate. Mostly contains parts.',
    dropRates: [
      { type: 'part', itemId: 'cooling-fan', chance: 0.6 },
      { type: 'part', itemId: 'overclock-chip', chance: 0.3 },
      { type: 'device', itemId: 'd1', chance: 0.08 },
      { type: 'device', itemId: 'd2', chance: 0.02 },
    ],
  },
  {
    id: 'premium-crate',
    name: 'Premium Crate',
    cost: 2500,
    icon: '🎁',
    color: '#a855f7',
    description: 'High chance for rare parts and standard miners.',
    dropRates: [
      { type: 'part', itemId: 'overclock-chip', chance: 0.4 },
      { type: 'part', itemId: 'golden-rack', chance: 0.3 },
      { type: 'device', itemId: 'd2', chance: 0.2 },
      { type: 'device', itemId: 'd3', chance: 0.1 },
    ],
  },
  {
    id: 'legendary-crate',
    name: 'Legendary Crate',
    cost: 10000,
    icon: '💎',
    color: '#eab308',
    description: 'Guaranteed high-tier items. Very rare drops.',
    dropRates: [
      { type: 'part', itemId: 'lucky-charm', chance: 0.3 },
      { type: 'device', itemId: 'd3', chance: 0.4 },
      { type: 'device', itemId: 'd4', chance: 0.25 },
      { type: 'device', itemId: 'd5', chance: 0.05 },
    ],
  }
];

const initialMarketplaceListings: MarketplaceListing[] = [
  {
    id: 'mkt1',
    itemType: 'device',
    itemId: 'd2',
    itemName: 'Gaming GPU',
    icon: '🎮',
    price: 450,
    quantity: 5,
    seller: 'Global Vendor',
    isMine: false,
    createdAt: Date.now(),
  },
  {
    id: 'mkt2',
    itemType: 'part',
    itemId: 'cooling-fan',
    itemName: 'Quantum Cooling Fan',
    icon: '🌀',
    price: 120,
    quantity: 10,
    seller: 'Global Vendor',
    isMine: false,
    createdAt: Date.now(),
  },
  {
    id: 'mkt3',
    itemType: 'part',
    itemId: 'overclock-chip',
    itemName: 'Overclock Chip',
    icon: '💿',
    price: 350,
    quantity: 4,
    seller: 'Global Vendor',
    isMine: false,
    createdAt: Date.now(),
  },
];

const initialStakingPools: StakingPool[] = [
  {
    id: 'pool1',
    name: 'Basic Staking',
    apy: 5,
    minStake: 10,
    lockPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days
    totalStaked: 0,
    userStaked: 0,
  },
  {
    id: 'pool2',
    name: 'Advanced Staking',
    apy: 10,
    minStake: 100,
    lockPeriod: 30 * 24 * 60 * 60 * 1000, // 30 days
    totalStaked: 0,
    userStaked: 0,
  },
  {
    id: 'pool3',
    name: 'Expert Staking',
    apy: 15,
    minStake: 1000,
    lockPeriod: 90 * 24 * 60 * 60 * 1000, // 90 days
    totalStaked: 0,
    userStaked: 0,
  },
];

const createInitialPool = (minMinutes: number, maxMinutes: number): GlobalMiningPool => {
  const now = Date.now();
  const minMs = minMinutes * 60 * 1000;
  const maxMs = maxMinutes * 60 * 1000;
  const nextBlockAt = now + (minMs + Math.random() * Math.max(1000, maxMs - minMs));

  return {
    currentBlock: 1,
    blockStartedAt: now,
    nextBlockAt,
    userContribution: 0,
    networkContribution: 0,
    rewardPot: 0,
    lastBlockReward: 0,
    lastWinnerShare: 0,
  };
};

// --- Store -----------------------------------------------------------------

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      user: {
        username: 'Miner_' + Math.floor(Math.random() * 10000),
        level: 1,
        xp: 0,
        joinedAt: Date.now(),
        totalMined: 0,
        gamesPlayed: 0,
        vipLevel: 0,
        vipPoints: 0,
        lastFaucetClaim: 0,
        cmrBalance: 0,
        cmrStaked: 0,
        cmrEarned: 0,
        geoMiningEnabled: false,
        geoMiningLocation: null,
        geoMiningPower: 0,
        geoMiningLastUpdate: 0,
      },
      balance: 5000,
      cmrBalance: 0,
      cmrStaked: 0,
      cmrEarned: 0,
      cmrTotalSupply: 1000000,
      tokenListings: [],
      stakingPools: initialStakingPools,
      devices: initialDevices,
      cryptos: initialCryptos,
      selectedCrypto: 'btc',
      isMining: false,
      energy: 100,
      maxEnergy: 100,
      miningMultiplier: 1,
      totalMined: 0,
      miniGames: initialMiniGames,
      gamePowerBoosts: [],
      globalMiningPool: createInitialPool(15, 30),
      parts: initialParts,
      lootboxes: initialLootboxes,
      marketplaceListings: initialMarketplaceListings,
      ptcAds: [
        {
          id: 'ad1',
          title: 'Official CryptoMiner Discord',
          url: 'https://discord.gg/cryptominer',
          reward: 0.1,
          duration: 15,
          clicksLeft: 1000,
          platform: 'Other',
          seller: 'Admin',
          thumbnail: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&q=80'
        },
        {
          id: 'ad2',
          title: 'Best Mining Playlist',
          url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM3M',
          reward: 0.08,
          duration: 20,
          clicksLeft: 500,
          platform: 'Spotify',
          seller: 'Admin',
          thumbnail: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80'
        },
        {
          id: 'ad3',
          title: 'Ultimate Mining Guide 2024',
          url: 'https://youtube.com/watch?v=example',
          reward: 0.05,
          duration: 10,
          clicksLeft: 500,
          platform: 'Youtube',
          seller: 'Admin',
          thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80'
        }
      ],
      quests: initialQuests,
      achievements: initialAchievements,
      transactions: [],
      notifications: [],
      payments: [],
      adCooldowns: {},
      cards: [],
      lands: [
        { id: 'l1', name: 'Starter Garage', size: 10, efficiency: 1.0, cost: 0, purchased: true },
        { id: 'l2', name: 'Tech Basement', size: 25, efficiency: 1.1, cost: 5000, purchased: false },
        { id: 'l3', name: 'Cloud Data Center', size: 100, efficiency: 1.5, cost: 50000, purchased: false },
      ],
      pets: [],
      adminSettings: {
        globalMiningRate: 1,
        energyRegenRate: 1,
        gameRewardMultiplier: 1,
        deviceCostMultiplier: 1,
        questRewardMultiplier: 1,
        achievementRewardMultiplier: 1,
        energyCostMultiplier: 1,
        xpGainMultiplier: 1,
        dailyBonusMultiplier: 1,
        autoSaveInterval: 30,
        energyRegenTickRate: 1000,
        cryptoPriceVolatility: true,
        maxEnergy: 100,
        gameBaseDuration: 60,
        gameDurationPerLevel: 15,
        gameDifficultyMultiplier: 1.2,
        maxGameLevels: 10,
        gameBaseReward: 50,
        gameRewardPerLevel: 10,
        gameSessionMinSeconds: 30,
        gameSessionMaxSeconds: 120,
        ptcBaseDuration: 15,
        ptcEarlyExitCooldownMinutes: 5,
        ptcRewardMultiplier: 1,
        ptcMinDurationSeconds: 10,
        ptcMaxDurationSeconds: 120,
        ptcMinRewardUsd: 0.0001,
        ptcRequireTabFocus: true,
        ptcRequireManualPlay: true,
        ptcSpotifyStrictSync: true,
        currencyPrecision: 6,
        poolBlockIntervalMinMinutes: 15,
        poolBlockIntervalMaxMinutes: 30,
        poolRewardBase: 500,
        poolRewardPerPower: 0.4,
        poolSimulatedNetworkPower: 150000,
        gameBoostBasePowerPercent: 2,
        gameBoostScoreScaling: 0.02,
        gameBoostDurationHours: 24,
        gamePartDropChance: 0.35,
        paymentsEnabled: true,
        minWithdrawAmount: 5,
        minDepositAmount: 1,
        faucetPayApiKey: undefined,
        faucetPayUsername: undefined,
        payeerMerchantId: undefined,
        payeerSecret: undefined,
        directWalletAddress: undefined,
        terminalRefreshRateMs: 2000,
        terminalLogLimit: 150,
        antiCheatSensitivity: 70,
        houseEdgeGlobal: 5,
        maxWinLimit: 10000,
        slotsRtp: 95,
        diceHouseEdge: 2,
        blackjackPayout: 1.5,
        rouletteZeroRules: true,
        pokerRoyalFlushMultiplier: 800,
        arcadeEnergyCost: 10,
        arcadeCooldownSeconds: 30,
        arcadeLevelScalingRate: 1.2,
        arcadeHighScoreRewardsEnabled: true,
        guildCreationCost: 1000,
        guildMaxMembers: 50,
        guildXpMultiplier: 1,
        guildTaxPercentage: 5,
        referralRewardPercentL1: 10,
        referralRewardPercentL2: 5,
        referralRewardPercentL3: 2,
        referralMinWithdraw: 100,
        seasonDurationDays: 30,
        seasonXpPerLevel: 1000,
        seasonTotalLevels: 50,
        seasonPremiumPrice: 20,
        maxTransactionsPerMinute: 60,
        withdrawalCooldownHours: 24,
        antiCheatIpRestriction: false,
        antiCheatDeviceFingerprinting: true,
        vipSystemEnabled: true,
        vipPointsMultiplier: 1,
        faucetEnabled: true,
        faucetCooldownMinutes: 60,
        faucetMinReward: 10,
        faucetMaxReward: 100,
        cmrEnabled: true,
        cmrExchangeRate: 100,
        cmrMiningReward: 10,
        cmrStakingAPY: 10,
        cmrMaxSupply: 10000000,
        cmrTotalMinted: 1000000,
        geoMiningEnabled: true,
        geoMiningPowerMultiplier: 1.5,
        geoMiningLocationRadius: 100,
        geoMiningUpdateInterval: 60000,
        tokenMarketplaceEnabled: true,
        tokenMarketplaceFee: 0.02,
        tokenMinListing: 1,
        stakingEnabled: true,
        stakingMinAmount: 10,
        stakingMaxAPY: 15,
        adminCanMint: true,
        adminCanBurn: true,
        adminMintLimit: 10000,
        features: {
          mining: true,
          arcade: true,
          shop: true,
          marketplace: true,
          mergeLab: true,
          casino: true,
          ptc: true,
          lootboxes: true,
          inventory: true,
          dailyRewards: true,
          seasonPass: true,
          researchLab: true,
          guilds: true,
          guildWars: true,
          pvpBattles: true,
          bossRaids: true,
          tradingCards: true,
          pets: true,
          landOwnership: true,
          crafting: true,
          quests: true,
          achievements: true,
          staking: true,
          referrals: true,
          cmrToken: true,
          geoMining: true,
          tokenMarketplace: true,
        },
      },

      setMining: (mining) => set({ isMining: mining }),
      setAdCooldown: (adId, durationMinutes) => {
        const endTime = Date.now() + durationMinutes * 60 * 1000;
        set((state) => ({
          adCooldowns: { ...state.adCooldowns, [adId]: endTime }
        }));
      },
      setSelectedCrypto: (crypto) => set({ selectedCrypto: crypto }),
      updateBalance: (amount) => set((state) => ({ balance: state.balance + amount })),

      buyDevice: (deviceId) => {
        const state = get();
        const device = state.devices.find((d) => d.id === deviceId);
        if (!device) return;

        const actualCost = device.cost * state.adminSettings.deviceCostMultiplier;
        if (device.owned >= device.maxQuantity || state.balance < actualCost) return;

        set({
          devices: state.devices.map((d) =>
            d.id === deviceId ? { ...d, owned: d.owned + 1 } : d
          ),
          balance: state.balance - actualCost,
        });

        get().addTransaction({
          type: 'purchase',
          amount: -actualCost,
          description: `Purchased ${device.name}`,
        });

        get().gainXP(device.tier * 10);
        get().addVipPoints(Math.floor(actualCost / 100));

        const deviceTypes = state.devices.filter((d) => d.owned > 0).length;
        set({
          quests: state.quests.map((q) =>
            q.type === 'devices' ? { ...q, progress: deviceTypes } : q
          ),
        });

        if (!state.achievements.find((a) => a.id === 'a1')?.unlocked) {
          get().unlockAchievement('a1');
        }

        const totalPower = state.devices.reduce(
          (sum, d) => sum + d.power * d.owned,
          0
        );
        if (
          totalPower >= 500 &&
          !state.achievements.find((a) => a.id === 'a2')?.unlocked
        ) {
          get().unlockAchievement('a2');
        }

        if (
          state.devices.every((d) => d.owned > 0) &&
          !state.achievements.find((a) => a.id === 'a7')?.unlocked
        ) {
          get().unlockAchievement('a7');
        }
      },

      upgradeMiningMultiplier: () => {
        const state = get();
        const cost = Math.floor(1000 * Math.pow(1.5, state.miningMultiplier));
        if (state.balance < cost) return;

        set({
          balance: state.balance - cost,
          miningMultiplier: state.miningMultiplier + 0.1,
        });

        get().addTransaction({
          type: 'upgrade',
          amount: -cost,
          description: 'Upgraded mining multiplier',
        });

        get().gainXP(50);
      },

      updateEnergy: (delta) => {
        const state = get();
        const cap = state.adminSettings.maxEnergy;
        const newEnergy = Math.max(0, Math.min(cap, state.energy + delta));
        set({ energy: newEnergy });
      },

      mine: () => {
        const state = get();
        if (!state.isMining || state.energy <= 0) return;

        const now = Date.now();
        const activeBoosts = state.gamePowerBoosts.filter((b) => b.expiresAt > now);
        const boostPercent = activeBoosts.reduce((sum, b) => sum + b.powerPercent, 0);

        const totalPower = state.devices.reduce(
          (sum, d) => sum + d.power * d.owned,
          0
        );
        if (totalPower === 0) return;

        const baseEnergyCost = state.devices.reduce(
          (sum, d) => sum + d.energyCost * d.owned,
          0
        );
        if (baseEnergyCost <= 0) return;

        const crypto = state.cryptos.find((c) => c.id === state.selectedCrypto);
        if (!crypto) return;

        const adminEnergyCost = baseEnergyCost * state.adminSettings.energyCostMultiplier;

        const partsPowerBonus = state.parts.reduce(
          (sum, p) => sum + p.powerBonus * p.quantity,
          0
        );
        const partsEnergyBonus = state.parts.reduce(
          (sum, p) => sum + p.energyBonus * p.quantity,
          0
        );

        const powerMultiplierFromParts = 1 + partsPowerBonus;
        const energyMultiplierFromParts = Math.max(0.4, 1 + partsEnergyBonus);

        const effectivePower = totalPower * powerMultiplierFromParts * (1 + boostPercent / 100);
        const effectiveEnergyCost = adminEnergyCost * energyMultiplierFromParts;

        if (state.energy < effectiveEnergyCost) return;

        const baseReward = (effectivePower / 10000) * state.miningMultiplier * state.adminSettings.globalMiningRate;
        const cryptoAmount = baseReward / crypto.value;
        const usdValue = cryptoAmount * crypto.value;

        // Add GEO mining power if enabled
        let geoPower = 0;
        if (state.user.geoMiningEnabled && state.adminSettings.geoMiningEnabled) {
          geoPower = state.user.geoMiningPower * state.adminSettings.geoMiningPowerMultiplier;
        }

        set({
          cryptos: state.cryptos.map((c) =>
            c.id === state.selectedCrypto
              ? { ...c, amount: c.amount + cryptoAmount }
              : c
          ),
          totalMined: state.totalMined + usdValue,
          energy: state.energy - effectiveEnergyCost,
          gamePowerBoosts: activeBoosts,
          globalMiningPool: {
            ...state.globalMiningPool,
            userContribution: state.globalMiningPool.userContribution + effectivePower + geoPower,
            networkContribution: state.globalMiningPool.networkContribution + state.adminSettings.poolSimulatedNetworkPower,
            rewardPot: state.globalMiningPool.rewardPot + (effectivePower + geoPower) * state.adminSettings.poolRewardPerPower,
          },
        });

        get().gainXP(Math.floor(usdValue / 10));

        const updatedTotalMined = state.totalMined + usdValue;
        set({
          quests: state.quests.map((q) => {
            if (q.type === 'earnings') {
              return { ...q, progress: updatedTotalMined };
            }
            if (q.type === 'power') {
              return { ...q, progress: totalPower + geoPower };
            }
            return q;
          }),
        });

        if (
          updatedTotalMined >= 1_000_000 &&
          !state.achievements.find((a) => a.id === 'a3')?.unlocked
        ) {
          get().unlockAchievement('a3');
        }

        const btc = state.cryptos.find((c) => c.symbol === 'BTC');
        if (
          btc &&
          btc.amount >= 1 &&
          !state.achievements.find((a) => a.id === 'a5')?.unlocked
        ) {
          get().unlockAchievement('a5');
        }
      },

      addPart: (partId, quantity = 1) => {
        const state = get();
        const part = state.parts.find((p) => p.id === partId);
        if (!part) return null;

        const updated: Part = { ...part, quantity: part.quantity + quantity };

        set({
          parts: state.parts.map((p) => (p.id === partId ? updated : p)),
        });

        get().addTransaction({
          type: 'part-drop',
          amount: 0,
          description: `Found ${quantity}× ${part.name}`,
        });

        return updated;
      },

      playMiniGame: (gameId, score) => {
        const state = get();
        const game = state.miniGames.find((g) => g.id === gameId);
        if (!game) return null;

        const now = Date.now();
        if (game.lastPlayed && now - game.lastPlayed < game.cooldown) return null;

        const reward = Math.floor(
          (state.adminSettings.gameBaseReward + score * game.reward) * state.adminSettings.gameRewardMultiplier,
        );

        const gameBoostPower = state.adminSettings.gameBoostBasePowerPercent + score * state.adminSettings.gameBoostScoreScaling;
        const gameBoost: GamePowerBoost = {
          id: `boost_${gameId}_${now}`,
          sourceGameId: gameId,
          sourceGameName: game.name,
          powerPercent: Number(gameBoostPower.toFixed(2)),
          earnedAt: now,
          expiresAt: now + state.adminSettings.gameBoostDurationHours * 60 * 60 * 1000,
        };

        const xpGained = Math.floor(
          (state.adminSettings.gameBaseReward + score * 2) * state.adminSettings.xpGainMultiplier,
        );

        set({
          balance: state.balance + reward,
          miniGames: state.miniGames.map((g) =>
            g.id === gameId ? { ...g, lastPlayed: now } : g
          ),
          user: { ...state.user, gamesPlayed: state.user.gamesPlayed + 1 },
          gamePowerBoosts: [...state.gamePowerBoosts.filter((b) => b.expiresAt > now), gameBoost],
        });

        get().addTransaction({
          type: 'game',
          amount: reward,
          description: `Won ${game.name}`,
        });

        get().gainXP(xpGained);
        get().addVipPoints(1);

        set({
          quests: state.quests.map((q) =>
            q.type === 'games' ? { ...q, progress: q.progress + 1 } : q,
          ),
        });

        const totalGames = state.user.gamesPlayed + 1;
        if (
          totalGames >= 50 &&
          !state.achievements.find((a) => a.id === 'a4')?.unlocked
        ) {
          get().unlockAchievement('a4');
        }

        let rewardedPart: Part | null = null;
        const dropRoll = Math.random();
        if (dropRoll < state.adminSettings.gamePartDropChance) {
          const availableParts = state.parts;
          if (availableParts.length > 0) {
            const picked = availableParts[Math.floor(Math.random() * availableParts.length)];
            rewardedPart = get().addPart(picked.id, 1);
          }
        }

        return { reward, xpGained, partDrop: rewardedPart, gameBoost };
      },

      completeQuest: (questId) => {
        const state = get();
        const quest = state.quests.find((q) => q.id === questId);
        if (!quest || quest.completed || quest.progress < quest.target) return;

        const questReward = Math.floor(quest.reward * state.adminSettings.questRewardMultiplier);

        set({
          balance: state.balance + questReward,
          quests: state.quests.map((q) =>
            q.id === questId ? { ...q, completed: true } : q,
          ),
        });

        if (quest.cryptoReward) {
          set({
            cryptos: state.cryptos.map((c) =>
              c.symbol === quest.cryptoReward!.symbol
                ? { ...c, amount: c.amount + quest.cryptoReward!.amount }
                : c,
            ),
          });
        }

        get().addTransaction({
          type: 'quest',
          amount: questReward,
          description: `Completed: ${quest.title}`,
        });

        get().gainXP(100);
      },

      unlockAchievement: (achievementId) => {
        const state = get();
        const achievement = state.achievements.find((a) => a.id === achievementId);
        if (!achievement || achievement.unlocked) return;

        const achievementReward = Math.floor(achievement.reward * state.adminSettings.achievementRewardMultiplier);

        set({
          achievements: state.achievements.map((a) =>
            a.id === achievementId
              ? { ...a, unlocked: true, unlockedAt: Date.now() }
              : a,
          ),
          balance: state.balance + achievementReward,
        });

        get().addTransaction({
          type: 'achievement',
          amount: achievementReward,
          description: `Unlocked: ${achievement.title}`,
        });

        get().gainXP(150);
      },

      updateCryptoPrices: () => {
        const state = get();
        if (!state.adminSettings.cryptoPriceVolatility) return;

        set({
          cryptos: state.cryptos.map((c) => ({
            ...c,
            value: c.value * (0.95 + Math.random() * 0.1),
          })),
        });
      },

      addTransaction: (transaction) => {
        const state = get();
        set({
          transactions: [
            {
              ...transaction,
              id: `tx_${Date.now()}_${Math.random()}`,
              timestamp: Date.now(),
            },
            ...state.transactions,
          ].slice(0, 120),
        });
      },

      addNotification: (type, message) => {
        const id = `notif_${Date.now()}_${Math.random()}`;
        set((state) => ({
          notifications: [
            ...state.notifications,
            { id, type, message, timestamp: Date.now() },
          ],
        }));

        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      updateAdminSettings: (settings) => {
        set((state) => {
          const merged: AdminSettings = { ...state.adminSettings, ...settings };
          const newMaxEnergy = merged.maxEnergy;
          const clampedEnergy = Math.min(state.energy, newMaxEnergy);
          return {
            adminSettings: merged,
            maxEnergy: newMaxEnergy,
            energy: clampedEnergy,
          };
        });
      },

      gainXP: (amount) => {
        const state = get();
        const adjustedXP = Math.floor(amount * state.adminSettings.xpGainMultiplier);
        const totalXP = state.user.xp + adjustedXP;
        const xpForNextLevel = state.user.level * 1000;

        if (totalXP >= xpForNextLevel) {
          const overflow = totalXP - xpForNextLevel;
          const newLevel = state.user.level + 1;

          set({
            user: {
              ...state.user,
              level: newLevel,
              xp: overflow,
            },
          });

          get().addTransaction({
            type: 'level',
            amount: 0,
            description: `Level up! Reached level ${newLevel}`,
          });
        } else {
          set({
            user: { ...state.user, xp: totalXP },
          });
        }
      },

      resetGame: () => {
        set({
          balance: 5000,
          cmrBalance: 0,
          cmrStaked: 0,
          cmrEarned: 0,
          cmrTotalSupply: 1000000,
          tokenListings: [],
          devices: initialDevices,
          cryptos: initialCryptos,
          selectedCrypto: 'btc',
          isMining: false,
          energy: 100,
          maxEnergy: 100,
          miningMultiplier: 1,
          totalMined: 0,
          miniGames: initialMiniGames,
          gamePowerBoosts: [],
          globalMiningPool: createInitialPool(15, 30),
          parts: initialParts,
          lootboxes: initialLootboxes,
          marketplaceListings: initialMarketplaceListings,
          quests: initialQuests,
          achievements: initialAchievements,
          transactions: [],
          user: {
            username: 'Miner_' + Math.floor(Math.random() * 10000),
            level: 1,
            xp: 0,
            joinedAt: Date.now(),
            totalMined: 0,
            gamesPlayed: 0,
            vipLevel: 0,
            vipPoints: 0,
            lastFaucetClaim: 0,
            cmrBalance: 0,
            cmrStaked: 0,
            cmrEarned: 0,
            geoMiningEnabled: false,
            geoMiningLocation: null,
            geoMiningPower: 0,
            geoMiningLastUpdate: 0,
          },
          adminSettings: {
            globalMiningRate: 1,
            energyRegenRate: 1,
            gameRewardMultiplier: 1,
            deviceCostMultiplier: 1,
            questRewardMultiplier: 1,
            achievementRewardMultiplier: 1,
            energyCostMultiplier: 1,
            xpGainMultiplier: 1,
            dailyBonusMultiplier: 1,
            autoSaveInterval: 30,
            energyRegenTickRate: 1000,
            cryptoPriceVolatility: true,
            maxEnergy: 100,
            gameBaseDuration: 60,
            gameDurationPerLevel: 15,
            gameDifficultyMultiplier: 1.2,
            maxGameLevels: 10,
            gameBaseReward: 50,
            gameRewardPerLevel: 10,
            gameSessionMinSeconds: 30,
            gameSessionMaxSeconds: 120,
            ptcBaseDuration: 15,
            ptcEarlyExitCooldownMinutes: 5,
            ptcRewardMultiplier: 1,
            ptcMinDurationSeconds: 10,
            ptcMaxDurationSeconds: 120,
            ptcMinRewardUsd: 0.0001,
            ptcRequireTabFocus: true,
            ptcRequireManualPlay: true,
            ptcSpotifyStrictSync: true,
            currencyPrecision: 6,
            poolBlockIntervalMinMinutes: 15,
            poolBlockIntervalMaxMinutes: 30,
            poolRewardBase: 500,
            poolRewardPerPower: 0.4,
            poolSimulatedNetworkPower: 150000,
            gameBoostBasePowerPercent: 2,
            gameBoostScoreScaling: 0.02,
            gameBoostDurationHours: 24,
            gamePartDropChance: 0.35,
            paymentsEnabled: true,
            minWithdrawAmount: 5,
            minDepositAmount: 1,
            faucetPayApiKey: undefined,
            faucetPayUsername: undefined,
            payeerMerchantId: undefined,
            payeerSecret: undefined,
            directWalletAddress: undefined,
            terminalRefreshRateMs: 2000,
            terminalLogLimit: 150,
            antiCheatSensitivity: 70,
            houseEdgeGlobal: 5,
            maxWinLimit: 10000,
            slotsRtp: 95,
            diceHouseEdge: 2,
            blackjackPayout: 1.5,
            rouletteZeroRules: true,
            pokerRoyalFlushMultiplier: 800,
            arcadeEnergyCost: 10,
            arcadeCooldownSeconds: 30,
            arcadeLevelScalingRate: 1.2,
            arcadeHighScoreRewardsEnabled: true,
            guildCreationCost: 1000,
            guildMaxMembers: 50,
            guildXpMultiplier: 1,
            guildTaxPercentage: 5,
            referralRewardPercentL1: 10,
            referralRewardPercentL2: 5,
            referralRewardPercentL3: 2,
            referralMinWithdraw: 100,
            seasonDurationDays: 30,
            seasonXpPerLevel: 1000,
            seasonTotalLevels: 50,
            seasonPremiumPrice: 20,
            maxTransactionsPerMinute: 60,
            withdrawalCooldownHours: 24,
            antiCheatIpRestriction: false,
            antiCheatDeviceFingerprinting: true,
            vipSystemEnabled: true,
            vipPointsMultiplier: 1,
            faucetEnabled: true,
            faucetCooldownMinutes: 60,
            faucetMinReward: 10,
            faucetMaxReward: 100,
            cmrEnabled: true,
            cmrExchangeRate: 100,
            cmrMiningReward: 10,
            cmrStakingAPY: 10,
            cmrMaxSupply: 10000000,
            cmrTotalMinted: 1000000,
            geoMiningEnabled: true,
            geoMiningPowerMultiplier: 1.5,
            geoMiningLocationRadius: 100,
            geoMiningUpdateInterval: 60000,
            tokenMarketplaceEnabled: true,
            tokenMarketplaceFee: 0.02,
            tokenMinListing: 1,
            stakingEnabled: true,
            stakingMinAmount: 10,
            stakingMaxAPY: 15,
            adminCanMint: true,
            adminCanBurn: true,
            adminMintLimit: 10000,
            features: {
              mining: true,
              arcade: true,
              shop: true,
              marketplace: true,
              mergeLab: true,
              casino: true,
              ptc: true,
              lootboxes: true,
              inventory: true,
              dailyRewards: true,
              seasonPass: true,
              researchLab: true,
              guilds: true,
              guildWars: true,
              pvpBattles: true,
              bossRaids: true,
              tradingCards: true,
              pets: true,
              landOwnership: true,
              crafting: true,
              quests: true,
              achievements: true,
              staking: true,
              referrals: true,
              cmrToken: true,
              geoMining: true,
              tokenMarketplace: true,
            },
          },
        });
      },

      mergeMiners: (deviceId) => {
        const state = get();
        const device = state.devices.find((d) => d.id === deviceId);
        if (!device || device.owned < 2) return;

        const newMergeLevel = (device.mergeLevel ?? 0) + 1;
        const powerBoost = 1.4;
        const energyBoost = 1.15;

        set({
          devices: state.devices.map((d) =>
            d.id === deviceId
              ? {
                  ...d,
                  owned: d.owned - 1,
                  mergeLevel: newMergeLevel,
                  power: d.power * powerBoost,
                  energyCost: Math.ceil(d.energyCost * energyBoost),
                }
              : d,
          ),
        });

        get().addTransaction({
          type: 'merge-miner',
          amount: 0,
          description: `Merged 2× ${device.name} → Level ${newMergeLevel + 1} miner`,
        });

        get().gainXP(device.tier * 25);
      },

      mergeParts: (partId) => {
        const state = get();
        const part = state.parts.find((p) => p.id === partId);
        if (!part || part.quantity < 3) return;

        set({
          parts: state.parts.map((p) =>
            p.id === partId ? { ...p, quantity: p.quantity - 3 } : p,
          ),
          miningMultiplier: state.miningMultiplier + 0.05,
        });

        get().addTransaction({
          type: 'merge-part',
          amount: 0,
          description: `Fused 3× ${part.name} → permanent mining boost`,
        });

        get().gainXP(40);
      },

      createListing: ({ itemType, itemId, price, quantity }) => {
        const state = get();
        if (quantity <= 0 || price <= 0) return;

        if (itemType === 'device') {
          const device = state.devices.find((d) => d.id === itemId);
          if (!device || device.owned < quantity) return;

          set({
            devices: state.devices.map((d) =>
              d.id === itemId ? { ...d, owned: d.owned - quantity } : d,
            ),
          });
        } else {
          const part = state.parts.find((p) => p.id === itemId);
          if (!part || part.quantity < quantity) return;

          set({
            parts: state.parts.map((p) =>
              p.id === itemId ? { ...p, quantity: p.quantity - quantity } : p,
            ),
          });
        }

        const nameSource = itemType === 'device' ? state.devices.find((d) => d.id === itemId)?.name : state.parts.find((p) => p.id === itemId)?.name;
        const iconSource = itemType === 'device' ? state.devices.find((d) => d.id === itemId)?.emoji ?? '📦' : state.parts.find((p) => p.id === itemId)?.icon ?? '🧩';

        const listing: MarketplaceListing = {
          id: `listing_${Date.now()}_${Math.random()}`,
          itemType,
          itemId,
          itemName: nameSource || 'Item',
          icon: iconSource,
          price,
          quantity,
          seller: state.user.username,
          isMine: true,
          createdAt: Date.now(),
        };

        set({ marketplaceListings: [listing, ...state.marketplaceListings] });

        get().addTransaction({
          type: 'market-list',
          amount: 0,
          description: `Listed ${quantity}× ${listing.itemName} on marketplace`,
        });
      },

      buyListing: (listingId) => {
        const state = get();
        const listing = state.marketplaceListings.find((l) => l.id === listingId);
        if (!listing || listing.quantity <= 0) return;
        if (listing.isMine) return;

        const price = listing.price;
        if (state.balance < price) return;

        const newBalance = state.balance - price;

        if (listing.itemType === 'device') {
          const exists = state.devices.find((d) => d.id === listing.itemId);
          if (!exists) return;
          set({
            devices: state.devices.map((d) =>
              d.id === listing.itemId ? { ...d, owned: d.owned + 1 } : d,
            ),
          });
        } else {
          const exists = state.parts.find((p) => p.id === listing.itemId);
          if (!exists) return;
          set({
            parts: state.parts.map((p) =>
              p.id === listing.itemId ? { ...p, quantity: p.quantity + 1 } : p,
            ),
          });
        }

        const updatedListings = state.marketplaceListings
          .map((l) => l.id === listingId ? { ...l, quantity: l.quantity - 1 } : l)
          .filter((l) => l.quantity > 0);

        set({ marketplaceListings: updatedListings, balance: newBalance });

        get().addTransaction({
          type: 'market-buy',
          amount: -price,
          description: `Purchased 1× ${listing.itemName}`,
        });
      },

      cancelListing: (listingId) => {
        const state = get();
        const listing = state.marketplaceListings.find((l) => l.id === listingId);
        if (!listing || !listing.isMine) return;

        if (listing.itemType === 'device') {
          set({
            devices: state.devices.map((d) =>
              d.id === listing.itemId ? { ...d, owned: d.owned + listing.quantity } : d,
            ),
          });
        } else {
          set({
            parts: state.parts.map((p) =>
              p.id === listing.itemId ? { ...p, quantity: p.quantity + listing.quantity } : p,
            ),
          });
        }

        set({
          marketplaceListings: state.marketplaceListings.filter((l) => l.id !== listingId),
        });

        get().addTransaction({
          type: 'market-cancel',
          amount: 0,
          description: `Cancelled listing for ${listing.itemName}`,
        });
      },

      viewPtcAd: (adId) => {
        const state = get();
        const ad = state.ptcAds.find(a => a.id === adId);
        if (!ad || ad.clicksLeft <= 0 || state.energy < 1) return;

        const payout = Number((ad.reward * state.adminSettings.ptcRewardMultiplier).toFixed(state.adminSettings.currencyPrecision));

        set({
          balance: state.balance + payout,
          energy: Math.max(0, state.energy - 1),
          ptcAds: state.ptcAds.map(a => a.id === adId ? { ...a, clicksLeft: a.clicksLeft - 1 } : a)
        });

        get().addTransaction({
          type: 'ptc',
          amount: payout,
          description: `Viewed ad: ${ad.title}`
        });

        get().gainXP(10);
      },

      createPtcAd: (ad) => {
        const state = get();
        const minReward = state.adminSettings.ptcMinRewardUsd;
        const clampedReward = Math.max(minReward, ad.reward);
        const clampedDuration = Math.max(state.adminSettings.ptcMinDurationSeconds, Math.min(state.adminSettings.ptcMaxDurationSeconds, ad.duration));
        const totalCost = clampedReward * ad.clicks * 1.2;
        if (state.balance < totalCost) return;

        const newAd = {
          ...ad,
          reward: clampedReward,
          duration: clampedDuration,
          id: `ad_${Date.now()}_${Math.random()}`,
          clicksLeft: ad.clicks,
          seller: state.user.username
        };

        set({
          balance: state.balance - totalCost,
          ptcAds: [newAd, ...state.ptcAds]
        });

        get().addTransaction({
          type: 'ptc-create',
          amount: -totalCost,
          description: `Created ad campaign: ${ad.title}`
        });
      },

      resolveGlobalMiningPool: () => {
        const state = get();
        const now = Date.now();
        const pool = state.globalMiningPool;
        if (now < pool.nextBlockAt) return;

        const totalContribution = pool.userContribution + pool.networkContribution;
        const userShare = totalContribution > 0 ? pool.userContribution / totalContribution : 0;
        const blockReward = state.adminSettings.poolRewardBase + Math.floor(pool.rewardPot);
        const userReward = Math.max(0, Math.floor(blockReward * userShare));

        const minMs = state.adminSettings.poolBlockIntervalMinMinutes * 60 * 1000;
        const maxMs = state.adminSettings.poolBlockIntervalMaxMinutes * 60 * 1000;
        const nextBlockAt = now + (minMs + Math.random() * Math.max(1000, maxMs - minMs));

        set({
          balance: state.balance + userReward,
          globalMiningPool: {
            currentBlock: pool.currentBlock + 1,
            blockStartedAt: now,
            nextBlockAt,
            userContribution: 0,
            networkContribution: 0,
            rewardPot: 0,
            lastBlockReward: userReward,
            lastWinnerShare: Number((userShare * 100).toFixed(2)),
          },
        });

        if (userReward > 0) {
          get().addTransaction({
            type: 'pool-reward',
            amount: userReward,
            description: `Global pool block #${pool.currentBlock} reward (${(userShare * 100).toFixed(2)}% share)`,
          });
          get().gainXP(80);
        }
      },

      openLootbox: (boxId) => {
        const state = get();
        const box = state.lootboxes.find((b) => b.id === boxId);
        if (!box || state.balance < box.cost) return null;

        const roll = Math.random();
        let cumulative = 0;
        let selectedDrop = box.dropRates[0];

        for (const drop of box.dropRates) {
          cumulative += drop.chance;
          if (roll <= cumulative) {
            selectedDrop = drop;
            break;
          }
        }

        if (selectedDrop.type === 'device') {
          set({
            balance: state.balance - box.cost,
            devices: state.devices.map((d) =>
              d.id === selectedDrop.itemId ? { ...d, owned: d.owned + 1 } : d
            ),
          });
        } else {
          set({
            balance: state.balance - box.cost,
            parts: state.parts.map((p) =>
              p.id === selectedDrop.itemId ? { ...p, quantity: p.quantity + 1 } : p
            ),
          });
        }

        const itemName = selectedDrop.type === 'device' ? state.devices.find(d => d.id === selectedDrop.itemId)?.name : state.parts.find(p => p.id === selectedDrop.itemId)?.name;

        get().addTransaction({
          type: 'lootbox',
          amount: -box.cost,
          description: `Opened ${box.name} and found ${itemName}`,
        });

        get().gainXP(20);

        return { itemType: selectedDrop.type, itemId: selectedDrop.itemId };
      },

      buyLand: (landId) => {
        const state = get();
        const land = state.lands.find(l => l.id === landId);
        if (!land || land.purchased || state.balance < land.cost) return;
        set({
          balance: state.balance - land.cost,
          lands: state.lands.map(l => l.id === landId ? { ...l, purchased: true } : l)
        });
        get().addTransaction({ type: 'purchase', amount: -land.cost, description: `Bought land: ${land.name}` });
      },

      adoptPet: (petType) => {
        const state = get();
        const cost = 2500;
        if (state.balance < cost) return;
        const newPet: Pet = {
          id: `pet_${Date.now()}`,
          name: `${petType} Companion`,
          type: petType,
          level: 1,
          bonus: 0.05,
          experience: 0
        };
        set({
          balance: state.balance - cost,
          pets: [...state.pets, newPet]
        });
        get().addTransaction({ type: 'purchase', amount: -cost, description: `Adopted a ${petType} pet!` });
      },

      drawCard: () => {
        const state = get();
        const cost = 1000;
        const types: ('miner' | 'booster' | 'shield' | 'hacker')[] = ['miner', 'booster', 'shield', 'hacker'];
        
        function rollRarity() {
          const r = Math.random();
          if (r < 0.05) return 'legendary';
          if (r < 0.15) return 'epic';
          if (r < 0.4) return 'rare';
          return 'common';
        }

        const rarity = rollRarity();
        const newCard: TradingCard = {
          id: `card_${Date.now()}`,
          name: `Crypto Card #${state.cards.length + 1}`,
          rarity,
          power: rarity === 'legendary' ? 100 : rarity === 'epic' ? 50 : rarity === 'rare' ? 20 : 5,
          type: types[Math.floor(Math.random() * types.length)],
          image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80'
        };

        if (state.balance >= cost) {
          set({
            balance: state.balance - cost,
            cards: [...state.cards, newCard]
          });
          get().addTransaction({ type: 'purchase', amount: -cost, description: `Drew a ${rarity} card!` });
        }
        return newCard;
      },

      claimFaucet: () => {
        const state = get();
        if (!state.adminSettings.faucetEnabled) return null;
        
        const now = Date.now();
        const cooldownMs = state.adminSettings.faucetCooldownMinutes * 60 * 1000;
        if (now - state.user.lastFaucetClaim < cooldownMs) return null;

        const min = state.adminSettings.faucetMinReward;
        const max = state.adminSettings.faucetMaxReward;
        
        const vipBonus = 1 + (state.user.vipLevel * 0.1); 
        const reward = Math.floor((min + Math.random() * (max - min)) * vipBonus);

        set({
          balance: state.balance + reward,
          user: { ...state.user, lastFaucetClaim: now }
        });

        get().addTransaction({ type: 'faucet', amount: reward, description: `Claimed Faucet Reward + VIP Bonus` });
        return reward;
      },

      addVipPoints: (points: number) => {
        const state = get();
        if (!state.adminSettings.vipSystemEnabled) return;

        const actualPoints = points * state.adminSettings.vipPointsMultiplier;
        const newTotal = state.user.vipPoints + actualPoints;
        const nextLevelReq = (state.user.vipLevel + 1) * 1000;

        let newLevel = state.user.vipLevel;
        if (newTotal >= nextLevelReq) {
          newLevel++;
          get().addTransaction({ type: 'vip-up', amount: 0, description: `VIP Level Upgraded to ${newLevel}!` });
        }

        set({
          user: { ...state.user, vipPoints: newTotal, vipLevel: newLevel }
        });
      },

      adminAddInventory: (itemType, itemId, quantity = 1) => {
        const state = get();
        if (itemType === 'device') {
          set({
            devices: state.devices.map((d) =>
              d.id === itemId ? { ...d, owned: d.owned + quantity } : d
            ),
          });
        } else {
          set({
            parts: state.parts.map((p) =>
              p.id === itemId ? { ...p, quantity: p.quantity + quantity } : p
            ),
          });
        }
        get().addNotification('success', `Admin: Added ${quantity}× item to inventory`);
      },

      adminModifyBalance: (amount) => {
        set((state) => ({ balance: state.balance + amount }));
        get().addNotification('success', `Admin: Balance ${amount >= 0 ? 'added' : 'removed'} ($${Math.abs(amount).toLocaleString()})`);
      },

      batchSellItems: (items) => {
        const state = get();
        let totalGain = 0;

        const newDevices = [...state.devices];
        const newParts = [...state.parts];

        items.forEach((item) => {
          if (item.itemType === 'device') {
            const idx = newDevices.findIndex((d) => d.id === item.itemId);
            if (idx !== -1 && newDevices[idx].owned >= item.quantity) {
              const device = newDevices[idx];
              const sellValue = Math.floor(device.cost * 0.4) * item.quantity;
              totalGain += sellValue;
              newDevices[idx] = { ...device, owned: device.owned - item.quantity };
            }
          } else {
            const idx = newParts.findIndex((p) => p.id === item.itemId);
            if (idx !== -1 && newParts[idx].quantity >= item.quantity) {
              const part = newParts[idx];
              const sellValue = 50 * item.quantity;
              totalGain += sellValue;
              newParts[idx] = { ...part, quantity: part.quantity - item.quantity };
            }
          }
        });

        set({
          devices: newDevices,
          parts: newParts,
          balance: state.balance + totalGain,
        });

        if (totalGain > 0) {
          get().addNotification('success', `Batch sold items for $${totalGain.toLocaleString()}`);
          get().addTransaction({
            type: 'batch-sell',
            amount: totalGain,
            description: `Batch sold ${items.length} items`,
          });
        }
      },

      createPaymentRequest: ({ method, type, amount, currency, addressOrTag }) => {
        const state = get();
        if (!state.adminSettings.paymentsEnabled) {
          get().addNotification('error', 'Payments are currently disabled by admin');
          return;
        }

        const minAmount = type === 'withdraw' ? state.adminSettings.minWithdrawAmount : state.adminSettings.minDepositAmount;

        if (amount < minAmount) {
          get().addNotification('warning', `Minimum ${type} is ${minAmount} ${currency}`);
          return;
        }

        if (type === 'withdraw' && state.balance < amount) {
          get().addNotification('error', 'Insufficient balance for withdrawal');
          return;
        }

        const id = `pay_${Date.now()}_${Math.random()}`;
        const request: PaymentRequest = {
          id,
          method,
          type,
          amount,
          currency,
          addressOrTag,
          status: 'pending',
          createdAt: Date.now(),
        };

        set({ payments: [request, ...state.payments] });

        if (type === 'withdraw') {
          set({ balance: state.balance - amount });
        }

        get().addTransaction({
          type: type === 'withdraw' ? 'withdraw-request' : 'deposit-request',
          amount: type === 'withdraw' ? -amount : 0,
          description: `${type === 'withdraw' ? 'Withdrawal' : 'Deposit'} request via ${method.toUpperCase()} (${amount} ${currency})`,
        });

        get().addNotification('info', `Created ${type} request via ${method.toUpperCase()}`);
      },

      markPaymentProcessed: (id, status) => {
        const state = get();
        const existing = state.payments.find((p) => p.id === id);
        if (!existing || existing.status !== 'pending') return;

        const updated: PaymentRequest = {
          ...existing,
          status,
          processedAt: Date.now(),
        };

        const newPayments = state.payments.map((p) => (p.id === id ? updated : p));
        set({ payments: newPayments });

        if (status === 'rejected' && existing.type === 'withdraw') {
          set({ balance: state.balance + existing.amount });
        }

        get().addTransaction({
          type: status === 'completed' ? 'payment-complete' : 'payment-rejected',
          amount: status === 'completed' && existing.type === 'deposit' ? existing.amount : 0,
          description: `${existing.type === 'withdraw' ? 'Withdrawal' : 'Deposit'} ${status} (${existing.method.toUpperCase()})`,
        });

        if (status === 'completed' && existing.type === 'deposit') {
          set({ balance: state.balance + existing.amount });
        }

        get().addNotification(
          status === 'completed' ? 'success' : 'warning',
          `${existing.type === 'withdraw' ? 'Withdrawal' : 'Deposit'} ${status}`,
        );
      },

      // CMR Token Actions
      exchangeUSDToCMR: (usdAmount) => {
        const state = get();
        if (!state.adminSettings.cmrEnabled) {
          get().addNotification('error', 'CMR Token system is disabled');
          return;
        }

        if (state.balance < usdAmount) {
          get().addNotification('error', 'Insufficient USD balance');
          return;
        }

        const cmrAmount = usdAmount / state.adminSettings.cmrExchangeRate;
        
        set({
          balance: state.balance - usdAmount,
          cmrBalance: state.cmrBalance + cmrAmount,
          cmrTotalSupply: state.cmrTotalSupply + cmrAmount,
        });

        get().addTransaction({
          type: 'cmr-exchange',
          amount: -usdAmount,
          description: `Exchanged $${usdAmount.toFixed(2)} for ${cmrAmount.toFixed(6)} CMR`,
        });

        get().addNotification('success', `Exchanged $${usdAmount.toFixed(2)} for ${cmrAmount.toFixed(6)} CMR`);
        get().gainXP(50);
      },

      exchangeCMRToUSD: (cmrAmount) => {
        const state = get();
        if (!state.adminSettings.cmrEnabled) {
          get().addNotification('error', 'CMR Token system is disabled');
          return;
        }

        if (state.cmrBalance < cmrAmount) {
          get().addNotification('error', 'Insufficient CMR balance');
          return;
        }

        const usdAmount = cmrAmount * state.adminSettings.cmrExchangeRate;
        
        set({
          balance: state.balance + usdAmount,
          cmrBalance: state.cmrBalance - cmrAmount,
        });

        get().addTransaction({
          type: 'cmr-exchange',
          amount: usdAmount,
          description: `Exchanged ${cmrAmount.toFixed(6)} CMR for $${usdAmount.toFixed(2)}`,
        });

        get().addNotification('success', `Exchanged ${cmrAmount.toFixed(6)} CMR for $${usdAmount.toFixed(2)}`);
      },

      stakeCMR: (amount, poolId) => {
        const state = get();
        if (!state.adminSettings.stakingEnabled) {
          get().addNotification('error', 'Staking is disabled');
          return;
        }

        const pool = state.stakingPools.find(p => p.id === poolId);
        if (!pool) {
          get().addNotification('error', 'Invalid staking pool');
          return;
        }

        if (state.cmrBalance < amount) {
          get().addNotification('error', 'Insufficient CMR balance');
          return;
        }

        if (amount < pool.minStake) {
          get().addNotification('error', `Minimum stake is ${pool.minStake} CMR`);
          return;
        }

        set({
          cmrBalance: state.cmrBalance - amount,
          cmrStaked: state.cmrStaked + amount,
          stakingPools: state.stakingPools.map(p => 
            p.id === poolId ? { ...p, userStaked: p.userStaked + amount, totalStaked: p.totalStaked + amount } : p
          ),
        });

        get().addTransaction({
          type: 'staking',
          amount: 0,
          description: `Staked ${amount.toFixed(6)} CMR in ${pool.name}`,
        });

        get().addNotification('success', `Staked ${amount.toFixed(6)} CMR in ${pool.name}`);
      },

      unstakeCMR: (amount, poolId) => {
        const state = get();
        const pool = state.stakingPools.find(p => p.id === poolId);
        if (!pool) {
          get().addNotification('error', 'Invalid staking pool');
          return;
        }

        if (pool.userStaked < amount) {
          get().addNotification('error', 'Insufficient staked balance');
          return;
        }

        set({
          cmrBalance: state.cmrBalance + amount,
          cmrStaked: state.cmrStaked - amount,
          stakingPools: state.stakingPools.map(p => 
            p.id === poolId ? { ...p, userStaked: p.userStaked - amount, totalStaked: p.totalStaked - amount } : p
          ),
        });

        get().addTransaction({
          type: 'staking',
          amount: 0,
          description: `Unstaked ${amount.toFixed(6)} CMR from ${pool.name}`,
        });

        get().addNotification('success', `Unstaked ${amount.toFixed(6)} CMR from ${pool.name}`);
      },

      claimStakingRewards: (poolId) => {
        const state = get();
        const pool = state.stakingPools.find(p => p.id === poolId);
        if (!pool) {
          get().addNotification('error', 'Invalid staking pool');
          return;
        }

        const now = Date.now();
        const timeStaked = now - (state.user.joinedAt + pool.lockPeriod);
        if (timeStaked < 0) {
          get().addNotification('error', 'Lock period not completed');
          return;
        }

        const reward = (pool.userStaked * pool.apy * timeStaked) / (365 * 24 * 60 * 60 * 1000 * 100);
        
        set({
          cmrBalance: state.cmrBalance + reward,
          cmrEarned: state.cmrEarned + reward,
        });

        get().addTransaction({
          type: 'staking',
          amount: reward,
          description: `Claimed ${reward.toFixed(6)} CMR staking rewards from ${pool.name}`,
        });

        get().addNotification('success', `Claimed ${reward.toFixed(6)} CMR staking rewards`);
      },

      // GEO Mining Actions
      enableGeoMining: (latitude, longitude) => {
        const state = get();
        if (!state.adminSettings.geoMiningEnabled) {
          get().addNotification('error', 'GEO Mining is disabled');
          return;
        }

        set({
          user: {
            ...state.user,
            geoMiningEnabled: true,
            geoMiningLocation: { lat: latitude, lng: longitude },
            geoMiningLastUpdate: Date.now(),
            geoMiningPower: 10 + Math.random() * 20,
          },
        });

        get().addNotification('success', 'GEO Mining enabled! You now earn extra mining power based on your location.');
        get().gainXP(100);
      },

      disableGeoMining: () => {
        const state = get();
        set({
          user: {
            ...state.user,
            geoMiningEnabled: false,
            geoMiningLocation: null,
            geoMiningPower: 0,
          },
        });

        get().addNotification('info', 'GEO Mining disabled');
      },

      updateGeoMiningPower: () => {
        const state = get();
        if (!state.user.geoMiningEnabled) return;

        const now = Date.now();
        if (now - state.user.geoMiningLastUpdate < state.adminSettings.geoMiningUpdateInterval) return;

        const newPower = 10 + Math.random() * 20;
        set({
          user: {
            ...state.user,
            geoMiningPower: newPower,
            geoMiningLastUpdate: now,
          },
        });

        get().addNotification('info', `GEO Mining power updated: ${newPower.toFixed(2)} TH/s`);
      },

      // Token Marketplace Actions
      createTokenListing: (amount, pricePerToken) => {
        const state = get();
        if (!state.adminSettings.tokenMarketplaceEnabled) {
          get().addNotification('error', 'Token marketplace is disabled');
          return;
        }

        if (state.cmrBalance < amount) {
          get().addNotification('error', 'Insufficient CMR balance');
          return;
        }

        if (amount < state.adminSettings.tokenMinListing) {
          get().addNotification('error', `Minimum listing is ${state.adminSettings.tokenMinListing} CMR`);
          return;
        }

        const totalPrice = amount * pricePerToken;
        const listing: TokenListing = {
          id: `token_${Date.now()}_${Math.random()}`,
          seller: state.user.username,
          amount,
          pricePerToken,
          totalPrice,
          createdAt: Date.now(),
        };

        set({
          cmrBalance: state.cmrBalance - amount,
          tokenListings: [listing, ...state.tokenListings],
        });

        get().addTransaction({
          type: 'token-listing',
          amount: 0,
          description: `Listed ${amount.toFixed(6)} CMR for sale at $${pricePerToken.toFixed(4)}/CMR`,
        });

        get().addNotification('success', `Listed ${amount.toFixed(6)} CMR for sale`);
      },

      buyTokens: (listingId) => {
        const state = get();
        const listing = state.tokenListings.find(l => l.id === listingId);
        if (!listing) {
          get().addNotification('error', 'Listing not found');
          return;
        }

        if (state.balance < listing.totalPrice) {
          get().addNotification('error', 'Insufficient USD balance');
          return;
        }

        set({
          balance: state.balance - listing.totalPrice,
          cmrBalance: state.cmrBalance + listing.amount,
          tokenListings: state.tokenListings.filter(l => l.id !== listingId),
        });

        get().addTransaction({
          type: 'token-buy',
          amount: -listing.totalPrice,
          description: `Bought ${listing.amount.toFixed(6)} CMR for $${listing.totalPrice.toFixed(2)}`,
        });

        get().addNotification('success', `Bought ${listing.amount.toFixed(6)} CMR for $${listing.totalPrice.toFixed(2)}`);
      },

      cancelTokenListing: (listingId) => {
        const state = get();
        const listing = state.tokenListings.find(l => l.id === listingId);
        if (!listing || listing.seller !== state.user.username) {
          get().addNotification('error', 'Listing not found or not yours');
          return;
        }

        set({
          cmrBalance: state.cmrBalance + listing.amount,
          tokenListings: state.tokenListings.filter(l => l.id !== listingId),
        });

        get().addTransaction({
          type: 'token-cancel',
          amount: 0,
          description: `Cancelled listing for ${listing.amount.toFixed(6)} CMR`,
        });

        get().addNotification('success', `Cancelled listing for ${listing.amount.toFixed(6)} CMR`);
      },

      // Admin Token Management
      adminMintCMR: (amount, recipient) => {
        const state = get();
        if (!state.adminSettings.adminCanMint) {
          get().addNotification('error', 'Admin minting is disabled');
          return;
        }

        if (amount > state.adminSettings.adminMintLimit) {
          get().addNotification('error', `Mint limit is ${state.adminSettings.adminMintLimit} CMR`);
          return;
        }

        if (state.cmrTotalSupply + amount > state.adminSettings.cmrMaxSupply) {
          get().addNotification('error', 'Exceeds maximum supply');
          return;
        }

        set({
          cmrTotalSupply: state.cmrTotalSupply + amount,
        });

        // In a real implementation, this would update the recipient's balance
        get().addTransaction({
          type: 'admin-mint',
          amount: amount,
          description: `Admin minted ${amount.toFixed(6)} CMR to ${recipient}`,
        });

        get().addNotification('success', `Minted ${amount.toFixed(6)} CMR to ${recipient}`);
      },

      adminBurnCMR: (amount, from) => {
        const state = get();
        if (!state.adminSettings.adminCanBurn) {
          get().addNotification('error', 'Admin burning is disabled');
          return;
        }

        set({
          cmrTotalSupply: Math.max(0, state.cmrTotalSupply - amount),
        });

        get().addTransaction({
          type: 'admin-burn',
          amount: -amount,
          description: `Admin burned ${amount.toFixed(6)} CMR from ${from}`,
        });

        get().addNotification('success', `Burned ${amount.toFixed(6)} CMR from ${from}`);
      },

      adminUpdateCmrSupply: (newSupply) => {
        const state = get();
        if (newSupply > state.adminSettings.cmrMaxSupply) {
          get().addNotification('error', 'Exceeds maximum supply');
          return;
        }

        set({
          cmrTotalSupply: newSupply,
        });

        get().addNotification('success', `CMR total supply updated to ${newSupply.toFixed(6)}`);
      },
    }),
    {
      name: 'cryptomine-storage',
    },
  ),
);