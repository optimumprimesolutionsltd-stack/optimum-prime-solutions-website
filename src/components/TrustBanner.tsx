import { motion } from 'framer-motion';
import { ArrowRight, Award, Clock, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import TallyPrimeIcon from './TallyPrimeIcon';
import KraLogo from './KraLogo';

const stats = [
  { icon: Users, value: '2.5M', suffix: '+', label: 'TallyPrime Users Worldwide' },
  { icon: Award, value: 15, suffix: '+', label: 'Years Experience' },
  { icon: Shield, value: 99, suffix: '.9%', label: 'Uptime Guarantee' },
  { icon: Clock, value: 1, suffix: 'hr', label: 'Avg Response Time' },
];

export default function TrustBanner() {
  return (
    <section className="py-20 bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-800 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 shadow-sm">
            <TallyPrimeIcon className="h-4 w-4" showText={false} />
            Certified TallyPrime Partner · eTIMS Compliant ·
            <span className="inline-flex items-center gap-1">
              <KraLogo className="h-4 w-4" />
              KRA Approved
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
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
                className="rounded-3xl p-6 text-center bg-slate-800 border border-white/10 shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-semibold text-white">{item.value}{item.suffix}</p>
                <p className="mt-3 text-sm font-semibold text-white">{item.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/contact#demo-form"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-500 shadow-md shadow-red-600/30 transition-colors"
          >
            Book a Free Demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
