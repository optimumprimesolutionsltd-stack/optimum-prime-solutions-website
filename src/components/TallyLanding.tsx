import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function TallyLanding() {
  const confettiRoot = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Simple DOM confetti: create colorful flakes and animate then remove
    const root = confettiRoot.current;
    if (!root) return;

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

    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rx = (-y / rect.height) * 6; // tilt intensity
      const ry = (x / rect.width) * 6;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    }

    function onLeave() {
      el.style.transform = 'none';
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-sky-700">
      {/* Background: team image fallback while video support can remain optional */}
      <div className="absolute inset-0 -z-30 bg-cover bg-center" style={{ backgroundImage: "url('/tally-team-poster.jpg')" }} />
      <video
        className="absolute inset-0 h-full w-full object-cover will-change-transform animate-videoZoom z-10 filter-bright"
        autoPlay
        muted
        loop
        playsInline
        poster="/tally-team-poster.jpg"
      >
        <source src="/tally-people.webm" type="video/webm" />
        <source src="/tally-people.mp4" type="video/mp4" />
      </video>

      {/* Blue tint overlay for the landing picture */}
      <div className="absolute inset-0 z-20 bg-sky-700/30" />

      <div className="absolute inset-x-0 bottom-0 h-48 z-30 bg-gradient-to-t from-slate-100/90 via-slate-100/30 to-transparent" />


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


      <div ref={confettiRoot} className="relative z-20 mx-auto flex h-full max-w-7xl items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          ref={logoRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="space-y-6"
        >
          <div className="mx-auto max-w-3xl rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-100/80 shadow-sm shadow-black/10">
            Certified Tally Prime partner
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
            Optimum Prime Solutions is Kenya’s certified Tally Prime partner
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-200/90">
            We sell, install and support Tally Prime for Kenyan businesses — from accounting and inventory to payroll, KRA compliance and cloud access.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <a href="#home" className="rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:opacity-95">Explore Tally Prime services</a>
            <a href="/contact" className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10">Book a demo</a>
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
