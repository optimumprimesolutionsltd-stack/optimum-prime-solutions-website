import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Star, TrendingUp, Zap, Crown } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function Products() {
  const { data } = useSite();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="products" className="relative py-32 bg-gradient-to-br from-slate-100 via-slate-50 to-sky-100 overflow-hidden text-slate-900">
      {/* Background animation */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl opacity-40 -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/80 rounded-full blur-3xl opacity-30 -ml-48 -mb-48" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <span className="inline-block rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-sky-300/20">
            Products & Packages
          </span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            TallyPrime Editions, Cloud Hosting & EOS® Consulting Packages
          </h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Choose the right TallyPrime edition for your business — Silver, Gold, or Enterprise. Add cloud hosting for remote access, or engage us for EOS® implementation to strengthen your leadership operating system.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 xl:grid-cols-5 gap-5"
        >
          {data.products.map((p, i) => (
            <motion.div
              key={p.id}
              variants={itemVariants}
              whileHover={{ y: p.popular ? 0 : -8 }}
              className={`group relative rounded-2xl border p-8 transition-all duration-300 overflow-visible ${
                p.popular
                  ? 'border-red-500/40 bg-gradient-to-br from-red-50 via-white to-red-50 shadow-xl shadow-red-900/10 xl:scale-[1.05] text-slate-950'
                  : 'border-slate-200 bg-white shadow-xl hover:shadow-slate-300/30'
              }`}
            >
              {/* Badge */}
              {p.popular && (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-red-600/30"
                >
                  <Star className="h-3.5 w-3.5" />
                  Most Popular
                </motion.div>
              )}

              {/* Background shine effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />

              {/* Icon */}
              <motion.div className="relative z-10 mb-6">
                {p.edition === 'Silver' && (
                  <div className="inline-block p-3 rounded-xl bg-red-500/10">
                    <Zap className="h-6 w-6 text-red-400" />
                  </div>
                )}
                {p.edition === 'Gold' && (
                  <div className="inline-block p-3 rounded-xl bg-red-600/10">
                    <Crown className="h-6 w-6 text-red-300" />
                  </div>
                )}
                {['Plus', 'Enterprise'].some(e => p.edition.includes(e)) && (
                  <div className="inline-block p-3 rounded-xl bg-slate-200/80">
                    <TrendingUp className="h-6 w-6 text-slate-700" />
                  </div>
                )}
              </motion.div>

              {/* Pricing */}
              <div className="relative z-10 text-center">
                <p className="text-sm font-medium text-slate-400">{p.name}</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className={`text-2xl font-bold mt-2 ${p.popular ? 'text-slate-950' : 'text-slate-900'}`}
                >
                  {p.edition}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="mt-4"
                >
                  <span className={`text-3xl font-extrabold ${p.popular ? 'text-slate-950' : 'text-slate-900'}`}>
                    {p.price.includes('KES') && p.price.match(/\d+/)?.[0] ? (
                      <motion.span
                        key={p.price}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {p.price}
                      </motion.span>
                    ) : (
                      p.price
                    )}
                  </span>
                </motion.div>
                <p className="text-xs text-slate-500 mt-1">{p.period}</p>
                {p.popular && (
                  <p className="mt-4 text-sm font-medium text-slate-700">
                    Best value for growing teams that need multi-user access, remote connectivity, and priority support.
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="mt-8 space-y-3 relative z-10">
                {p.features.map((f, idx) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex items-start gap-3 text-xs ${p.popular ? 'text-slate-700' : 'text-slate-600'}`}
                  >
                    <motion.div whileHover={{ scale: 1.2 }}>
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.popular ? 'text-red-500' : 'text-yellow-600'}`} />
                    </motion.div>
                    <span>{f}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8"
              >
                <Link
                  to="/contact"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className={`block text-center rounded-xl py-3 text-sm font-semibold transition relative z-10 ${
                    p.popular
                      ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {p.cta}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

