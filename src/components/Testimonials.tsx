import { motion } from 'framer-motion';
import { Star, Quote, MessageCircle, Play } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function Testimonials() {
  const { data } = useSite();
  const featured = data.testimonials[0];

  return (
    <section id="testimonials" className="relative bg-slate-900 py-12 sm:py-16 overflow-hidden">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-80 h-80 bg-red-600/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Compact label */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            Client Story
          </p>
        </div>

        {featured && (
          <div className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">

            {/* LEFT — Video */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-video lg:aspect-auto lg:min-h-[360px] bg-slate-800 group cursor-pointer"
              onClick={() => window.open('https://www.facebook.com/share/v/1AcTcParoW/', '_blank')}
            >
              <img
                src="/ujenzi-video-thumbnail.webp?v=2"
                alt="Frederick Chege — Ujenzi Distributors Ltd"
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-500"
                width={854}
                height={480}
                loading="lazy"
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-transparent to-transparent" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl shadow-red-600/50 border-2 border-white/20"
                >
                  <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                </motion.div>
              </div>

              {/* Bottom label */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <p className="text-xs font-semibold text-white/80">Watch Frederick Chege's Story</p>
                <a
                  href="https://www.facebook.com/TallySolutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#1877F2] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow hover:bg-[#166fe5] transition flex items-center gap-1.5"
                >
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  Watch More Stories
                </a>
              </div>
            </motion.div>

            {/* RIGHT — Logo + Quote */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative flex flex-col justify-between bg-slate-800/80 p-8 md:p-10"
            >
              {/* Verified badge */}
              <div className="absolute top-5 right-5 flex items-center gap-1 bg-green-900/30 text-green-300 rounded-full px-3 py-1 text-xs font-semibold">
                <MessageCircle className="h-3.5 w-3.5" /> Verified Client
              </div>

              {/* Logo + company name */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-24 rounded-xl bg-white p-2.5 flex items-center justify-center shadow-lg border border-slate-100 shrink-0">
                  <img
                    src="/client-ujenzi-logo.png"
                    alt="Ujenzi Distributors Ltd Logo"
                    className="w-full h-full object-contain"
                    width={96}
                    height={64}
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-base font-bold text-white">Ujenzi Distributors Ltd</p>
                  <p className="text-xs text-slate-400 mt-0.5">Hardware & Construction Supplies, Kenya</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative flex-1">
                <Quote className="h-8 w-8 text-red-600/20 mb-3" />
                <p className="text-base md:text-lg text-white font-medium italic leading-relaxed">
                  "{featured.text}"
                </p>
              </div>

              {/* Author */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-sm font-bold text-white">{featured.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{featured.role}, {featured.company}</p>
              </div>
            </motion.div>

          </div>
        )}
      </div>
    </section>
  );
}
