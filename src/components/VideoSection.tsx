import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';
import { useState } from 'react';

// "Get Started with TallyPrime" — the same intro video featured on the
// Video Tutorials page. Replaces a "TallyPrime 7.0 launch" video that
// wasn't actually an introduction and would read as dated over time.
const TALLY_VIDEO_ID = 'st036Km_Lfk';

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="bg-slate-800 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500 mb-2">
            See It In Action
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            New to TallyPrime? Watch the Introduction
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-6 items-center">

          {/* Video */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/40">
              {!playing ? (
                <>
                  <img
                    src={`https://img.youtube.com/vi/${TALLY_VIDEO_ID}/maxresdefault.jpg`}
                    alt="Introduction to TallyPrime"
                    className="w-full aspect-video object-cover"
                    width={1280}
                    height={720}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${TALLY_VIDEO_ID}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 transition-colors duration-300" />
                  <button
                    onClick={() => setPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center"
                    aria-label="Play Introduction to TallyPrime video"
                  >
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-14 h-14 rounded-full bg-red-600 shadow-xl shadow-red-600/40 border-2 border-white/20"
                    >
                      <Play className="h-6 w-6 text-white ml-0.5" fill="white" />
                    </motion.div>
                  </button>
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Official TallyPrime Video
                  </div>
                </>
              ) : (
                <iframe
                  className="w-full aspect-video"
                  src={`https://www.youtube.com/embed/${TALLY_VIDEO_ID}?autoplay=1&rel=0`}
                  title="Introduction to TallyPrime"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            <Link
              to="/knowledge-hub/videos"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-400 transition-colors"
            >
              Watch more TallyPrime tutorials <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Why TallyPrime — unique differentiators, not repeating the services list */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Why businesses choose TallyPrime</p>
            {[
              { title: 'No subscription fees', desc: 'One-time license — own it forever. No monthly SaaS fees eating into your margins.', color: 'text-red-400' },
              { title: 'Go live in 5 business days', desc: 'Our certified team handles setup, data migration and staff training — fast.', color: 'text-sky-400' },
              { title: 'Works offline & online', desc: 'Run on your local network or our cloud — no internet dependency for daily operations.', color: 'text-emerald-400' },
              { title: 'Used by 7 million+ businesses', desc: "Tally is Africa's most widely used accounting platform — proven at every business size.", color: 'text-amber-400' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-3 items-start rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${item.color.replace('text-', 'bg-')}`} />
                <div>
                  <p className={`text-sm font-semibold ${item.color}`}>{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-5">{item.desc}</p>
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              <Link
                to="/contact#demo-form"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-500 shadow-md shadow-red-600/30 transition-colors"
              >
                Book a Free Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
