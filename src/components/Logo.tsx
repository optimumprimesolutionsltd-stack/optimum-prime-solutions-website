import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export default function Logo({ className = 'h-10 w-auto', variant = 'full' }: LogoProps) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <img 
        src="/optimum-logo-clean.png" 
        alt="Optimum Prime Solutions Ltd" 
        className="h-full w-auto object-contain"
      />
    </motion.div>
  );
}
