import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, GraduationCap, BarChart3, Users, DollarSign, Phone, MessageSquare, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

const features = [
  { icon: GraduationCap, title: 'Student Fee Management', desc: 'Track fee payments by student, class, and term. Know exactly who has paid, who has a balance, and how much is outstanding across the entire school.' },
  { icon: DollarSign, title: 'Fee Structure Management', desc: 'Set up different fee structures for different classes, boarding vs day scholars, and special programmes. Apply discounts for siblings or bursary students automatically.' },
  { icon: Users, title: 'Staff Payroll', desc: 'Manage teacher and support staff payroll with PAYE, NSSF, SHIF, Housing Levy, and NITA deductions. Generate payslips and statutory remittance schedules automatically.' },
  { icon: BookOpen, title: 'Inventory & Stores Management', desc: 'Track school supplies, textbooks, uniforms, and equipment. Manage the school tuck shop or canteen as a separate profit centre within TallyPrime.' },
  { icon: BarChart3, title: 'Budget vs Actual Reports', desc: 'Set annual budgets for each department and cost centre. Get real-time reports showing actual spend against budget — essential for school board reporting.' },
  { icon: CheckCircle2, title: 'Audit-Ready Financial Statements', desc: 'Produce Income & Expenditure accounts, Balance Sheet, and cash flow statements in the format required by your auditors and the Ministry of Education.' },
];

const faqs = [
  { q: 'Can TallyPrime send fee balance reminders to parents?', a: 'TallyPrime tracks outstanding fee balances per student. While it doesn\'t send SMS directly, the outstanding balances report can be exported and used to generate reminder messages through your school\'s communication system.' },
  { q: 'Can we manage multiple schools or campuses in one TallyPrime?', a: 'Yes. TallyPrime Gold supports multi-company or multi-branch setups. Each campus can be managed as a separate branch with its own accounts, while consolidated reports are available across all campuses.' },
  { q: 'Does TallyPrime handle government capitation grants?', a: 'Yes. Government capitation grants are recorded as income in TallyPrime and tracked separately from fee income. Expenditure of capitation funds can be tracked against the government\'s prescribed expenditure categories.' },
];

export default function SchoolsPage() {
  return (
    <>
      <SEO
        title="TallyPrime for Schools & Educational Institutions Kenya — Fee Management & Payroll"
        description="TallyPrime school accounting solution in Kenya. Student fee management, staff payroll, budget tracking, and financial reporting for private schools and educational institutions."
        canonical="/industries/schools"
        keywords="TallyPrime schools Kenya, school accounting software Kenya, fee management software Kenya, school payroll Kenya, educational institution accounting Nairobi"
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-600/20 border border-cyan-500/30 px-4 py-1.5 text-sm font-semibold text-cyan-400 mb-6">
              <GraduationCap className="h-4 w-4" /> Schools & Education
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              TallyPrime for<br /><span className="text-cyan-400">Kenyan Schools</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              From student fee tracking to staff payroll and board reporting — TallyPrime gives Kenyan schools a complete financial management system that's simple to use and audit-ready.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition">Book a Free Demo <ArrowRight className="h-4 w-4" /></Link>
              <a href="https://wa.me/254116246074?text=Hi%2C%20I%27d%20like%20to%20learn%20about%20TallyPrime%20for%20schools" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition"><MessageSquare className="h-4 w-4" /> Chat on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14"><h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Built for Kenyan Schools</h2></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => { const Icon = f.icon; return (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 mb-4"><Icon className="h-5 w-5" /></div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ); })}
          </div>
        </div>
      </section>
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-slate-900 mb-4">Schools FAQs</h2></div>
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
          <h2 className="text-3xl font-bold text-white mb-4">See TallyPrime School Accounting in Action</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Book a free demo tailored to your school's fee management and reporting needs.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition">Book Free Demo <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:+254116246074" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-8 py-3 text-sm font-semibold text-white transition"><Phone className="h-4 w-4" /> +254 116 246 074</a>
          </div>
        </div>
      </section>
    </>
  );
}
