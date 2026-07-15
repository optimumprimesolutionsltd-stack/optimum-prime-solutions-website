import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const partners = [
  { name: 'TallyPrime',  logo: '/tally-solutions-new-logo.png', angle: 0,   color: '#dc2626', invertOnDark: false },
  { name: 'EOS®',        logo: '/partner-eos.png',        angle: 60,  color: '#0ea5e9', invertOnDark: false },
  { name: 'Biz Analyst', logo: '/partner-biz-analyst.png', angle: 120, color: '#34d399', invertOnDark: false },
  { name: 'TSplus',      logo: '/partner-tsplus.png',     angle: 240, color: '#8b5cf6', invertOnDark: false },
  { name: 'KRA eTIMS',   logo: '/kra-logo-official.png', angle: 300, color: '#16a34a', invertOnDark: true },
];

const cards = [
  { label: 'TallyPrime',      desc: 'Accounting, inventory & KRA compliance',         border: 'border-red-500/30',    bg: 'bg-red-500/10',    text: 'text-red-400' },
  { label: 'Biz Analyst App', desc: 'Real-time Tally data on your mobile phone',       border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  { label: 'EOS® Consulting', desc: 'Business operating system for leadership teams', border: 'border-sky-500/30',    bg: 'bg-sky-500/10',    text: 'text-sky-400' },
  { label: 'Cloud Hosting',   desc: 'Secure remote access & daily backups',           border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400' },
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
      transition={{ duration, repeat: Infinity, ease: 'linear' as const, delay }}
    >
      <motion.div
        className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ rotate: -360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' as const, delay }}
        title={partner.name}
        whileHover={{ scale: 1.15 }}
      >
        <motion.div
          className="w-16 h-16 rounded-full flex items-center justify-center p-2 shadow-2xl transition-all cursor-pointer group relative overflow-visible"
          style={{
            background: `${partner.color}22`,
            border: `2px solid ${partner.color}88`,
            boxShadow: `0 0 24px ${partner.color}55`,
          }}
          whileHover={{
            boxShadow: `0 0 40px ${partner.color}99`,
            scale: 1.1,
          }}
        >
          {/* Subtle glow background without blur that affects children */}
          <div
            className="absolute inset-0 rounded-full opacity-20"
            style={{ background: partner.color }}
          />
          
          <img
            src={partner.logo}
            alt={partner.name}
            className="w-full h-full object-contain relative z-10 filter drop-shadow-md"
            width={64}
            height={64}
            loading="lazy"
            style={{ imageRendering: 'auto', ...(partner.invertOnDark ? { filter: 'brightness(0) invert(1)' } : {}) }}
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
          className="rounded-full px-3 py-1 text-[11px] font-bold whitespace-nowrap shadow-lg border"
          style={{
            background: 'rgba(15,23,42,0.95)',
            color: partner.color,
            borderColor: `${partner.color}66`,
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
      {/* Background glow blobs - kept separate to avoid affecting text/images */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-red-600/10 blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
        />
        <motion.div
          className="absolute -right-32 bottom-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-[120px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* ── LEFT: Orbit Graphic ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center"
          >
            <div className="relative scale-75 sm:scale-100" style={{ width: 400, height: 400 }}>
              {/* Orbit rings with solid/dashed borders but NO backdrop-blur */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  top: '50%', left: '50%',
                  width: 320, height: 320,
                  marginTop: -160, marginLeft: -160,
                  border: '1.5px dashed rgba(220,38,38,0.25)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' as const }}
              />

              <motion.div
                className="absolute rounded-full"
                style={{
                  top: '50%', left: '50%',
                  width: 240, height: 240,
                  marginTop: -120, marginLeft: -120,
                  border: '1px solid rgba(14,165,233,0.2)',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: 'linear' as const }}
              />

              {/* Orbiting partner icons */}
              {partners.map((p, i) => (
                <OrbitIcon
                  key={p.name}
                  partner={p}
                  radius={180}
                  duration={30 + i * 5}
                  delay={-(i * (30 / partners.length))}
                />
              ))}

              {/* Centre logo */}
              <div
                className="absolute flex flex-col items-center justify-center"
                style={{ top: '50%', left: '50%', width: 140, height: 140, marginTop: -70, marginLeft: -70 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const }}
                  className="w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl relative z-10"
                  style={{
                    background: '#0f172a',
                    border: '2px solid rgba(220,38,38,0.5)',
                    boxShadow: '0 0 40px rgba(220,38,38,0.2)',
                  }}
                >
                  <img
                    src="/logo.png"
                    alt="Optimum Prime Solutions logo — certified TallyPrime partner and business consultant in Ruiru, Kenya"
                    className="w-16 h-16 object-contain filter drop-shadow-lg"
                    width={64}
                    height={64}
                    loading="lazy"
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
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-red-600/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-400 border border-red-500/20">
                Our Ecosystem
              </span>
              <h2 className="mt-6 text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                One Partner. A Complete Solution.
              </h2>
              <p className="mt-4 text-lg text-slate-300 leading-relaxed">
                We bring together the best-in-class tools — TallyPrime for accounting, the Biz Analyst mobile app for real-time data, EOS® for leadership, and secure cloud infrastructure — so you get everything you need in one trusted partnership.
              </p>
            </div>

            <div className="space-y-4">
              {cards.map((card, idx) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className={`rounded-xl border p-4 transition-all hover:bg-slate-800/40 ${card.border} ${card.bg}`}
                >
                  <p className={`font-bold text-sm ${card.text}`}>{card.label}</p>
                  <p className="mt-1 text-sm text-slate-300">{card.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <a
                href="https://wa.me/254727209720?text=Hi%2C%20I%27d%20like%20to%20speak%20to%20an%20expert%20about%20TallyPrime"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[#1DA851]"
              >
                WhatsApp Us
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
