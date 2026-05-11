import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MapPin, Navigation, Search, ChevronRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const POPULAR_AREAS = [
  { area: 'Koramangala', city: 'Bengaluru', pincode: '560034' },
  { area: 'Bandra West', city: 'Mumbai', pincode: '400050' },
  { area: 'Connaught Place', city: 'New Delhi', pincode: '110001' },
  { area: 'Jubilee Hills', city: 'Hyderabad', pincode: '500033' },
  { area: 'T. Nagar', city: 'Chennai', pincode: '600017' },
  { area: 'Salt Lake', city: 'Kolkata', pincode: '700091' },
];

export const LocationScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setLocation } = useApp();
  const [pincode, setPincode] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const selectLocation = (loc: { area: string; city: string; pincode: string }) => {
    setLocation({ area: loc.area, city: loc.city, pincode: loc.pincode });
    navigate('/home');
  };

  const autoDetect = () => {
    setDetecting(true);
    setTimeout(() => {
      setDetected(true);
      setDetecting(false);
      setTimeout(() => {
        setLocation({ area: 'Koramangala', city: 'Bengaluru', pincode: '560034' });
        navigate('/home');
      }, 1000);
    }, 2000);
  };

  const handlePincode = () => {
    if (pincode.length === 6) {
      selectLocation({ area: 'Your Area', city: 'Your City', pincode });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white px-5 pt-16 pb-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
          <MapPin size={28} className="text-emerald-500" />
        </div>
        <h1 className="text-gray-900 font-black mb-2" style={{ fontSize: '26px', letterSpacing: '-0.5px' }}>
          Where are you?
        </h1>
        <p className="text-gray-400 text-sm">
          We'll show prices available in your area for the fastest delivery
        </p>
      </div>

      <div className="flex-1 px-5 pb-6 space-y-4">
        {/* Auto detect */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={autoDetect}
          disabled={detecting}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all"
          style={{ borderColor: detected ? '#10B981' : detecting ? '#10B981' : '#E5E7EB', background: detected || detecting ? '#F0FDF4' : 'white' }}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${detecting || detected ? 'bg-emerald-500' : 'bg-gray-100'}`}>
            {detected ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <span className="text-white text-xl">✓</span>
              </motion.div>
            ) : (
              <Navigation size={22} className={detecting ? 'text-white' : 'text-gray-500'} />
            )}
          </div>
          <div className="flex-1 text-left">
            <p className="text-gray-900 font-bold text-sm">
              {detected ? 'Location Detected!' : detecting ? 'Detecting location...' : 'Detect my location'}
            </p>
            <p className="text-gray-400 text-xs">
              {detected ? 'Koramangala, Bengaluru 560034' : detecting ? 'Please wait...' : 'Using GPS for precise delivery area'}
            </p>
          </div>
          {detecting && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Navigation size={16} className="text-emerald-500" />
            </motion.div>
          )}
        </motion.button>

        {/* Pincode input */}
        <div
          className="flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 transition-all bg-gray-50"
          style={{ borderColor: searchFocused ? '#10B981' : 'transparent' }}
        >
          <Search size={18} className="text-gray-400" />
          <input
            type="tel"
            maxLength={6}
            value={pincode}
            onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Enter 6-digit pincode"
            className="flex-1 bg-transparent text-gray-900 font-medium outline-none placeholder:text-gray-300"
            style={{ fontSize: '16px' }}
          />
          {pincode.length > 0 && (
            <button onClick={() => setPincode('')} className="text-gray-300">
              <X size={16} />
            </button>
          )}
        </div>

        {pincode.length === 6 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handlePincode}
            className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-500/25"
          >
            Confirm Pincode
          </motion.button>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-400 text-xs">Popular areas</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Popular locations */}
        <div className="space-y-2">
          {POPULAR_AREAS.map((loc, i) => (
            <motion.button
              key={loc.pincode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => selectLocation(loc)}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 hover:bg-emerald-50 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <MapPin size={16} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-800 font-semibold text-sm">{loc.area}</p>
                <p className="text-gray-400 text-xs">{loc.city} — {loc.pincode}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-400 transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
