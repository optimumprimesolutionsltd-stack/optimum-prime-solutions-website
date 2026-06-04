import { motion } from 'framer-motion';
import TallyPrimeIcon from './TallyPrimeIcon';

export default function AfricanLaptopShowcase() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-sky-500/15 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 rounded-full bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-700 ring-1 ring-sky-200">
              <TallyPrimeIcon className="h-5 w-5" showText={false} isDark={false} />
              African teams using Tally Prime
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              See Kenyan business owners working with laptops and Tally Prime.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              A local professional using a laptop brings the page to life — showing how Tally Prime supports real operations, inventory control, and financial accuracy for thriving Kenyan businesses.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Authentic African imagery',
                'Laptop screen with Tally Prime',
                'Operational confidence',
                'Kenyan business-ready systems',
              ].map((feature) => (
                <div key={feature} className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200">
                  {feature}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950/5 shadow-2xl"
          >
            <div className="absolute inset-0 bg-slate-950/10" />
            <img
              src="/tally-team-poster.jpg"
              alt="Kenyan business owner using a laptop"
              className="h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
            <div className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] border border-white/15 bg-slate-950/85 p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between gap-3 text-slate-100">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0D5E99]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F0B21F]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3BA3C9]" />
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-slate-200">
                  <TallyPrimeIcon className="h-4 w-4" showText={false} isDark />
                  Tally Prime
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-3 rounded-full bg-cyan-400/70" />
                <div className="h-2.5 w-5/6 rounded-full bg-slate-400/40" />
                <div className="h-2.5 w-2/3 rounded-full bg-slate-400/30" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="h-3 rounded-full bg-sky-400/70" />
                    <div className="h-2.5 w-4/5 rounded-full bg-white/20" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 rounded-full bg-teal-400/70" />
                    <div className="h-2.5 w-5/6 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="rounded-full bg-white/10 px-3 py-1">Sales</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Inventory</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Reports</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
