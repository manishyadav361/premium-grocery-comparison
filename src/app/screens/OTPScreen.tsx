import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OTPScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useApp();
  const phone = (location.state as any)?.phone || '9876543210';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const t = setInterval(() => setTimer(p => {
        if (p <= 1) { setCanResend(true); clearInterval(t); return 0; }
        return p - 1;
      }), 1000);
      return () => clearInterval(t);
    }
  }, [timer, canResend]);

  // Auto-verify demo
  useEffect(() => {
    const code = otp.join('');
    if (code.length === 6) {
      setError('');
      setTimeout(() => {
        if (code === '123456' || code.length === 6) {
          setVerified(true);
          setTimeout(() => {
            setUser({ name: 'Rahul Sharma', phone: `+91 ${phone}`, avatar: 'RS' });
            navigate('/location');
          }, 1200);
        } else {
          setError('Invalid OTP. Use 123456 for demo.');
        }
      }, 400);
    }
  }, [otp]);

  const handleInput = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const newOtp = [...otp];
      newOtp[idx - 1] = '';
      setOtp(newOtp);
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const resend = () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
    setError('');
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
          <span className="text-3xl">📱</span>
        </div>

        <h1 className="text-gray-900 font-black mb-2" style={{ fontSize: '26px', letterSpacing: '-0.5px' }}>
          Verify your number
        </h1>
        <p className="text-gray-400 text-sm">
          We've sent a 6-digit OTP to{' '}
          <span className="text-gray-700 font-semibold">+91 {phone}</span>
        </p>
      </div>

      <div className="flex-1 px-5">
        {/* OTP inputs */}
        <div className="flex gap-3 justify-between mb-5">
          {otp.map((digit, idx) => (
            <motion.input
              key={idx}
              ref={el => { inputRefs.current[idx] = el; }}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={e => handleInput(e.target.value, idx)}
              onKeyDown={e => handleKeyDown(e, idx)}
              animate={verified ? { scale: [1, 1.1, 1] } : {}}
              transition={{ delay: idx * 0.05 }}
              className="flex-1 text-center font-black rounded-2xl border-2 outline-none transition-all"
              style={{
                fontSize: '24px',
                height: '64px',
                borderColor: verified ? '#10B981' : error ? '#EF4444' : digit ? '#10B981' : '#E5E7EB',
                background: verified ? '#F0FDF4' : error ? '#FEF2F2' : digit ? '#F0FDF4' : '#F9FAFB',
                color: verified ? '#059669' : error ? '#DC2626' : '#111827',
              }}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm text-center mb-4 font-medium"
          >
            {error}
          </motion.p>
        )}

        {/* Verified state */}
        {verified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 bg-emerald-50 rounded-2xl py-3 mb-5"
          >
            <CheckCircle size={18} className="text-emerald-500" />
            <span className="text-emerald-700 font-semibold text-sm">OTP Verified! Logging in...</span>
          </motion.div>
        )}

        {/* Hint */}
        <p className="text-center text-gray-400 text-xs mb-6">Demo: Use any 6 digits</p>

        {/* Resend */}
        <div className="flex items-center justify-center gap-1.5">
          {!canResend ? (
            <p className="text-gray-400 text-sm">
              Resend OTP in{' '}
              <span className="text-emerald-500 font-bold">{timer}s</span>
            </p>
          ) : (
            <button onClick={resend} className="flex items-center gap-1.5 text-emerald-500 font-semibold text-sm">
              <RefreshCw size={14} />
              Resend OTP
            </button>
          )}
        </div>

        {/* Alternative login */}
        <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
          <p className="text-gray-400 text-xs text-center mb-3">Having trouble? Try</p>
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs font-semibold">
              📞 Call me instead
            </button>
            <button className="flex-1 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs font-semibold">
              💬 WhatsApp OTP
            </button>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="px-5 pb-8 pt-4">
        <p className="text-center text-gray-300 text-xs">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};
