import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const POPUP_KEY = 'tp71_popup_dismissed_v1';
const POPUP_DELAY_MS = 2500; // show after 2.5 seconds

const features = [
  'Professional Invoice Templates',
  'Connected Banking & Reconciliation',
  'Auto-Wrap Text & Better Readability',
  'Flexible Discounts & Voucher Controls',
];

export default function TallyPrime71Popup() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Don't show if already dismissed this session
    const dismissed = sessionStorage.getItem(POPUP_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem(POPUP_KEY, 'true');
  };

  const handleCTA = () => {
    handleClose();
    navigate('/contact');
  };

  const handleLearnMore = () => {
    handleClose();
    navigate('/blog');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(2, 4, 10, 0.75)', backdropFilter: 'blur(6px)' }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.05 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #060814 0%, #101622 60%, #1a0a0a 100%)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              boxShadow: '0 0 60px rgba(220, 38, 38, 0.15), 0 25px 50px rgba(0,0,0,0.6)',
            }}
          >
            {/* Animated background glow */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #dc2626 0%, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #dc2626 0%, transparent 70%)' }}
            />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(220,38,38,0.7)';
                e.currentTarget.style.borderColor = 'rgba(220,38,38,0.8)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="relative z-10 p-7 pb-6">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 text-xs font-semibold tracking-wide uppercase"
                style={{
                  background: 'rgba(220, 38, 38, 0.15)',
                  border: '1px solid rgba(220, 38, 38, 0.4)',
                  color: '#f87171',
                }}
              >
                <Sparkles className="h-3 w-3" />
                Just Released
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <img
                    src="/optimum-logo-white.png"
                    alt="Optimum Prime Solutions"
                    className="h-7 object-contain"
                    style={{ filter: 'brightness(1.1)' }}
                  />
                </div>
                <h2 className="text-3xl font-extrabold text-white mt-3 leading-tight tracking-tight">
                  TallyPrime 7.1
                  <br />
                  <span style={{ color: '#dc2626' }}>Is Now Live</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                  The most powerful version of TallyPrime yet — designed to help Kenyan businesses
                  work faster, stay KRA-compliant, and look more professional.
                </p>
              </motion.div>

              {/* Feature list */}
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-5 space-y-2"
              >
                {features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.07 }}
                    className="flex items-center gap-2.5 text-sm"
                    style={{ color: '#cbd5e1' }}
                  >
                    <CheckCircle className="h-4 w-4 shrink-0" style={{ color: '#22c55e' }} />
                    {feature}
                  </motion.li>
                ))}
              </motion.ul>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 flex flex-col sm:flex-row gap-3"
              >
                <button
                  onClick={handleCTA}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)')}
                >
                  Upgrade Now
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={handleLearnMore}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#e2e8f0',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                >
                  Read What's New
                </button>
              </motion.div>

              {/* Dismiss button */}
              <button
                onClick={handleClose}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#94a3b8',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.11)';
                  e.currentTarget.style.color = '#e2e8f0';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <X className="h-4 w-4" />
                No thanks, close this
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
