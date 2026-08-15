import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Star, TrendingUp, Zap, Crown, Cloud, Sparkles, Wifi } from 'lucide-react';
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
    <section id="products" className="relative py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden text-white">
      {/* Background animation */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl opacity-40 -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-800/80 rounded-full blur-3xl opacity-30 -ml-48 -mb-48" />

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
          <h2 className="mt-6 text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            TallyPrime Editions & Cloud Hosting Packages
          </h2>
          <p className="mt-6 text-lg text-slate-400 leading-relaxed">
            Choose the right TallyPrime edition for your business — Silver, Gold, or Enterprise. Add secure cloud hosting for remote access and get local implementation, training and support from our Kenyan team.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {data.products.map((p) => {
            const isCloud = p.edition === 'Cloud Hosting';

            if (isCloud) {
              return (
                <motion.div
                  key={p.id}
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative rounded-2xl overflow-visible"
                  style={{ isolation: 'isolate' }}
                >
                  {/* Glowing border ring */}
                  <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 opacity-80 blur-[2px] group-hover:opacity-100 transition-opacity duration-300 z-0" />

                  {/* Card body */}
                  <div className="relative z-10 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 h-full flex flex-col shadow-2xl shadow-sky-900/30">

                    {/* NEW PRICE badge */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="absolute -top-3 -right-3 rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 px-3 py-1.5 text-xs font-bold text-slate-900 flex items-center gap-1 shadow-lg shadow-sky-400/50 z-20"
                    >
                      <Sparkles className="h-3 w-3" />
                      NEW PRICE
                    </motion.div>

                    {/* Icon */}
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-500/20 border border-sky-500/30">
                        <Cloud className="h-6 w-6 text-sky-400" />
                      </div>
                    </div>

                    {/* Name & Edition */}
                    <div className="text-center mb-2">
                      <p className="text-sm font-medium text-sky-400/80">{p.name}</p>
                      <p className="text-2xl font-bold mt-1 text-white">{p.edition}</p>
                    </div>

                    {/* Price — the hero element */}
                    <div className="text-center mt-4 mb-1">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-xs font-semibold uppercase tracking-widest text-sky-400/70 mb-1">Starting from</span>
                        <motion.div
                          key={p.price}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          className="relative"
                        >
                          {/* Glow behind price */}
                          <div className="absolute inset-0 bg-sky-400/20 blur-xl rounded-full" />
                          <span className="relative text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-300 to-white drop-shadow-lg">
                            KES 3,000
                          </span>
                        </motion.div>
                        <span className="text-sm text-sky-400/70 font-medium mt-1">{p.period}</span>
                      </div>
                    </div>

                    {/* Live indicator */}
                    <div className="flex items-center justify-center gap-1.5 mt-3 mb-6">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-xs text-green-400 font-medium">99.9% Uptime SLA</span>
                      <Wifi className="h-3 w-3 text-green-400 ml-1" />
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 flex-1">
                      {p.features.map((f, idx) => (
                        <motion.li
                          key={f}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-3 text-xs text-slate-300"
                        >
                          <motion.div whileHover={{ scale: 1.2 }}>
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                          </motion.div>
                          <span>{f}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="mt-8"
                    >
                      <Link
                        to="/contact#demo-form"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="block text-center rounded-xl py-3 text-sm font-bold transition bg-gradient-to-r from-sky-500 to-cyan-500 text-white hover:from-sky-400 hover:to-cyan-400 shadow-lg shadow-sky-500/30"
                      >
                        {p.cta}
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={p.id}
                variants={itemVariants}
                whileHover={{ y: p.popular ? 0 : -8 }}
                className={`group relative rounded-2xl border p-8 transition-all duration-300 overflow-visible ${
                  p.popular
                    ? 'border-red-500/40 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-800 shadow-xl shadow-red-900/20 text-white ring-1 ring-red-500/30'
                    : 'border-white/10 bg-slate-800 shadow-xl hover:shadow-slate-300/30'
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
                      <TrendingUp className="h-6 w-6 text-slate-300" />
                    </div>
                  )}
                </motion.div>

                {/* Pricing */}
                <div className="relative z-10 text-center">
                  <p className="text-sm font-medium text-slate-400">{p.name}</p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className={`text-2xl font-bold mt-2 text-white`}
                  >
                    {p.edition}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="mt-4"
                  >
                    <span className={`text-3xl font-extrabold text-white`}>
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
                  <p className="text-xs text-slate-400 mt-1">{p.period}</p>
                  {(p as any).note && (
                    <p className="mt-2 text-xs text-amber-400 font-medium">
                      💡 {(p as any).note}
                    </p>
                  )}
                  {p.popular && (
                    <p className="mt-4 text-sm font-medium text-slate-300">
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
                      className={`flex items-start gap-3 text-xs ${p.popular ? 'text-slate-300' : 'text-slate-400'}`}
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
                    to="/contact#demo-form"
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
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
