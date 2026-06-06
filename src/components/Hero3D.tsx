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
      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="mt-0 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Helping Businesses Gain Financial Clarity, Connectivity & Operational Traction
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              We implement TallyPrime, provide secure cloud hosting, and help businesses improve systems, reporting, accountability, and operational performance across multiple locations.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary">
                Book a Consultation
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">
                Request a Demo
              </Link>
              <a
                href={`https://wa.me/${data.contact.whatsapp}?text=Hi,%20I%20need%20to%20talk%20to%20an%20expert`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#1DA851] transition"
              >
                <WhatsAppIcon className="h-5 w-5 text-white" />
                Talk to an Expert
              </a>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              {[
                { title: 'KRA compliant', description: 'Accurate tax-ready accounting.' },
                { title: 'Inventory control', description: 'Real-time stock intelligence.' },
              ].map((item) => (
                <div key={item.title} className="surface rounded-3xl p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{item.title}</p>
                  <p className="mt-3 text-base text-slate-700">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
              <div className="p-6 text-slate-950">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Business overview</p>
                    <h2 className="mt-3 text-3xl font-semibold">Performance by metric</h2>
                  </div>
                  <div className="rounded-3xl bg-slate-100 px-4 py-2 text-xs text-slate-700">Live</div>
                </div>
              </div>

              <div className="space-y-6 p-6">
                {[
                  { label: 'Clients', value: '85%', accent: 'bg-red-600' },
                  { label: 'Compliance', value: '98%', accent: 'bg-red-700' },
                  { label: 'Uptime', value: '99.9%', accent: 'bg-red-500' },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-700">
                      <span>{item.label}</span>
                      <span className="font-semibold text-slate-950">{item.value}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200">
                      <div className={`h-full rounded-full ${item.accent}`} style={{ width: item.value }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 bg-slate-50 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Active users</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950">500+</h3>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Response time</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950">1 hr</h3>
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
