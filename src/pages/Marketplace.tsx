import { useState } from 'react';
import { useGameStore, MarketplaceItemType } from '../store/gameStore';

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'orders'>('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const { 
    marketplaceListings, 
    createListing, 
    buyListing, 
    cancelListing, 
    devices, 
    parts, 
    balance
  } = useGameStore();

  const [sellItem, setSellItem] = useState<{
    itemType: MarketplaceItemType;
    itemId: string;
    price: number;
    quantity: number;
  }>({
    itemType: 'device',
    itemId: '',
    price: 0,
    quantity: 1,
  });

  const categories = [
    { id: 'all', name: 'All', count: marketplaceListings.length },
    { id: 'device', name: 'Miners', count: marketplaceListings.filter(l => l.itemType === 'device').length },
    { id: 'part', name: 'Parts', count: marketplaceListings.filter(l => l.itemType === 'part').length },
    { id: 'rack', name: 'Racks', count: 0 },
    { id: 'battery', name: 'Batteries', count: 0 },
    { id: 'other', name: 'Other', count: 0 },
  ];

  const filteredListings = marketplaceListings
    .filter(listing => {
      if (selectedCategory !== 'all' && listing.itemType !== selectedCategory) return false;
      if (searchQuery && !listing.itemName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (listing.price < priceRange[0] || listing.price > priceRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  const myOrders = marketplaceListings.filter(l => l.isMine);

  const handleCreateListing = () => {
    if (!sellItem.itemId || sellItem.price <= 0 || sellItem.quantity <= 0) return;
    createListing(sellItem);
    setSellItem({ itemType: 'device', itemId: '', price: 0, quantity: 1 });
  };

  const handleBuy = (listingId: string) => {
    if (confirm('Confirm purchase?')) {
      buyListing(listingId);
    }
  };

  const handleCancel = (listingId: string) => {
    if (confirm('Cancel this listing?')) {
      cancelListing(listingId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            💱 Marketplace
            <span className="text-sm font-normal text-gray-400">v 0.2</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            At this section you can buy goods. Use the filters to search for the needed ones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('buy')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'buy'
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                : 'bg-[#151a28] border border-gray-700 text-gray-400 hover:border-cyan-500/30'
            }`}
          >
            🛒 Buy
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'sell'
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                : 'bg-[#151a28] border border-gray-700 text-gray-400 hover:border-cyan-500/30'
            }`}
          >
            💰 Sell
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                : 'bg-[#151a28] border border-gray-700 text-gray-400 hover:border-cyan-500/30'
            }`}
          >
            📋 My orders
          </button>
          <button
            disabled
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold bg-[#151a28] border border-gray-700 text-gray-600 cursor-not-allowed"
          >
            ⚖️ Auction <span className="text-xs ml-2">COMING SOON</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'buy' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="gaming-card p-4 text-center">
                  <div className="text-3xl mb-2">🛒</div>
                  <div className="text-gray-400 text-sm">Orders placed</div>
                  <div className="text-2xl font-bold text-white">7 583 198</div>
                </div>
                <div className="gaming-card p-4 text-center">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-gray-400 text-sm">Items sold</div>
                  <div className="text-2xl font-bold text-white">212 196 951</div>
                </div>
                <div className="gaming-card p-4 text-center">
                  <div className="text-3xl mb-2 text-cyan-400">₮</div>
                  <div className="text-gray-400 text-sm">Trade volume</div>
                  <div className="text-2xl font-bold text-cyan-400">4 058 062</div>
                </div>
              </div>

              {/* Filters */}
              <div className="gaming-card p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#151a28] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#151a28] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none"
                  >
                    <option value="newest">Date: New - Old</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                  <select className="bg-[#151a28] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none">
                    <option>12</option>
                    <option>24</option>
                    <option>48</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  {/* Categories */}
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                          selectedCategory === cat.id
                            ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                            : 'bg-[#151a28] border border-gray-700 text-gray-400 hover:border-cyan-500/30'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${
                          selectedCategory === cat.id ? 'bg-cyan-400' : 'bg-gray-600'
                        }`} />
                        <span className="flex-1 text-left">{cat.name}</span>
                        <span className="text-xs text-gray-500">({cat.count.toLocaleString()})</span>
                      </button>
                    ))}
                  </div>

                  {/* Price Range */}
                  <div className="bg-[#151a28] rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400 text-sm">Price range (CMR):</span>
                      <button className="text-cyan-400 text-xs font-bold">MAX</button>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-24 bg-[#0f1420] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500/50 focus:outline-none"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-24 bg-[#0f1420] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500/50 focus:outline-none"
                      />
                      <button className="btn-gaming px-4 py-2 text-sm">OK</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Listings */}
              <div className="space-y-3">
                {filteredListings.map((listing) => (
                  <div key={listing.id} className="gaming-card p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-[#151a28] rounded-lg flex items-center justify-center text-4xl border border-gray-700">
                        {listing.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {listing.itemName.includes('Rare') && (
                            <span className="badge badge-rare">Rare</span>
                          )}
                          <h3 className="text-white font-bold">{listing.itemName}</h3>
                        </div>
                        <div className="text-sm text-gray-400">
                          Quantity: <span className="text-white">{listing.quantity}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Seller: {listing.seller}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-gray-400 text-sm mb-1">From</div>
                        <div className="text-2xl font-bold text-cyan-400">
                          {listing.price.toFixed(4)} CMR
                        </div>
                        <button
                          onClick={() => handleBuy(listing.id)}
                          disabled={listing.isMine || balance < listing.price}
                          className="btn-gaming mt-2 w-full"
                        >
                          {listing.isMine ? 'Your Item' : 'BUY NOW'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sell' && (
            <div className="gaming-card p-6">
              <h3 className="text-xl font-bold text-white mb-6">Create New Listing</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Item Type</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSellItem({ ...sellItem, itemType: 'device', itemId: '' })}
                      className={`flex-1 py-3 rounded-lg font-bold ${
                        sellItem.itemType === 'device'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-[#151a28] text-gray-400 border border-gray-700'
                      }`}
                    >
                       Miners
                    </button>
                    <button
                      onClick={() => setSellItem({ ...sellItem, itemType: 'part', itemId: '' })}
                      className={`flex-1 py-3 rounded-lg font-bold ${
                        sellItem.itemType === 'part'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-[#151a28] text-gray-400 border border-gray-700'
                      }`}
                    >
                      🔧 Parts
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Select Item</label>
                  <select
                    value={sellItem.itemId}
                    onChange={(e) => setSellItem({ ...sellItem, itemId: e.target.value })}
                    className="w-full bg-[#151a28] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none"
                  >
                    <option value="">Choose an item...</option>
                    {sellItem.itemType === 'device' ? (
                      devices.filter(d => d.owned > 0).map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name} (Owned: {d.owned})
                        </option>
                      ))
                    ) : (
                      parts.filter(p => p.quantity > 0).map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Owned: {p.quantity})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Quantity</label>
                    <input
                      type="number"
                      value={sellItem.quantity}
                      onChange={(e) => setSellItem({ ...sellItem, quantity: Number(e.target.value) })}
                      className="w-full bg-[#151a28] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Price (CMR)</label>
                    <input
                      type="number"
                      value={sellItem.price}
                      onChange={(e) => setSellItem({ ...sellItem, price: Number(e.target.value) })}
                      className="w-full bg-[#151a28] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none"
                      min="0.0001"
                      step="0.0001"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCreateListing}
                  disabled={!sellItem.itemId || sellItem.price <= 0}
                  className="btn-gaming w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📦 Create Listing
                </button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {myOrders.length === 0 ? (
                <div className="gaming-card p-8 text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Active Orders</h3>
                  <p className="text-gray-400 mb-4">You haven't listed any items for sale yet.</p>
                  <button onClick={() => setActiveTab('sell')} className="btn-gaming">
                    Create Listing
                  </button>
                </div>
              ) : (
                myOrders.map((order) => (
                  <div key={order.id} className="gaming-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#151a28] rounded-lg flex items-center justify-center text-3xl border border-gray-700">
                          {order.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-bold">{order.itemName}</h3>
                          <div className="text-sm text-gray-400">
                            Quantity: {order.quantity} | Price: {order.price.toFixed(4)} CMR
                          </div>
                          <div className="text-xs text-gray-500">
                            Listed: {new Date(order.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="btn-gaming btn-gaming-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
