import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, PiggyBank, BarChart3, Users, Shield, Phone, MessageSquare, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

const features = [
  { icon: PiggyBank, title: 'Member Savings Tracking', desc: 'Track individual member savings, share capital, and deposit contributions. Generate member statements showing all transactions and current balances.' },
  { icon: TrendingUp, title: 'Loan Portfolio Management', desc: 'Record loan disbursements, track repayments, and calculate outstanding balances for each member. Monitor the health of your loan book with ageing and default reports.' },
  { icon: Users, title: 'Member Ledger Management', desc: 'Each member has a dedicated ledger in TallyPrime. All transactions — deposits, withdrawals, loan repayments, dividends — are recorded and traceable.' },
  { icon: BarChart3, title: 'SACCO Financial Statements', desc: 'Produce Income & Expenditure accounts, Balance Sheet, and cash flow statements in the format required by SASRA and your external auditors.' },
  { icon: Shield, title: 'SASRA Compliance Reports', desc: 'Generate the regulatory reports required by the SACCO Societies Regulatory Authority (SASRA) — capital adequacy, liquidity ratios, and portfolio quality reports.' },
  { icon: CheckCircle2, title: 'Staff Payroll', desc: 'Manage SACCO staff payroll with full Kenya statutory deductions — PAYE, NSSF, SHIF, Housing Levy, and NITA. Generate payslips and remittance schedules.' },
];

const faqs = [
  { q: 'Can TallyPrime calculate loan interest automatically?', a: 'TallyPrime can be configured to track loan interest accruals. For complex loan interest calculations (reducing balance, flat rate), we recommend a dedicated SACCO management system integrated with TallyPrime for accounting.' },
  { q: 'How does TallyPrime handle dividend distribution?', a: 'Dividend distributions are recorded as journal entries in TallyPrime, debiting the dividend payable account and crediting each member\'s account. Member statements are updated automatically.' },
  { q: 'Can TallyPrime handle both savings and credit SACCOs?', a: 'Yes. TallyPrime\'s flexible chart of accounts and cost centre structure supports both savings-only SACCOs (BOSA) and front office savings activity (FOSA) operations.' },
];

export default function SACCOPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime for SACCOs Kenya — Member Accounting, Loans & SASRA Compliance"
        description="TallyPrime SACCO accounting solution in Kenya. Member savings tracking, loan management, SASRA compliance reports, and financial statements for SACCOs across Kenya."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. SACCO solutions for your business in Ruiru and beyond."
        canonical="/industries/sacco"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Industries', item: 'https://www.optimumprimesolutions.co.ke/industries/' },
          { name: 'SACCO', item: 'https://www.optimumprimesolutions.co.ke/industries/sacco/' },
        ]}
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-600/20 border border-green-500/30 px-4 py-1.5 text-sm font-semibold text-green-400 mb-6">
              <PiggyBank className="h-4 w-4" /> SACCOs & Cooperatives
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              TallyPrime for<br /><span className="text-green-400">Kenyan SACCOs</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Manage member accounts, track loan portfolios, and produce SASRA-compliant financial reports — all from one trusted accounting system. TallyPrime supports SACCOs and cooperatives across Kenya.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition">Book a Free Demo <ArrowRight className="h-4 w-4" /></Link>
              <a href="https://wa.me/254727209720?text=Hi%2C%20I%27d%20like%20to%20learn%20about%20TallyPrime%20for%20SACCOs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition"><MessageSquare className="h-4 w-4" /> Chat on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14"><h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Built for Kenyan SACCOs</h2></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => { const Icon = f.icon; return (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-600 mb-4"><Icon className="h-5 w-5" /></div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ); })}
          </div>
        </div>
      </section>
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-slate-900 mb-4">SACCO FAQs</h2></div>
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
          <h2 className="text-3xl font-bold text-white mb-4">See TallyPrime SACCO Accounting in Action</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Book a free demo tailored to your SACCO's member accounting and regulatory reporting needs.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition">Book Free Demo <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:+254116246074" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-8 py-3 text-sm font-semibold text-white transition"><Phone className="h-4 w-4" /> +254 116 246 074</a>
          </div>
        </div>
      </section>
    </main>
  );
}
