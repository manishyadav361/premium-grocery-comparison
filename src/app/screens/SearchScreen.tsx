import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowLeft, Clock, TrendingUp, Zap } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { SkeletonSearchItem } from '../components/SkeletonLoader';
import { PRODUCTS, TRENDING_SEARCHES, RECENT_SEARCHES, getCheapestPlatform, getMinPrice, PLATFORMS } from '../data/mockData';

export const SearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(true);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof PRODUCTS>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      const q = query.toLowerCase();
      const results = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some(tag => tag.includes(q))
      );
      setSuggestions(results);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const handleSubmit = () => {
    if (query.trim()) navigate(`/products?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8 lg:pl-[220px]">
      {/* Search header */}
      <div className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 px-4 md:px-6 pt-4 md:pt-6 pb-4">
            <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <ArrowLeft size={17} className="text-gray-600" />
            </button>
            <div className="flex-1 flex items-center gap-2.5 bg-gray-50 rounded-2xl px-4 py-3 border-2 border-emerald-400">
              <Search size={16} className="text-emerald-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Search for products..."
                className="flex-1 bg-transparent text-gray-900 font-medium outline-none placeholder:text-gray-300 text-sm"
              />
              {query && (
                <button onClick={() => setQuery('')}>
                  <X size={15} className="text-gray-400" />
                </button>
              )}
            </div>
            {query && (
              <button
                onClick={handleSubmit}
                className="px-4 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-sm flex-shrink-0"
              >
                Go
              </button>
            )}
          </div>

          {/* Popular categories */}
          {!query && (
            <div className="px-4 md:px-6 pb-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {['🛒 All', '🥛 Dairy', '🍿 Snacks', '🍎 Fruits', '🧴 Personal Care', '🍞 Bakery'].map(c => (
                <button
                  key={c}
                  onClick={() => {
                    const cat = c.split(' ')[1].toLowerCase().replace(' care', '-care');
                    navigate(`/products?cat=${cat}`);
                  }}
                  className="flex-shrink-0 px-3 py-1.5 bg-gray-100 rounded-xl text-gray-600 text-xs font-semibold"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-4">
        {/* Loading skeleton */}
        {loading && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {[...Array(4)].map((_, i) => <SkeletonSearchItem key={i} />)}
          </div>
        )}

        {/* Suggestions */}
        {!loading && query.length >= 2 && (
          <AnimatePresence>
            {suggestions.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50"
              >
                <div className="px-4 py-2.5 border-b border-gray-50 flex items-center justify-between">
                  <p className="text-gray-400 text-xs font-semibold">{suggestions.length} products found</p>
                  <button
                    onClick={handleSubmit}
                    className="text-emerald-500 text-xs font-bold flex items-center gap-1"
                  >
                    See all <Zap size={10} fill="currentColor" />
                  </button>
                </div>
                {suggestions.map((p, i) => {
                  const cheapest = getCheapestPlatform(p);
                  const minPrice = getMinPrice(p);
                  const pInfo = PLATFORMS[cheapest.platform as keyof typeof PLATFORMS];
                  return (
                    <motion.button
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(`/compare/${p.id}`)}
                      className="w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-gray-50 flex-shrink-0" />
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-gray-900 font-semibold text-sm line-clamp-1">{p.name}</p>
                        <p className="text-gray-400 text-xs">{p.brand} · {p.variant}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-emerald-600 font-black text-base">₹{minPrice}</p>
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{ background: pInfo.color, color: pInfo.textColor }}
                        >
                          {pInfo.name}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-16 text-center"
              >
                <span className="text-5xl mb-4">🔍</span>
                <p className="text-gray-700 font-bold text-lg mb-1">No results for "{query}"</p>
                <p className="text-gray-400 text-sm">Try a different search term</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Recent searches */}
        {!query && (
          <>
            {RECENT_SEARCHES.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-700 font-bold text-sm flex items-center gap-1.5">
                    <Clock size={14} className="text-gray-400" />
                    Recent Searches
                  </p>
                  <button className="text-gray-300 text-xs font-semibold">Clear</button>
                </div>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
                  {RECENT_SEARCHES.map(s => (
                    <button
                      key={s}
                      onClick={() => navigate(`/products?q=${encodeURIComponent(s)}`)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Clock size={13} className="text-gray-400" />
                      </div>
                      <span className="flex-1 text-left text-gray-700 font-medium text-sm">{s}</span>
                      <button
                        onClick={e => e.stopPropagation()}
                        className="text-gray-300 hover:text-gray-500"
                      >
                        <X size={14} />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending searches */}
            <div>
              <p className="text-gray-700 font-bold text-sm flex items-center gap-1.5 mb-3">
                <TrendingUp size={14} className="text-emerald-500" />
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((s, i) => (
                  <motion.button
                    key={s}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => navigate(`/products?q=${encodeURIComponent(s)}`)}
                    className="px-4 py-2.5 bg-white rounded-xl border border-gray-100 text-gray-600 text-sm font-medium shadow-sm hover:border-emerald-200 hover:text-emerald-600 transition-all"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* All categories */}
            <div className="mt-6">
              <p className="text-gray-700 font-bold text-sm mb-3">Browse by Category</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { id: 'dairy', label: 'Dairy & Eggs', emoji: '🥛', color: '#3B82F6', bg: '#EFF6FF' },
                  { id: 'snacks', label: 'Snacks', emoji: '🍿', color: '#F59E0B', bg: '#FFFBEB' },
                  { id: 'fruits', label: 'Fruits', emoji: '🍎', color: '#10B981', bg: '#F0FDF4' },
                  { id: 'personal-care', label: 'Personal Care', emoji: '🧴', color: '#7C3AED', bg: '#F5F3FF' },
                  { id: 'beverages', label: 'Beverages', emoji: '🧃', color: '#FF6B35', bg: '#FFF7F3' },
                  { id: 'bakery', label: 'Bakery', emoji: '🍞', color: '#D97706', bg: '#FFFBEB' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/products?cat=${cat.id}`)}
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100 transition-all hover:border-gray-200"
                    style={{ background: cat.bg }}
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-gray-700 font-bold text-sm">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};
