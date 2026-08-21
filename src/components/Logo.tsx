import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  loading?: 'eager' | 'lazy';
}

export default function Logo({ className = 'h-10 w-auto', loading = 'eager' }: LogoProps) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src="/optimum-logo-header.png"
        alt="Optimum Prime Solutions Ltd"
        className="h-full w-auto object-contain"
        width={200}
        height={33}
        loading={loading}
      />
    </motion.div>
  );
}
