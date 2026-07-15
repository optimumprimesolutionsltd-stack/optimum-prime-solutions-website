import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShoppingCart, Package, BarChart3, Receipt, Phone, MessageSquare, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

const features = [
  { icon: ShoppingCart, title: 'POS Integration', desc: 'Connect your point-of-sale system to TallyPrime for automatic sales posting. Every sale updates stock, accounts, and KRA eTIMS in real time.' },
  { icon: Package, title: 'Fast-Moving Stock Management', desc: 'Track hundreds or thousands of SKUs with reorder alerts, stock ageing reports, and dead stock identification to keep your shelves optimised.' },
  { icon: Tag, title: 'Multiple Price Lists', desc: 'Set different prices for retail, wholesale, and loyalty customers. Apply discounts by customer category, quantity, or promotion period.' },
  { icon: Receipt, title: 'KRA eTIMS Compliance', desc: 'Every sale generates an eTIMS-validated receipt automatically. Stay fully compliant without any manual intervention.' },
  { icon: BarChart3, title: 'Daily Sales & Cash Reports', desc: 'Close each day with a complete picture: cash collected, M-Pesa received, credit sales outstanding, and stock consumed.' },
  { icon: CheckCircle2, title: 'Supplier Payment Management', desc: 'Track what you owe each supplier, manage payment terms, and reconcile supplier statements against your purchase records.' },
];

const faqs = [
  { q: 'Does TallyPrime work with barcode scanners?', a: 'Yes. TallyPrime supports barcode scanning for stock items. You can scan items at the point of sale or during stock receiving to speed up data entry and reduce errors.' },
  { q: 'Can we manage multiple retail branches in TallyPrime?', a: 'Yes. TallyPrime Gold supports multi-branch retail operations with separate stock tracking per branch, consolidated reporting, and inter-branch stock transfers.' },
  { q: 'How does TallyPrime handle M-Pesa payments?', a: 'M-Pesa receipts are recorded as a separate payment mode in TallyPrime. You can reconcile M-Pesa collections against your bank statement and track outstanding M-Pesa settlements.' },
];

export default function RetailPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime for Retail Businesses Kenya — POS, Inventory & KRA eTIMS Compliance"
        description="TallyPrime retail solution in Kenya. POS integration, stock management, multiple price lists, and KRA eTIMS compliance for retail shops and supermarkets across Kenya."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Retail solutions for your business in Ruiru and beyond."
        canonical="/industries/retail"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Industries', item: 'https://www.optimumprimesolutions.co.ke/industries/' },
          { name: 'Retail', item: 'https://www.optimumprimesolutions.co.ke/industries/retail/' },
        ]}
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-600/20 border border-pink-500/30 px-4 py-1.5 text-sm font-semibold text-pink-400 mb-6">
              <ShoppingCart className="h-4 w-4" /> Retail
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              TallyPrime for<br /><span className="text-pink-400">Kenyan Retailers</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              From the shop floor to the back office — TallyPrime keeps your stock accurate, your accounts up to date, and your KRA compliance automatic. Built for Kenyan retail businesses of all sizes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition">Book a Free Demo <ArrowRight className="h-4 w-4" /></Link>
              <a href="https://wa.me/254727209720?text=Hi%2C%20I%27d%20like%20to%20learn%20about%20TallyPrime%20for%20retail" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition"><MessageSquare className="h-4 w-4" /> Chat on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Built for Kenyan Retail</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => { const Icon = f.icon; return (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 mb-4"><Icon className="h-5 w-5" /></div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ); })}
          </div>
        </div>
      </section>
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-slate-900 mb-4">Retail FAQs</h2></div>
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Modernise Your Retail Operations?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Book a free demo and see TallyPrime in action for your retail business.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition">Book Free Demo <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:+254116246074" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-8 py-3 text-sm font-semibold text-white transition"><Phone className="h-4 w-4" /> +254 116 246 074</a>
          </div>
        </div>
      </section>
    </main>
  );
}
