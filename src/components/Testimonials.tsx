import { motion } from 'framer-motion';
import { Star, Quote, MessageCircle, Play } from 'lucide-react';
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
          <span className="inline-block rounded-full bg-red-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-400 border border-red-500/20">
            Success Story
          </span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Trusted by <span className="bg-gradient-to-r from-red-400 to-rose-600 bg-clip-text text-transparent">Ujenzi Distributors Ltd</span>
          </h2>
          <p className="mt-6 text-lg text-slate-300">
            See how Frederick Chege transformed his business operations with Optimum Prime Solutions.
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
                src="/ujenzi-video-thumbnail.webp" 
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

              {/* Video Info Overlay */}
              <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 text-xs font-bold text-white flex items-center gap-2 border border-white/10">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                Success Story: Ujenzi Distributors Ltd
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="text-white">
                  <p className="text-sm font-bold">Watch Frederick Chege's Story</p>
                  <p className="text-xs text-slate-300">Opens in Facebook</p>
                </div>
                <div className="flex gap-2">
                  <a 
                    href="https://www.facebook.com/profile.php?id=100041376170510" 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#1877F2] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:bg-[#166fe5] transition flex items-center gap-2"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    Follow Us
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
                <div className="h-16 w-16 rounded-full bg-white p-2 flex items-center justify-center shadow-lg">
                  <img 
                    src={featured.logo} 
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
      </div>
    </section>
  );
}
