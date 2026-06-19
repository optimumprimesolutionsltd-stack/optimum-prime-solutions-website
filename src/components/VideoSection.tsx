import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';
import { useState } from 'react';

// TallyPrime 7.0 official launch video from Tally Solutions
const TALLY_VIDEO_ID = '5fAaRE-J3QE';

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block rounded-full bg-gradient-to-r from-red-600 to-red-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-red-600/30 mb-4">
            See It In Action
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            TallyPrime — Business Software Built for Growth
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
            Watch how TallyPrime transforms accounting, inventory, payroll and compliance into one seamless system — then let us set it up for your business.
          </p>
        </motion.div>

        {/* Two-column layout: video left, CTA right */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Video embed */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative group"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
              {!playing ? (
                <>
                  {/* Thumbnail with play button overlay */}
                  <img
                    src={`https://img.youtube.com/vi/${TALLY_VIDEO_ID}/maxresdefault.jpg`}
                    alt="TallyPrime Product Video"
                    className="w-full aspect-video object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${TALLY_VIDEO_ID}/hqdefault.jpg`;
                    }}
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors duration-300" />
                  {/* Play button */}
                  <button
                    onClick={() => setPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center"
                    aria-label="Play TallyPrime video"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-20 h-20 rounded-full bg-red-600 shadow-2xl shadow-red-600/50 border-4 border-white/20"
                    >
                      <Play className="h-8 w-8 text-white ml-1" fill="white" />
                    </motion.div>
                  </button>
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Official TallyPrime Video
                  </div>
                </>
              ) : (
                <iframe
                  className="w-full aspect-video"
                  src={`https://www.youtube.com/embed/${TALLY_VIDEO_ID}?autoplay=1&rel=0`}
                  title="TallyPrime Product Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Floating label below video */}
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                <Play className="h-3 w-3 text-red-400" />
                TallyPrime 7.0 Official Launch — Tally Solutions
              </span>
            </div>
          </motion.div>

          {/* CTA panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Feature highlights */}
            {[
              {
                title: 'Accounting & Compliance',
                desc: 'Full double-entry accounting, KRA eTIMS compliance, and automated VAT/payroll — all in one place.',
                color: 'text-red-400',
              },
              {
                title: 'Inventory & Stock Management',
                desc: 'Real-time stock tracking, multi-location warehouses, batch management, and reorder alerts.',
                color: 'text-sky-400',
              },
              {
                title: 'Cloud Hosting from KES 3,000/mo',
                desc: 'Access TallyPrime from anywhere with our secure cloud setup. 99.9% uptime, daily backups included.',
                color: 'text-emerald-400',
              },
              {
                title: 'Certified Kenya Support',
                desc: 'Our certified team handles implementation, training, and ongoing support — locally, in your timezone.',
                color: 'text-yellow-400',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 items-start bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-colors"
              >
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${item.color.replace('text-', 'bg-')}`} />
                <div>
                  <p className={`text-sm font-bold ${item.color}`}>{item.title}</p>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/contact"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-500 shadow-lg shadow-red-600/30 transition-colors w-full sm:w-auto"
                >
                  Book a Free Demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/products"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors w-full sm:w-auto"
                >
                  View Pricing
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
