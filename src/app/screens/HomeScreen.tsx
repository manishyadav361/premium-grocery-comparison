import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Bell, ChevronDown, X, TrendingUp, Clock, Zap, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav, SIDEBAR_WIDTH } from '../components/BottomNav';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, TRENDING_SEARCHES, RECENT_SEARCHES, CATEGORIES } from '../data/mockData';

const TRENDING_PRODUCTS = PRODUCTS.slice(0, 8);
const DEALS = PRODUCTS.slice(2, 8);

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, location, alerts } = useApp();
  const [searchText, setSearchText] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const triggerSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query)}`);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const pendingAlerts = alerts.filter(a => a.enabled).length;

  return (
    <div
      className="min-h-screen bg-gray-50 pb-24 lg:pb-8"
      style={{ paddingLeft: undefined }}
    >
      {/* Sidebar spacer on desktop */}
      <div className="lg:pl-[220px]">
        {/* Header */}
        <div className="bg-white px-4 md:px-6 pt-4 md:pt-6 pb-4 shadow-sm sticky top-0 z-30">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              {/* Location pill */}
              <button
                onClick={() => navigate('/location')}
                className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 max-w-[55%]"
              >
                <MapPin size={14} className="text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm font-semibold truncate">
                  {location ? `${location.area}, ${location.city}` : 'Set Location'}
                </span>
                <ChevronDown size={12} className="text-gray-400 flex-shrink-0" />
              </button>

              {/* Right side */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/alerts')}
                  className="relative w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100"
                >
                  <Bell size={17} className="text-gray-600" />
                  {pendingAlerts > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                      {pendingAlerts}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm shadow-emerald-500/30"
                >
                  <span className="text-white font-bold text-xs">
                    {user?.isGuest ? '👤' : user?.avatar || user?.name?.[0] || 'U'}
                  </span>
                </button>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative">
              <motion.div
                animate={{ scale: searchFocused ? 1.01 : 1 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3.5 border-2 transition-all"
                style={{ borderColor: searchFocused ? '#10B981' : 'transparent' }}
              >
                <Search size={18} className={searchFocused ? 'text-emerald-500' : 'text-gray-400'} />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                  onKeyDown={e => e.key === 'Enter' && triggerSearch(searchText)}
                  placeholder="Search toothbrush, milk, chips..."
                  className="flex-1 bg-transparent text-gray-900 font-medium outline-none placeholder:text-gray-400 text-sm"
                />
                {searchText ? (
                  <button onClick={() => setSearchText('')}>
                    <X size={16} className="text-gray-400" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1 bg-emerald-500 px-2 py-1 rounded-lg">
                    <Zap size={11} className="text-white" fill="white" />
                    <span className="text-white text-[10px] font-bold">Compare</span>
                  </div>
                )}
              </motion.div>

              {/* Search suggestions dropdown */}
              <AnimatePresence>
                {searchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-30 mt-2 overflow-hidden"
                  >
                    {/* Recent */}
                    {RECENT_SEARCHES.length > 0 && (
                      <div className="p-3 border-b border-gray-50">
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2 px-1">Recent</p>
                        {RECENT_SEARCHES.map(s => (
                          <button
                            key={s}
                            onClick={() => triggerSearch(s)}
                            className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50"
                          >
                            <Clock size={14} className="text-gray-300" />
                            <span className="text-gray-700 text-sm font-medium">{s}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Trending */}
                    <div className="p-3">
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2 px-1">Trending</p>
                      <div className="flex flex-wrap gap-2">
                        {TRENDING_SEARCHES.slice(0, 8).map(s => (
                          <button
                            key={s}
                            onClick={() => triggerSearch(s)}
                            className="px-3 py-1.5 bg-gray-50 rounded-xl text-gray-600 text-sm font-medium hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Pull to refresh indicator */}
        <AnimatePresence>
          {refreshing && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 48 }}
              exit={{ height: 0 }}
              className="bg-emerald-50 flex items-center justify-center overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                  <Search size={14} className="text-emerald-500" />
                </motion.div>
                <span className="text-emerald-600 text-xs font-semibold">Refreshing prices...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page content */}
        <div className="max-w-5xl mx-auto px-4 md:px-6">

          {/* Categories */}
          <div className="pt-5 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    if (cat.id !== 'all') navigate(`/products?cat=${cat.id}`);
                  }}
                  className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-2"
                  style={{
                    background: activeCategory === cat.id ? '#10B981' : 'white',
                    color: activeCategory === cat.id ? 'white' : '#4B5563',
                    borderColor: activeCategory === cat.id ? '#10B981' : '#F3F4F6',
                    boxShadow: activeCategory === cat.id ? '0 4px 12px rgba(16,185,129,0.25)' : 'none',
                  }}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Savings banner */}
          <div className="pt-3 pb-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 md:p-5 flex items-center gap-4 overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
            >
              <div className="absolute right-0 top-0 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #10B981, transparent)', transform: 'translate(20%, -20%)' }} />
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm md:text-base mb-0.5">Save up to ₹500/month</p>
                <p className="text-gray-400 text-xs md:text-sm">By comparing prices across 3 platforms</p>
              </div>
              <button
                onClick={() => navigate('/products?q=trending')}
                className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center"
              >
                <ArrowRight size={14} className="text-white" />
              </button>
            </motion.div>
          </div>

          {/* Recent searches */}
          <div className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-gray-900 font-bold" style={{ fontSize: '16px' }}>Recent Searches</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {RECENT_SEARCHES.map(s => (
                <button
                  key={s}
                  onClick={() => triggerSearch(s)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-gray-100 shadow-sm"
                >
                  <Clock size={12} className="text-gray-300" />
                  <span className="text-gray-600 text-sm font-medium">{s}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trending now */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-500" />
                <h2 className="text-gray-900 font-bold" style={{ fontSize: '16px' }}>Trending Now</h2>
              </div>
              <button onClick={() => navigate('/products?q=trending')} className="text-emerald-500 text-sm font-semibold flex items-center gap-1">
                See all <ArrowRight size={13} />
              </button>
            </div>
            {/* Responsive grid: 2 cols on mobile, 3 on md, 4 on lg */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {TRENDING_PRODUCTS.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>

          {/* Today's deals */}
          <div className="pt-6 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-500" fill="currentColor" />
                <h2 className="text-gray-900 font-bold" style={{ fontSize: '16px' }}>Today's Deals</h2>
              </div>
              <button onClick={() => navigate('/products?sort=discount')} className="text-emerald-500 text-sm font-semibold flex items-center gap-1">
                See all <ArrowRight size={13} />
              </button>
            </div>
            {/* On mobile: horizontal scroll. On md+: grid */}
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-3">
              {DEALS.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} compact />
              ))}
            </div>
            <div className="flex md:hidden gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {DEALS.map((p, i) => (
                <div key={p.id} className="flex-shrink-0" style={{ width: '160px' }}>
                  <ProductCard product={p} index={i} compact />
                </div>
              ))}
            </div>
          </div>

          {/* Platform quick access */}
          <div className="pb-4">
            <h2 className="text-gray-900 font-bold mb-3" style={{ fontSize: '16px' }}>Compare On</h2>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {[
                { name: 'Blinkit', color: '#F8CB46', text: '#000', emoji: '⚡', desc: '8-12 min' },
                { name: 'Zepto', color: '#7C3AED', text: '#fff', emoji: '🟣', desc: '10-15 min' },
                { name: 'Instamart', color: '#FF6B35', text: '#fff', emoji: '🛍️', desc: '13-20 min' },
              ].map(p => (
                <button
                  key={p.name}
                  onClick={() => navigate(`/products?platform=${p.name.toLowerCase()}`)}
                  className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all hover:scale-[1.02]"
                  style={{ borderColor: `${p.color}40`, background: `${p.color}10` }}
                >
                  <span className="text-2xl md:text-3xl">{p.emoji}</span>
                  <span className="text-gray-800 font-bold text-xs md:text-sm">{p.name}</span>
                  <span className="text-gray-400 text-[10px] md:text-xs">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
};
