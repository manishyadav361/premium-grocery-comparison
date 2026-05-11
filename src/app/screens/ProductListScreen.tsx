import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, SlidersHorizontal, ChevronDown, Search, X } from 'lucide-react';
import { ProductListItem } from '../components/ProductCard';
import { FilterSheet } from '../components/FilterSheet';
import { SkeletonListItem } from '../components/SkeletonLoader';
import { PRODUCTS, CATEGORIES, getCheapestPlatform, getMinPrice } from '../data/mockData';

const SORT_OPTIONS = [
  { id: 'cheapest', label: 'Cheapest First' },
  { id: 'fastest', label: 'Fastest Delivery' },
  { id: 'discount', label: 'Best Discount' },
  { id: 'popular', label: 'Most Popular' },
];

export const ProductListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('cat') || '';
  const platform = searchParams.get('platform') || '';
  const sort = searchParams.get('sort') || 'cheapest';

  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(sort);
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [searchText, setSearchText] = useState(query);
  const [activeFilters, setActiveFilters] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, [query, category]);

  // Filter products
  let products = PRODUCTS.filter(p => {
    if (query && query !== 'trending') {
      const q = query.toLowerCase();
      return p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q));
    }
    if (category && category !== 'all') return p.category === category;
    if (platform) {
      const pd = p.platforms[platform as keyof typeof p.platforms];
      return pd && pd.inStock;
    }
    return true;
  });

  if (activeFilters.platforms?.length > 0) {
    products = products.filter(p =>
      activeFilters.platforms.some((plat: string) =>
        p.platforms[plat as keyof typeof p.platforms]?.inStock
      )
    );
  }
  if (activeFilters.inStockOnly) {
    products = products.filter(p =>
      Object.values(p.platforms).some(pd => pd.inStock)
    );
  }
  if (activeFilters.priceRange) {
    products = products.filter(p => {
      const min = getMinPrice(p);
      return min >= activeFilters.priceRange[0] && min <= activeFilters.priceRange[1];
    });
  }
  if (activeFilters.brands?.length > 0) {
    products = products.filter(p => activeFilters.brands.includes(p.brand));
  }
  if (activeFilters.hasDiscount) {
    products = products.filter(p => Object.values(p.platforms).some(pd => pd.discount > 0));
  }
  if (activeFilters.hasCoupon) {
    products = products.filter(p => Object.values(p.platforms).some(pd => pd.coupon));
  }

  // Sort
  products = [...products].sort((a, b) => {
    if (sortBy === 'cheapest') return getMinPrice(a) - getMinPrice(b);
    if (sortBy === 'discount') {
      const maxDA = Math.max(...Object.values(a.platforms).map(p => p.discount));
      const maxDB = Math.max(...Object.values(b.platforms).map(p => p.discount));
      return maxDB - maxDA;
    }
    if (sortBy === 'fastest') {
      const etaA = Math.min(...Object.values(a.platforms).filter(p => p.inStock).map(p => parseInt(p.eta)));
      const etaB = Math.min(...Object.values(b.platforms).filter(p => p.inStock).map(p => parseInt(p.eta)));
      return etaA - etaB;
    }
    return b.reviews - a.reviews;
  });

  const pageTitle = query && query !== 'trending'
    ? `"${query}"`
    : category ? CATEGORIES.find(c => c.id === category)?.label || 'Products'
      : platform ? platform.charAt(0).toUpperCase() + platform.slice(1)
        : 'All Products';

  return (
    <div className="min-h-screen bg-gray-50 lg:pl-[220px]">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-4 md:pt-6 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <ArrowLeft size={17} className="text-gray-600" />
            </button>
            {/* Inline search bar */}
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
              <Search size={15} className="text-gray-400" />
              <input
                type="text"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchText.trim()) {
                    navigate(`/products?q=${encodeURIComponent(searchText)}`);
                  }
                }}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-gray-800 text-sm font-medium outline-none placeholder:text-gray-300"
              />
              {searchText && (
                <button onClick={() => setSearchText('')}><X size={14} className="text-gray-300" /></button>
              )}
            </div>
          </div>

          {/* Result count + sort/filter row */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs">{products.length} results for </span>
              <span className="text-gray-900 text-xs font-bold">{pageTitle}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => { setShowSort(!showSort); setShowFilter(false); }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs font-semibold text-gray-600"
                >
                  <ChevronDown size={12} />
                  {SORT_OPTIONS.find(s => s.id === sortBy)?.label.split(' ')[0]}
                </button>

                <AnimatePresence>
                  {showSort && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      className="absolute right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-40 w-44"
                    >
                      {SORT_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => { setSortBy(opt.id); setShowSort(false); }}
                          className={`w-full text-left px-4 py-3 text-sm font-medium border-b border-gray-50 last:border-0 ${sortBy === opt.id ? 'text-emerald-500 bg-emerald-50' : 'text-gray-600'}`}
                        >
                          {sortBy === opt.id && '✓ '}{opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Filter */}
              <button
                onClick={() => { setShowFilter(true); setShowSort(false); }}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all"
                style={{
                  borderColor: filterCount > 0 ? '#10B981' : '#F3F4F6',
                  background: filterCount > 0 ? '#F0FDF4' : '#F9FAFB',
                  color: filterCount > 0 ? '#059669' : '#6B7280',
                }}
              >
                <SlidersHorizontal size={12} />
                Filter
                {filterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {filterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {filterCount > 0 && (
          <div className="max-w-5xl mx-auto px-4 md:px-6 pb-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {activeFilters.platforms?.map((p: string) => (
              <span key={p} className="flex-shrink-0 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full capitalize">
                {p}
              </span>
            ))}
            {activeFilters.inStockOnly && (
              <span className="flex-shrink-0 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">In Stock</span>
            )}
            <button
              onClick={() => { setActiveFilters({}); setFilterCount(0); }}
              className="flex-shrink-0 px-3 py-1 bg-red-50 text-red-500 text-xs font-semibold rounded-full flex items-center gap-1"
            >
              <X size={10} /> Clear All
            </button>
          </div>
        )}
      </div>

      {/* Product list / grid */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-3 pb-8">
        {loading ? (
          /* skeleton always single-col */
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <SkeletonListItem key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          <>
            {/* On md+ switch to 2-col grid for the list items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {products.map((p, i) => <ProductListItem key={p.id} product={p} index={i} />)}
            </div>
          </>
        )}
      </div>

      {/* Filter sheet */}
      <FilterSheet
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(filters) => {
          setActiveFilters(filters);
          const count = [
            filters.platforms.length > 0,
            filters.priceRange[0] > 0 || filters.priceRange[1] < 2000,
            filters.deliveryFee !== 'any',
            filters.eta !== 'any',
            filters.brands.length > 0,
            filters.inStockOnly,
            filters.hasDiscount,
            filters.hasCoupon,
          ].filter(Boolean).length;
          setFilterCount(count);
        }}
      />

      {/* Click-away for sort */}
      {showSort && <div className="fixed inset-0 z-30" onClick={() => setShowSort(false)} />}
    </div>
  );
};

const EmptyState: React.FC<{ query: string }> = ({ query }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-5">
        <span className="text-4xl">🔍</span>
      </div>
      <h3 className="text-gray-800 font-bold text-lg mb-2">No results found</h3>
      <p className="text-gray-400 text-sm mb-6 max-w-xs">
        We couldn't find "{query}" in our database. Try a different search term.
      </p>
      <div className="flex gap-2 flex-wrap justify-center">
        {['Toothbrush', 'Milk', 'Chips'].map(s => (
          <button
            key={s}
            onClick={() => navigate(`/products?q=${s}`)}
            className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-semibold"
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
