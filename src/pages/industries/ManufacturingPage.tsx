import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Factory, Package, BarChart3, ClipboardList, Phone, MessageSquare, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

const challenges = [
  { title: 'Raw Material Cost Control', desc: 'Fluctuating raw material prices eat into margins. Without real-time cost tracking, you only discover losses at month-end.' },
  { title: 'Production Cost Visibility', desc: 'Labour, overheads, and raw materials all contribute to finished goods cost — but most manufacturers in Kenya track these in separate spreadsheets.' },
  { title: 'Multi-Godown Stock Management', desc: 'Raw materials, work-in-progress, and finished goods sit in different locations. Knowing what\'s where — and what it\'s worth — is a daily challenge.' },
  { title: 'KRA eTIMS Compliance', desc: 'From 1 January 2026, KRA validates every expense against eTIMS data. Manufacturers must ensure all supplier invoices are eTIMS-compliant or risk tax disallowances.' },
];

const features = [
  {
    icon: ClipboardList,
    title: 'Bill of Materials (BOM) Management',
    desc: 'Define the exact raw materials, quantities, and costs required to produce each finished product. TallyPrime automatically calculates production costs and updates stock when you record a manufacturing journal.',
  },
  {
    icon: Factory,
    title: 'Manufacturing Journal',
    desc: 'Record production runs with a single entry — raw materials are consumed, finished goods are added to stock, and production costs are captured automatically.',
  },
  {
    icon: Package,
    title: 'Batch & Lot Tracking',
    desc: 'Track raw materials and finished goods by batch number, manufacturing date, and expiry date. Essential for food, pharmaceutical, and chemical manufacturers.',
  },
  {
    icon: BarChart3,
    title: 'Production Cost Reports',
    desc: 'See the actual cost of every production run — materials, labour, and overheads — compared to your standard cost. Identify where margins are being lost.',
  },
  {
    icon: TrendingUp,
    title: 'Multi-Location Inventory',
    desc: 'Manage raw material stores, production floor WIP, and finished goods warehouse as separate godowns. Get real-time stock valuation across all locations.',
  },
  {
    icon: CheckCircle2,
    title: 'KRA eTIMS Integration',
    desc: 'All sales invoices are transmitted to KRA eTIMS automatically. Supplier invoice validation ensures your input costs are fully deductible.',
  },
];

const results = [
  { metric: '18%', label: 'Average margin improvement reported by manufacturing clients' },
  { metric: '< 1 hr', label: 'Time to close month-end production cost reports' },
  { metric: '95%', label: 'Reduction in stock discrepancies after implementation' },
  { metric: '100%', label: 'KRA eTIMS compliance from day one' },
];

const faqs = [
  {
    q: 'Can TallyPrime handle sub-contracting (job work)?',
    a: 'Yes. TallyPrime supports job work scenarios where raw materials are sent to a sub-contractor for processing and returned as semi-finished or finished goods. Stock movements and costs are tracked throughout.',
  },
  {
    q: 'Does TallyPrime support multi-level BOM?',
    a: 'Yes. TallyPrime supports multi-level Bills of Materials — where a finished product contains sub-assemblies, which in turn have their own component lists.',
  },
  {
    q: 'Can we track production by shift or machine?',
    a: 'Using cost centres and custom TDL configurations, we can set up TallyPrime to track production costs by shift, machine, or production line. Contact us to discuss your specific requirements.',
  },
];

export default function ManufacturingPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime for Manufacturers Kenya | Optimum Prime"
        description="TallyPrime manufacturing solution in Kenya — Bill of Materials, production costing, batch tracking, and KRA eTIMS compliance."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Manufacturing solutions for your business in Ruiru and beyond."
        canonical="/industries/manufacturing"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Industries', item: 'https://www.optimumprimesolutions.co.ke/industries/' },
          { name: 'Manufacturing', item: 'https://www.optimumprimesolutions.co.ke/industries/manufacturing/' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-600/20 border border-orange-500/30 px-4 py-1.5 text-sm font-semibold text-orange-400 mb-6">
              <Factory className="h-4 w-4" />
              Manufacturing
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              TallyPrime for<br />
              <span className="text-orange-400">Kenyan Manufacturers</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              From Bill of Materials to finished goods — TallyPrime gives Kenyan manufacturers real-time production cost visibility, batch tracking, and KRA eTIMS compliance in one integrated system.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition">
                Book a Free Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="https://wa.me/254727209720?text=Hi%2C%20I%27d%20like%20to%20learn%20about%20TallyPrime%20for%20manufacturing" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition">
                <MessageSquare className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Results Strip */}
      <section className="bg-orange-600 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white">
            {results.map((r) => (
              <div key={r.label}>
                <div className="text-3xl font-black mb-1">{r.metric}</div>
                <div className="text-orange-100 text-xs leading-tight">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Challenges Kenyan Manufacturers Face</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">These are the most common pain points we hear from manufacturing businesses across Nairobi, Ruiru, Kiambu, and Thika.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {challenges.map((ch, i) => (
              <motion.div key={ch.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-bold text-slate-900 mb-2">{ch.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{ch.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How TallyPrime Solves These Challenges</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-3xl bg-white border border-slate-200 p-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Manufacturing FAQs</h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">See TallyPrime Manufacturing in Action</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Book a free demo tailored to your manufacturing operations. We'll show you BOM setup, production costing, and KRA eTIMS — using scenarios from your industry.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition">
              Book Free Manufacturing Demo <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="tel:+254116246074" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-8 py-3 text-sm font-semibold text-white transition">
              <Phone className="h-4 w-4" /> +254 116 246 074
            </a>
          </div>
        </div>
      </section>

      {/* Related Industries */}
      <section className="bg-slate-50 py-14 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Other Industries We Serve</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Distribution & Wholesale', href: '/industries/distribution' },
              { label: 'Retail', href: '/industries/retail' },
              { label: 'Construction', href: '/industries/construction' },
              { label: 'Hardware', href: '/industries/hardware' },
            ].map((s) => (
              <Link key={s.href} to={s.href} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:border-red-300 hover:text-red-600 px-4 py-2 text-sm font-medium text-slate-700 transition">
                {s.label} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
