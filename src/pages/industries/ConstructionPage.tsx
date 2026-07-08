import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, HardHat, BarChart3, FileText, DollarSign, Phone, MessageSquare, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

const features = [
  { icon: Layers, title: 'Project Cost Accounting', desc: 'Track every shilling spent on each project — materials, labour, subcontractors, and overheads — using TallyPrime cost centres. Know your project profitability in real time.' },
  { icon: FileText, title: 'Bill of Quantities (BOQ) Tracking', desc: 'Map your BOQ to TallyPrime cost categories. Compare actual spend against budgeted quantities at every stage of the project.' },
  { icon: HardHat, title: 'Subcontractor Payment Management', desc: 'Manage retention amounts, milestone payments, and withholding tax deductions for subcontractors. Generate payment certificates directly from TallyPrime.' },
  { icon: DollarSign, title: 'Withholding Tax Compliance', desc: 'Construction companies are subject to 3% withholding tax on payments to contractors. TallyPrime calculates and tracks WHT automatically on every applicable payment.' },
  { icon: BarChart3, title: 'Multi-Project Reporting', desc: 'Run profitability reports across all active projects simultaneously. Identify which projects are on budget and which need attention — before it\'s too late.' },
  { icon: CheckCircle2, title: 'KRA eTIMS for All Invoices', desc: 'All client invoices and supplier bills are eTIMS-validated. Stay compliant with KRA\'s 2026 expense validation requirements.' },
];

const faqs = [
  { q: 'Can TallyPrime track retention amounts?', a: 'Yes. Retention amounts can be tracked as separate ledgers in TallyPrime. When retention is released, a credit note or payment is applied against the retention ledger.' },
  { q: 'How does TallyPrime handle progress billing?', a: 'Progress invoices (interim certificates) are recorded as partial invoices against the project. TallyPrime tracks the total contract value, amount billed to date, and balance remaining.' },
  { q: 'Can we track plant and equipment costs per project?', a: 'Yes. Using cost centres and job costing, you can allocate plant hire, fuel, and maintenance costs to specific projects for accurate project profitability reporting.' },
];

export default function ConstructionPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime for Construction Companies Kenya — Project Costing, BOQ & Compliance"
        description="TallyPrime construction solution in Kenya. Project cost accounting, BOQ tracking, subcontractor management, withholding tax, and KRA eTIMS compliance for construction companies."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Construction solutions for your business in Ruiru and beyond."
        canonical="/industries/construction"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Industries', item: 'https://www.optimumprimesolutions.co.ke/industries/' },
          { name: 'Construction', item: 'https://www.optimumprimesolutions.co.ke/industries/construction/' },
        ]}
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-600/20 border border-yellow-500/30 px-4 py-1.5 text-sm font-semibold text-yellow-400 mb-6">
              <HardHat className="h-4 w-4" /> Construction
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              TallyPrime for<br /><span className="text-yellow-400">Kenyan Contractors</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Know your project profitability before the final certificate — not after. TallyPrime gives construction companies in Kenya real-time project cost tracking, BOQ management, and full KRA compliance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition">Book a Free Demo <ArrowRight className="h-4 w-4" /></Link>
              <a href="https://wa.me/254116246074?text=Hi%2C%20I%27d%20like%20to%20learn%20about%20TallyPrime%20for%20construction" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition"><MessageSquare className="h-4 w-4" /> Chat on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14"><h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Built for Kenyan Construction</h2></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => { const Icon = f.icon; return (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600 mb-4"><Icon className="h-5 w-5" /></div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ); })}
          </div>
        </div>
      </section>
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-slate-900 mb-4">Construction FAQs</h2></div>
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
          <h2 className="text-3xl font-bold text-white mb-4">See TallyPrime Construction in Action</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Book a free demo tailored to your construction business — project costing, BOQ tracking, and compliance included.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition">Book Free Demo <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:+254116246074" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-8 py-3 text-sm font-semibold text-white transition"><Phone className="h-4 w-4" /> +254 116 246 074</a>
          </div>
        </div>
      </section>
    </main>
  );
}
