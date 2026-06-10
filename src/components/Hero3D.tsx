import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import WhatsAppIcon from './WhatsAppIcon';
import { useSite } from '../context/SiteContext';

export default function Hero3D() {
  const { data } = useSite();

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-slate-100 to-slate-200">
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-sky-100 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-16 sm:pt-12 sm:pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr] items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="mt-0 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl md:text-5xl lg:text-6xl">
Kenya's Certified TallyPrime Partner — Cloud Hosting, EOS® Consulting & Business Automation
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
We sell and implement TallyPrime (Silver, Gold & Enterprise), provide secure cloud hosting for remote access, and help leadership teams run their businesses on the Entrepreneurial Operating System (EOS®) — the proven framework by Gino Wickman used by 280,000+ companies worldwide.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-accent w-full sm:w-auto text-center hover:scale-105 active:scale-95 transition-transform sm:py-4 text-base">
                Book a Consultation
              </Link>
              <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-secondary w-full sm:w-auto text-center hover:scale-105 active:scale-95 transition-transform sm:py-4 text-base">
                Request a Demo
              </Link>
              <a
                href={`https://wa.me/${data.contact.whatsapp}?text=Hi,%20I%20need%20to%20talk%20to%20an%20expert`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#1DA851] hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              >
                <WhatsAppIcon className="h-5 w-5 text-white" />
                Talk to an Expert
              </a>
            </div>

            <div className="mt-10 sm:mt-12 grid gap-3 grid-cols-1 sm:grid-cols-2">
              {[
                { title: 'Certified Tally Partner', description: 'Official TallyPrime reseller & implementation expert.' },
                { title: 'Cloud & Remote Access', description: 'Secure cloud hosting with anywhere access.' },
                { title: 'EOS® Consulting', description: 'Run your business on the Entrepreneurial Operating System.' },
                { title: 'HubSpot CRM Integration', description: 'Connect your sales pipeline to TallyPrime for a 360° business view.' },
              ].map((item) => (
                <div key={item.title} className="surface rounded-3xl p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{item.title}</p>
                  <p className="mt-3 text-base text-slate-700">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-slate-200 bg-white shadow-soft">
              <div className="p-4 sm:p-6 text-slate-950">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Business benefits</p>
                    <h2 className="mt-3 text-3xl font-semibold">Key benefits</h2>
                  </div>
                  <div className="rounded-3xl bg-slate-100 px-4 py-2 text-xs text-slate-700">Top Picks</div>
                </div>
              </div>

              <div className="space-y-4 p-4 sm:p-6">
                {[
                  { title: 'TallyPrime Sales & Licensing', description: 'Official Silver, Gold & Enterprise editions at best prices.' },
                  { title: 'Cloud Hosting & Remote Access', description: 'Access your TallyPrime data securely from anywhere.' },
                  { title: 'EOS® Business Operating System', description: 'Strengthen Vision, People, Data, Process & Traction in your business.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-700">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">TallyPrime certified</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950">Official partner</h3>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">EOS® consulting</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950">Gain traction</h3>
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
