import { motion } from 'framer-motion';
import { Star, Quote, MessageCircle, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

export default function Testimonials() {
  const { data } = useSite();
  const featured = data.testimonials[0];
  // Show up to 3 additional reviews (skip the featured one)
  const reviewCards = data.testimonials.slice(1, 4);

  return (
    <section id="testimonials" className="relative bg-slate-900 py-12 sm:py-16 overflow-hidden">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-80 h-80 bg-red-600/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            Client Stories
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">What our clients say</h2>
        </div>

        {/* Featured 2-col video card */}
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
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl shadow-red-600/50 border-2 border-white/20"
                >
                  <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                </motion.div>
              </div>
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
              <div className="absolute top-5 right-5 flex items-center gap-1 bg-green-900/30 text-green-300 rounded-full px-3 py-1 text-xs font-semibold">
                <MessageCircle className="h-3.5 w-3.5" /> Verified Client
              </div>
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
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="relative flex-1">
                <Quote className="h-8 w-8 text-red-600/20 mb-3" />
                <p className="text-base md:text-lg text-white font-medium italic leading-relaxed">
                  "{featured.text}"
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-sm font-bold text-white">{featured.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{featured.role}, {featured.company}</p>
              </div>
            </motion.div>

          </div>
        )}

        {/* Real Google Reviews */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Review 1 — Njoki Gathua */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="flex flex-col rounded-2xl border border-white/10 bg-slate-800/60 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </div>
            <p className="text-sm text-slate-300 italic leading-relaxed flex-1">
              "With the current economic situation and government requirements for small businesses, Optimum has been very helpful. Their customer service is excellent — they responded quickly, were very professional and always willing to help. I highly recommend them to any company looking for a Tally partner."
            </p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm font-bold text-white">Njoki Gathua</p>
              <p className="text-xs text-slate-400 mt-0.5">Google Review · 5 stars</p>
            </div>
          </motion.div>

          {/* Review 2 — Avyla Ventures Ltd */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="flex flex-col rounded-2xl border border-white/10 bg-slate-800/60 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </div>
            <p className="text-sm text-slate-300 italic leading-relaxed flex-1">
              "Excellent service from Optimum Prime Solutions. TallyPrime has streamlined our accounting and completely resolved our inventory management issues. Reliable, easy to use and highly recommended for any business."
            </p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm font-bold text-white">Avyla Ventures Ltd</p>
              <p className="text-xs text-slate-400 mt-0.5">Google Review · 5 stars</p>
            </div>
          </motion.div>

          {/* Review 3 — Google rating badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-800/60 p-6 text-center"
          >
            <svg className="h-8 w-8 mb-3" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            <p className="text-4xl font-extrabold text-white mb-1">5.0</p>
            <div className="flex gap-0.5 justify-center mb-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-400 mb-4">5 reviews on Google</p>
            <Link
              to="/testimonials#review-form"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Leave us a review
            </Link>
          </motion.div>

        </div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/contact#demo-form"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-500 shadow-md shadow-red-600/30 transition-colors"
          >
            Join 500+ businesses — Book a Free Demo <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/testimonials"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Read all reviews
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
