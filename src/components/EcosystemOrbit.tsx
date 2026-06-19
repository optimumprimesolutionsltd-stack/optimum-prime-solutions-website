import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const partners = [
  { name: 'TallyPrime', logo: '/partner-tallyprime.png', angle: 0,   color: '#dc2626' },
  { name: 'EOS®',       logo: '/partner-eos.png',        angle: 72,  color: '#0ea5e9' },
  { name: 'HubSpot',    logo: '/partner-hubspot.png',    angle: 144, color: '#f97316' },
  { name: 'TSplus',     logo: '/partner-tsplus.png',     angle: 216, color: '#8b5cf6' },
  { name: 'KRA eTIMS',  logo: '/kra-logo.png',           angle: 288, color: '#16a34a' },
];

const cards = [
  { label: 'TallyPrime',      desc: 'Accounting, inventory & KRA compliance',         border: 'border-red-500/30',    bg: 'bg-red-500/10',    text: 'text-red-400' },
  { label: 'EOS® Consulting', desc: 'Business operating system for leadership teams', border: 'border-sky-500/30',    bg: 'bg-sky-500/10',    text: 'text-sky-400' },
  { label: 'HubSpot CRM',     desc: 'Sales pipeline & customer management',           border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-400' },
  { label: 'TSplus & Cloud',  desc: 'Secure remote access & cloud hosting',           border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400' },
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
      <motion.div
        className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ rotate: -360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
        title={partner.name}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center p-2 shadow-lg transition-transform hover:scale-110 cursor-default"
          style={{
            background: `${partner.color}22`,
            border: `1.5px solid ${partner.color}55`,
            boxShadow: `0 0 16px ${partner.color}33`,
          }}
        >
          <img
            src={partner.logo}
            alt={partner.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = 'none';
              const parent = el.parentElement;
              if (parent) {
                parent.innerHTML = `<span style="color:${partner.color};font-size:11px;font-weight:900">${partner.name.slice(0, 2)}</span>`;
              }
            }}
          />
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap backdrop-blur-sm"
          style={{
            background: 'rgba(15,23,42,0.85)',
            color: partner.color,
            border: `1px solid ${partner.color}44`,
          }}
        >
          {partner.name}
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function EcosystemOrbit() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-1/4 h-[28rem] w-[28rem] rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute -right-40 bottom-1/4 h-[28rem] w-[28rem] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/8 blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* ── LEFT: Orbit Graphic ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center"
          >
            <div className="relative" style={{ width: 360, height: 360 }}>
              {/* Outer dashed orbit ring */}
              <div
                className="absolute rounded-full"
                style={{
                  top: '50%', left: '50%',
                  width: 320, height: 320,
                  marginTop: -160, marginLeft: -160,
                  border: '1.5px dashed rgba(255,255,255,0.12)',
                }}
              />
              {/* Solid inner ring */}
              <div
                className="absolute rounded-full"
                style={{
                  top: '50%', left: '50%',
                  width: 200, height: 200,
                  marginTop: -100, marginLeft: -100,
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'radial-gradient(circle, rgba(220,38,38,0.06) 0%, rgba(14,165,233,0.04) 100%)',
                }}
              />

              {/* Orbiting partner icons */}
              {partners.map((p, i) => (
                <OrbitIcon
                  key={p.name}
                  partner={p}
                  radius={160}
                  duration={20 + i * 2}
                  delay={-(i * (20 / partners.length))}
                />
              ))}

              {/* Centre logo */}
              <div
                className="absolute flex flex-col items-center justify-center"
                style={{ top: '50%', left: '50%', width: 120, height: 120, marginTop: -60, marginLeft: -60 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    border: '2px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 0 40px rgba(220,38,38,0.25), 0 0 80px rgba(14,165,233,0.1)',
                  }}
                >
                  <img
                    src="/logo.png"
                    alt="Optimum Prime Solutions"
                    className="w-14 h-14 object-contain"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      const parent = el.parentElement;
                      if (parent) {
                        parent.innerHTML = '<span class="text-[10px] font-black text-white text-center leading-tight px-2">Optimum<br/>Prime</span>';
                      }
                    }}
                  />
                </motion.div>
              </div>

              {/* Pulse glow behind centre */}
              <motion.div
                className="absolute rounded-full"
                style={{ top: '50%', left: '50%', width: 140, height: 140, marginTop: -70, marginLeft: -70, background: 'radial-gradient(circle, rgba(220,38,38,0.18) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>

          {/* ── RIGHT: Text + Cards ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-red-600/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-400 ring-1 ring-red-500/30">
                Our Ecosystem
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                One Partner.{' '}
                <span className="bg-gradient-to-r from-red-400 via-orange-400 to-sky-400 bg-clip-text text-transparent">
                  A Complete Business Ecosystem.
                </span>
              </h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-slate-400">
                We bring together Kenya's most powerful business tools under one roof — TallyPrime for accounting and inventory, EOS® for operational excellence, HubSpot for CRM, and TSplus for secure remote access. All certified, all integrated, all supported by our local team.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {cards.map((c) => (
                <motion.div
                  key={c.label}
                  whileHover={{ scale: 1.04, y: -2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`rounded-2xl border ${c.border} ${c.bg} p-4 backdrop-blur-sm`}
                >
                  <p className={`text-sm font-bold ${c.text}`}>{c.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{c.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-slate-100 hover:shadow-xl"
              >
                Talk to an Expert <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
