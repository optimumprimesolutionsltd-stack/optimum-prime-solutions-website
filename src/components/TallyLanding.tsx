import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import TallyPrimeIcon from './TallyPrimeIcon';

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
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background: prefer people-on-laptop cinematic video. Add files to /public/ */}
      <video
        className="absolute inset-0 h-full w-full object-cover will-change-transform animate-videoZoom z-0 filter-bright"
        autoPlay
        muted
        loop
        playsInline
        poster="/tally-people-poster.jpg"
      >
        <source src="/tally-people.webm" type="video/webm" />
        <source src="/tally-people.mp4" type="video/mp4" />
      </video>

      {/* Image fallback for mobile or when video not available */}
      <div className="absolute inset-0 -z-30 md:hidden bg-cover bg-center" style={{ backgroundImage: "url('/tally-people.jpg')" }} />

      {/* Gradient overlay to add color and contrast */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#0f172a66] via-[#0b122f55] to-[#04263a40] opacity-60 animate-[gradientShift_14s_linear_infinite] mix-blend-multiply" />

      {/* Light streak (adds cinematic motion) */}
      <div className="absolute -left-1/4 top-1/4 z-15 h-1/2 w-3/4 -translate-x-12 transform-gpu overflow-hidden opacity-60">
        <div className="absolute -inset-6 h-full w-full rotate-12 transform-gpu bg-gradient-to-r from-transparent via-white/12 to-transparent blur-2xl animate-streak" />
      </div>

      {/* Animated bokeh orbs */}
      <div className="pointer-events-none absolute inset-0 z-12 -z-0">
        <div className="absolute left-10 top-20 h-40 w-40 rounded-full bg-[#ffd16633] blur-3xl animate-bob-1" />
        <div className="absolute right-16 top-36 h-28 w-28 rounded-full bg-[#60a5fa33] blur-3xl animate-bob-2" />
        <div className="absolute left-1/2 top-56 h-56 w-56 -translate-x-1/2 rounded-full bg-[#34d39933] blur-3xl animate-bob-3" />
      </div>

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

      {/* Certified partner badge */}
      <div className="absolute left-6 top-6 z-30 flex items-center gap-3 rounded-full bg-white/10 px-3 py-2 backdrop-blur">
        <TallyPrimeIcon className="h-8 w-8" showText={false} isDark={false} />
        <div className="text-xs font-semibold text-white">Certified Tally Partner</div>
      </div>

      <div ref={confettiRoot} className="relative z-20 mx-auto flex h-full max-w-7xl items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="space-y-6"
        >
          <motion.div
            ref={logoRef}
            className="mx-auto flex items-center justify-center rounded-3xl bg-white/8 px-6 py-4 backdrop-blur will-change-transform shadow-2xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
          >
            <TallyPrimeIcon className="h-28 w-28" showText={true} isDark={true} />
          </motion.div>

          {/* Floating translucent UI cards to add life */}
          <div className="absolute right-12 bottom-24 z-15 hidden lg:block">
            <div className="mb-4 w-56 rounded-2xl bg-white/6 p-4 backdrop-blur-lg shadow-lg animate-float-slow">
              <div className="h-3 w-28 rounded-full bg-white/30 mb-3" />
              <div className="h-28 rounded-lg bg-white/8" />
            </div>
            <div className="w-44 rounded-2xl bg-white/6 p-3 backdrop-blur-lg shadow-lg animate-float-slower">
              <div className="h-3 w-20 rounded-full bg-white/30 mb-2" />
              <div className="h-20 rounded-lg bg-white/8" />
            </div>
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
            Tally Prime — Cloud Hosting & Expert Implementation
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-200/90">
            Fast, secure Tally Prime deployments with business-ready reporting, inventory control and multi-location synchronization.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <a href="#home" className="rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:opacity-95">Explore Services</a>
            <a href="/contact" className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10">Contact Us</a>
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

        @keyframes streak {
          0% { transform: translateX(-30%) rotate(12deg); opacity: 0 }
          10% { opacity: 0.6 }
          50% { transform: translateX(30%) rotate(12deg); opacity: 0.35 }
          100% { transform: translateX(80%) rotate(12deg); opacity: 0 }
        }
        .animate-streak { animation: streak 8s linear infinite; }

        @keyframes bob1 { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-18px) } }
        @keyframes bob2 { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @keyframes bob3 { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-28px) } }
        .animate-bob-1 { animation: bob1 7s ease-in-out infinite; }
        .animate-bob-2 { animation: bob2 9s ease-in-out infinite; }
        .animate-bob-3 { animation: bob3 11s ease-in-out infinite; }

        .animate-float-slow { animation: floatCard 6s ease-in-out infinite; }
        .animate-float-slower { animation: floatCard 9s ease-in-out infinite; }
        @keyframes floatCard { 0% { transform: translateY(0) } 50% { transform: translateY(-12px) } 100% { transform: translateY(0) } }
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
