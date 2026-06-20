import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

type ShowcaseTheme = 'about' | 'products' | 'features' | 'faq' | 'testimonials' | 'blog' | 'contact';

type AfricanLaptopShowcaseProps = {
  tag: string;
  title: string;
  description: string;
  features: string[];
  theme: ShowcaseTheme;
};

const themeConfig: Record<ShowcaseTheme, {
  accent: string;
  glow1: string;
  glow2: string;
  tagBg: string;
  tagText: string;
  tagRing: string;
  dotColor: string;
  imageUrl: string;
  imageCaption: string;
  stat: string;
  statLabel: string;
  alt: string;
}> = {
  about: {
    accent: 'from-amber-400 to-orange-500',
    glow1: 'bg-amber-500/15',
    glow2: 'bg-orange-500/10',
    tagBg: 'bg-amber-500/15',
    tagText: 'text-amber-300',
    tagRing: 'ring-amber-500/30',
    dotColor: '#f59e0b',
    imageUrl: '/images/hero-office-professional.webp',
    imageCaption: "Kenya's certified TallyPrime & EOS® team",
    stat: '10+ Years',
    statLabel: 'Business expertise',
    alt: 'Optimum Prime Solutions professional business office environment',
  },
  products: {
    accent: 'from-emerald-400 to-teal-500',
    glow1: 'bg-emerald-500/15',
    glow2: 'bg-teal-500/10',
    tagBg: 'bg-emerald-500/15',
    tagText: 'text-emerald-300',
    tagRing: 'ring-emerald-500/30',
    dotColor: '#10b981',
    imageUrl: '/images/services-fintech-mobile.webp',
    imageCaption: 'TallyPrime Silver, Gold & Enterprise editions',
    stat: '3 Editions',
    statLabel: 'Silver · Gold · Enterprise',
    alt: 'Fintech mobile dashboard and business software solutions Kenya',
  },
  features: {
    accent: 'from-sky-400 to-blue-500',
    glow1: 'bg-sky-500/15',
    glow2: 'bg-blue-500/10',
    tagBg: 'bg-sky-500/15',
    tagText: 'text-sky-300',
    tagRing: 'ring-sky-500/30',
    dotColor: '#0ea5e9',
    imageUrl: '/images/services-fintech-mobile.webp',
    imageCaption: 'End-to-end implementation & support',
    stat: '5-Step',
    statLabel: 'Implementation process',
    alt: 'TallyPrime implementation and support services Kenya',
  },
  faq: {
    accent: 'from-violet-400 to-purple-500',
    glow1: 'bg-violet-500/15',
    glow2: 'bg-purple-500/10',
    tagBg: 'bg-violet-500/15',
    tagText: 'text-violet-300',
    tagRing: 'ring-violet-500/30',
    dotColor: '#8b5cf6',
    imageUrl: '/images/hero-office-professional.webp',
    imageCaption: 'Get answers from our certified consultants',
    stat: '24/7',
    statLabel: 'Support available',
    alt: 'Optimum Prime Solutions customer support and consulting',
  },
  testimonials: {
    accent: 'from-teal-400 to-cyan-500',
    glow1: 'bg-teal-500/15',
    glow2: 'bg-cyan-500/10',
    tagBg: 'bg-teal-500/15',
    tagText: 'text-teal-300',
    tagRing: 'ring-teal-500/30',
    dotColor: '#14b8a6',
    imageUrl: '/images/hero-office-professional.webp',
    imageCaption: 'Trusted by businesses across Kenya',
    stat: '500+',
    statLabel: 'Happy clients',
    alt: 'Successful Kenyan business professionals using TallyPrime',
  },
  blog: {
    accent: 'from-orange-400 to-red-500',
    glow1: 'bg-orange-500/15',
    glow2: 'bg-red-500/10',
    tagBg: 'bg-orange-500/15',
    tagText: 'text-orange-300',
    tagRing: 'ring-orange-500/30',
    dotColor: '#f97316',
    imageUrl: '/images/compliance-financial-docs.webp',
    imageCaption: 'Expert insights for Kenyan businesses',
    stat: 'Weekly',
    statLabel: 'New articles',
    alt: 'KRA eTIMS compliant invoice and financial documentation insights',
  },
  contact: {
    accent: 'from-red-400 to-rose-500',
    glow1: 'bg-red-500/15',
    glow2: 'bg-rose-500/10',
    tagBg: 'bg-red-500/15',
    tagText: 'text-red-300',
    tagRing: 'ring-red-500/30',
    dotColor: '#dc2626',
    imageUrl: '/images/hero-office-professional.webp',
    imageCaption: 'Our team is ready to help you today',
    stat: '<24h',
    statLabel: 'Response time',
    alt: 'Contact Optimum Prime Solutions for TallyPrime support Kenya',
  },
};

export default function AfricanLaptopShowcase({ tag, title, description, features, theme }: AfricanLaptopShowcaseProps) {
  const cfg = themeConfig[theme];
  const words = title.split(' ');
  const firstHalf = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const secondHalf = words.slice(Math.ceil(words.length / 2)).join(' ');

  return (
    <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className={`absolute -left-40 -top-20 h-[32rem] w-[32rem] rounded-full ${cfg.glow1} blur-3xl`} />
        <div className={`absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full ${cfg.glow2} blur-3xl`} />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">

          {/* LEFT: Text */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-7"
          >
            <span
              className={`inline-flex items-center gap-2 rounded-full ${cfg.tagBg} px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${cfg.tagText} ring-1 ${cfg.tagRing}`}
            >
              <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: cfg.dotColor }} />
              {tag}
            </span>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              <span className={`bg-gradient-to-r ${cfg.accent} bg-clip-text text-transparent`}>{firstHalf}</span>{' '}
              <span className="text-white">{secondHalf}</span>
            </h1>

            <p className="max-w-xl text-base leading-7 text-slate-400">{description}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <motion.div
                  key={feature}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-300 backdrop-blur-sm"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: cfg.dotColor }} />
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Image card */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="relative"
          >
            {/* Glow ring behind image */}
            <div
              className="absolute -inset-4 rounded-[2.5rem] blur-2xl opacity-25"
              style={{ background: `linear-gradient(135deg, ${cfg.dotColor}66, transparent)` }}
            />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
              <div className="relative h-[26rem]">
                {/* Stock photo — swap for real company photo when available. */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${cfg.imageUrl}')` }}
                  role="img"
                  aria-label={cfg.alt}
                />
                <div className="absolute inset-0 bg-slate-900/50" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900/90 to-transparent" />

                {/* Caption */}
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md ring-1 ring-white/15">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full animate-pulse" style={{ background: cfg.dotColor }} />
                    <p className="text-sm font-semibold text-white">{cfg.imageCaption}</p>
                  </div>
                </div>

                {/* Top badge */}
                <div className="absolute left-5 top-5">
                  <span className={`inline-flex items-center gap-2 rounded-full ${cfg.tagBg} px-3 py-1 text-xs font-bold ${cfg.tagText} ring-1 ${cfg.tagRing} backdrop-blur-sm`}>
                    {tag}
                  </span>
                </div>
              </div>
            </div>

            {/* Floating stat card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-5 -right-4 rounded-2xl border border-white/10 bg-slate-800/90 px-5 py-3 shadow-2xl backdrop-blur-md"
            >
              <p className="text-xs font-semibold text-slate-400">Certified Partner</p>
              <p className="mt-0.5 text-lg font-black text-white">{cfg.stat}</p>
              <p className="text-xs text-slate-400">{cfg.statLabel}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
