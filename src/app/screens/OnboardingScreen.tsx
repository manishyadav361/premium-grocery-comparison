import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SLIDES = [
  {
    emoji: '🔍',
    title: 'Compare Prices\nInstantly',
    desc: 'Search any grocery item and compare real-time prices across Blinkit, Zepto & Instamart in one tap.',
    accent: '#10B981',
    bg: 'from-emerald-50 to-white',
    stat: '3x faster',
    statLabel: 'than checking apps separately',
  },
  {
    emoji: '💰',
    title: 'Always Find the\nCheapest Option',
    desc: 'Our smart engine highlights the best deal with savings amount — so you never overpay again.',
    accent: '#7C3AED',
    bg: 'from-purple-50 to-white',
    stat: '₹500/month',
    statLabel: 'average savings per user',
  },
  {
    emoji: '🔔',
    title: 'Get Price Drop\nAlerts',
    desc: 'Set your target price and we\'ll notify you the moment it drops. Never miss a deal.',
    accent: '#FF6B35',
    bg: 'from-orange-50 to-white',
    stat: '2M+',
    statLabel: 'price drops tracked daily',
  },
];

export const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setHasOnboarded } = useApp();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (current < SLIDES.length - 1) {
      setDirection(1);
      setCurrent(c => c + 1);
    } else {
      finish();
    }
  };

  const finish = () => {
    setHasOnboarded(true);
    navigate('/auth');
  };

  const slide = SLIDES[current];

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-b ${slide.bg} transition-all duration-500`}>
      {/* Skip */}
      <div className="flex justify-between items-center px-5 pt-14 pb-2">
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: i === current ? 24 : 8 }}
              className="h-2 rounded-full transition-all"
              style={{ background: i === current ? slide.accent : '#E5E7EB' }}
            />
          ))}
        </div>
        <button onClick={finish} className="text-gray-400 font-semibold text-sm">
          Skip
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 60 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="flex flex-col items-center text-center w-full"
          >
            {/* Illustration */}
            <div
              className="w-48 h-48 rounded-3xl flex items-center justify-center mb-8 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${slide.accent}15, ${slide.accent}30)`,
                border: `2px solid ${slide.accent}20`,
              }}
            >
              <span style={{ fontSize: '80px' }}>{slide.emoji}</span>
            </div>

            {/* Stat badge */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full mb-6 shadow-sm"
              style={{ background: `${slide.accent}15`, border: `1px solid ${slide.accent}25` }}
            >
              <span className="font-black text-sm" style={{ color: slide.accent }}>{slide.stat}</span>
              <span className="text-gray-500 text-xs">{slide.statLabel}</span>
            </div>

            {/* Title */}
            <h1
              className="font-black mb-4 text-gray-900 whitespace-pre-line"
              style={{ fontSize: '28px', lineHeight: '1.2', letterSpacing: '-0.5px' }}
            >
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-gray-500 leading-relaxed max-w-xs" style={{ fontSize: '15px' }}>
              {slide.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Platform logos */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-center gap-3 mb-8">
          {[
            { label: 'Blinkit', color: '#F8CB46', text: '#000' },
            { label: 'Zepto', color: '#7C3AED', text: '#fff' },
            { label: 'Instamart', color: '#FF6B35', text: '#fff' },
          ].map(p => (
            <span
              key={p.label}
              className="px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"
              style={{ background: p.color, color: p.text }}
            >
              {p.label}
            </span>
          ))}
        </div>

        {/* Next button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={goNext}
          className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}cc)`,
            color: 'white',
            boxShadow: `0 12px 30px ${slide.accent}40`,
          }}
        >
          {current === SLIDES.length - 1 ? (
            <>Get Started <ArrowRight size={18} /></>
          ) : (
            <>Next <ChevronRight size={18} /></>
          )}
        </motion.button>

        <p className="text-center text-gray-400 text-xs mt-3">
          {current + 1} of {SLIDES.length}
        </p>
      </div>
    </div>
  );
};
