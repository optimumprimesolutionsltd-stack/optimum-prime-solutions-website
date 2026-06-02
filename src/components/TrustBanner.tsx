import { motion } from 'framer-motion';
import { Award, Clock, Shield, Users } from 'lucide-react';
import TallyPrimeIcon from './TallyPrimeIcon';
import KraLogo from './KraLogo';

const stats = [
  { icon: Users, value: 500, suffix: '+', label: 'Businesses Served' },
  { icon: Award, value: 15, suffix: '+', label: 'Years Experience' },
  { icon: Shield, value: 99, suffix: '.9%', label: 'Uptime Guarantee' },
  { icon: Clock, value: 1, suffix: 'hr', label: 'Avg Response Time' },
];

export default function TrustBanner() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 shadow-sm">
            <TallyPrimeIcon className="h-4 w-4" showText={false} />
            Certified TallyPrime Partner · eTIMS Compliant ·
            <span className="inline-flex items-center gap-1">
              <KraLogo className="h-4 w-4" />
              KRA Approved
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Trusted by Kenyan businesses for practical digital transformation
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="surface rounded-3xl p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-200 text-slate-950">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-semibold text-slate-950">{item.value}{item.suffix}</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">{item.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
