import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Truck, Package, BarChart3, MapPin, Phone, MessageSquare, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

const challenges = [
  { title: 'Multi-Branch Stock Visibility', desc: 'Distributors operating across Nairobi, Mombasa, Kisumu, or upcountry often have no real-time view of stock across all locations — leading to overstocking in one branch and stockouts in another.' },
  { title: 'Credit Management for Dealers', desc: 'Extending credit to retailers and dealers is standard in distribution. Without a tight credit control system, outstanding debts accumulate and cash flow suffers.' },
  { title: 'High Transaction Volume', desc: 'Wholesale distributors process hundreds of invoices daily. Manual entry is slow, error-prone, and creates backlogs that delay financial reporting.' },
  { title: 'KRA eTIMS for All Sales', desc: 'Every invoice must be transmitted to KRA eTIMS. For high-volume distributors, this must happen automatically — not manually after the fact.' },
];

const features = [
  {
    icon: MapPin,
    title: 'Multi-Branch Inventory Management',
    desc: 'Manage stock across all your branches and warehouses as separate godowns. Transfer stock between locations, track movement, and get consolidated reports across the entire distribution network.',
  },
  {
    icon: CreditCard,
    title: 'Credit Control & Ageing Analysis',
    desc: 'Set credit limits for each dealer and retailer. Get real-time outstanding balance alerts, ageing analysis by customer, and automatic credit hold when limits are exceeded.',
  },
  {
    icon: Truck,
    title: 'Sales Order to Invoice Workflow',
    desc: 'Manage the full order-to-delivery cycle: sales order, delivery note, invoice, and receipt — all linked and traceable. Know exactly which orders are pending, dispatched, and paid.',
  },
  {
    icon: Package,
    title: 'Reorder Level Alerts',
    desc: 'Set minimum stock levels for each item at each location. TallyPrime alerts you when stock falls below reorder level — so you never run out of fast-moving products.',
  },
  {
    icon: BarChart3,
    title: 'Sales Rep Performance Reports',
    desc: 'Track sales by representative, route, or territory. See who is hitting targets, which products are moving, and where the growth opportunities are.',
  },
  {
    icon: CheckCircle2,
    title: 'Automatic KRA eTIMS Transmission',
    desc: 'Every invoice is transmitted to KRA eTIMS in real time — no manual upload, no compliance risk. Your customers receive eTIMS-validated invoices automatically.',
  },
];

const faqs = [
  {
    q: 'Can TallyPrime handle different price lists for different customers?',
    a: 'Yes. TallyPrime supports multiple price levels — you can set different selling prices for retailers, wholesalers, and key accounts, and assign each customer to the appropriate price list.',
  },
  {
    q: 'Can we manage consignment stock in TallyPrime?',
    a: 'Yes. TallyPrime supports consignment stock scenarios where goods are placed with a dealer but remain your property until sold. Stock movements and billing are tracked separately.',
  },
  {
    q: 'How does TallyPrime handle returns from dealers?',
    a: 'Credit notes and debit notes are handled natively in TallyPrime. Returns are linked to the original invoice, stock is updated automatically, and the dealer\'s account is adjusted.',
  },
];

export default function DistributionPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime for Distributors Kenya | Optimum Prime"
        description="TallyPrime distribution solution in Kenya — multi-branch inventory, credit control, sales order management, and KRA eTIMS compliance."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Distribution solutions for your business in Ruiru and beyond."
        canonical="/industries/distribution"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Industries', item: 'https://www.optimumprimesolutions.co.ke/industries/' },
          { name: 'Distribution', item: 'https://www.optimumprimesolutions.co.ke/industries/distribution/' },
        ]}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 border border-blue-500/30 px-4 py-1.5 text-sm font-semibold text-blue-400 mb-6">
              <Truck className="h-4 w-4" />
              Distribution & Wholesale
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              TallyPrime for<br />
              <span className="text-blue-400">Kenyan Distributors</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Manage multi-branch stock, control dealer credit, and stay KRA eTIMS compliant — all from one system. TallyPrime is the accounting and inventory platform trusted by wholesale distributors across Kenya.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition">
                Book a Free Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="https://wa.me/254727209720?text=Hi%2C%20I%27d%20like%20to%20learn%20about%20TallyPrime%20for%20distribution" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition">
                <MessageSquare className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Challenges Kenyan Distributors Face</h2>
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
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
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

      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Distribution FAQs</h2>
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

      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Streamline Your Distribution?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Book a free demo and see how TallyPrime handles multi-branch stock, credit control, and KRA eTIMS for distributors like yours.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition">
              Book Free Demo <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="tel:+254116246074" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-8 py-3 text-sm font-semibold text-white transition">
              <Phone className="h-4 w-4" /> +254 116 246 074
            </a>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Other Industries We Serve</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Manufacturing', href: '/industries/manufacturing' },
              { label: 'Retail', href: '/industries/retail' },
              { label: 'Hardware', href: '/industries/hardware' },
              { label: 'Construction', href: '/industries/construction' },
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
