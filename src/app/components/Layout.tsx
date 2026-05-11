import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { snackbar } = useApp();

  return (
    <div
      className="min-h-screen relative"
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        background: '#F0F2F5',
      }}
    >
      {/* Background gradient — visible on all sizes */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 30%, #ede7f6 60%, #e8f5e9 100%)',
        }}
      />
      {/* Subtle grid dots */}
      <div
        className="fixed inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #10B98130 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main content — full width, sidebar offset handled by screens on lg+ */}
      <div className="min-h-screen">
        {children}
      </div>

      {/* Global Snackbar */}
      <AnimatePresence>
        {snackbar && (
          <motion.div
            key={snackbar.id}
            initial={{ y: 80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed z-[9999] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl"
            style={{
              bottom: '88px',
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '420px',
              width: 'calc(100% - 32px)',
              background: snackbar.type === 'success'
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : snackbar.type === 'error'
                ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                : 'linear-gradient(135deg, #3B82F6, #2563EB)',
            }}
          >
            {snackbar.type === 'success' && <CheckCircle size={18} color="white" />}
            {snackbar.type === 'error' && <XCircle size={18} color="white" />}
            {snackbar.type === 'info' && <Info size={18} color="white" />}
            <span className="text-white text-sm font-semibold flex-1">{snackbar.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
