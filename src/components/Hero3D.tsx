import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Download, MessageCircle } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function Hero3D() {
  const { data } = useSite();
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseXValue = useMotionValue(0);
  const mouseYValue = useMotionValue(0);
  
  // 3D tilt effect based on mouse position
  const rotateX = useTransform(mouseYValue, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXValue, [-0.5, 0.5], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      setMouseX(x);
      setMouseY(y);
      mouseXValue.set(x);
      mouseYValue.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseXValue, mouseYValue]);

  return (
    <section 
      id="home" 
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800"
      style={{ perspective: '1200px' }}
    >
      {/* 3D Background Shapes - Rotating */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large rotating cube shadow */}
        <motion.div
          animate={{ 
            rotateX: [0, 360],
            rotateY: [0, 360],
            rotateZ: [0, 180]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/3 w-screen h-screen border-2 border-blue-500/30 rounded-3xl"
          style={{ perspective: "1000px" }}
        />
        
        {/* Secondary rotating shape - larger */}
        <motion.div
          animate={{ 
            rotateX: [360, 0],
            rotateY: [360, 0],
            rotateZ: [180, 0]
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-screen h-screen border-2 border-yellow-500/20"
          style={{ 
            perspective: "1000px",
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
          }}
        />

        {/* Animated gradient blobs with depth */}
        <motion.div 
          animate={{ 
            y: [0, 60, 0],
            x: [-40, 40, -40],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.35, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-10 -left-40 w-screen h-screen bg-gradient-to-br from-yellow-400/50 to-transparent rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            y: [0, -60, 0],
            x: [40, -40, 40],
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-40 -right-40 w-screen h-screen bg-gradient-to-tl from-blue-400/40 to-transparent rounded-full blur-3xl" 
        />

        {/* 3D Grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='0' x2='100' y2='0' stroke='%23fff' stroke-width='0.5'/%3E%3Cline x1='0' y1='100' x2='100' y2='100' stroke='%23fff' stroke-width='0.5'/%3E%3Cline x1='0' y1='0' x2='0' y2='100' stroke='%23fff' stroke-width='0.5'/%3E%3Cline x1='100' y1='0' x2='100' y2='100' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          perspective: '500px'
        }} />

        {/* Floating 3D particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-100, window.innerHeight + 100],
              x: Math.sin(i) * 200,
              rotateZ: [0, 360],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-1 h-1 bg-gradient-to-r from-yellow-400 to-blue-500 rounded-full blur-sm"
            style={{
              left: `${20 + i * 15}%`,
              top: `${Math.cos(i) * 50}%`,
              filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))'
            }}
          />
        ))}
      </div>

      {/* Main Content with 3D Card Effect */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center justify-center w-full h-full">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10"
          >
            {/* 3D Headline with letters appearing */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6"
              style={{ perspective: "1200px" }}
            >
              {data.company.name.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, rotateX: 90, y: 20 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  transition={{
                    delay: 0.3 + i * 0.15,
                    duration: 0.7,
                    ease: "easeOut"
                  }}
                  className="block"
                  style={{ 
                    perspective: '1200px',
                    display: 'inline-block',
                    transformStyle: 'preserve-3d',
                    marginRight: '0.5rem'
                  }}
                >
                  <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-blue-600 bg-clip-text text-transparent">
                    {word}
                  </span>
                </motion.span>
              ))}
            </motion.h1>

            {/* 3D Tagline */}
            <motion.div
              initial={{ opacity: 0, rotateX: 90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              style={{ perspective: "1200px" }}
              className="mb-8"
            >
              <motion.p 
                animate={{
                  y: [-4, 4, -4],
                  rotateZ: [-1, 1, -1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-xl lg:text-2xl text-white font-semibold leading-relaxed"
              >
                {data.company.tagline}
              </motion.p>
              <div className="mt-2 h-1 w-24 bg-gradient-to-r from-yellow-400 to-blue-600 rounded-full" />
            </motion.div>



            {/* 3D Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05, rotateZ: 2 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all"
                style={{ perspective: "1200px" }}
              >
                <span>Request Demo</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </motion.a>

              <motion.a
                href="https://tallysolutions.com/ssa/download/?srsltid=AfmBOooMSwVbv50rP24g8n8IKqi92cdz3NFhSuqpfprrxIcgj7DZLXym"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, rotateZ: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-yellow-400/50 px-8 py-4 text-sm font-bold text-yellow-400 hover:bg-yellow-400/10 transition-all"
                style={{ perspective: "1200px" }}
              >
                <Download className="h-5 w-5" />
                <span>Download Tally</span>
              </motion.a>
            </motion.div>

            {/* Trust Badges with 3D effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-12 flex flex-col sm:flex-row gap-6"
            >
              {[
                { icon: '✓', text: '500+ Clients Served' },
                { icon: '⚡', text: '99.9% Uptime' },
                { icon: '🎯', text: '< 1 Hour Support' }
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5, rotateZ: 2 }}
                  className="flex items-center gap-2 text-white"
                >
                  <span className="text-yellow-400 text-xl">{badge.icon}</span>
                  <span className="text-sm font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - 3D Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:flex items-center justify-center"
            style={{ perspective: "1000px" }}
          >
            <motion.div
              animate={{
                rotateX: rotateX,
                rotateY: rotateY,
              }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="relative w-full aspect-square max-w-md"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1200px'
              }}
            >
              {/* 3D Card Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-blue-600/20 rounded-3xl border border-blue-400/30 backdrop-blur-xl shadow-2xl shadow-blue-500/20"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(100px)'
                }}
              />

              {/* 3D Inner layers */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotateZ: [0, 360],
                  }}
                  transition={{
                    duration: 15 + i * 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className={`absolute inset-${4 + i * 4} rounded-3xl border`}
                  style={{
                    borderColor: i === 0 ? 'rgba(59, 130, 246, 0.3)' : i === 1 ? 'rgba(168, 85, 247, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    transform: `translateZ(${80 - i * 30}px) rotateZ(${i * 45}deg)`,
                  }}
                />
              ))}

              {/* Center floating element */}
              <motion.div
                animate={{
                  y: [-20, 20, -20],
                  rotateZ: [0, 360]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  className="w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-blue-600/20 rounded-2xl border border-yellow-400/50 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-5xl">✨</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-center justify-center">
          <motion.div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
