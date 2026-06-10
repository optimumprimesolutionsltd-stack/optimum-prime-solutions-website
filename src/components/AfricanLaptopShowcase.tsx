import { motion } from 'framer-motion';
import TallyPrimeIcon from './TallyPrimeIcon';
import { useSite } from '../context/SiteContext';

type ShowcaseTheme = 'about' | 'products' | 'features' | 'faq' | 'testimonials' | 'blog' | 'contact';

type AfricanLaptopShowcaseProps = {
  tag: string;
  title: string;
  description: string;
  features: string[];
  theme: ShowcaseTheme;
};

const themeStyles: Record<ShowcaseTheme, { badge: string; accentDot: string; bgOverlay: string; label: string }> = {
  about: {
    badge: 'bg-amber-500/10 text-amber-700 ring-amber-200',
    accentDot: 'bg-amber-300',
    bgOverlay: 'from-amber-400/20 via-transparent to-transparent',
    label: 'About the team',
  },
  products: {
    badge: 'bg-emerald-500/10 text-emerald-700 ring-emerald-200',
    accentDot: 'bg-emerald-300',
    bgOverlay: 'from-emerald-400/20 via-transparent to-transparent',
    label: 'Product plans',
  },
  features: {
    badge: 'bg-sky-500/10 text-sky-700 ring-sky-200',
    accentDot: 'bg-sky-300',
    bgOverlay: 'from-sky-400/20 via-transparent to-transparent',
    label: 'Feature focus',
  },
  faq: {
    badge: 'bg-violet-500/10 text-violet-700 ring-violet-200',
    accentDot: 'bg-violet-300',
    bgOverlay: 'from-violet-400/20 via-transparent to-transparent',
    label: 'Help center',
  },
  testimonials: {
    badge: 'bg-teal-500/10 text-teal-700 ring-teal-200',
    accentDot: 'bg-teal-300',
    bgOverlay: 'from-teal-400/20 via-transparent to-transparent',
    label: 'Client stories',
  },
  blog: {
    badge: 'bg-orange-500/10 text-orange-700 ring-orange-200',
    accentDot: 'bg-orange-300',
    bgOverlay: 'from-orange-400/20 via-transparent to-transparent',
    label: 'Insights',
  },
  contact: {
    badge: 'bg-pink-500/10 text-pink-700 ring-pink-200',
    accentDot: 'bg-pink-300',
    bgOverlay: 'from-pink-400/20 via-transparent to-transparent',
    label: 'Contact us',
  },
};

function renderThemeDecor(theme: ShowcaseTheme) {
  switch (theme) {
    case 'about':
      return (
        <>
          <div className="absolute -left-16 top-12 h-44 w-44 rounded-full bg-amber-400/20 blur-2xl" />
          <div className="absolute right-10 bottom-16 h-20 w-20 rounded-2xl bg-amber-400/25 blur-2xl" />
        </>
      );
    case 'products':
      return (
        <>
          <div className="absolute right-8 top-16 h-28 w-28 rounded-full bg-emerald-400/20 blur-2xl" />
          <div className="absolute left-10 bottom-24 h-20 w-20 rounded-full bg-emerald-400/25 blur-2xl" />
        </>
      );
    case 'features':
      return (
        <>
          <div className="absolute left-8 top-20 h-24 w-24 rounded-full bg-sky-400/20 blur-2xl" />
          <div className="absolute right-12 bottom-14 h-24 w-24 rounded-full bg-sky-400/25 blur-2xl" />
        </>
      );
    case 'faq':
      return (
        <>
          <div className="absolute right-16 top-14 h-28 w-28 rounded-full bg-violet-400/20 blur-2xl" />
          <div className="absolute left-12 bottom-18 h-20 w-20 rounded-full bg-violet-400/25 blur-2xl" />
        </>
      );
    case 'testimonials':
      return (
        <>
          <div className="absolute left-10 top-14 h-32 w-32 rounded-full bg-teal-400/20 blur-2xl" />
          <div className="absolute right-12 bottom-20 h-20 w-20 rounded-full bg-teal-400/25 blur-2xl" />
        </>
      );
    case 'blog':
      return (
        <>
          <div className="absolute left-16 top-12 h-32 w-32 rounded-full bg-orange-400/20 blur-2xl" />
          <div className="absolute right-14 bottom-16 h-24 w-24 rounded-full bg-orange-400/25 blur-2xl" />
        </>
      );
    case 'contact':
      return (
        <>
          <div className="absolute right-12 top-12 h-28 w-28 rounded-full bg-pink-400/20 blur-2xl" />
          <div className="absolute left-10 bottom-22 h-20 w-20 rounded-full bg-pink-400/25 blur-2xl" />
        </>
      );
    default:
      return null;
  }
}

export default function AfricanLaptopShowcase({ tag, title, description, features, theme }: AfricanLaptopShowcaseProps) {
  const style = themeStyles[theme];
  const imageUrls: Record<ShowcaseTheme, string> = {
    // About: African business team collaborating in a modern office
    about: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600',
    // Products: African professionals reviewing business software on laptops
    products: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600',
    // Features/Services: African team in a business strategy meeting
    features: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600',
    // FAQ: African professional working at a laptop in an office
    faq: 'https://images.pexels.com/photos/4342352/pexels-photo-4342352.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600',
    // Testimonials: African business people in a discussion/meeting
    testimonials: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600',
    // Blog: African professional writing/reading at a desk
    blog: 'https://images.pexels.com/photos/4050291/pexels-photo-4050291.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600',
    // Contact: African customer support professional with headset
    contact: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600',
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 text-slate-950">
      <div className="absolute inset-0 -z-30 bg-cover bg-center" style={{ backgroundImage: `url('${imageUrls[theme]}')` }} />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-slate-900/5 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className={`inline-flex items-center gap-3 rounded-full ${style.badge} px-4 py-2 text-sm font-semibold ring-1 ${style.badge.replace('bg-', 'ring-')}`}>
              <TallyPrimeIcon className="h-5 w-5" showText={false} isDark={false} />
              {tag}
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              {title}
            </h2>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              {description}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200">
                  {feature}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950/5 shadow-2xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-tr ${style.bgOverlay}`} />
            {renderThemeDecor(theme)}
            <div className="relative h-[28rem] max-w-[32rem] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${imageUrls[theme]}')` }} />
              <div className="absolute inset-0 bg-slate-950/30" />
              <div className="absolute inset-0 rounded-[2rem] ring-1 ring-white/10" />
              <div className="relative flex h-full items-end p-6">
                <div className="rounded-3xl bg-white/10 px-5 py-4 text-sm text-white/90 backdrop-blur-md ring-1 ring-white/15">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-200"></p>
                  <p className="mt-2 font-semibold">{theme === 'products' ? 'Laptop workflow preview' : 'Financial clarity and operational growth'}</p>
                </div>
              </div>
            </div>
            <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-slate-900/75 px-4 py-2 text-xs font-semibold text-white/90 backdrop-blur">
              <span className={`h-2.5 w-2.5 rounded-full ${style.accentDot}`} />
              {style.label}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
