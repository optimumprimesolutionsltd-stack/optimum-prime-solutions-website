import { motion } from 'framer-motion';
import { Package, BookOpen, Wallet, Factory, FileCheck, Code, Headphones, BarChart3, Sparkles, type LucideIcon } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import TallyPrimeIcon from './TallyPrimeIcon';

const iconMap: Record<string, LucideIcon> = {
  Package, BookOpen, Wallet, Factory, FileCheck, Code, Headphones, BarChart3, Download: Package
};

export default function Features() {
  const { data } = useSite();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotateX: 20 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="services" className="relative py-32 bg-gradient-to-br from-slate-100 via-slate-50 to-sky-100 overflow-hidden perspective text-slate-900">
      {/* Animated background elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl opacity-40" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/80 rounded-full blur-3xl opacity-30" />
      <div className="absolute left-1/2 top-16 -translate-x-1/2 h-72 w-72 rounded-full bg-slate-300/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-20 font-sans">
          <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity }} className="inline-block">
            <Sparkles className="h-5 w-5 text-sky-500" />
          </motion.span>
          <span className="inline-block rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white ml-2">Our Services</span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Business Systems, Cloud Hosting & Operational Consulting
          </h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            We design and implement systems that deliver financial clarity, centralized reporting, and operational traction — combining TallyPrime expertise with secure cloud hosting and process optimization.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ perspective: '1000px' }}
        >
          {data.services.map((svc, i) => {
            const Ic = iconMap[svc.icon] || Package;
            const isHeroCard = i === 0;
            return (
              <motion.div
                key={svc.id}
                variants={itemVariants}
                whileHover={{ y: -12, rotateX: -5, transition: { duration: 0.3 } }}
                className={`group relative rounded-[2rem] border p-6 transition-all duration-300 overflow-hidden ${
                  isHeroCard
                    ? 'border-slate-200 bg-white text-slate-950 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.12)] hover:shadow-2xl hover:shadow-slate-300/30'
                    : 'border-slate-200 bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.15)] hover:shadow-2xl hover:shadow-slate-300/30'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Gradient border on hover */}
                <motion.div
                className="absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0 }}
              />

              {/* Background shine effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />

              {/* Icon background animation */}
              <motion.div
                className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-white/80 flex items-center justify-center mb-4 relative overflow-hidden"
                whileHover={{ scale: 1.15, rotate: 10 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-sky-400/30 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                <Ic className="h-6 w-6 text-sky-600 relative z-10" />
              </motion.div>

                <h3 className={`text-base font-bold flex items-center gap-2 ${isHeroCard ? 'text-slate-950' : 'text-slate-900'} ${!isHeroCard ? 'group-hover:text-sky-600' : ''}`}>
                  {svc.title}
                </h3>
                <p className={`mt-3 text-sm leading-relaxed ${isHeroCard ? 'text-slate-700' : 'text-slate-600'}`}>
                  {svc.desc}
                </p>

                {/* Features list */}
                <ul className="mt-4 space-y-2">
                  {svc.features.map((f) => (
                    <motion.li
                      key={f}
                      whileHover={{ x: 4 }}
                      className={`flex items-center gap-2 text-xs ${isHeroCard ? 'text-slate-300' : 'text-slate-600'}`}
                    >
                      <motion.span
                        className="h-2 w-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
                        whileHover={{ scale: 1.2 }}
                      />
                      {f}
                    </motion.li>
                  ))}
                </ul>
                <motion.a
                  href={svc.link || svc.cta || '#'}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -2 }}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-300 hover:bg-sky-700"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                    <TallyPrimeIcon className="h-4 w-4" showText={false} isDark />
                  </span>
                  View on Tally
                </motion.a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

