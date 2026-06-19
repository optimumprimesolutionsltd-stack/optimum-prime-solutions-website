import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ClipboardList, Cpu, Plug, UserCheck, HeartHandshake, ArrowRight } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: ClipboardList,
    title: 'Requirements Gathering',
    desc: 'We understand your business — your industry, team size, workflows, and pain points — to design the right TallyPrime setup for you.',
    color: 'from-red-500 to-red-600',
    shadow: 'shadow-red-500/20',
  },
  {
    num: '02',
    icon: Cpu,
    title: 'Solution Design',
    desc: 'We configure TallyPrime editions, chart of accounts, inventory structure, and reporting dashboards tailored to your business.',
    color: 'from-sky-500 to-sky-600',
    shadow: 'shadow-sky-500/20',
  },
  {
    num: '03',
    icon: Plug,
    title: 'Implementation & Migration',
    desc: 'We install, configure, and migrate your existing data — from spreadsheets or legacy software — into TallyPrime with zero data loss.',
    color: 'from-violet-500 to-violet-600',
    shadow: 'shadow-violet-500/20',
  },
  {
    num: '04',
    icon: UserCheck,
    title: 'Training & Go-Live',
    desc: 'Your team gets hands-on training from our certified consultants. We stay with you through go-live to ensure a smooth transition.',
    color: 'from-emerald-500 to-emerald-600',
    shadow: 'shadow-emerald-500/20',
  },
  {
    num: '05',
    icon: HeartHandshake,
    title: 'Ongoing Support',
    desc: 'Post-implementation, our Kenya-based team provides priority support, software updates, and quarterly business reviews.',
    color: 'from-amber-500 to-amber-600',
    shadow: 'shadow-amber-500/20',
  },
];

export default function ProcessFlow() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
            Implementation Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            From Sign-Up to Full Go-Live in Days, Not Months
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
            Our proven 5-step process gets your business running on TallyPrime quickly, correctly, and with full team buy-in.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-14">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="relative group rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/8 hover:border-white/20 transition-all duration-300"
              >
                {/* Step number */}
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} shadow-lg ${step.shadow} mb-4`}>
                  <span className="text-xs font-black text-white">{step.num}</span>
                </div>

                {/* Connector line (hidden on last item and on mobile) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-11 -right-2.5 w-5 h-0.5 bg-white/10 z-10" />
                )}

                {/* Icon */}
                <div className="mb-3">
                  <Icon className="h-5 w-5 text-slate-400 group-hover:text-slate-200 transition-colors" />
                </div>

                {/* Content */}
                <h3 className="text-sm font-bold text-white mb-2 leading-snug">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link
              to="/contact"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-8 py-4 text-sm font-bold text-white hover:bg-red-500 shadow-xl shadow-red-600/30 transition-colors"
            >
              Start Your Implementation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
