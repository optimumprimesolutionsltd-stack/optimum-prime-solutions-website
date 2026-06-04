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
  const { data } = useSite();
  const bgImage = data?.heroImages?.[theme] || '/tally-team-poster.jpg';

  const analytics: {
    cards: { label: string; value: string; detail: string }[];
    chartLabel: string;
    chartValues: number[];
    reports: string[];
  } = {
    about: {
      cards: [
        { label: 'Businesses supported', value: '500+', detail: 'Live Tally Prime clients across Kenya' },
        { label: 'KRA-ready reports', value: '100%', detail: 'Tax reports generated automatically' },
        { label: 'On-time delivery', value: '22 days', detail: 'Average implementation period' },
        { label: 'Remote access', value: '24/7', detail: 'Cloud-hosted Tally Prime availability' },
      ],
      chartLabel: 'Business health',
      chartValues: [42, 56, 71, 63, 82],
      reports: ['Client billing summary', 'Quote-to-cash', 'Branch financials', 'User activity'],
    },
    products: {
      cards: [
        { label: 'Active licenses', value: '72', detail: 'Silver, Gold, Plus and Enterprise in use' },
        { label: 'Monthly invoices', value: '3.4K', detail: 'Invoices processed through Tally Prime' },
        { label: 'Cloud sessions', value: '98.7%', detail: 'Online availability for remote teams' },
        { label: 'Support SLA', value: '< 2h', detail: 'Average response time for support' },
      ],
      chartLabel: 'Usage trend',
      chartValues: [55, 62, 75, 68, 84],
      reports: ['License utilization', 'Inventory turns', 'Receivables aging', 'Stock valuation'],
    },
    features: {
      cards: [
        { label: 'Cash flow', value: 'KES 4.8M', detail: 'Tracked in real time with collections data' },
        { label: 'Sales growth', value: '18%', detail: 'Month-over-month revenue increase' },
        { label: 'Inventory value', value: 'KES 12.2M', detail: 'Stock value updated every transaction' },
        { label: 'Tax liability', value: 'KES 420K', detail: 'VAT and PAYE due for the period' },
      ],
      chartLabel: 'Weekly revenue',
      chartValues: [38, 52, 67, 59, 76],
      reports: ['P&L statement', 'Balance sheet', 'GST return', 'Stock movement'],
    },
    faq: {
      cards: [
        { label: 'Answers available', value: '120+', detail: 'Knowledge base for Tally Prime users' },
        { label: 'Response time', value: '< 1h', detail: 'Helpdesk response for common queries' },
        { label: 'Self-service', value: '24/7', detail: 'Access guides and support docs anytime' },
        { label: 'Setup guides', value: '50+', detail: 'Tally Prime configuration walkthroughs' },
      ],
      chartLabel: 'Support performance',
      chartValues: [72, 78, 81, 89, 94],
      reports: ['FAQ hits', 'Support tickets', 'Knowledge growth', 'Article views'],
    },
    testimonials: {
      cards: [
        { label: 'Client satisfaction', value: '99%', detail: 'Positive feedback from deployed clients' },
        { label: 'Repeat customers', value: '84%', detail: 'Clients renewing support and upgrades' },
        { label: 'Projects delivered', value: '120+', detail: 'Tally Prime implementations completed' },
        { label: 'Avg ROI', value: '32%', detail: 'Efficiency gains reported after go-live' },
      ],
      chartLabel: 'Customer trust',
      chartValues: [60, 68, 74, 82, 91],
      reports: ['Success stories', 'Case studies', 'Training feedback', 'NPS score'],
    },
    blog: {
      cards: [
        { label: 'Posts published', value: '24', detail: 'Insights on Tally Prime and business automation' },
        { label: 'Reader reach', value: '14K', detail: 'Total monthly readers and subscribers' },
        { label: 'Engagement', value: '5.4%', detail: 'Interaction rate on published content' },
        { label: 'SEO growth', value: '36%', detail: 'Search visibility improvement year-on-year' },
      ],
      chartLabel: 'Content traction',
      chartValues: [34, 46, 58, 69, 80],
      reports: ['Top articles', 'Topic engagement', 'Newsletter signups', 'Insights shared'],
    },
    contact: {
      cards: [
        { label: 'Enquiries/week', value: '28', detail: 'New conversations started by prospects' },
        { label: 'Response rate', value: '97%', detail: 'Leads replied to within business hours' },
        { label: 'Call conversion', value: '18%', detail: 'Qualified leads booked for demos' },
        { label: 'Demos booked', value: '12', detail: 'Live Tally Prime demo sessions scheduled' },
      ],
      chartLabel: 'Contact momentum',
      chartValues: [45, 54, 67, 73, 86],
      reports: ['Latest leads', 'Call schedule', 'Demo readiness', 'Proposal pipeline'],
    },
  }[theme];

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20">
      <div className="absolute inset-0 -z-30 bg-cover bg-center" style={{ backgroundImage: `url('${bgImage}')` }} />
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
            <div className="relative mx-auto h-[28rem] max-w-[32rem] p-8">
              <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-2xl ring-1 ring-white/10" />
              <div className="absolute inset-x-6 top-6 flex items-center justify-between rounded-[1.75rem] bg-slate-900/95 px-4 py-3 text-slate-300 ring-1 ring-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-sm" />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Tally Prime dashboard</p>
                    <p className="text-sm font-semibold text-white/90">Real-time analytics</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300 ring-1 ring-white/10">
                  Live
                </div>
              </div>
              <div className="absolute inset-x-6 top-24 bottom-6 overflow-hidden rounded-[2rem] bg-slate-900/95 p-5 shadow-inner ring-1 ring-white/10">
                <div className="grid h-full gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-[1.75rem] bg-slate-950/90 p-5 ring-1 ring-white/10 shadow-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{analytics.chartLabel}</p>
                        <h3 className="mt-2 text-xl font-semibold text-white">Live Tally Prime insights</h3>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] ${style.badge}`}>
                        Updated
                      </span>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {analytics.cards.map((card) => (
                        <div key={card.label} className="rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/10">
                          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">{card.label}</p>
                          <p className="mt-3 text-2xl font-semibold text-white">{card.value}</p>
                          <p className="mt-2 text-sm text-slate-400">{card.detail}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/10">
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Trend overview</span>
                        <span className="text-slate-300">Week view</span>
                      </div>
                      <div className="mt-4 flex h-28 items-end gap-2">
                        {analytics.chartValues.map((value, index) => (
                          <div key={index} className="relative flex-1 overflow-hidden rounded-full bg-slate-800">
                            <div className="absolute inset-x-0 bottom-0 rounded-full bg-gradient-to-t from-cyan-400 to-blue-500" style={{ height: `${value}%` }} />
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.28em] text-slate-500">
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                        <span>Sun</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.75rem] bg-slate-950/90 p-5 ring-1 ring-white/10 shadow-xl">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Fast reports</p>
                    <div className="mt-5 space-y-3">
                      {analytics.reports.map((report) => (
                        <div key={report} className="rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/10">
                          <div className="flex items-center justify-between text-sm text-slate-200">
                            <span>{report}</span>
                            <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px] uppercase tracking-[0.28em] text-slate-400">
                              View
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
