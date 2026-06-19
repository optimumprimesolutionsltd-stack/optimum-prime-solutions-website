import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const partners = [
  { name: 'TallyPrime', logo: '/partner-tallyprime.png', angle: 0, color: '#1a56db' },
  { name: 'EOS®', logo: '/partner-eos.png', angle: 72, color: '#e3500a' },
  { name: 'HubSpot', logo: '/partner-hubspot.png', angle: 144, color: '#ff7a59' },
  { name: 'TSplus', logo: '/partner-tsplus.png', angle: 216, color: '#0ea5e9' },
  { name: 'KRA eTIMS', logo: '/kra-logo.png', angle: 288, color: '#16a34a' },
];

function OrbitIcon({ partner, radius, duration, delay }: {
  partner: typeof partners[0];
  radius: number;
  duration: number;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute"
      style={{
        width: radius * 2,
        height: radius * 2,
        top: '50%',
        left: '50%',
        marginTop: -radius,
        marginLeft: -radius,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
    >
      {/* Icon positioned at the top of the orbit circle */}
      <motion.div
        className="absolute -top-7 left-1/2 -translate-x-1/2"
        animate={{ rotate: -360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
        title={partner.name}
      >
        <div className="w-14 h-14 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center p-2 hover:scale-110 transition-transform cursor-default">
          <img
            src={partner.logo}
            alt={partner.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = 'none';
              const parent = el.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="text-xs font-bold text-slate-700">${partner.name.slice(0, 2)}</span>`;
              }
            }}
          />
        </div>
        <p className="text-center text-[10px] font-semibold text-slate-600 mt-1 whitespace-nowrap">{partner.name}</p>
      </motion.div>
    </motion.div>
  );
}

export default function EcosystemOrbit() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-sky-50 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-100/60 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-50/80 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: orbit graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center"
          >
            <div className="relative" style={{ width: 340, height: 340 }}>
              {/* Orbit ring */}
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed border-slate-200"
                style={{ top: '50%', left: '50%', width: 300, height: 300, marginTop: -150, marginLeft: -150 }}
              />
              {/* Inner glow ring */}
              <div
                className="absolute rounded-full bg-gradient-to-br from-red-50 to-sky-50 border border-slate-100 shadow-inner"
                style={{ top: '50%', left: '50%', width: 200, height: 200, marginTop: -100, marginLeft: -100 }}
              />

              {/* Orbiting partner icons */}
              {partners.map((p, i) => (
                <OrbitIcon
                  key={p.name}
                  partner={p}
                  radius={150}
                  duration={18 + i * 2}
                  delay={-(i * (18 / partners.length))}
                />
              ))}

              {/* Center logo */}
              <div
                className="absolute flex flex-col items-center justify-center"
                style={{ top: '50%', left: '50%', width: 120, height: 120, marginTop: -60, marginLeft: -60 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-24 h-24 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center p-3"
                >
                  <img
                    src="/logo.png"
                    alt="Optimum Prime Solutions"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      const parent = el.parentElement;
                      if (parent) {
                        parent.innerHTML = '<span class="text-xs font-bold text-slate-800 text-center leading-tight">Optimum Prime</span>';
                      }
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right: text content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block rounded-full bg-gradient-to-r from-red-600 to-red-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-red-600/20 mb-6">
              Our Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              One Partner. A Complete Business Ecosystem.
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              We bring together Kenya's most powerful business tools under one roof — TallyPrime for accounting and inventory, EOS® for operational excellence, HubSpot for CRM, and TSplus for secure remote access. All certified, all integrated, all supported by our local team.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { label: 'TallyPrime', desc: 'Accounting, inventory & KRA compliance', color: 'border-blue-200 bg-blue-50' },
                { label: 'EOS® Consulting', desc: 'Business operating system for leadership teams', color: 'border-orange-200 bg-orange-50' },
                { label: 'HubSpot CRM', desc: 'Sales pipeline & customer management', color: 'border-red-200 bg-red-50' },
                { label: 'TSplus & Cloud', desc: 'Secure remote access & cloud hosting', color: 'border-sky-200 bg-sky-50' },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl border p-4 ${item.color}`}>
                  <p className="text-sm font-bold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 shadow-lg transition-colors"
              >
                Talk to an Expert
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
