import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    title: 'LUCKY RED SALE',
    subtitle: 'ENDS IN 1d : 22h : 15m',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800',
    color: 'from-red-600 to-orange-600',
    tag: 'SALE'
  },
  {
    id: 2,
    title: 'CRIMSON FIREWORK',
    subtitle: '27 FEB - 02 MAR',
    image: 'https://images.unsplash.com/photo-1642104704074-907c0698bcd9?auto=format&fit=crop&q=80&w=800',
    color: 'from-purple-600 to-pink-600',
    tag: 'EVENT'
  },
  {
    id: 3,
    title: 'LUCKY RED CRAFT',
    subtitle: 'ENDS IN 1d : 22h : 15m',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800',
    color: 'from-green-600 to-teal-600',
    tag: 'CRAFT'
  },
  {
    id: 4,
    title: 'PIKA HAM SALE',
    subtitle: 'ENDS IN 22h : 15m',
    image: 'https://images.unsplash.com/photo-1621504450181-5d356f63d3ee?auto=format&fit=crop&q=80&w=800',
    color: 'from-blue-600 to-indigo-600',
    tag: 'LIMITED'
  }
];

export const EventCarousel: React.FC = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative group w-full h-48 md:h-64 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${active * 100}%)` }}>
        {BANNERS.map((banner) => (
          <div key={banner.id} className="min-w-full h-full relative">
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover opacity-60" />
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} opacity-40`} />
            <div className="absolute inset-0 flex flex-col justify-center p-8">
              <span className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold w-fit mb-4 tracking-widest border border-white/20">
                {banner.tag}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-lg font-orbitron">
                {banner.title}
              </h2>
              <div className="flex items-center gap-2 text-white/90 font-medium">
                <Clock size={16} className="animate-pulse" />
                <span className="text-sm md:text-base font-rajdhani">{banner.subtitle}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => setActive((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={() => setActive((prev) => (prev + 1) % BANNERS.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-12 h-1 rounded-full transition-all ${active === i ? 'bg-white' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};