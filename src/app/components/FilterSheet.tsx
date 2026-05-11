import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RotateCcw, Check } from 'lucide-react';

interface FilterState {
  platforms: string[];
  priceRange: [number, number];
  deliveryFee: string;
  eta: string;
  brands: string[];
  inStockOnly: boolean;
  hasDiscount: boolean;
  hasCoupon: boolean;
}

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

const DEFAULT_FILTERS: FilterState = {
  platforms: [],
  priceRange: [0, 2000],
  deliveryFee: 'any',
  eta: 'any',
  brands: [],
  inStockOnly: false,
  hasDiscount: false,
  hasCoupon: false,
};

const PLATFORM_OPTIONS = [
  { id: 'blinkit', label: 'Blinkit', color: '#F8CB46', textColor: '#000' },
  { id: 'zepto', label: 'Zepto', color: '#7C3AED', textColor: '#fff' },
  { id: 'instamart', label: 'Instamart', color: '#FF6B35', textColor: '#fff' },
];

const BRANDS = ['Oral-B', 'Colgate', 'Amul', "Lay's", 'Britannia', 'Dove', 'Himalaya'];

export const FilterSheet: React.FC<FilterSheetProps> = ({ visible, onClose, onApply, initialFilters }) => {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS, ...initialFilters });

  const togglePlatform = (id: string) => {
    setFilters(f => ({
      ...f,
      platforms: f.platforms.includes(id) ? f.platforms.filter(p => p !== id) : [...f.platforms, id],
    }));
  };

  const toggleBrand = (brand: string) => {
    setFilters(f => ({
      ...f,
      brands: f.brands.includes(brand) ? f.brands.filter(b => b !== brand) : [...f.brands, brand],
    }));
  };

  const reset = () => setFilters(DEFAULT_FILTERS);

  const activeCount = [
    filters.platforms.length > 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 2000,
    filters.deliveryFee !== 'any',
    filters.eta !== 'any',
    filters.brands.length > 0,
    filters.inStockOnly,
    filters.hasDiscount,
    filters.hasCoupon,
  ].filter(Boolean).length;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-3xl z-50 overflow-hidden"
            style={{ maxWidth: '430px', maxHeight: '92vh' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div>
                <h2 className="text-gray-900 font-bold" style={{ fontSize: '17px' }}>Filters</h2>
                {activeCount > 0 && (
                  <p className="text-emerald-500 text-xs font-medium">{activeCount} filter{activeCount > 1 ? 's' : ''} active</p>
                )}
              </div>
              <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <X size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto pb-24" style={{ maxHeight: 'calc(92vh - 140px)' }}>

              {/* Platform */}
              <Section title="Platform">
                <div className="flex gap-2 flex-wrap">
                  {PLATFORM_OPTIONS.map(p => {
                    const active = filters.platforms.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => togglePlatform(p.id)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all font-semibold text-sm"
                        style={{
                          borderColor: active ? p.color : '#E5E7EB',
                          background: active ? p.color : 'white',
                          color: active ? p.textColor : '#6B7280',
                        }}
                      >
                        {active && <Check size={13} />}
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Price Range */}
              <Section title="Price Range">
                <div className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    step={50}
                    value={filters.priceRange[1]}
                    onChange={e => setFilters(f => ({ ...f, priceRange: [f.priceRange[0], Number(e.target.value)] }))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-gray-700">₹{filters.priceRange[0]}</span>
                    <span className="text-sm font-semibold text-gray-700">₹{filters.priceRange[1]}</span>
                  </div>
                  <div className="flex gap-2">
                    {[100, 200, 500, 1000].map(val => (
                      <button
                        key={val}
                        onClick={() => setFilters(f => ({ ...f, priceRange: [0, val] }))}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filters.priceRange[1] === val ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-200 text-gray-500'}`}
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>
                </div>
              </Section>

              {/* Delivery Fee */}
              <Section title="Delivery Fee">
                <div className="flex gap-2">
                  {[
                    { id: 'free', label: 'Free only' },
                    { id: 'under20', label: 'Under ₹20' },
                    { id: 'any', label: 'Any' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setFilters(f => ({ ...f, deliveryFee: opt.id }))}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${filters.deliveryFee === opt.id ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-200 text-gray-500'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Section>

              {/* ETA */}
              <Section title="Delivery Time">
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: 'under10', label: '⚡ Under 10 min' },
                    { id: 'under20', label: '🚀 Under 20 min' },
                    { id: 'any', label: '⏰ Any time' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setFilters(f => ({ ...f, eta: opt.id }))}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${filters.eta === opt.id ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-200 text-gray-500'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Section>

              {/* Brand */}
              <Section title="Brand">
                <div className="flex gap-2 flex-wrap">
                  {BRANDS.map(brand => {
                    const active = filters.brands.includes(brand);
                    return (
                      <button
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${active ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-200 text-gray-500'}`}
                      >
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Toggles */}
              <Section title="More Options">
                <div className="space-y-3">
                  <ToggleRow
                    label="In Stock Only"
                    desc="Show only available products"
                    value={filters.inStockOnly}
                    onChange={v => setFilters(f => ({ ...f, inStockOnly: v }))}
                  />
                  <ToggleRow
                    label="Has Discount"
                    desc="Products with any discount"
                    value={filters.hasDiscount}
                    onChange={v => setFilters(f => ({ ...f, hasDiscount: v }))}
                  />
                  <ToggleRow
                    label="Has Coupon"
                    desc="Show coupon-eligible products"
                    value={filters.hasCoupon}
                    onChange={v => setFilters(f => ({ ...f, hasCoupon: v }))}
                  />
                </div>
              </Section>
            </div>

            {/* Sticky buttons */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-3">
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm"
              >
                <RotateCcw size={14} />
                Reset
              </button>
              <button
                onClick={() => { onApply(filters); onClose(); }}
                className="flex-1 py-3.5 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25"
              >
                Apply Filters{activeCount > 0 ? ` (${activeCount})` : ''}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="px-5 py-4 border-b border-gray-50">
    <h3 className="text-gray-900 font-bold text-sm mb-3">{title}</h3>
    {children}
  </div>
);

const ToggleRow: React.FC<{
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, desc, value, onChange }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-gray-800 text-sm font-semibold">{label}</p>
      <p className="text-gray-400 text-xs">{desc}</p>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-emerald-500' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);
