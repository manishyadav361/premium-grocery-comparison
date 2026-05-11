import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, User, MapPin, Bell, Star, HelpCircle, LogOut,
  ChevronRight, Shield, Heart, Zap, Phone, Mail, Edit3,
  ExternalLink, MessageSquare, AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/BottomNav';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, location, savedItems, alerts, showSnackbar } = useApp();
  const [showLogout, setShowLogout] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({
    priceDrops: true,
    restock: true,
    deals: false,
    weekly: true,
  });

  const handleLogout = () => {
    setUser(null);
    showSnackbar('Logged out successfully', 'info');
    navigate('/auth');
  };

  const stats = [
    { label: 'Items Saved', value: savedItems.length, icon: Heart, color: '#10B981' },
    { label: 'Active Alerts', value: alerts.filter(a => a.enabled).length, icon: Bell, color: '#7C3AED' },
    { label: 'Savings Found', value: '₹2,340', icon: Zap, color: '#F59E0B' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8 lg:pl-[220px]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-4 md:pt-6 pb-6">
          <div className="flex items-center gap-3 mb-5">
            <h1 className="text-gray-900 font-black" style={{ fontSize: '22px' }}>Profile</h1>
          </div>

          {/* User card */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-white font-black text-2xl">
                  {user?.isGuest ? '👤' : user?.name?.[0] || 'U'}
                </span>
              </div>
              {!user?.isGuest && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Edit3 size={9} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-gray-900 font-black text-lg">{user?.name || 'Guest User'}</h2>
              {user?.phone && (
                <p className="text-gray-400 text-sm flex items-center gap-1.5">
                  <Phone size={12} />
                  {user.phone}
                </p>
              )}
              {user?.email && (
                <p className="text-gray-400 text-sm flex items-center gap-1.5">
                  <Mail size={12} />
                  {user.email}
                </p>
              )}
              {user?.isGuest && (
                <button
                  onClick={() => navigate('/auth')}
                  className="mt-1 text-emerald-500 text-sm font-bold flex items-center gap-1"
                >
                  Sign in for full features →
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-2 mt-5">
            {stats.map(s => (
              <div key={s.label} className="flex-1 bg-gray-50 rounded-2xl p-3 flex flex-col gap-1.5">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20` }}>
                  <s.icon size={14} style={{ color: s.color }} />
                </div>
                <p className="text-gray-900 font-black text-base">{s.value}</p>
                <p className="text-gray-400 text-[10px] font-medium leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-5 space-y-4">

        {/* Account section */}
        <Section title="Account">
          <MenuItem icon={MapPin} label="Saved Locations" value={location ? `${location.area}, ${location.city}` : 'None set'} color="#10B981" onClick={() => navigate('/location')} />
          <MenuItem icon={Heart} label="Saved Products" value={`${savedItems.length} items`} color="#EF4444" onClick={() => navigate('/saved')} />
          <MenuItem icon={Bell} label="Price Alerts" value={`${alerts.length} alerts`} color="#7C3AED" onClick={() => navigate('/alerts')} />
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <ToggleMenuItem
            label="Price Drop Alerts"
            desc="When your saved items drop in price"
            value={notifPrefs.priceDrops}
            onChange={v => setNotifPrefs(p => ({ ...p, priceDrops: v }))}
          />
          <ToggleMenuItem
            label="Restock Alerts"
            desc="When out-of-stock items are available"
            value={notifPrefs.restock}
            onChange={v => setNotifPrefs(p => ({ ...p, restock: v }))}
          />
          <ToggleMenuItem
            label="Deals & Offers"
            desc="Promotional offers from platforms"
            value={notifPrefs.deals}
            onChange={v => setNotifPrefs(p => ({ ...p, deals: v }))}
          />
          <ToggleMenuItem
            label="Weekly Summary"
            desc="Your weekly savings report"
            value={notifPrefs.weekly}
            onChange={v => setNotifPrefs(p => ({ ...p, weekly: v }))}
          />
        </Section>

        {/* App info */}
        <Section title="About">
          <MenuItem icon={Star} label="Rate PriceCart" value="5 stars on App Store" color="#F59E0B" onClick={() => showSnackbar('Thanks for loving us! ❤️')} />
          <MenuItem icon={MessageSquare} label="Send Feedback" value="Help us improve" color="#3B82F6" onClick={() => showSnackbar('Feedback form opening... 📝', 'info')} />
          <MenuItem icon={HelpCircle} label="Help & Support" value="FAQ & Contact" color="#8B5CF6" onClick={() => showSnackbar('Redirecting to support...', 'info')} />
          <MenuItem icon={Shield} label="Privacy Policy" color="#6B7280" onClick={() => showSnackbar('Opening privacy policy...', 'info')} />
          <MenuItem icon={ExternalLink} label="Terms of Service" color="#6B7280" onClick={() => showSnackbar('Opening terms...', 'info')} />
        </Section>

        {/* Platform partnerships */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">Our Partners</p>
          <div className="flex gap-3">
            {[
              { name: 'Blinkit', color: '#F8CB46', text: '#000' },
              { name: 'Zepto', color: '#7C3AED', text: '#fff' },
              { name: 'Instamart', color: '#FF6B35', text: '#fff' },
            ].map(p => (
              <div key={p.name} className="flex-1 py-2 rounded-xl text-center text-xs font-black" style={{ background: p.color, color: p.text }}>
                {p.name}
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-[10px] text-center mt-2">
            PriceCart is not affiliated with these platforms
          </p>
        </div>

        {/* App version */}
        <p className="text-center text-gray-300 text-xs">PriceCart v1.0.0 · Made with ❤️ in India</p>

        {/* Logout */}
        <button
          onClick={() => setShowLogout(true)}
          className="w-full py-4 rounded-2xl border-2 border-red-100 bg-red-50 text-red-500 font-bold text-sm flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          {user?.isGuest ? 'Switch Account' : 'Log Out'}
        </button>
      </div>

      {/* Logout confirmation */}
      <AnimatePresence>
        {showLogout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={() => setShowLogout(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-3xl z-50 p-6"
              style={{ maxWidth: '600px' }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
                  <AlertTriangle size={28} className="text-red-400" />
                </div>
                <h3 className="text-gray-900 font-black text-xl mb-2">Log out?</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  You'll lose access to your saved items and alerts. Make sure you remember your login details.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-500/25"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 px-1">{title}</p>
    <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
      {children}
    </div>
  </div>
);

const MenuItem: React.FC<{
  icon: any;
  label: string;
  value?: string;
  color: string;
  onClick?: () => void;
}> = ({ icon: Icon, label, value, color, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
  >
    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
      <Icon size={15} style={{ color }} />
    </div>
    <div className="flex-1 text-left">
      <p className="text-gray-800 font-semibold text-sm">{label}</p>
      {value && <p className="text-gray-400 text-xs">{value}</p>}
    </div>
    <ChevronRight size={15} className="text-gray-300" />
  </button>
);

const ToggleMenuItem: React.FC<{
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, desc, value, onChange }) => (
  <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50 last:border-0">
    <div className="flex-1">
      <p className="text-gray-800 font-semibold text-sm">{label}</p>
      <p className="text-gray-400 text-xs">{desc}</p>
    </div>
    <button
      onClick={() => onChange(!value)}
      className="w-12 h-6 rounded-full relative transition-all ml-3"
      style={{ background: value ? '#10B981' : '#E5E7EB' }}
    >
      <motion.div
        animate={{ x: value ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  </div>
);
