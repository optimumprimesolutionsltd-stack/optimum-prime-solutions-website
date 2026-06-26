import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const POPUP_KEY = 'tp71_popup_dismissed_v1';
const POPUP_DELAY_MS = 2500;

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
    const dismissed = sessionStorage.getItem(POPUP_KEY);
    if (dismissed) return;
    const timer = setTimeout(() => setIsVisible(true), POPUP_DELAY_MS);
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
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{
            zIndex: 9999,
            backgroundColor: 'rgba(2, 4, 10, 0.75)',
            backdropFilter: 'blur(6px)',
          }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.05 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #060814 0%, #101622 60%, #1a0a0a 100%)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              boxShadow: '0 0 60px rgba(220, 38, 38, 0.15), 0 25px 50px rgba(0,0,0,0.6)',
              overflow: 'visible',
            }}
          >
            {/* Background glow decorations — pointer-events disabled so they never block clicks */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle, #dc2626 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
            <div
              className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10"
              style={{
                background: 'radial-gradient(circle, #dc2626 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* ── Close button ── sits ABOVE everything else at z-index 50 */}
            <button
              onClick={handleClose}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 50,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.15)',
                border: '1.5px solid rgba(255,255,255,0.3)',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.75)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#dc2626';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* ── Main content ── z-index 10, does NOT overlap the close button area */}
            <div style={{ position: 'relative', zIndex: 10, padding: '28px 28px 24px' }}>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '9999px',
                  padding: '4px 12px',
                  marginBottom: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'rgba(220, 38, 38, 0.15)',
                  border: '1px solid rgba(220, 38, 38, 0.4)',
                  color: '#f87171',
                }}
              >
                <Sparkles size={11} />
                Just Released
              </motion.div>

              {/* Logo + Headline */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <img
                  src="/optimum-logo-white.png"
                  alt="Optimum Prime Solutions"
                  style={{ height: '28px', objectFit: 'contain', marginBottom: '12px' }}
                />
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}>
                  TallyPrime 7.1
                  <br />
                  <span style={{ color: '#dc2626' }}>Is Now Live</span>
                </h2>
                <p style={{
                  marginTop: '8px',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: '#94a3b8',
                }}>
                  The most powerful version of TallyPrime yet — designed to help Kenyan businesses
                  work faster, stay KRA-compliant, and look more professional.
                </p>
              </motion.div>

              {/* Feature list */}
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                style={{ marginTop: '18px', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                {features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.07 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}
                  >
                    <CheckCircle size={15} style={{ color: '#22c55e', flexShrink: 0 }} />
                    {feature}
                  </motion.li>
                ))}
              </motion.ul>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                {/* Primary */}
                <button
                  onClick={handleCTA}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#ffffff',
                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.88')}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
                >
                  Upgrade Now <ArrowRight size={15} />
                </button>

                {/* Secondary */}
                <button
                  onClick={handleLearnMore}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#e2e8f0',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.11)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)')}
                >
                  Read What's New
                </button>

                {/* Dismiss */}
                <button
                  onClick={handleClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    borderRadius: '12px',
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#64748b',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  <X size={13} /> No thanks, close this
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
