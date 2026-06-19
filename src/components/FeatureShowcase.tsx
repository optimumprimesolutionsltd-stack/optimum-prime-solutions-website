import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Banknote, Building, Globe2, Package, Factory, BarChart3, 
  Share2, TrendingUp, Lock, ChevronRight
} from 'lucide-react';

const features = [
  { icon: Banknote, title: 'Cash Flow Control', desc: 'Track receivables, payables, and daily operations with ageing analysis, automated reminders, and essential business reports for informed decisions.', color: 'from-blue-600 to-navy-800' },
  { icon: Building, title: 'Banking & Reconciliation', desc: 'Automate bank reconciliation, match statements, flag exceptions, and convert unmatched entries into accurate accounting vouchers seamlessly.', color: 'from-blue-500 to-indigo-600' },
  { icon: Globe2, title: 'Multi-Entity Operations', desc: 'Manage multiple companies and multi-currency transactions with separate books, forex tracking, and centralized control from one dashboard.', color: 'from-purple-500 to-violet-600' },
  { icon: Package, title: 'Inventory Structuring', desc: 'Define flexible stock items, groups, hierarchies, units, and manage inventory seamlessly across multiple warehouse locations.', color: 'from-orange-500 to-red-500' },
  { icon: Factory, title: 'Manufacturing & Planning', desc: 'Set reorder levels, apply valuation methods, and manage formula-based manufacturing with wastage tracking and by-product management.', color: 'from-cyan-500 to-blue-500' },
  { icon: BarChart3, title: 'Inventory Intelligence', desc: 'Analyze stock movement, ageing, balances, and trends using configurable, item-wise and location-wise reports with real-time data.', color: 'from-sky-500 to-blue-700' },
  { icon: Share2, title: 'Connected Compliance', desc: 'Access reports anywhere, share via WhatsApp or email, enable e-invoicing, stay KRA compliant with eTIMS and VAT returns.', color: 'from-pink-500 to-rose-500' },
  { icon: TrendingUp, title: 'Financial Intelligence', desc: 'Monitor cost centres, budgets, variances, ratios, cash flow, fund flow, and generate complete final financial statements.', color: 'from-amber-500 to-yellow-500' },
  { icon: Lock, title: 'Control & Scalability', desc: 'Ensure audit readiness with role-based access, edit tracking, compliance tools, and scale effortlessly with flexible licensing.', color: 'from-slate-500 to-gray-600' },
];

export default function FeatureShowcase() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
      <div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-700">
            Services
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white">
            Solutions That Deliver Financial Clarity & Operational Traction
          </h2>
          <p className="mt-4 text-slate-600">
            From reporting to multi-branch connectivity and cloud hosting, our services focus on measurable business outcomes — faster reporting, stronger controls, and scalable operations.
          </p>
        </motion.div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            const isActive = active === i;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={`relative rounded-3xl border p-6 cursor-pointer transition-all duration-300 overflow-hidden ${
                  isActive
                    ? 'border-sky-500/40 bg-slate-800 shadow-xl shadow-sky-900/30 -translate-y-1'
                    : 'border-white/10 bg-slate-800/60'
                }`}
              >
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${f.color} transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                <div className="flex items-start gap-4">
                  <div className={`h-14 w-14 rounded-[22px] bg-gradient-to-br ${f.color} p-[1.75px] shrink-0 transition-transform duration-300 ${isActive ? 'scale-105' : 'scale-100'}`}>
                    <div className="h-full w-full rounded-[20px] bg-slate-700 flex items-center justify-center shadow-sm">
                      <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {f.title}
                      <ChevronRight className={`h-4 w-4 text-sky-500 transition-all ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                    </h3>
                    <AnimatePresence>
                      {isActive ? (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 text-sm text-slate-600 leading-relaxed"
                        >
                          {f.desc}
                        </motion.p>
                      ) : (
                        <p className="mt-1.5 text-sm text-slate-500 line-clamp-1">{f.desc}</p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
