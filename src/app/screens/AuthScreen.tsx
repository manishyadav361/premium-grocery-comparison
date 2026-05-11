import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Phone, ChevronRight, User, Shield, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [phone, setPhone] = useState('');
  const [focused, setFocused] = useState(false);

  const handlePhoneLogin = () => {
    if (phone.length === 10) {
      navigate('/otp', { state: { phone } });
    }
  };

  const handleGoogle = () => {
    setUser({ name: 'Rahul Sharma', email: 'rahul@gmail.com', avatar: 'RS' });
    navigate('/location');
  };

  const handleGuest = () => {
    setUser({ name: 'Guest', isGuest: true });
    navigate('/location');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top section */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)', paddingTop: '80px', paddingBottom: '60px' }}>
        {/* Bg orb */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #10B981, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)', transform: 'translate(-30%, 30%)' }} />

        <div className="px-6 relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-2xl">🛒</span>
            </div>
            <div>
              <h2 className="text-white font-black text-xl" style={{ letterSpacing: '-0.5px' }}>PriceCart</h2>
              <p className="text-gray-400 text-xs">Compare & Save</p>
            </div>
          </div>

          <h1 className="text-white font-black mb-2" style={{ fontSize: '28px', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
            Save money on<br />every grocery run
          </h1>
          <p className="text-gray-400 text-sm">Compare prices across Blinkit, Zepto & Instamart</p>

          {/* Feature pills */}
          <div className="flex gap-2 mt-5 flex-wrap">
            {['⚡ Instant Compare', '💰 Best Price', '🔔 Price Alerts'].map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-gray-300 border border-white/10">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Auth card */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-5 relative z-10 px-5 pt-8 pb-6">
        <h2 className="text-gray-900 font-bold text-lg mb-1">Log in or Sign up</h2>
        <p className="text-gray-400 text-sm mb-6">Find and save on your groceries instantly</p>

        {/* Phone input */}
        <div className="mb-4">
          <div
            className="flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 bg-gray-50 transition-all"
            style={{ borderColor: focused ? '#10B981' : 'transparent' }}
          >
            <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
              <span className="text-lg">🇮🇳</span>
              <span className="text-gray-600 font-semibold text-sm">+91</span>
            </div>
            <input
              type="tel"
              maxLength={10}
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Enter mobile number"
              className="flex-1 bg-transparent text-gray-900 font-medium outline-none placeholder:text-gray-300"
              style={{ fontSize: '16px' }}
            />
            {phone.length === 10 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Continue button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handlePhoneLogin}
          disabled={phone.length !== 10}
          className="w-full py-4 rounded-2xl font-bold text-white text-base mb-4 flex items-center justify-center gap-2 transition-all"
          style={{
            background: phone.length === 10
              ? 'linear-gradient(135deg, #10B981, #059669)'
              : '#E5E7EB',
            color: phone.length === 10 ? 'white' : '#9CA3AF',
            boxShadow: phone.length === 10 ? '0 8px 24px rgba(16,185,129,0.35)' : 'none',
          }}
        >
          <Phone size={17} />
          Continue with Phone
          <ChevronRight size={17} />
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-400 text-xs font-medium">or continue with</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Google */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogle}
          className="w-full py-4 rounded-2xl font-semibold text-gray-700 text-sm mb-3 flex items-center justify-center gap-3 border-2 border-gray-100 bg-white hover:bg-gray-50 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </motion.button>

        {/* Guest */}
        <button
          onClick={handleGuest}
          className="w-full py-3 rounded-2xl text-gray-400 text-sm font-medium hover:text-gray-600 transition-all flex items-center justify-center gap-2"
        >
          <User size={15} />
          Continue as Guest
        </button>

        {/* Trust indicators */}
        <div className="mt-6 flex items-start gap-3 bg-gray-50 rounded-2xl p-3.5">
          <Shield size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-400 text-xs leading-relaxed">
            We never share your data. Your number is only used for login. 100% private & secure.
          </p>
        </div>
      </div>
    </div>
  );
};
