import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, BellOff, TrendingDown, TrendingUp, Award } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { useApp } from '../context/AppContext';
import { PRODUCTS, PLATFORMS } from '../data/mockData';

const PLATFORM_COLORS = {
  blinkit: '#F59E0B',
  zepto: '#7C3AED',
  instamart: '#FF6B35',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3 min-w-[140px]">
      <p className="text-gray-500 text-xs font-semibold mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-gray-600 text-xs font-medium capitalize">{entry.dataKey}</span>
          </div>
          <span className="text-gray-900 text-xs font-black">₹{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export const PriceHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAlert, alerts, removeAlert, showSnackbar } = useApp();

  const product = PRODUCTS.find(p => p.id === id);
  const [activePlatforms, setActivePlatforms] = useState(['blinkit', 'zepto', 'instamart']);
  const [alertPrice, setAlertPrice] = useState('');
  const [showAlertInput, setShowAlertInput] = useState(false);

  if (!product) return null;

  const hasAlert = alerts.some(a => a.productId === product.id);
  const history = product.priceHistory;

  const allPrices = history.flatMap(h => [h.blinkit, h.zepto, h.instamart]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const latestBlinkit = history[history.length - 1]?.blinkit;
  const latestZepto = history[history.length - 1]?.zepto;
  const latestInstamart = history[history.length - 1]?.instamart;
  const firstBlinkit = history[0]?.blinkit;
  const firstZepto = history[0]?.zepto;
  const firstInstamart = history[0]?.instamart;

  const togglePlatform = (p: string) => {
    setActivePlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const handleSetAlert = () => {
    const price = parseInt(alertPrice);
    if (!isNaN(price) && price > 0) {
      const cheapestCurrent = Math.min(latestBlinkit, latestZepto, latestInstamart);
      addAlert({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        targetPrice: price,
        currentPrice: cheapestCurrent,
        platform: 'all',
        type: 'price-drop',
        enabled: true,
      });
      showSnackbar(`Alert set for ₹${price} 🔔`);
      setShowAlertInput(false);
      setAlertPrice('');
    }
  };

  const priceChange = (latest: number, first: number) => {
    const diff = latest - first;
    const pct = ((diff / first) * 100).toFixed(1);
    return { diff, pct, up: diff > 0 };
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10 lg:pl-[220px]">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-4 md:pt-6 pb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <ArrowLeft size={17} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900 font-black" style={{ fontSize: '18px' }}>Price History</h1>
            <p className="text-gray-400 text-xs line-clamp-1">{product.name}</p>
          </div>
        </div>
      </div>

      {/* Product mini card */}
      <div className="bg-white mx-4 mt-4 rounded-2xl p-4 flex gap-3 shadow-sm border border-gray-50">
        <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
        <div className="flex-1">
          <p className="text-emerald-500 text-xs font-bold">{product.brand}</p>
          <p className="text-gray-900 font-bold text-sm line-clamp-2">{product.name}</p>
          <p className="text-gray-400 text-xs">{product.variant}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-3">
        {[
          { label: 'Lowest Ever', value: `₹${minPrice}`, icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Highest', value: `₹${maxPrice}`, icon: TrendingUp, color: 'text-red-400', bg: 'bg-red-50' },
          { label: 'Avg Range', value: `₹${Math.round((minPrice + maxPrice) / 2)}`, icon: TrendingDown, color: 'text-blue-400', bg: 'bg-blue-50' },
        ].map(s => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-3 flex flex-col gap-1 shadow-sm border border-gray-50"
          >
            <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
              <s.icon size={14} className={s.color} />
            </div>
            <p className="text-gray-900 font-black text-base">{s.value}</p>
            <p className="text-gray-400 text-[10px] font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Platform toggles */}
      <div className="px-4 mt-4 flex gap-2">
        {Object.entries(PLATFORM_COLORS).map(([key, color]) => (
          <button
            key={key}
            onClick={() => togglePlatform(key)}
            className="flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all capitalize"
            style={{
              borderColor: activePlatforms.includes(key) ? color : '#E5E7EB',
              background: activePlatforms.includes(key) ? `${color}15` : '#F9FAFB',
              color: activePlatforms.includes(key) ? color : '#9CA3AF',
            }}
          >
            {PLATFORMS[key as keyof typeof PLATFORMS].name}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white mx-4 mt-4 rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50">
          <p className="text-gray-900 font-bold text-sm">6-Week Price Trend</p>
          <p className="text-gray-400 text-xs">Tap a point to see exact price</p>
        </div>
        <div className="px-2 py-4" style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={minPrice} stroke="#10B981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Low', position: 'insideRight', fontSize: 9, fill: '#10B981' }} />
              {activePlatforms.includes('blinkit') && (
                <Line type="monotone" dataKey="blinkit" stroke={PLATFORM_COLORS.blinkit} strokeWidth={2.5} dot={{ r: 4, fill: PLATFORM_COLORS.blinkit }} activeDot={{ r: 6 }} />
              )}
              {activePlatforms.includes('zepto') && (
                <Line type="monotone" dataKey="zepto" stroke={PLATFORM_COLORS.zepto} strokeWidth={2.5} dot={{ r: 4, fill: PLATFORM_COLORS.zepto }} activeDot={{ r: 6 }} />
              )}
              {activePlatforms.includes('instamart') && (
                <Line type="monotone" dataKey="instamart" stroke={PLATFORM_COLORS.instamart} strokeWidth={2.5} dot={{ r: 4, fill: PLATFORM_COLORS.instamart }} activeDot={{ r: 6 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price change summary */}
      <div className="px-4 mt-4 space-y-2">
        <p className="text-gray-700 font-bold text-sm px-1">Price Change (6 weeks)</p>
        {[
          { key: 'blinkit', latest: latestBlinkit, first: firstBlinkit },
          { key: 'zepto', latest: latestZepto, first: firstZepto },
          { key: 'instamart', latest: latestInstamart, first: firstInstamart },
        ].map(({ key, latest, first }) => {
          const change = priceChange(latest, first);
          return (
            <div key={key} className="bg-white rounded-2xl p-3.5 flex items-center justify-between shadow-sm border border-gray-50">
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: PLATFORM_COLORS[key as keyof typeof PLATFORM_COLORS] + '20', color: PLATFORM_COLORS[key as keyof typeof PLATFORM_COLORS] }}>
                  {PLATFORMS[key as keyof typeof PLATFORMS].name}
                </div>
                <span className="text-gray-400 text-xs">₹{first} → ₹{latest}</span>
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold ${change.up ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                {change.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {change.up ? '+' : ''}{change.pct}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert section */}
      <div className="px-4 mt-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-900 font-bold text-sm">Price Drop Alert</p>
              <p className="text-gray-400 text-xs">Get notified when price drops</p>
            </div>
            <button
              onClick={() => setShowAlertInput(!showAlertInput)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${hasAlert || showAlertInput ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'}`}
            >
              {hasAlert || showAlertInput ? <Bell size={13} fill="currentColor" /> : <Bell size={13} />}
              {hasAlert ? 'Alert Active' : 'Set Alert'}
            </button>
          </div>

          {showAlertInput && !hasAlert && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="px-4 pb-4 border-t border-gray-50"
            >
              <p className="text-gray-500 text-xs mt-3 mb-2">Alert me when price drops below:</p>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                  <span className="text-gray-500 font-bold">₹</span>
                  <input
                    type="number"
                    value={alertPrice}
                    onChange={e => setAlertPrice(e.target.value)}
                    placeholder={`Current: ₹${Math.min(latestBlinkit, latestZepto, latestInstamart)}`}
                    className="flex-1 bg-transparent text-gray-900 font-semibold outline-none text-sm placeholder:text-gray-300"
                  />
                </div>
                <button
                  onClick={handleSetAlert}
                  className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-sm"
                >
                  Set
                </button>
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {[minPrice, Math.round((minPrice + latestBlinkit) / 2), latestBlinkit - 10].map(p => (
                  <button
                    key={p}
                    onClick={() => setAlertPrice(String(p))}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-semibold"
                  >
                    ₹{p}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
