import { Link } from 'react-router-dom';
import { ArrowRight, Code2, FileText, BarChart3, Printer, Phone, MessageSquare, Puzzle } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

const customizations = [
  {
    icon: FileText,
    title: 'Custom Invoice & Document Templates',
    desc: 'Branded invoices, delivery notes, purchase orders, and receipts that match your company identity — with your logo, colours, terms, and layout exactly as you want them.',
    examples: ['Tax invoice with eTIMS QR code', 'Delivery note with driver signature field', 'Proforma invoice template', 'Statement of account layout'],
  },
  {
    icon: BarChart3,
    title: 'Custom Reports & MIS Dashboards',
    desc: 'TallyPrime\'s default reports don\'t always show what your management team needs. We build custom reports tailored to your KPIs, industry, and decision-making style.',
    examples: ['Sales rep performance report', 'Branch-wise profitability', 'Ageing analysis by sales rep', 'Stock movement by category'],
  },
  {
    icon: Code2,
    title: 'TDL Customizations',
    desc: 'Using Tally Definition Language (TDL), we extend TallyPrime\'s core functionality — adding new fields, automating calculations, and integrating with external systems.',
    examples: ['Custom fields on vouchers', 'Automated commission calculations', 'Approval workflows', 'Integration with external POS or ERP'],
  },
  {
    icon: Printer,
    title: 'Payslip & HR Document Design',
    desc: 'Professional payslips showing all Kenya-specific deductions — PAYE, NSSF, SHIF, Housing Levy, NITA — in a clear, employee-friendly format.',
    examples: ['Branded payslip template', 'Leave application form', 'P9 form layout', 'NSSF/SHIF contribution schedule'],
  },
];

const process = [
  { step: '01', title: 'Requirements Gathering', desc: 'We meet with your team to understand exactly what you need — what data to capture, how it should look, and what decisions it should support.' },
  { step: '02', title: 'Design & Prototype', desc: 'We build a prototype of the customisation and share it with you for review before any final development begins.' },
  { step: '03', title: 'Development & Testing', desc: 'We develop the customisation in a test environment, run thorough quality checks, and verify it works correctly with your live data.' },
  { step: '04', title: 'Deployment & Training', desc: 'We deploy to your live TallyPrime, train your team on how to use the new feature, and provide 30 days of post-deployment support.' },
];

const faqs = [
  {
    q: 'Will customisations break when TallyPrime updates?',
    a: 'TDL customisations are designed to be version-independent where possible. When TallyPrime releases a major update, we review and update your customisations as part of your AMC or at a fixed service fee.',
  },
  {
    q: 'Can you integrate TallyPrime with our website or other software?',
    a: 'Yes. We can build integrations between TallyPrime and external systems — including e-commerce platforms, CRM tools, and custom applications — using TallyPrime\'s ODBC and XML export capabilities.',
  },
  {
    q: 'How long does a customisation project take?',
    a: 'Simple template customisations take 1–3 days. Complex TDL development or integrations typically take 1–4 weeks depending on scope. We provide a timeline estimate before starting.',
  },
  {
    q: 'Do I need to be on a specific TallyPrime version?',
    a: 'We recommend keeping your TallyPrime on the latest version (covered by an active TSS). Customisations are built for the current version and tested before delivery.',
  },
];

export default function CustomizationPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime Customization Kenya | Optimum Prime"
        description="TallyPrime customization in Kenya — custom invoice templates, MIS reports, TDL development, and system integrations."
        service={{
          name: "TallyPrime Customization (TDL)",
          description: "TallyPrime customization in Kenya - custom invoice templates, MIS reports, TDL development, and system integrations.",
          serviceType: "Software customization",
        }}
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Customization solutions for your business in Ruiru and beyond."
        canonical="/tallyprime/customization"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'TallyPrime Solutions', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/' },
          { name: 'Customization', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/customization/' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-600/20 border border-indigo-500/30 px-4 py-1.5 text-sm font-semibold text-indigo-400 mb-6">
              <Puzzle className="h-4 w-4" />
              TallyPrime Customization
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              TallyPrime Built<br />
              <span className="text-indigo-400">Around Your Business</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Standard TallyPrime is powerful — but your business has unique workflows, reporting needs, and document formats. We customise TallyPrime to fit your operations precisely, so your team works faster and your reports tell the right story.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact#demo-form"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                Discuss Your Requirements <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/254727209720?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20TallyPrime%20customization"
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

      {/* Customization Types */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">What We Customise</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              From simple invoice templates to complex TDL integrations — we cover the full range of TallyPrime customisation.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {customizations.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 flex-shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Examples</p>
                    <ul className="space-y-1">
                      {item.examples.map((ex) => (
                        <li key={ex} className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Our Customisation Process</h2>
            <p className="text-slate-600 max-w-xl mx-auto">No surprises. Every project follows a clear 4-step process from requirements to delivery.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-3xl bg-white border border-slate-200 p-6"
              >
                <span className="text-5xl font-black text-slate-100 absolute top-4 right-5 select-none">{p.step}</span>
                <h3 className="font-bold text-slate-900 mb-2 pr-8">{p.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 md:p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Tell Us What You Need</h2>
                <p className="text-indigo-100 leading-relaxed">
                  Describe the report, template, or workflow you need — and we'll tell you how we can build it in TallyPrime. Most customisation requests get a quote within 24 hours.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact#demo-form" className="flex-1 flex items-center justify-center gap-2 rounded-full bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-6 py-3 text-sm transition">
                  Send Requirements <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="tel:+254116246074" className="flex-1 flex items-center justify-center gap-2 rounded-full border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 text-sm transition">
                  <Phone className="h-4 w-4" /> Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Customisation FAQs</h2>
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

      {/* Related Services */}
      <section className="bg-white py-14 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Related Services</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Implementation', href: '/tallyprime/implementation' },
              { label: 'Training', href: '/tallyprime/training' },
              { label: 'Support & Maintenance', href: '/tallyprime/support' },
              { label: 'Data Migration', href: '/tallyprime/data-migration' },
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
