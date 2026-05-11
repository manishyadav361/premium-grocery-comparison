import React from 'react';
import { useNavigate } from 'react-router';
import { Bookmark, BookmarkCheck, Star, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, PLATFORMS, getCheapestPlatform, getMinPrice, getSavings } from '../data/mockData';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  index?: number;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0, compact = false }) => {
  const navigate = useNavigate();
  const { isItemSaved, addSavedItem, removeSavedItem, showSnackbar } = useApp();
  const saved = isItemSaved(product.id);
  const cheapest = getCheapestPlatform(product);
  const minPrice = getMinPrice(product);
  const savings = getSavings(product);
  const platformInfo = PLATFORMS[cheapest.platform as keyof typeof PLATFORMS];

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      removeSavedItem(product.id);
      showSnackbar('Removed from saved items', 'info');
    } else {
      addSavedItem(product);
      showSnackbar('Saved! We\'ll track prices for you 🎯', 'success');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      onClick={() => navigate(`/compare/${product.id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer active:scale-[0.98] transition-all hover:shadow-md"
    >
      <div className="relative">
        {/* Product image */}
        <div className="bg-gray-50 flex items-center justify-center" style={{ height: compact ? '120px' : '140px' }}>
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Cheapest badge */}
        <div
          className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm"
          style={{ background: platformInfo.color, color: platformInfo.textColor }}
        >
          <Zap size={9} fill="currentColor" />
          {platformInfo.name}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
        >
          {saved ? (
            <BookmarkCheck size={15} className="text-emerald-500" fill="currentColor" />
          ) : (
            <Bookmark size={15} className="text-gray-400" />
          )}
        </button>
      </div>

      <div className="p-3">
        {/* Product info */}
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">{product.brand}</p>
        <h3 className="text-gray-900 text-sm font-semibold line-clamp-2 mb-1" style={{ lineHeight: '1.3' }}>
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-400 mb-2">{product.variant}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star size={10} className="text-amber-400" fill="currentColor" />
          <span className="text-[11px] text-gray-500 font-medium">{product.rating}</span>
          <span className="text-[11px] text-gray-300">({product.reviews.toLocaleString()})</span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-emerald-600 font-bold" style={{ fontSize: '18px' }}>₹{minPrice}</span>
            </div>
            {savings > 0 && (
              <p className="text-[10px] text-emerald-500 font-semibold">Save ₹{savings} vs others</p>
            )}
          </div>

          {/* Platform dots */}
          <div className="flex gap-1.5">
            {Object.entries(PLATFORMS).map(([key, p]) => {
              const pd = product.platforms[key as keyof typeof product.platforms];
              return (
                <div
                  key={key}
                  className={`w-2 h-2 rounded-full ${!pd.inStock ? 'opacity-30' : ''}`}
                  style={{ background: p.color }}
                  title={`${p.name}: ₹${pd.price}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ProductListItem: React.FC<{ product: Product; index?: number }> = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const { isItemSaved, addSavedItem, removeSavedItem, showSnackbar } = useApp();
  const saved = isItemSaved(product.id);
  const cheapest = getCheapestPlatform(product);
  const minPrice = getMinPrice(product);
  const savings = getSavings(product);
  const platformInfo = PLATFORMS[cheapest.platform as keyof typeof PLATFORMS];

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      removeSavedItem(product.id);
      showSnackbar('Removed from saved items', 'info');
    } else {
      addSavedItem(product);
      showSnackbar('Saved! Tracking prices 🎯', 'success');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      onClick={() => navigate(`/compare/${product.id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer active:scale-[0.99] transition-all"
    >
      <div className="flex gap-3 p-3">
        <div className="relative flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-20 h-20 rounded-xl object-cover bg-gray-50"
          />
          <div
            className="absolute -top-1 -left-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold shadow"
            style={{ background: platformInfo.color, color: platformInfo.textColor }}
          >
            <Zap size={7} fill="currentColor" />
            Best
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{product.brand}</p>
          <h3 className="text-gray-900 text-sm font-semibold line-clamp-2 mb-1" style={{ lineHeight: '1.3' }}>
            {product.name}
          </h3>
          <p className="text-[11px] text-gray-400 mb-2">{product.variant}</p>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-emerald-600 font-bold text-lg">₹{minPrice}</span>
                <span className="text-[11px] text-gray-400 line-through">₹{Math.max(...Object.values(product.platforms).map(p => p.mrp))}</span>
              </div>
              {savings > 0 && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
                  💰 Save ₹{savings}
                </span>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <button onClick={handleSave} className="p-1.5 rounded-full bg-gray-50 active:bg-gray-100">
                {saved ? (
                  <BookmarkCheck size={16} className="text-emerald-500" fill="currentColor" />
                ) : (
                  <Bookmark size={16} className="text-gray-400" />
                )}
              </button>
              <div className="flex gap-1">
                {Object.entries(PLATFORMS).map(([key, p]) => {
                  const pd = product.platforms[key as keyof typeof product.platforms];
                  return (
                    <div
                      key={key}
                      className={`w-1.5 h-1.5 rounded-full ${!pd.inStock ? 'opacity-20' : ''}`}
                      style={{ background: p.color }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
