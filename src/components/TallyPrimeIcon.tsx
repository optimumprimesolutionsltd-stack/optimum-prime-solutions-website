import { motion } from 'framer-motion';

interface TallyPrimeIconProps {
  className?: string;
  showText?: boolean;
  isDark?: boolean;
}

export default function TallyPrimeIcon({ className = 'h-8 w-8', showText = true, isDark = false }: TallyPrimeIconProps) {
  const blueStart = isDark ? '#083A63' : '#0D5E99';
  const blueEnd = isDark ? '#062D4A' : '#0A4C7D';
  const goldStart = isDark ? '#C08812' : '#F0B21F';
  const goldEnd = isDark ? '#A66F10' : '#DEA411';
  const tealStart = isDark ? '#1F6F8A' : '#3BA3C9';
  const tealEnd = isDark ? '#145E74' : '#2E89B5';
  const lineOpacity = isDark ? 0.32 : 0.15;

  return (
    <motion.span
      className={`inline-flex items-center gap-2 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full min-w-[1rem]" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tally Prime logo">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity={isDark ? 0.28 : 0.12} />
          </filter>
          <linearGradient id="blueGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={blueStart} />
            <stop offset="100%" stopColor={blueEnd} />
          </linearGradient>
          <linearGradient id="goldGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={goldStart} />
            <stop offset="100%" stopColor={goldEnd} />
          </linearGradient>
          <linearGradient id="tealGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={tealStart} />
            <stop offset="100%" stopColor={tealEnd} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="55" rx="12" fill="url(#blueGlow)" filter="url(#shadow)" />
        <rect x="0" y="55" width="50" height="45" fill="url(#goldGlow)" />
        <rect x="50" y="55" width="50" height="45" fill="url(#tealGlow)" />
        <path d="M 10 12 H 90" stroke="#ffffff" strokeWidth="5" opacity={lineOpacity} />
      </svg>
      {showText && (
        <span className={`text-xs font-semibold tracking-wide ${isDark ? 'text-white' : 'text-[#05345D]'}`}>
          Tally Prime
        </span>
      )}
    </motion.span>
  );
}
