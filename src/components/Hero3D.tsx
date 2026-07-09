import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import WhatsAppIcon from './WhatsAppIcon';
import { useSite } from '../context/SiteContext';

export default function Hero3D() {
  const { data } = useSite();
  return (
    <section id="home" className="relative overflow-hidden bg-slate-900">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-16 sm:pt-12 sm:pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr] items-center">

          {/* Left column */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="mt-0 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Kenya's Certified{' '}
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                TallyPrime Partner
              </span>{' '}
              — Cloud Hosting, EOS® Consulting &amp; Business Automation
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              We sell and implement TallyPrime (Silver, Gold &amp; Enterprise), provide secure cloud hosting for remote access, and help leadership teams run their businesses on the Entrepreneurial Operating System (EOS®) — the proven framework by Gino Wickman used by 280,000+ companies worldwide.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link
                to="/contact#demo-form"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-red-900/40 hover:bg-red-500 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-center"
              >
                Book a Consultation
              </Link>
              <Link
                to="/contact#demo-form"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm sm:text-base font-semibold text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-center backdrop-blur-sm"
              >
                Request a Demo
              </Link>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('zawadi:open'))}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#1DA851] hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              >
                <WhatsAppIcon className="h-5 w-5 text-white" />
                Talk to an Expert
              </button>
            </div>
            <div className="mt-10 sm:mt-12 flex flex-wrap gap-3">
              {[
                '✓ Certified Tally Partner',
                '✓ KRA eTIMS Approved',
                '✓ 500+ Clients Served',
                '✓ Licensed EOS® Implementer',
                '✓ < 1hr Support Response',
              ].map((badge) => (
                <span key={badge} className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-sm">
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right column — what we do card */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/10 bg-slate-800/80 shadow-2xl shadow-black/40 backdrop-blur-sm">
              <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-red-500/20 blur-[60px]" />
              <div className="p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">What we do</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Our Core Services</h2>
              </div>
              <div className="space-y-2 px-5 pb-5 sm:px-6 sm:pb-6">
                {[
                  { label: 'TallyPrime Sales & Implementation', sub: 'Silver, Gold & Enterprise editions — licensed & deployed', color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5' },
                  { label: 'Cloud Hosting & Remote Access', sub: 'Secure cloud server setup with 99.9% uptime SLA', color: 'text-sky-400', border: 'border-sky-500/20', bg: 'bg-sky-500/5' },
                  { label: 'EOS® Business Consulting', sub: 'Align your leadership team and gain traction', color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
                  { label: 'KRA eTIMS Compliance', sub: 'Automated eTIMS invoicing built into TallyPrime', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl border ${item.border} ${item.bg} px-4 py-3`}>
                    <p className={`text-sm font-semibold ${item.color}`}>{item.label}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
