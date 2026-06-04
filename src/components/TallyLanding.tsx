import { motion } from 'framer-motion';
import TallyPrimeIcon from './TallyPrimeIcon';

export default function TallyLanding() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background video (optional). Add /public/tally-bg.mp4 for cinematic video. */}
      <video
        className="absolute inset-0 h-full w-full object-cover will-change-transform animate-videoZoom"
        autoPlay
        muted
        loop
        playsInline
        poster="/tally-bg-poster.jpg"
      >
        <source src="/tally-bg.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay to add cinematic contrast */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-indigo-900 to-sky-900 opacity-80 animate-[gradientShift_14s_linear_infinite]" />

      {/* Subtle particle layer using SVG shapes and CSS animation */}
      <svg className="pointer-events-none absolute inset-0 -z-20 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="p" x1="0" x2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <g className="animate-particles" fill="url(#p)">
          <circle cx="10%" cy="20%" r="2" />
          <circle cx="30%" cy="10%" r="1.5" />
          <circle cx="70%" cy="25%" r="2.2" />
          <circle cx="85%" cy="40%" r="1.2" />
          <circle cx="50%" cy="65%" r="1.8" />
        </g>
      </svg>

      {/* Certified partner badge */}
      <div className="absolute left-6 top-6 z-30 flex items-center gap-3 rounded-full bg-white/10 px-3 py-2 backdrop-blur">
        <TallyPrimeIcon className="h-8 w-8" showText={false} isDark={false} />
        <div className="text-xs font-semibold text-white">Certified Tally Partner</div>
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="space-y-6"
        >
          <motion.div
            className="mx-auto flex items-center justify-center rounded-3xl bg-white/6 px-6 py-4 backdrop-blur"
            animate={{ y: [0, -10, 0], rotate: [0, 1.5, 0] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
          >
            <TallyPrimeIcon className="h-28 w-28" showText={true} isDark={true} />
          </motion.div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
            Tally Prime — Cloud Hosting & Expert Implementation
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-200/90">
            Fast, secure Tally Prime deployments with business-ready reporting, inventory control and multi-location synchronization.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <a href="#home" className="rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:opacity-95">Explore Services</a>
            <a href="/contact" className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10">Contact Us</a>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-[gradientShift_14s_linear_infinite] { background-size: 200% 200%; }

        @keyframes videoZoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .animate-videoZoom { animation: videoZoom 18s ease-in-out infinite; }

        @keyframes particleFloat {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(6px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        .animate-particles { animation: particleFloat 12s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
