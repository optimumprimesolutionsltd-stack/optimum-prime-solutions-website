import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, CheckCircle, ChevronDown } from "lucide-react";
import { useRef } from "react";
import { useSiteContent } from "../lib/useSiteContent";

const floatVariants = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.5 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const trustItems = [
  "Free 30-day trial",
  "No long-term contracts",
  "Kenya-local support",
];

const floatingCards = [
  {
    icon: "📊",
    title: "Real-time Reports",
    sub: "Live business insights",
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: "☁️",
    title: "Cloud Hosted",
    sub: "99.9% uptime guaranteed",
    color: "from-yellow-400 to-orange-400",
  },
  {
    icon: "🔒",
    title: "KRA Compliant",
    sub: "Always up to date",
    color: "from-green-500 to-emerald-700",
  },
];

export default function Hero() {
  const { content } = useSiteContent();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const hero = content?.hero;
  const badge = hero?.badgeText || "🇰🇪 Trusted by Kenyan Businesses";
  const headline = hero?.headline || "Business Systems That Actually Work";
  const subheadline =
    hero?.subheadline ||
    "TallyPrime implementation, secure cloud hosting & operational consulting for growing businesses in Kenya.";
  const ctaPrimary = hero?.ctaPrimary || "Get a Free Demo";
  const ctaSecondary = hero?.ctaSecondary || "See How It Works";
  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#eef3f8] via-white to-[#f0f4ff]"
    >

      {/* Animated colour blobs (behind content, in front of logo) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-200/25 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-yellow-200/30 blur-3xl"
        />
      </div>

      {/* ─── MAIN CONTENT ───────────────────────────────────────────── */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-0"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-screen lg:min-h-0 lg:py-32">

          {/* Left — text */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 self-start px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {badge}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[#1f3a5f] tracking-tight"
            >
              {headline.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.5 }}
                  className={`inline-block mr-2 ${
                    word.toLowerCase() === "actually" || word.toLowerCase() === "work"
                      ? "text-blue-600"
                      : ""
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg text-gray-600 leading-relaxed max-w-lg"
            >
              {subheadline}
            </motion.p>

            {/* Trust items */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-x-4 gap-y-2"
            >
              {trustItems.map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  {item}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04, y: -2, boxShadow: "0 20px 40px rgba(250, 204, 21, 0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 font-bold rounded-xl shadow-lg shadow-yellow-400/30 transition-colors"
                style={{ color: "#1f3a5f" }}
              >
                {ctaPrimary}
                <ArrowRight size={16} />
              </motion.a>
              <motion.a
                href="#how-it-works"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-white/10 font-semibold text-white rounded-xl shadow-sm transition-all"
              >
                <Play size={14} className="text-blue-600 fill-blue-600" />
                {ctaSecondary}
              </motion.a>
            </motion.div>
          </div>

          {/* Right — floating cards */}
          <div className="relative flex items-center justify-center h-[420px] lg:h-[520px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 rounded-full bg-gradient-to-br from-blue-400/20 to-yellow-400/20 blur-2xl" />
            </div>

            {/* Dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              variants={floatVariants}
              // @ts-ignore
              whileInView="animate"
              className="relative z-10 bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 p-5 w-72"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400 font-mono">TallyPrime Dashboard</span>
              </div>
              <div className="flex items-end gap-1.5 h-20 mb-3">
                {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.6 + i * 0.08, duration: 0.4, ease: "easeOut" }}
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-sm origin-bottom ${i === 5 ? "bg-blue-600" : "bg-blue-200"}`}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">Monthly Revenue</p>
                  <p className="text-lg font-bold text-[#1f3a5f]">KES 4.2M</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">↑ 18%</span>
              </div>
            </motion.div>

            {/* Floating mini cards */}
            {floatingCards.map((card, i) => {
              const positions = [
                "absolute -top-4 -right-4 lg:-right-8",
                "absolute bottom-8 -left-4 lg:-left-8",
                "absolute top-1/2 -right-2 lg:right-0 translate-x-12 lg:translate-x-24",
              ];
              return (
                <motion.div
                  key={card.title}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.05, y: -4 }}
                  className={`${positions[i]} z-20 bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/10 p-3 flex items-center gap-3 min-w-[140px] sm:min-w-[160px] scale-90 sm:scale-100`}
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-lg flex-shrink-0`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{card.title}</p>
                    <p className="text-xs text-gray-400">{card.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
