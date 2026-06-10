import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TallyLanding() {
  const confettiRoot = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const benefits = [
    'Certified TallyPrime partner — Silver, Gold & Enterprise',
    'Secure cloud hosting & remote access setup',
    'KRA & eTIMS compliant accounting out of the box',
    'EOS® business operating system implementation',
    'Scalable systems for growing Kenyan businesses',
  ];

  useEffect(() => {
    // Simple DOM confetti: create colorful flakes and animate then remove
    const root = confettiRoot.current;
    if (!root) return;
    // Disable confetti on small screens or when user prefers reduced motion
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

    const cleanup = () => {
      flakes.forEach((el) => el.remove());
    };

    const t = setTimeout(cleanup, 5000);
    return () => {
      clearTimeout(t);
      cleanup();
    };
  }, []);

  // Simple parallax / tilt for logo
  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    const node = el as HTMLDivElement;

    function onMove(e: MouseEvent) {
      const rect = node.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rx = (-y / rect.height) * 6; // tilt intensity
      const ry = (x / rect.width) * 6;
      node.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    }

    function onLeave() {
      node.style.transform = 'none';
    }

    node.addEventListener('mousemove', onMove);
    node.addEventListener('mouseleave', onLeave);
    return () => {
      node.removeEventListener('mousemove', onMove);
      node.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0 z-10 bg-black/70 pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 h-48 z-30 bg-gradient-to-t from-slate-100/90 via-slate-100/30 to-transparent pointer-events-none" />


      {/* Subtle particle layer using SVG shapes and CSS animation */}
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


      <div ref={confettiRoot} className="relative z-40 mx-auto flex h-full max-w-7xl items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          ref={logoRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="space-y-6"
        >
          <div className="mx-auto max-w-3xl rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-100/80 shadow-sm shadow-black/10">
            Kenya's Certified TallyPrime Partner · Cloud Support · EOS® Consulting
          </div>

          <h1 className="mx-auto max-w-full text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl drop-shadow-lg">
            <span className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <span>Grow</span>
              <motion.span
                animate={{ opacity: [1, 0, 0, 1] }}
                transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 0.5, times: [0, 0.15, 0.85, 1], ease: 'easeInOut' }}
                className="text-yellow-300"
              >
                Sales.
              </motion.span>
              <span>Improve</span>
              <motion.span
                animate={{ opacity: [1, 0, 0, 1] }}
                transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 0.5, times: [0, 0.15, 0.85, 1], ease: 'easeInOut', delay: 1.8 }}
                className="text-cyan-200"
              >
                Collections.
              </motion.span>
              <span>Control</span>
              <motion.span
                animate={{ opacity: [1, 0, 0, 1] }}
                transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 0.5, times: [0, 0.15, 0.85, 1], ease: 'easeInOut', delay: 3.6 }}
                className="text-emerald-200"
              >
                Inventory.
              </motion.span>
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-200/90">
            Kenya's certified TallyPrime partner. We sell, implement, and support TallyPrime — plus provide secure cloud hosting and help businesses run on the Entrepreneurial Operating System (EOS®) by Gino Wickman.
          </p>

          <div className="mx-auto mt-8 grid max-w-2xl gap-3 grid-cols-1 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 rounded-3xl border border-white/15 bg-white/10 px-4 py-3 text-left backdrop-blur-sm text-sm text-white/90 shadow-sm shadow-black/10">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-emerald-200">✓</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <button type="button" onClick={() => { navigate('/features'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="rounded-full bg-white/90 px-6 py-3 text-sm sm:text-base font-semibold text-slate-900 shadow-lg hover:bg-white hover:shadow-2xl hover:scale-105 transition-all text-center inline-flex items-center justify-center cursor-pointer active:scale-95 w-full sm:w-auto">Explore Services</button>
            <button type="button" onClick={() => { navigate('/contact'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="rounded-full border border-white/30 px-6 py-3 text-sm sm:text-base font-semibold text-white/90 hover:bg-white/30 hover:border-white/70 hover:scale-105 transition-all text-center inline-flex items-center justify-center cursor-pointer active:scale-95 w-full sm:w-auto">Book a Demo</button>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-[gradientShift_14s_linear_infinite] { background-size: 200% 200%; }

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

        /* Vibrant extras */
        .filter-bright { filter: brightness(1.08) contrast(1.08) saturate(1.12); }

        @keyframes bob1 { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-18px) } }
        @keyframes bob2 { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @keyframes bob3 { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-28px) } }
        .animate-bob-1 { animation: bob1 7s ease-in-out infinite; }
        .animate-bob-2 { animation: bob2 9s ease-in-out infinite; }
        .animate-bob-3 { animation: bob3 11s ease-in-out infinite; }
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
