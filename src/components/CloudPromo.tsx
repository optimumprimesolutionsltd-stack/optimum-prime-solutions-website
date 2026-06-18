import { motion } from 'framer-motion';
import { Cloud, FileText, Globe, TrendingUp, Shield, Phone, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: FileText, label: 'Professional Invoices & Reports' },
  { icon: Globe, label: 'Work From Anywhere' },
  { icon: TrendingUp, label: 'Real-Time Stock & Sales' },
  { icon: Shield, label: 'Secure & Reliable' },
];

export default function CloudPromo() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-20 md:py-28">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-blue-600 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-cyan-500 blur-[120px]"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* NEW badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-300 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            NEW PRICING — Limited Time Offer
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </span>
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Run Your Business{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Get access to the world's best business software on the cloud — made affordable for Kenyan businesses.
            </p>

            {/* Feature icons */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {features.map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">{label}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:shadow-blue-600/50 hover:scale-105"
              >
                Start Cloud Hosting
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="tel:+254116246074"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                Call Now: 0116 246 074
              </a>
            </div>
          </motion.div>

          {/* Right: Pricing card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-sm">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-400 opacity-20 blur-2xl" />

              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                {/* Cloud icon */}
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/40">
                    <Cloud className="h-8 w-8 text-white" />
                  </div>
                </div>

                <p className="text-center text-sm font-semibold uppercase tracking-widest text-blue-300">
                  Business on the Cloud
                </p>

                {/* Price */}
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-slate-400">Only</p>
                  <div className="mt-1 flex items-end justify-center gap-1">
                    <span className="text-2xl font-bold text-slate-300">KSh.</span>
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.3 }}
                      className="text-7xl font-black leading-none text-white"
                    >
                      3,000
                    </motion.span>
                  </div>
                  <div className="mt-2 inline-block rounded-full bg-blue-600 px-5 py-1.5 text-sm font-bold text-white">
                    / MONTH
                  </div>
                </div>

                {/* Features list */}
                <ul className="mt-6 space-y-2.5">
                  {[
                    'Secure cloud server setup',
                    'Access from any device, anywhere',
                    'Automated daily backups',
                    '99.9% uptime SLA guarantee',
                    'Multi-user concurrent access',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <CheckCircle className="h-4 w-4 shrink-0 text-cyan-400" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Bottom tag */}
                <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-600/20 py-3 text-center text-xs font-semibold text-blue-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Grow With Confidence · T&amp;Cs Apply
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
