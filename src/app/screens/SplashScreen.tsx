import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasOnboarded } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        navigate('/home');
      } else if (hasOnboarded) {
        navigate('/auth');
      } else {
        navigate('/onboarding');
      }
    }, 2800);
    return () => clearTimeout(timer);
  }, [navigate, user, hasOnboarded]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #0F172A 0%, #1a2744 50%, #0F172A 100%)' }}>
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.05, scale: 1 }}
            transition={{ delay: i * 0.2, duration: 1.5 }}
            className="absolute rounded-full"
            style={{
              width: `${120 + i * 80}px`,
              height: `${120 + i * 80}px`,
              top: `${20 + i * 10}%`,
              left: `${10 + i * 12}%`,
              background: 'radial-gradient(circle, #10B981, transparent)',
            }}
          />
        ))}
      </div>

      {/* Shimmer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute w-64 h-64 rounded-full border-2 border-dashed border-emerald-500/20"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute w-80 h-80 rounded-full border border-emerald-500/10"
      />

      {/* Logo container */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* Logo */}
        <div className="relative">
          <motion.div
            animate={{ boxShadow: ['0 0 20px rgba(16,185,129,0.3)', '0 0 60px rgba(16,185,129,0.6)', '0 0 20px rgba(16,185,129,0.3)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
          >
            <span style={{ fontSize: '44px' }}>🛒</span>
          </motion.div>
          {/* Shimmer overlay */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            className="absolute inset-0 rounded-3xl overflow-hidden"
          >
            <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
          </motion.div>
        </div>

        {/* App name */}
        <div className="text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-white font-black tracking-tight"
            style={{ fontSize: '36px', letterSpacing: '-1px' }}
          >
            Price<span className="text-emerald-400">Cart</span>
          </motion.h1>
          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-gray-400 mt-1 font-medium"
            style={{ fontSize: '14px', letterSpacing: '0.5px' }}
          >
            Compare. Save. Delivered.
          </motion.p>
        </div>

        {/* Platform badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex items-center gap-2"
        >
          {[
            { name: 'Blinkit', color: '#F8CB46', text: '#000' },
            { name: 'Zepto', color: '#7C3AED', text: '#fff' },
            { name: 'Instamart', color: '#FF6B35', text: '#fff' },
          ].map((p, i) => (
            <motion.span
              key={p.name}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + i * 0.1, type: 'spring' }}
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: p.color, color: p.text }}
            >
              {p.name}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-3"
      >
        <div className="w-40 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
          />
        </div>
        <p className="text-gray-500 text-xs">Finding best prices near you...</p>
      </motion.div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 text-gray-600 text-xs"
      >
        Powered by real-time price data
      </motion.p>
    </div>
  );
};
