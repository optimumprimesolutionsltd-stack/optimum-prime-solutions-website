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
            <div className="mt-10 sm:mt-12 grid gap-3 grid-cols-1 sm:grid-cols-2">
              {[
                { title: 'Certified Tally Partner', description: 'Official TallyPrime reseller & implementation expert.' },
                { title: 'Cloud & Remote Access', description: 'Secure cloud hosting with anywhere access.' },
                { title: 'EOS® Consulting', description: 'Run your business on the Entrepreneurial Operating System.' },
                { title: 'HubSpot CRM Integration', description: 'Connect your sales pipeline to TallyPrime for a 360° business view.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-400">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column — dark benefits card */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/10 bg-slate-800/80 shadow-2xl shadow-black/40 backdrop-blur-sm">
              <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-red-500/20 blur-[60px]" />
              <div className="p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Business benefits</p>
                    <h2 className="mt-3 text-3xl font-semibold text-white">Key benefits</h2>
                  </div>
                  <div className="rounded-2xl bg-red-600/20 border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-400">Top Picks</div>
                </div>
              </div>
              <div className="space-y-3 px-4 pb-4 sm:px-6 sm:pb-6">
                {[
                  { title: 'TallyPrime Sales & Licensing', description: 'Official Silver, Gold & Enterprise editions at best prices.' },
                  { title: 'Cloud Hosting & Remote Access', description: 'Access your TallyPrime data securely from anywhere.' },
                  { title: 'EOS® Business Operating System', description: 'Strengthen Vision, People, Data, Process & Traction in your business.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-700/60 p-5 hover:border-sky-500/30 transition-colors">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 bg-slate-900/40 p-4 sm:p-6">
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-sky-400">TallyPrime certified</p>
                    <h3 className="mt-3 text-xl font-semibold text-white">Official partner</h3>
                  </div>
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-400">EOS® consulting</p>
                    <h3 className="mt-3 text-xl font-semibold text-white">Gain traction</h3>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
