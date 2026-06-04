import { motion } from 'framer-motion';
import TallyPrimeIcon from './TallyPrimeIcon';

export default function TallyLanding() {
  return (
    <section className="relative h-screen w-full">
      {/* Background video (optional). Place a file at /public/tally-bg.mp4 to use. */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/tally-bg-poster.jpg"
      >
        <source src="/tally-bg.mp4" type="video/mp4" />
      </video>

      {/* Fallback animated gradient in case video isn't present or supported */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-900 via-indigo-700 to-slate-900 animate-[gradientShift_8s_linear_infinite]" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="mx-auto flex items-center justify-center rounded-3xl bg-white/6 px-6 py-4 backdrop-blur">
            <TallyPrimeIcon className="h-20 w-20" showText={true} isDark={true} />
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tally Prime — Cloud Hosting & Expert Implementation
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-200">
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
        .animate-[gradientShift_8s_linear_infinite] {
          background-size: 200% 200%;
        }
      `}</style>
    </section>
  );
}
