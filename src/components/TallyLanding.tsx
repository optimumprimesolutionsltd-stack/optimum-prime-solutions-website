import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Award, Cloud, BookOpen, Wrench } from 'lucide-react';

export default function TallyLanding() {
  const confettiRoot = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const services = [
    { icon: Award, label: 'Official Tally Partner Kenya', desc: 'Certified by Tally Solutions Africa — authorised to sell, implement and support TallyPrime across Kenya.' },
    { icon: Wrench, label: 'TallyPrime Implementation Kenya', desc: 'End-to-end setup, data migration, customisation and go-live support for Silver, Gold & Enterprise editions.' },
    { icon: BookOpen, label: 'TallyPrime Training Kenya', desc: 'Hands-on user training, admin workshops and ongoing coaching for your team — on-site or remote.' },
    { icon: Cloud, label: 'TallyPrime Cloud Hosting', desc: 'Secure, always-on cloud access to your TallyPrime data from any device, anywhere in Kenya.' },
    { icon: CheckCircle, label: 'Buy TallyPrime Kenya', desc: 'Genuine licences at competitive prices — Silver, Gold and Enterprise editions with full local support.' },
  ];

  useEffect(() => {
    const root = confettiRoot.current;
    if (!root) return;
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || window.innerWidth < 640) return;
    }
    const colors = ['#F59E0B', '#06B6D4', '#0EA5E9', '#F97316', '#60A5FA', '#34D399'];
    const flakes: HTMLDivElement[] = [];
    for (let i = 0; i < 36; i++) {
      const f = document.createElement('div');
      f.className = 'confetti-flake';
      f.style.left = Math.random() * 100 + '%';
      f.style.background = colors[Math.floor(Math.random() * colors.length)];
      f.style.transform = `rotate(${Math.random() * 360}deg)`;
      f.style.animationDelay = `${Math.random() * 0.8}s`;
      root.appendChild(f);
      flakes.push(f);
    }
    const t = setTimeout(() => flakes.forEach((el) => el.remove()), 5000);
    return () => { clearTimeout(t); flakes.forEach((el) => el.remove()); };
  }, []);

  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    const node = el as HTMLDivElement;
    function onMove(e: MouseEvent) {
      const rect = node.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      node.style.transform = `perspective(800px) rotateX(${(-y / rect.height) * 6}deg) rotateY(${(x / rect.width) * 6}deg) translateZ(6px)`;
    }
    function onLeave() { node.style.transform = 'none'; }
    node.addEventListener('mousemove', onMove);
    node.addEventListener('mouseleave', onLeave);
    return () => { node.removeEventListener('mousemove', onMove); node.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-videoZoom opacity-60"
        style={{ backgroundImage: "url('/images/hero-erp-dashboard.webp')" }}
      />
      <div className="absolute inset-0 z-10 bg-slate-950/80 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-48 z-30 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

      {/* Particle layer */}
      <svg className="pointer-events-none absolute inset-0 -z-20 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="p" x1="0" x2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <g className="animate-particles" fill="url(#p)">
          <circle cx="10%" cy="20%" r="2" />
          <circle cx="30%" cy="10%" r="1.5" />
          <circle cx="70%" cy="25%" r="2.2" />
          <circle cx="85%" cy="40%" r="1.2" />
          <circle cx="50%" cy="65%" r="1.8" />
        </g>
      </svg>

      <div ref={confettiRoot} className="relative z-40 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.div
          ref={logoRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="w-full space-y-8"
        >
          {/* Badge */}
          <div className="mx-auto inline-block rounded-full border border-white/20 bg-slate-800/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-slate-100/80 shadow-sm backdrop-blur-sm">
            Certified TallyPrime Partner · Ruiru &amp; Nationwide
          </div>

          {/* H1 — primary keyword target */}
          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-lg">
            Grow Your Business with{' '}
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              Kenya's Certified TallyPrime Experts
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-200/90">
            Trusted by 500+ Kenyan businesses for TallyPrime implementation, cloud hosting, KRA eTIMS compliance, and EOS® consulting. Genuine licences, hands-on training, and local support — in Ruiru, Nairobi, and nationwide.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={() => { navigate('/contact#demo-form'); setTimeout(() => { const el = document.getElementById('demo-form'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 300); }}
              className="w-full rounded-full bg-red-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:scale-105 hover:bg-red-500 hover:shadow-red-600/40 active:scale-95 sm:w-auto"
            >
              Get a Free Quote
            </button>
            <Link
              to="/tallyprime"
              onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
              className="w-full rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:scale-105 hover:border-white/70 hover:bg-white/10 active:scale-95 sm:w-auto"
            >
              Explore TallyPrime Kenya
            </Link>
          </div>

          {/* Service keyword cards */}
          <div className="mx-auto mt-4 grid max-w-5xl gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.label}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-800/20 px-4 py-4 text-left backdrop-blur-sm transition-colors hover:border-red-500/30"
              >
                <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                <div>
                  <p className="text-sm font-semibold text-white">{s.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{s.desc}</p>
                </div>
              </div>
            ))}
            {/* Trust badge card */}
            <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-4 text-left backdrop-blur-sm">
              <Award className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-white">KRA &amp; eTIMS Compliant</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">TallyPrime is a KRA-approved eTIMS solution — fully compliant with Kenya's 2026 e-invoicing mandate.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes videoZoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .animate-videoZoom { animation: videoZoom 18s ease-in-out infinite; }
        @keyframes particleFloat {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(6px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        .animate-particles { animation: particleFloat 12s ease-in-out infinite; }
        .confetti-flake {
          position: absolute;
          top: -6vh;
          width: 10px;
          height: 14px;
          opacity: 0.95;
          border-radius: 2px;
          will-change: transform, opacity;
          animation: confettiFall 4s linear forwards;
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg) translateX(0); opacity: 1 }
          100% { transform: translateY(110vh) rotate(520deg) translateX(40px); opacity: 0 }
        }
      `}</style>
    </section>
  );
}
