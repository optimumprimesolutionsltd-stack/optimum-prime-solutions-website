import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Database, RefreshCw, ShieldCheck, FileSpreadsheet, Phone, MessageSquare, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

const sources = [
  { name: 'Microsoft Excel / Google Sheets', desc: 'Opening balances, ledger masters, stock items, and historical transactions from spreadsheets.' },
  { name: 'QuickBooks (Desktop & Online)', desc: 'Full migration of chart of accounts, customers, suppliers, inventory, and transaction history.' },
  { name: 'Sage Accounting', desc: 'Ledger masters, opening balances, and historical data from Sage 50, Sage 200, and Sage Business Cloud.' },
  { name: 'TallyERP 9', desc: 'Upgrade your existing TallyERP 9 company data to TallyPrime — preserving all transactions, masters, and configurations.' },
  { name: 'Older Tally Versions', desc: 'Migration from Tally 7.2, Tally 8, and Tally 9 to the current TallyPrime platform.' },
  { name: 'Other Accounting Software', desc: 'Pastel, MYOB, Xero, and custom in-house systems. Contact us to discuss your specific source system.' },
];

const steps = [
  {
    step: '01',
    title: 'Data Extraction & Audit',
    desc: 'We extract your data from the source system and audit it for completeness, accuracy, and consistency before any migration begins.',
  },
  {
    step: '02',
    title: 'Data Mapping & Transformation',
    desc: 'We map your existing chart of accounts, stock categories, and transaction types to the correct TallyPrime structure for your business.',
  },
  {
    step: '03',
    title: 'Test Migration',
    desc: 'We run a full test migration into a sandbox TallyPrime company and verify every balance, ledger, and stock item against your source data.',
  },
  {
    step: '04',
    title: 'Reconciliation & Sign-Off',
    desc: 'You review the migrated data. We reconcile any discrepancies and get your formal sign-off before going live.',
  },
  {
    step: '05',
    title: 'Live Migration & Go-Live',
    desc: 'We run the final migration into your live TallyPrime company and support your first week of operations on the new system.',
  },
];

const whatMigrates = [
  'Opening balances (all ledgers)',
  'Customer and supplier master data',
  'Stock item masters and categories',
  'Historical sales and purchase invoices',
  'Bank and cash transaction history',
  'Employee records and payroll history',
  'Fixed asset register',
  'Outstanding debtors and creditors',
  'Cost centres and project data',
  'Multi-currency balances',
];

const faqs = [
  {
    q: 'Will I lose any data during migration?',
    a: 'No. We run a full test migration and reconciliation before touching your live system. Every balance and transaction is verified against the source before you go live.',
  },
  {
    q: 'How long does data migration take?',
    a: 'Simple migrations (opening balances and masters only) take 1–2 days. Full historical transaction migrations can take 3–7 days depending on data volume and source system complexity.',
  },
  {
    q: 'Can I keep my old system running during migration?',
    a: 'Yes. We migrate data in parallel — your old system stays live until you formally sign off on the migrated data and are ready to switch over.',
  },
  {
    q: 'What if my data is messy or inconsistent?',
    a: 'This is common. We include a data cleaning step in every migration — identifying and resolving duplicate ledgers, mismatched balances, and inconsistent stock records before migration.',
  },
];

export default function DataMigrationPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime Data Migration Kenya"
        description="Professional TallyPrime data migration in Kenya from QuickBooks, Excel, Sage, or TallyERP 9 — zero data loss, full reconciliation."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. DataMigration solutions for your business in Ruiru and beyond."
        canonical="/tallyprime/data-migration"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'TallyPrime Solutions', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/' },
          { name: 'Data Migration', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/data-migration/' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-600/20 border border-teal-500/30 px-4 py-1.5 text-sm font-semibold text-teal-400 mb-6">
              <Database className="h-4 w-4" />
              Data Migration
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Switch to TallyPrime<br />
              <span className="text-teal-400">Without Losing a Single Record</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Moving from QuickBooks, Excel, Sage, or an older Tally version? Our data migration specialists handle the entire process — extraction, cleaning, mapping, testing, and go-live — so your historical data arrives in TallyPrime intact and reconciled.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact#demo-form"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                Discuss Your Migration <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/254727209720?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20data%20migration%20to%20TallyPrime"
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

      {/* Source Systems */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">We Migrate From Any System</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Whether you're on a spreadsheet or an enterprise accounting platform, we have migrated data from it before.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sources.map((src, i) => (
              <motion.div
                key={src.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <FileSpreadsheet className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">{src.name}</p>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{src.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Process */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Our 5-Step Migration Process</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Every migration follows the same rigorous process — no shortcuts, no data loss.</p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-slate-200 mx-16" />
            <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-white font-black text-lg mb-4 shadow-lg">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Migrates */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-red-600 mb-3 block">What Gets Migrated</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Your Complete Business History, Preserved
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                We don't just migrate opening balances — we bring your full business history into TallyPrime so your team can access historical invoices, statements, and reports from day one.
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {whatMigrates.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-teal-50 border border-teal-200 p-6">
                <ShieldCheck className="h-8 w-8 text-teal-600 mb-3" />
                <h3 className="font-bold text-slate-900 mb-2">Zero Data Loss Guarantee</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We do not go live until you have reviewed and signed off on the migrated data. Every balance is reconciled against your source system before cutover.
                </p>
              </div>
              <div className="rounded-3xl bg-amber-50 border border-amber-200 p-6">
                <AlertTriangle className="h-8 w-8 text-amber-600 mb-3" />
                <h3 className="font-bold text-slate-900 mb-2">Your Old System Stays Live</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We run the migration in parallel — your existing system remains fully operational until you are ready to switch. There is no forced cutover.
                </p>
              </div>
              <div className="rounded-3xl bg-green-50 border border-green-200 p-6">
                <RefreshCw className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-bold text-slate-900 mb-2">Post-Migration Support</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every migration includes 30 days of post-go-live support. If anything looks wrong in the first month, we fix it at no extra charge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Migration FAQs</h2>
          </div>
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

      {/* CTA */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Switch to TallyPrime?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Tell us your current system and data volume. We'll give you a migration plan and timeline within 24 hours.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition">
              Start Migration Planning <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="tel:+254116246074" className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-8 py-3 text-sm font-semibold text-white transition">
              <Phone className="h-4 w-4" /> +254 116 246 074
            </a>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="bg-slate-50 py-14 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Related Services</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Implementation', href: '/tallyprime/implementation' },
              { label: 'TallyPrime Licensing', href: '/tallyprime/licensing' },
              { label: 'Training', href: '/tallyprime/training' },
              { label: 'Support & Maintenance', href: '/tallyprime/support' },
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
