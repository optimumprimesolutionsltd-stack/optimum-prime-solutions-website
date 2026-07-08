import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ClipboardList, Settings, Users, Rocket, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

const steps = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Discovery & Needs Assessment',
    desc: 'We meet your team, map your current processes, and document exactly what TallyPrime needs to do for your business — from chart of accounts to multi-branch inventory.',
  },
  {
    icon: Settings,
    step: '02',
    title: 'Configuration & Setup',
    desc: 'We install and configure TallyPrime to match your business: company setup, tax codes, KRA eTIMS integration, godowns, cost centres, and user roles.',
  },
  {
    icon: Users,
    step: '03',
    title: 'Data Migration',
    desc: 'We migrate your opening balances, customer/supplier ledgers, and historical data from your previous system — whether Excel, QuickBooks, Sage, or another Tally version.',
  },
  {
    icon: Rocket,
    step: '04',
    title: 'Go-Live & Handover',
    desc: 'We run parallel testing, train your team, and support your first live month end-to-end. You go live with confidence, not guesswork.',
  },
];

const includes = [
  'Company setup & chart of accounts configuration',
  'KRA eTIMS integration and testing',
  'Multi-godown / multi-branch setup',
  'Opening balances migration',
  'User roles and access control setup',
  'Payroll module configuration (PAYE, NHIF, NSSF)',
  'Custom voucher types and invoice templates',
  'Staff training (up to 5 users)',
  '30-day post-go-live support',
];

const faqs = [
  {
    q: 'How long does a TallyPrime implementation take?',
    a: 'For a single-company setup, implementation typically takes 3–7 business days. Multi-branch or complex manufacturing setups may take 2–4 weeks depending on data volume and customisation requirements.',
  },
  {
    q: 'Do you migrate data from QuickBooks or Excel?',
    a: 'Yes. We migrate opening balances, ledger masters, stock items, and historical transactions from QuickBooks, Sage, Excel, and older Tally versions. Data accuracy is verified before go-live.',
  },
  {
    q: 'Will my team need training?',
    a: 'All implementations include hands-on training for up to 5 users. We cover daily transactions, month-end closing, KRA returns, and report generation. Additional training packages are available.',
  },
  {
    q: 'What happens after go-live?',
    a: 'Every implementation includes 30 days of post-go-live support via WhatsApp and remote desktop. After that, you can subscribe to our Annual Maintenance Contract (AMC) for ongoing support.',
  },
];

export default function ImplementationPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime Implementation Kenya — Setup, Configuration & Go-Live Support"
        description="Professional TallyPrime implementation in Kenya. End-to-end setup, KRA eTIMS integration, data migration, staff training, and go-live support. Serving Nairobi, Ruiru, Kiambu and all of Kenya."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Implementation solutions for your business in Ruiru and beyond."
        canonical="/tallyprime/implementation"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'TallyPrime Solutions', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/' },
          { name: 'Implementation', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/implementation/' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 border border-blue-500/30 px-4 py-1.5 text-sm font-semibold text-blue-400 mb-6">
              <CheckCircle2 className="h-4 w-4" />
              TallyPrime Implementation
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              TallyPrime Setup Done<br />
              <span className="text-blue-400">Right, First Time</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              A poorly configured TallyPrime costs more to fix than to do right. Our certified implementers follow a proven 4-step process — from discovery to go-live — so your business runs on accurate data from day one.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact#demo-form"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                Book a Free Consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/254116246074?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20TallyPrime%20implementation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition"
              >
                <MessageSquare className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Our 4-Step Implementation Process</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Every business is different. Our process is structured but flexible — designed to fit your timeline and minimise disruption.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex flex-col rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <span className="text-5xl font-black text-slate-100 absolute top-4 right-5 select-none">{s.step}</span>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-red-600 mb-3 block">What's Included</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Everything You Need to Go Live with Confidence
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                Our implementation package covers the full scope of work — no hidden extras. From the first configuration call to your first month-end close, we are with you every step of the way.
              </p>
              <ul className="space-y-3">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
              <h3 className="text-xl font-bold mb-2">Ready to get started?</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Book a free 30-minute consultation. We'll assess your current setup and give you a clear implementation plan and timeline — at no charge.
              </p>
              <div className="space-y-3">
                <Link
                  to="/contact#demo-form"
                  className="flex items-center justify-center gap-2 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-semibold px-6 py-3 text-sm transition w-full"
                >
                  Book Free Consultation <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="tel:+254116246074"
                  className="flex items-center justify-center gap-2 rounded-full border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 text-sm transition w-full"
                >
                  <Phone className="h-4 w-4" /> Call +254 116 246 074
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
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

      {/* Related Services */}
      <section className="bg-slate-50 py-14 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Related Services</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'TallyPrime Licensing', href: '/tallyprime/licensing' },
              { label: 'Cloud Hosting', href: '/tallyprime/cloud-hosting' },
              { label: 'Training', href: '/tallyprime/training' },
              { label: 'Data Migration', href: '/tallyprime/data-migration' },
              { label: 'Support & Maintenance', href: '/tallyprime/support' },
            ].map((s) => (
              <Link
                key={s.href}
                to={s.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:border-red-300 hover:text-red-600 px-4 py-2 text-sm font-medium text-slate-700 transition"
              >
                {s.label} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
