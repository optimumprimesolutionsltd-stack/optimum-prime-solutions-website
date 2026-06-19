import { motion } from 'framer-motion';
import { Star, Quote, MessageCircle } from 'lucide-react';
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

  const avatarColors = [
    'from-blue-500 to-yellow-600',
    'from-purple-500 to-blue-500',
    'from-green-500 to-blue-500',
    'from-red-500 to-purple-500',
    'from-yellow-500 to-red-500',
    'from-teal-500 to-green-500',
  ];

  return (
    <section id="testimonials" className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block rounded-full bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-yellow-600">
            Testimonials
          </span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-extrabold text-navy-900 dark:text-navy-900 leading-tight">
            Trusted by <span className="bg-gradient-to-r from-yellow-400 to-blue-600 bg-clip-text text-transparent">Kenyan Businesses</span>
          </h2>
          <p className="mt-6 text-lg text-navy-600 dark:text-navy-300">
            Join 500+ companies transforming their operations with our Tally Prime solutions.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {data.testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative rounded-2xl border border-navy-100 dark:border-navy-700 bg-slate-800 dark:bg-navy-800/50 p-8 shadow-md hover:shadow-xl hover:shadow-yellow-400/20 transition-all duration-300 overflow-hidden"
            >
              {/* Background gradient on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
              />

              {/* Quote icon */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
                className="relative z-10"
              >
                <Quote className="h-8 w-8 text-yellow-600/30 mb-4" />
              </motion.div>

              {/* Stars */}
              <div className="flex gap-1 mb-4 relative z-10">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 + j * 0.05 }}
                  >
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-sm text-navy-600 dark:text-navy-700 leading-relaxed relative z-10 mb-6">
                "{t.text}"
              </p>

              {/* Author info */}
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 border-t border-navy-100 dark:border-navy-700 pt-5 relative z-10"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`h-12 w-12 rounded-full bg-gradient-to-br ${
                    avatarColors[i % avatarColors.length]
                  } flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg`}
                >
                  {t.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-900 dark:text-white truncate">{t.name}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-600 truncate">
                    {t.role}, {t.company}
                  </p>
                </div>
              </motion.div>

              {/* Verified badge */}
              <motion.div
                className="absolute top-4 right-4 flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <MessageCircle className="h-3 w-3" /> Verified
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

