import { motion } from 'framer-motion';
import { Star, Quote, MessageCircle, Play, ExternalLink, ThumbsUp } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function Testimonials() {
  const { data } = useSite();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, rotateX: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const avatarImages = [
    '/images/team-headshot-male.webp',
    '/images/team-headshot-female.webp',
    '/images/team-headshot-male.webp',
    '/images/team-headshot-female.webp',
    '/images/team-headshot-male.webp',
    '/images/team-headshot-female.webp',
  ];

  const featured = data.testimonials[0];

  return (
    <section id="testimonials" className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-red-600/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="mt-6 text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Trusted by <span className="bg-gradient-to-r from-[#0070c0] to-[#2e3192] bg-clip-text text-transparent">Ujenzi Distributors Ltd</span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Frederick Chege, Ujenzi Distributors Ltd
          </p>
        </motion.div>

        {featured && (
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Video Testimonial Cover */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-800 group cursor-pointer"
              onClick={() => window.open('https://www.facebook.com/share/v/1AcTcParoW/', '_blank')}
            >
              <img 
                src="/ujenzi-video-thumbnail.webp?v=2" 
                alt="Frederick Chege Testimonial Video" 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-20 w-20 rounded-full bg-red-600 flex items-center justify-center shadow-2xl shadow-red-600/50 border-4 border-white/20"
                >
                  <Play className="h-8 w-8 text-white fill-white ml-1" />
                </motion.div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="text-white">
                  <p className="text-sm font-bold">Watch Frederick Chege's Story</p>
                </div>
                <div className="flex gap-2">
                  <a 
                    href="https://www.facebook.com/TallySolutions" 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#1877F2] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:bg-[#166fe5] transition flex items-center gap-2"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    Watch More Stories
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right: Quote & Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl border border-white/10 bg-slate-800/50 p-8 md:p-12 shadow-xl"
            >
              <Quote className="h-12 w-12 text-red-600/20 mb-6" />
              
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-xl md:text-2xl text-white font-medium italic leading-relaxed mb-8">
                "{featured.text}"
              </p>

              <div className="flex items-center gap-6 pt-8 border-t border-white/10">
                <div className="h-24 w-32 rounded-2xl bg-white p-4 flex items-center justify-center shadow-xl border border-slate-100 overflow-hidden">
                  <img 
                    src="/client-ujenzi-logo.png" 
                    alt="Ujenzi Distributors Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{featured.name}</p>
                  <p className="text-slate-400 font-medium">{featured.role}, {featured.company}</p>
                </div>
              </div>

              <motion.div
                className="absolute top-6 right-6 flex items-center gap-1 bg-green-900/30 text-green-300 rounded-full px-3 py-1 text-xs font-semibold"
              >
                <MessageCircle className="h-4 w-4" /> Verified Client
              </motion.div>
            </motion.div>
          </div>
        )}
        {/* Google Reviews CTA */}
        <div id="review-form" className="scroll-mt-24" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 rounded-3xl border border-white/10 bg-slate-800/60 px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Left: Google branding + stars */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center shadow-xl flex-shrink-0">
              {/* Google G logo */}
              <svg viewBox="0 0 48 48" className="h-10 w-10">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-red-500 mb-1">Google Reviews</p>
              <h3 className="text-2xl font-bold text-white mb-2">Enjoyed working with us?</h3>
              <p className="text-slate-400 max-w-md">
                Your review helps other businesses in Nairobi and Kiambu County discover us. It takes less than a minute and means the world to our team.
              </p>
              <div className="flex gap-1 mt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-sm text-slate-400 font-medium">Leave a 5-star review</span>
              </div>
            </div>
          </div>

          {/* Right: CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <motion.a
              href="https://maps.google.com/?cid=2714284919514249977&action=write-review"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#0070c0] hover:bg-[#005fa3] text-white font-semibold px-8 py-4 shadow-lg shadow-blue-900/30 transition-colors duration-200"
            >
              <ThumbsUp className="h-5 w-5" />
              Write a Review
              <ExternalLink className="h-4 w-4 opacity-70" />
            </motion.a>
            <motion.a
              href="https://www.google.com/search?q=Optimum+Prime+Solutions+Ltd+Ruiru+Kenya"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-700/50 hover:bg-slate-700 text-white font-semibold px-8 py-4 transition-colors duration-200"
            >
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              See Our Reviews
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
