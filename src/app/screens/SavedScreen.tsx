import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bookmark, Trash2, ChevronRight, TrendingDown, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/BottomNav';
import { PLATFORMS, getCheapestPlatform, getMinPrice, getSavings } from '../data/mockData';

export const SavedScreen: React.FC = () => {
  const navigate = useNavigate();
  const { savedItems, removeSavedItem, showSnackbar } = useApp();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [swipedId, setSwipedId] = useState<string | null>(null);

  const handleRemove = (id: string, name: string) => {
    setRemovingId(id);
    setTimeout(() => {
      removeSavedItem(id);
      setRemovingId(null);
      showSnackbar(`"${name.slice(0, 30)}..." removed`, 'info');
    }, 350);
  };

  const totalSavings = savedItems.reduce((acc, p) => acc + getSavings(p), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8 lg:pl-[220px]">
      {/* Header */}
      <div className="bg-white px-4 md:px-6 pt-4 md:pt-6 pb-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <ArrowLeft size={17} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-gray-900 font-black" style={{ fontSize: '20px' }}>Saved Items</h1>
            <p className="text-gray-400 text-xs">{savedItems.length} item{savedItems.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>
      </div>

      {savedItems.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* Stats bar */}
          {totalSavings > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-4 mt-4 bg-emerald-500 rounded-2xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-black text-base">Save ₹{totalSavings} total</p>
                <p className="text-emerald-100 text-xs">by buying from cheapest platforms</p>
              </div>
            </motion.div>
          )}

          {/* Swipe hint */}
          <div className="px-4 md:px-6 pt-4 pb-2">
            <p className="text-gray-400 text-xs flex items-center gap-1.5">
              <span>👆</span> Tap card to compare prices
            </p>
          </div>

          {/* Items list */}
          <div className="px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <AnimatePresence>
              {savedItems.map((product, idx) => {
                const cheapest = getCheapestPlatform(product);
                const minPrice = getMinPrice(product);
                const savings = getSavings(product);
                const platformInfo = PLATFORMS[cheapest.platform as keyof typeof PLATFORMS];
                const isRemoving = removingId === product.id;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isRemoving ? 0 : 1, x: isRemoving ? 100 : 0, height: isRemoving ? 0 : 'auto' }}
                    exit={{ opacity: 0, x: 100, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      onClick={() => navigate(`/compare/${product.id}`)}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer active:scale-[0.99] transition-all"
                    >
                      <div className="flex gap-3 p-3">
                        {/* Image */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 rounded-xl object-cover bg-gray-50"
                          />
                          <div
                            className="absolute -top-1 -left-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold"
                            style={{ background: platformInfo.color, color: platformInfo.textColor }}
                          >
                            {platformInfo.name}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{product.brand}</p>
                          <h3 className="text-gray-900 text-sm font-bold line-clamp-2 mb-1" style={{ lineHeight: '1.3' }}>
                            {product.name}
                          </h3>
                          <p className="text-[11px] text-gray-400 mb-1.5">{product.variant}</p>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-emerald-600 font-black text-lg">₹{minPrice}</span>
                                {savings > 0 && (
                                  <span className="text-[10px] text-emerald-500 font-bold">Save ₹{savings}</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/history/${product.id}`);
                                }}
                                className="w-7 h-7 bg-blue-50 rounded-xl flex items-center justify-center"
                              >
                                <TrendingDown size={13} className="text-blue-500" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove(product.id, product.name);
                                }}
                                className="w-7 h-7 bg-red-50 rounded-xl flex items-center justify-center"
                              >
                                <Trash2 size={13} className="text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Platform price comparison strip */}
                      <div className="flex border-t border-gray-50">
                        {Object.entries(PLATFORMS).map(([key, p]) => {
                          const pd = product.platforms[key as keyof typeof product.platforms];
                          const isCheap = key === cheapest.platform;
                          return (
                            <div
                              key={key}
                              className="flex-1 py-2 flex flex-col items-center gap-0.5 border-r border-gray-50 last:border-0"
                              style={{ background: isCheap ? `${p.color}12` : 'transparent' }}
                            >
                              <span className="text-[9px] font-bold" style={{ color: isCheap ? p.color === '#F8CB46' ? '#92630A' : p.color : '#9CA3AF' }}>
                                {p.name}
                              </span>
                              <span className="text-xs font-black" style={{ color: isCheap ? '#059669' : pd.inStock ? '#374151' : '#D1D5DB' }}>
                                {pd.inStock ? `₹${pd.price}` : '—'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="px-4 md:px-6 mt-6">
            <button
              onClick={() => navigate('/home')}
              className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              Add More Items <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

const EmptyState: React.FC = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-6 py-20 text-center"
    >
      <div className="w-24 h-24 rounded-3xl bg-emerald-50 flex items-center justify-center mb-6 shadow-sm">
        <Bookmark size={40} className="text-emerald-200" />
      </div>
      <h3 className="text-gray-800 font-black text-xl mb-2">Nothing saved yet</h3>
      <p className="text-gray-400 text-sm mb-8 max-w-xs leading-relaxed">
        Save products to track their prices and get alerts when they drop!
      </p>
      <button
        onClick={() => navigate('/home')}
        className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/25"
      >
        Start Comparing
      </button>
    </motion.div>
  );
};
