import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const partners = [
  { name: 'TallyPrime', logo: '/partner-tallyprime-official.png', angle: 0,   color: '#dc2626' },
  { name: 'EOS®',       logo: '/partner-eos.png',        angle: 72,  color: '#0ea5e9' },
  { name: 'HubSpot',    logo: '/partner-hubspot.png',    angle: 144, color: '#f97316' },
  { name: 'TSplus',     logo: '/partner-tsplus.png',     angle: 216, color: '#8b5cf6' },
  { name: 'KRA eTIMS',  logo: '/kra-logo-official.png', angle: 288, color: '#16a34a' },
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
        whileHover={{ scale: 1.15 }}
      >
        <motion.div
          className="w-16 h-16 rounded-full flex items-center justify-center p-2 shadow-2xl transition-all cursor-pointer group relative"
          style={{
            background: `${partner.color}22`,
            border: `2px solid ${partner.color}88`,
            boxShadow: `0 0 24px ${partner.color}55, inset 0 0 12px ${partner.color}22`,
          }}
          whileHover={{
            boxShadow: `0 0 40px ${partner.color}99, inset 0 0 20px ${partner.color}44, 0 0 60px ${partner.color}66`,
            scale: 1.1,
          }}
        >
          {/* Glow ring on hover */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${partner.color}33 0%, transparent 70%)`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1.3 }}
            transition={{ duration: 0.3 }}
          />
          
          <img
            src={partner.logo}
            alt={partner.name}
            className="w-full h-full object-contain relative z-10"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = 'none';
              const parent = el.parentElement;
              if (parent) {
                parent.innerHTML = `<span style="color:${partner.color};font-size:12px;font-weight:900;position:relative;z-index:10">${partner.name.slice(0, 2)}</span>`;
              }
            }}
          />
        </motion.div>
        <motion.span
          className="rounded-full px-3 py-1 text-[11px] font-bold whitespace-nowrap backdrop-blur-md shadow-lg"
          style={{
            background: 'rgba(15,23,42,0.95)',
            color: partner.color,
            border: `1.5px solid ${partner.color}66`,
            boxShadow: `0 0 12px ${partner.color}44`,
          }}
          whileHover={{
            background: 'rgba(15,23,42,1)',
            boxShadow: `0 0 20px ${partner.color}77`,
          }}
        >
          {partner.name}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

export default function EcosystemOrbit() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 py-32 text-white">
      {/* Enhanced background glow blobs with multiple layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Primary red glow */}
        <motion.div
          className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-red-600/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Primary sky glow */}
        <motion.div
          className="absolute -right-32 bottom-1/3 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        
        {/* Center violet glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        {/* Additional accent glows */}
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      {/* Animated grid background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]"
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
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center"
          >
            <div className="relative" style={{ width: 400, height: 400 }}>
              {/* Outer glow ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  top: '50%', left: '50%',
                  width: 360, height: 360,
                  marginTop: -180, marginLeft: -180,
                  background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, rgba(14,165,233,0.08) 50%, transparent 100%)',
                  boxShadow: 'inset 0 0 60px rgba(220,38,38,0.2), inset 0 0 40px rgba(14,165,233,0.1)',
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Outer dashed orbit ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  top: '50%', left: '50%',
                  width: 320, height: 320,
                  marginTop: -160, marginLeft: -160,
                  border: '2px dashed rgba(220,38,38,0.4)',
                  boxShadow: '0 0 30px rgba(220,38,38,0.3)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              />

              {/* Inner orbit ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  top: '50%', left: '50%',
                  width: 240, height: 240,
                  marginTop: -120, marginLeft: -120,
                  border: '1.5px solid rgba(14,165,233,0.5)',
                  boxShadow: '0 0 20px rgba(14,165,233,0.3), inset 0 0 20px rgba(14,165,233,0.1)',
                  background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 100%)',
                }}
                animate={{ rotate: -180 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              />

              {/* Orbiting partner icons */}
              {partners.map((p, i) => (
                <OrbitIcon
                  key={p.name}
                  partner={p}
                  radius={180}
                  duration={24 + i * 2}
                  delay={-(i * (24 / partners.length))}
                />
              ))}

              {/* Centre logo with enhanced glow */}
              <div
                className="absolute flex flex-col items-center justify-center"
                style={{ top: '50%', left: '50%', width: 140, height: 140, marginTop: -70, marginLeft: -70 }}
              >
                {/* Outer glow ring */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: 160, height: 160,
                    top: '50%', left: '50%',
                    marginTop: -80, marginLeft: -80,
                    background: 'radial-gradient(circle, rgba(220,38,38,0.3) 0%, rgba(14,165,233,0.15) 50%, transparent 100%)',
                    boxShadow: '0 0 50px rgba(220,38,38,0.4), 0 0 80px rgba(14,165,233,0.2)',
                  }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    border: '2.5px solid rgba(220,38,38,0.6)',
                    boxShadow: '0 0 60px rgba(220,38,38,0.4), 0 0 100px rgba(14,165,233,0.2), inset 0 0 20px rgba(220,38,38,0.2)',
                  }}
                >
                  <img
                    src="/logo.png"
                    alt="Optimum Prime Solutions"
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      const parent = el.parentElement;
                      if (parent) {
                        parent.innerHTML = '<span class="text-xs font-black text-white text-center leading-tight px-2">Optimum<br/>Prime</span>';
                      }
                    }}
                  />
                </motion.div>
              </div>
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
              <h2 className="mt-6 text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                One Partner. A Complete Solution.
              </h2>
              <p className="mt-4 text-lg text-slate-300 leading-relaxed">
                We bring together the best-in-class tools — TallyPrime for accounting, EOS® for business leadership, HubSpot for sales, and secure cloud infrastructure — so you get everything you need in one trusted partnership.
              </p>
            </div>

            <div className="space-y-4">
              {cards.map((card, idx) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className={`rounded-xl border p-4 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg ${card.border} ${card.bg}`}
                >
                  <p className={`font-bold text-sm ${card.text}`}>{card.label}</p>
                  <p className="mt-1 text-sm text-slate-300">{card.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/contact"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-semibold text-white shadow-lg shadow-red-600/30 transition hover:from-red-500 hover:to-red-600"
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
