import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Wrench, Package, BarChart3, CreditCard, Phone, MessageSquare, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

const features = [
  { icon: Package, title: 'Large SKU Inventory Management', desc: 'Hardware shops carry thousands of items — nails, pipes, cement, paint, tiles, and more. TallyPrime handles unlimited stock items with categories, units of measure, and reorder alerts.' },
  { icon: Tag, title: 'Bulk & Retail Pricing', desc: 'Set different prices for contractors buying in bulk and retail customers buying small quantities. Apply discounts by customer type or quantity automatically.' },
  { icon: CreditCard, title: 'Contractor Credit Management', desc: 'Most hardware shops extend credit to contractors and building companies. TallyPrime tracks each contractor\'s credit limit, outstanding balance, and payment history.' },
  { icon: Wrench, title: 'Quotation & LPO Management', desc: 'Generate professional quotations for contractors and manage Local Purchase Orders from government and corporate clients. Convert approved quotations to invoices in one click.' },
  { icon: BarChart3, title: 'Slow-Moving Stock Reports', desc: 'Identify items that haven\'t moved in 30, 60, or 90 days. Reduce dead stock and free up working capital tied up in slow-moving inventory.' },
  { icon: CheckCircle2, title: 'KRA eTIMS Compliance', desc: 'Every sale — cash, M-Pesa, or credit — generates an eTIMS-validated receipt automatically. Stay compliant without any extra work.' },
];

const faqs = [
  { q: 'Can TallyPrime handle different units of measure for the same item?', a: 'Yes. TallyPrime supports compound units of measure — for example, buying cement in bags and selling by the bag or by the pallet. Conversion factors are set once and applied automatically.' },
  { q: 'How does TallyPrime handle price fluctuations for building materials?', a: 'TallyPrime uses FIFO, LIFO, or weighted average costing methods. When material costs change, your cost of goods sold and margins are updated automatically.' },
  { q: 'Can we track deliveries to construction sites?', a: 'Yes. Delivery notes in TallyPrime track what was delivered, to which site, on which date — separate from the invoice. This is useful for contractors who want delivery confirmation before paying.' },
];

export default function HardwarePage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime for Hardware Shops Kenya — Inventory, Credit Control & KRA Compliance"
        description="TallyPrime hardware shop solution in Kenya. Manage thousands of SKUs, contractor credit, bulk pricing, and KRA eTIMS compliance for hardware and building materials businesses."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Hardware solutions for your business in Ruiru and beyond."
        canonical="/industries/hardware"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Industries', item: 'https://www.optimumprimesolutions.co.ke/industries/' },
          { name: 'Hardware', item: 'https://www.optimumprimesolutions.co.ke/industries/hardware/' },
        ]}
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-700/40 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-600/40 border border-slate-500/30 px-4 py-1.5 text-sm font-semibold text-slate-300 mb-6">
              <Wrench className="h-4 w-4" /> Hardware & Building Materials
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              TallyPrime for<br /><span className="text-red-400">Hardware Shops in Kenya</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Manage thousands of SKUs, control contractor credit, and stay KRA compliant — all from one system. TallyPrime is the trusted accounting and inventory platform for hardware and building materials businesses across Kenya.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition">Book a Free Demo <ArrowRight className="h-4 w-4" /></Link>
              <a href="https://wa.me/254727209720?text=Hi%2C%20I%27d%20like%20to%20learn%20about%20TallyPrime%20for%20hardware" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition"><MessageSquare className="h-4 w-4" /> Chat on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14"><h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Built for Kenyan Hardware Businesses</h2></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => { const Icon = f.icon; return (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4"><Icon className="h-5 w-5" /></div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ); })}
          </div>
        </div>
      </section>
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-slate-900 mb-4">Hardware FAQs</h2></div>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">See TallyPrime for Hardware in Action</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Book a free demo and see how TallyPrime handles your hardware shop's specific needs.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition">Book Free Demo <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:+254116246074" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-8 py-3 text-sm font-semibold text-white transition"><Phone className="h-4 w-4" /> +254 116 246 074</a>
          </div>
        </div>
      </section>
    </main>
  );
}
