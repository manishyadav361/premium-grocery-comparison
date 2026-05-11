import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bell, BellOff, Trash2, TrendingDown, Package, Plus, ChevronRight, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/BottomNav';
import { PLATFORMS } from '../data/mockData';

export const AlertsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { alerts, toggleAlert, removeAlert, showSnackbar } = useApp();
  const [activeTab, setActiveTab] = useState<'price' | 'restock'>('price');

  const priceAlerts = alerts.filter(a => a.type === 'price-drop');
  const restockAlerts = alerts.filter(a => a.type === 'restock');
  const currentAlerts = activeTab === 'price' ? priceAlerts : restockAlerts;

  const handleDelete = (id: string) => {
    removeAlert(id);
    showSnackbar('Alert removed', 'info');
  };

  const handleToggle = (id: string, name: string, enabled: boolean) => {
    toggleAlert(id);
    showSnackbar(enabled ? `Alert paused for "${name.slice(0, 25)}..."` : `Alert enabled for "${name.slice(0, 25)}..."`, 'info');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8 lg:pl-[220px]">
      {/* Header */}
      <div className="bg-white px-4 md:px-6 pt-4 md:pt-6 pb-4 shadow-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h1 className="text-gray-900 font-black" style={{ fontSize: '22px' }}>Price Alerts</h1>
              <p className="text-gray-400 text-xs">
                {alerts.filter(a => a.enabled).length} active alert{alerts.filter(a => a.enabled).length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
            {[
              { id: 'price', label: 'Price Drops', icon: TrendingDown, count: priceAlerts.length },
              { id: 'restock', label: 'Restock', icon: Package, count: restockAlerts.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: activeTab === tab.id ? 'white' : 'transparent',
                  color: activeTab === tab.id ? '#111827' : '#9CA3AF',
                  boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <tab.icon size={14} className={activeTab === tab.id ? 'text-emerald-500' : 'text-gray-300'} />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${activeTab === tab.id ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active alert count banner */}
      {alerts.filter(a => a.enabled && a.type === activeTab.replace('price', 'price-drop')).length > 0 && (
        <div className="max-w-5xl mx-auto px-4 md:px-6 mt-4">
          <div className="bg-emerald-500 rounded-2xl px-4 py-3 flex items-center gap-3">
            <Bell size={18} className="text-white" fill="white" />
            <p className="text-white font-semibold text-sm flex-1">
              {alerts.filter(a => a.enabled && a.type === (activeTab === 'price' ? 'price-drop' : 'restock')).length} alert{alerts.filter(a => a.enabled).length > 1 ? 's' : ''} monitoring prices live
            </p>
            <Zap size={14} className="text-white/70" fill="white" />
          </div>
        </div>
      )}

      {/* Alerts list */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence>
          {currentAlerts.length === 0 ? (
            <EmptyAlerts type={activeTab} onAdd={() => navigate('/home')} />
          ) : (
            currentAlerts.map((alert, idx) => {
              const platformInfo = alert.platform !== 'all'
                ? PLATFORMS[alert.platform as keyof typeof PLATFORMS]
                : null;
              const priceDiff = alert.currentPrice - alert.targetPrice;
              const progress = Math.max(0, Math.min(100, ((alert.currentPrice - alert.targetPrice) / alert.currentPrice) * 100));

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 100, height: 0 }}
                  transition={{ delay: idx * 0.07 }}
                >
                  <div
                    className="bg-white rounded-2xl shadow-sm border overflow-hidden transition-all cursor-pointer"
                    style={{ borderColor: alert.enabled ? '#F3F4F6' : '#F3F4F6', opacity: alert.enabled ? 1 : 0.6 }}
                    onClick={() => navigate(`/history/${alert.productId}`)}
                  >
                    <div className="p-4">
                      <div className="flex gap-3">
                        <img
                          src={alert.productImage}
                          alt={alert.productName}
                          className="w-16 h-16 rounded-xl object-cover bg-gray-50 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-gray-900 font-bold text-sm line-clamp-2 flex-1" style={{ lineHeight: '1.3' }}>
                              {alert.productName}
                            </p>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleToggle(alert.id, alert.productName, alert.enabled); }}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${alert.enabled ? 'bg-emerald-50' : 'bg-gray-100'}`}
                              >
                                {alert.enabled
                                  ? <Bell size={14} className="text-emerald-500" fill="currentColor" />
                                  : <BellOff size={14} className="text-gray-400" />
                                }
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(alert.id); }}
                                className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center"
                              >
                                <Trash2 size={13} className="text-red-400" />
                              </button>
                            </div>
                          </div>

                          {/* Alert type badge */}
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${alert.type === 'price-drop' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
                              {alert.type === 'price-drop' ? '📉 Price Drop' : '📦 Restock'}
                            </span>
                            {platformInfo && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${platformInfo.color}20`, color: platformInfo.color === '#F8CB46' ? '#92630A' : platformInfo.color }}>
                                {platformInfo.name}
                              </span>
                            )}
                            {alert.enabled && (
                              <span className="flex items-center gap-0.5 text-[10px] text-emerald-500 font-semibold">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Live
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Price target */}
                      {alert.type === 'price-drop' && (
                        <div className="mt-3 bg-gray-50 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-gray-400 text-[10px] font-semibold">CURRENT</p>
                              <p className="text-gray-900 font-black text-base">₹{alert.currentPrice}</p>
                            </div>
                            <TrendingDown size={16} className="text-gray-300" />
                            <div className="text-right">
                              <p className="text-gray-400 text-[10px] font-semibold">YOUR TARGET</p>
                              <p className="text-emerald-600 font-black text-base">₹{alert.targetPrice}</p>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all"
                              style={{ width: `${100 - progress}%` }}
                            />
                          </div>
                          <p className="text-gray-400 text-[10px] mt-1">
                            Still ₹{priceDiff} away from your target
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Add alert button */}
      {currentAlerts.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 md:px-6 mt-4">
          <button
            onClick={() => navigate('/home')}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-gray-400 font-semibold text-sm hover:border-emerald-300 hover:text-emerald-500 transition-all"
          >
            <Plus size={16} />
            Add more alerts
          </button>
        </div>
      )}

      {/* Notification permission */}
      <div className="max-w-5xl mx-auto mx-4 md:mx-6 mt-4 bg-amber-50 rounded-2xl p-4 flex gap-3">
        <Bell size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-800 font-bold text-sm">Enable push notifications</p>
          <p className="text-amber-600 text-xs mt-0.5">Get instant alerts when prices drop to your target</p>
          <button className="mt-2 text-amber-700 text-xs font-bold underline">Enable Now →</button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

const EmptyAlerts: React.FC<{ type: 'price' | 'restock'; onAdd: () => void }> = ({ type, onAdd }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-5">
      <span className="text-4xl">{type === 'price' ? '📉' : '📦'}</span>
    </div>
    <h3 className="text-gray-800 font-black text-lg mb-2">
      No {type === 'price' ? 'price drop' : 'restock'} alerts yet
    </h3>
    <p className="text-gray-400 text-sm mb-6 max-w-xs">
      {type === 'price'
        ? 'Set a target price on any product and get notified when it drops.'
        : 'Track out-of-stock products and get notified when they\'re available.'}
    </p>
    <button
      onClick={onAdd}
      className="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2"
    >
      <Plus size={16} />
      Browse Products
    </button>
  </motion.div>
);
