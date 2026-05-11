import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Bookmark, BookmarkCheck, Bell, BellOff,
  ExternalLink, Clock, Truck, Package, Zap, TrendingDown,
  ChevronRight, Star, Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS, PLATFORMS, getCheapestPlatform, getSavings } from '../data/mockData';

const PLATFORM_KEYS = ['blinkit', 'zepto', 'instamart'] as const;

export const ComparatorScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isItemSaved, addSavedItem, removeSavedItem, showSnackbar, addAlert, alerts } = useApp();

  const product = PRODUCTS.find(p => p.id === id);
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);
  const [highlightCheapest, setHighlightCheapest] = useState(false);

  useEffect(() => {
    // Animate cheapest card after mount
    const t = setTimeout(() => setHighlightCheapest(true), 600);
    return () => clearTimeout(t);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Product not found</p>
          <button onClick={() => navigate(-1)} className="mt-3 text-emerald-500 font-semibold">Go Back</button>
        </div>
      </div>
    );
  }

  const cheapest = getCheapestPlatform(product);
  const savings = getSavings(product);
  const saved = isItemSaved(product.id);
  const hasAlert = alerts.some(a => a.productId === product.id);

  const handleSave = () => {
    if (saved) {
      removeSavedItem(product.id);
      showSnackbar('Removed from saved items', 'info');
    } else {
      addSavedItem(product);
      showSnackbar('Saved! Tracking prices 🎯');
    }
  };

  const handleAlert = () => {
    if (!hasAlert) {
      addAlert({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        targetPrice: product.platforms[cheapest.platform as keyof typeof product.platforms].price - 20,
        currentPrice: cheapest.price,
        platform: cheapest.platform,
        type: 'price-drop',
        enabled: true,
      });
      showSnackbar('Price drop alert set! 🔔');
    }
  };

  const handleBuy = (platform: string) => {
    setRedirectTarget(platform);
    setTimeout(() => {
      setRedirectTarget(null);
      showSnackbar(`Opening ${PLATFORMS[platform as keyof typeof PLATFORMS].name}...`, 'info');
    }, 2000);
  };

  const prices = PLATFORM_KEYS.map(k => product.platforms[k].inStock ? product.platforms[k].price : Infinity);
  const minPrice = Math.min(...prices);

  return (
    <div className="min-h-screen bg-gray-50 pb-8 lg:pl-[220px]">
      {/* Redirect overlay */}
      <AnimatePresence>
        {redirectTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.85)' }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 mx-6 max-w-xs w-full"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: PLATFORMS[redirectTarget as keyof typeof PLATFORMS]?.color }}
              >
                🛒
              </div>
              <h3 className="text-gray-900 font-bold text-lg text-center">
                Opening {PLATFORMS[redirectTarget as keyof typeof PLATFORMS]?.name}
              </h3>
              <p className="text-gray-400 text-sm text-center">You'll be redirected to complete your purchase</p>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full"
              />
              <p className="text-gray-300 text-xs">If nothing opens, use the app directly</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 md:px-6 pt-4 md:pt-6 pb-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <ArrowLeft size={17} className="text-gray-600" />
          </button>
          <h1 className="text-gray-900 font-bold text-sm flex-1 text-center mx-3 line-clamp-1">Compare Prices</h1>
          <div className="flex gap-2">
            <button onClick={handleSave} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
              {saved ? <BookmarkCheck size={17} className="text-emerald-500" fill="currentColor" /> : <Bookmark size={17} className="text-gray-500" />}
            </button>
            <button onClick={handleAlert} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
              {hasAlert ? <Bell size={17} className="text-amber-500" fill="currentColor" /> : <Bell size={17} className="text-gray-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Product header */}
      <div className="bg-white mx-4 md:mx-6 mt-4 rounded-3xl p-5 shadow-sm border border-gray-50">
        <div className="flex gap-4">
          <img src={product.image} alt={product.name} className="w-24 h-24 rounded-2xl object-cover bg-gray-50 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-emerald-500 text-xs font-bold uppercase tracking-wide mb-1">{product.brand}</p>
            <h2 className="text-gray-900 font-bold mb-1" style={{ fontSize: '15px', lineHeight: '1.3' }}>
              {product.name}
            </h2>
            <p className="text-gray-400 text-xs mb-2">{product.variant}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                <Star size={10} className="text-amber-400" fill="currentColor" />
                <span className="text-amber-700 text-xs font-bold">{product.rating}</span>
              </div>
              <span className="text-gray-300 text-xs">({product.reviews.toLocaleString()} reviews)</span>
            </div>
          </div>
        </div>

        {/* Price range summary */}
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Price range</p>
            <p className="text-gray-900 font-black" style={{ fontSize: '20px' }}>
              ₹{minPrice}
              <span className="text-gray-300 font-normal text-sm"> – ₹{Math.max(...PLATFORM_KEYS.map(k => product.platforms[k].price))}</span>
            </p>
          </div>
          {savings > 0 && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-3 py-2 text-center">
              <p className="text-emerald-600 font-black text-lg">₹{savings}</p>
              <p className="text-emerald-500 text-[10px] font-semibold">max savings</p>
            </div>
          )}
        </div>
      </div>

      {/* Savings callout */}
      {savings > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-4 md:mx-6 mt-3"
        >
          <div className="flex items-center gap-3 bg-emerald-500 rounded-2xl px-4 py-3">
            <TrendingDown size={18} className="text-white flex-shrink-0" />
            <p className="text-white font-semibold text-sm flex-1">
              <span className="font-black">{PLATFORMS[cheapest.platform as keyof typeof PLATFORMS].name}</span>
              {' '}is cheapest by{' '}
              <span className="font-black">₹{savings}</span> right now
            </p>
            <Zap size={14} className="text-white/70" fill="white" />
          </div>
        </motion.div>
      )}

      {/* Platform comparison cards — 3-col on tablet+ */}
      <div className="px-4 md:px-6 mt-4">
        <h3 className="text-gray-900 font-bold text-sm px-1 mb-3">Platform Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {PLATFORM_KEYS.map((platformKey, idx) => {
            const pd = product.platforms[platformKey];
            const pInfo = PLATFORMS[platformKey];
            const isCheapest = platformKey === cheapest.platform && pd.inStock;

            return (
              <motion.div
                key={platformKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
              >
                <div
                  className="bg-white rounded-3xl overflow-hidden transition-all"
                  style={{
                    border: isCheapest && highlightCheapest
                      ? '2px solid #10B981'
                      : '2px solid #F3F4F6',
                    boxShadow: isCheapest && highlightCheapest
                      ? '0 8px 32px rgba(16,185,129,0.15)'
                      : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Card header */}
                  <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{
                      background: isCheapest && highlightCheapest
                        ? `linear-gradient(135deg, ${pInfo.color}20, ${pInfo.color}10)`
                        : '#FAFAFA',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Platform badge */}
                      <div
                        className="px-3 py-1.5 rounded-xl font-black text-sm"
                        style={{ background: pInfo.color, color: pInfo.textColor }}
                      >
                        {pInfo.name}
                      </div>
                      {isCheapest && highlightCheapest && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.8, type: 'spring' }}
                          className="flex items-center gap-1 bg-emerald-500 px-2 py-1 rounded-lg"
                        >
                          <Zap size={10} className="text-white" fill="white" />
                          <span className="text-white text-[10px] font-bold">BEST PRICE</span>
                        </motion.div>
                      )}
                    </div>

                    {pd.inStock ? (
                      <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        In Stock
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs font-semibold flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className={`px-4 py-4 ${!pd.inStock ? 'opacity-40' : ''}`}>
                    {/* Price row */}
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <motion.p
                          animate={isCheapest && highlightCheapest ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ delay: 0.9, duration: 0.4 }}
                          className="font-black"
                          style={{
                            fontSize: '32px',
                            color: isCheapest && highlightCheapest ? '#059669' : '#111827',
                            lineHeight: '1',
                          }}
                        >
                          ₹{pd.price}
                        </motion.p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-300 text-sm line-through">₹{pd.mrp}</span>
                          <span className="bg-red-50 text-red-500 text-xs font-bold px-1.5 py-0.5 rounded-md">
                            {pd.discount}% OFF
                          </span>
                        </div>
                      </div>

                      {pd.coupon && (
                        <div className="bg-amber-50 border border-amber-200 border-dashed rounded-xl px-3 py-2 text-center">
                          <p className="text-amber-600 text-[10px] font-bold">COUPON</p>
                          <p className="text-amber-700 text-xs font-black">{pd.coupon}</p>
                        </div>
                      )}
                    </div>

                    {/* Delivery details */}
                    <div className="flex gap-3">
                      <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2 flex-1">
                        <Clock size={13} className="text-gray-400" />
                        <span className="text-gray-700 text-xs font-bold">{pd.eta}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2 flex-1">
                        <Truck size={13} className="text-gray-400" />
                        <span className="text-gray-700 text-xs font-bold">
                          {pd.deliveryFee === 0 ? 'Free delivery' : `₹${pd.deliveryFee} fee`}
                        </span>
                      </div>
                    </div>

                    {/* Buy CTA */}
                    {pd.inStock && (
                      <button
                        onClick={() => handleBuy(platformKey)}
                        className="mt-3 w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        style={{
                          background: isCheapest && highlightCheapest
                            ? `linear-gradient(135deg, ${pInfo.color}, ${pInfo.color}cc)`
                            : '#F3F4F6',
                          color: isCheapest && highlightCheapest ? pInfo.textColor : '#4B5563',
                          boxShadow: isCheapest && highlightCheapest ? `0 4px 16px ${pInfo.color}40` : 'none',
                        }}
                      >
                        Buy on {pInfo.name}
                        <ExternalLink size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Price history link */}
      <div className="px-4 md:px-6 mt-4">
        <button
          onClick={() => navigate(`/history/${product.id}`)}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm hover:bg-gray-50 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <TrendingDown size={18} className="text-emerald-500" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-gray-900 font-bold text-sm">View Price History</p>
            <p className="text-gray-400 text-xs">Track price trends & set alerts</p>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>
      </div>

      {/* Trust badges */}
      <div className="px-4 md:px-6 mt-4 pb-6">
        <div className="bg-gray-50 rounded-2xl p-4 flex items-start gap-3">
          <Shield size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-700 font-semibold text-xs mb-1">Prices updated in real-time</p>
            <p className="text-gray-400 text-xs">We fetch live prices from partner apps. Final price may vary at checkout.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
