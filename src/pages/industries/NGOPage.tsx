import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Heart, BarChart3, FileText, Shield, Phone, MessageSquare, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

const features = [
  { icon: Globe, title: 'Multi-Donor Fund Accounting', desc: 'Track income and expenditure separately for each donor, grant, or project. Produce donor-specific financial reports showing exactly how their funds were used.' },
  { icon: FileText, title: 'Donor Report Generation', desc: 'Generate financial statements in the format required by each donor — USAID, EU, UN agencies, bilateral donors, and local foundations all have different reporting requirements. TallyPrime handles them all.' },
  { icon: BarChart3, title: 'Budget vs Actual Tracking', desc: 'Set budgets for each project and cost centre. Get real-time alerts when spending approaches or exceeds budget limits — before you overspend.' },
  { icon: Shield, title: 'Audit Trail & Compliance', desc: 'NGOs in Kenya are subject to NGO Board, KRA, and donor audits. TallyPrime\'s complete audit trail, Edit Log, and access controls make audit preparation straightforward.' },
  { icon: Heart, title: 'Multi-Currency Grants', desc: 'Receive grants in USD, EUR, GBP, or any other currency. TallyPrime handles multi-currency accounting and foreign exchange gain/loss automatically.' },
  { icon: CheckCircle2, title: 'Payroll & Staff Benefits', desc: 'Manage staff payroll with PAYE, NSSF, SHIF, Housing Levy, and NITA deductions. Handle per diem, allowances, and gratuity for both national and international staff.' },
];

const faqs = [
  { q: 'Can TallyPrime produce financial reports in donor formats?', a: 'Yes. Using custom report templates and cost centre reporting, TallyPrime can produce financial statements in the format required by most major donors. We configure the templates during implementation.' },
  { q: 'How does TallyPrime handle restricted and unrestricted funds?', a: 'Restricted and unrestricted funds are managed as separate cost centres or projects in TallyPrime. All income and expenditure is tagged to the appropriate fund, ensuring clean separation of donor funds.' },
  { q: 'Does TallyPrime support multiple bank accounts in different currencies?', a: 'Yes. TallyPrime supports unlimited bank accounts in any currency. Foreign currency transactions are automatically converted at the exchange rate you specify, and forex gains/losses are tracked.' },
];

export default function NGOPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime for NGOs & Non-Profits Kenya — Fund Accounting, Donor Reports & Compliance"
        description="TallyPrime NGO accounting solution in Kenya. Multi-donor fund accounting, budget tracking, donor report generation, and KRA compliance for NGOs and non-profit organisations."
        canonical="/industries/ngo"
        keywords="TallyPrime NGO Kenya, NGO accounting software Kenya, fund accounting Kenya, donor reporting software Kenya, non-profit accounting Nairobi"
        breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Industries', item: 'https://www.optimumprimesolutions.co.ke/industries/' },
          { name: 'NGO', item: 'https://www.optimumprimesolutions.co.ke/industries/ngo/' },
        ]}
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-600/20 border border-rose-500/30 px-4 py-1.5 text-sm font-semibold text-rose-400 mb-6">
              <Heart className="h-4 w-4" /> NGOs & Non-Profits
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              TallyPrime for<br /><span className="text-rose-400">NGOs in Kenya</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Manage multiple donor funds, produce audit-ready reports, and stay compliant with KRA and the NGO Board — all from one system. TallyPrime is trusted by NGOs and non-profits across Kenya.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition">Book a Free Demo <ArrowRight className="h-4 w-4" /></Link>
              <a href="https://wa.me/254116246074?text=Hi%2C%20I%27d%20like%20to%20learn%20about%20TallyPrime%20for%20NGOs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition"><MessageSquare className="h-4 w-4" /> Chat on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14"><h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Built for Kenyan NGOs</h2></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => { const Icon = f.icon; return (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4"><Icon className="h-5 w-5" /></div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ); })}
          </div>
        </div>
      </section>
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-slate-900 mb-4">NGO FAQs</h2></div>
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
          <h2 className="text-3xl font-bold text-white mb-4">See TallyPrime NGO Accounting in Action</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Book a free demo tailored to your NGO's fund accounting and donor reporting needs.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition">Book Free Demo <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:+254116246074" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-8 py-3 text-sm font-semibold text-white transition"><Phone className="h-4 w-4" /> +254 116 246 074</a>
          </div>
        </div>
      </section>
    </main>
  );
}
