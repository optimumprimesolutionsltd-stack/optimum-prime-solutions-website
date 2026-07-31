import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, BookOpen, Users, Monitor, Award, Phone, MessageSquare, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';

const programs = [
  {
    icon: BookOpen,
    title: 'Foundation Training',
    audience: 'New TallyPrime users',
    duration: '1 day',
    color: 'bg-blue-50 text-blue-600',
    topics: [
      'Company setup and chart of accounts',
      'Recording sales, purchases and payments',
      'Basic inventory management',
      'KRA eTIMS invoice generation',
      'Day-end and month-end closing',
      'Core reports: P&L, Balance Sheet, Trial Balance',
    ],
  },
  {
    icon: Users,
    title: 'Advanced User Training',
    audience: 'Experienced users & finance teams',
    duration: '2 days',
    color: 'bg-purple-50 text-purple-600',
    topics: [
      'Multi-currency transactions',
      'Cost centre and project accounting',
      'Payroll: PAYE, NSSF, SHIF, Housing Levy',
      'Manufacturing and BOM management',
      'Advanced inventory: batches, godowns, reorder levels',
      'Custom reports and MIS dashboards',
    ],
  },
  {
    icon: Monitor,
    title: 'KRA Compliance Training',
    audience: 'Accountants and finance managers',
    duration: '1 day',
    color: 'bg-red-50 text-red-600',
    topics: [
      'eTIMS setup and invoice transmission',
      'VAT returns filing from TallyPrime',
      'PAYE, NSSF, SHIF and Housing Levy remittance',
      'Withholding tax management',
      'Audit trail and Edit Log usage',
      'iTax integration and reconciliation',
    ],
  },
  {
    icon: Award,
    title: 'Administrator Training',
    audience: 'IT managers and system admins',
    duration: '1 day',
    color: 'bg-green-50 text-green-600',
    topics: [
      'User roles and access control setup',
      'Data backup and restore procedures',
      'TallyPrime server configuration',
      'Multi-company and multi-branch setup',
      'Security and audit settings',
      'Troubleshooting common issues',
    ],
  },
];

const deliveryModes = [
  {
    title: 'On-Site Training',
    desc: 'Our trainer comes to your office in Nairobi, Ruiru, Kiambu, or anywhere in Kenya. Your team trains on your own data and setup — no travel required from your staff.',
    icon: Users,
  },
  {
    title: 'Remote Training',
    desc: 'Live, interactive training via Zoom or Microsoft Teams. Ideal for teams spread across multiple locations or businesses outside Nairobi.',
    icon: Monitor,
  },
  {
    title: 'At Our Training Centre',
    desc: 'Attend a scheduled group training session at our Ruiru office. Great for individuals and small teams who want structured classroom learning.',
    icon: BookOpen,
  },
];

const faqs = [
  {
    q: 'How many people can attend a training session?',
    a: 'On-site and remote training sessions accommodate up to 10 participants per session. For larger teams, we run multiple sessions or split into groups.',
  },
  {
    q: 'Do you provide training materials?',
    a: 'Yes. Every participant receives a printed or digital training manual, exercise files, and a quick-reference guide they can use after training.',
  },
  {
    q: 'Can training be customised for our business?',
    a: 'Absolutely. We tailor all training to your industry, your chart of accounts, and the specific TallyPrime modules you use. Manufacturing training looks very different from retail training.',
  },
  {
    q: 'What if our staff need a refresher after training?',
    a: 'All training packages include 30 days of post-training support via WhatsApp. For ongoing support, we recommend our Annual Maintenance Contract (AMC).',
  },
];

export default function TrainingPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime Training Kenya | Optimum Prime"
        description="Professional TallyPrime training in Kenya — foundation, advanced, KRA compliance, and administrator courses, on-site or remote."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Training solutions for your business in Ruiru and beyond."
        canonical="/tallyprime/training"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'TallyPrime Solutions', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/' },
          { name: 'Training', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/training/' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-600/20 border border-purple-500/30 px-4 py-1.5 text-sm font-semibold text-purple-400 mb-6">
              <BookOpen className="h-4 w-4" />
              TallyPrime Training
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Train Your Team to Use<br />
              <span className="text-purple-400">TallyPrime Confidently</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              A powerful system is only as good as the people using it. Our certified TallyPrime trainers deliver practical, Kenya-specific training — covering everything from daily transactions to KRA eTIMS compliance and payroll.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact#demo-form"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                Book a Training Session <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/254727209720?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20TallyPrime%20training"
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

      {/* Training Programs */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Training Programs</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Choose the program that matches your team's experience level and business needs. All programs can be combined or customised.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {programs.map((prog, i) => {
              const Icon = prog.icon;
              return (
                <motion.div
                  key={prog.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl flex-shrink-0 ${prog.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{prog.title}</h3>
                      <p className="text-sm text-slate-500">{prog.audience}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 mt-1">
                        <Clock className="h-3 w-3" /> {prog.duration}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {prog.topics.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Delivery Modes */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How We Deliver Training</h2>
            <p className="text-slate-600 max-w-xl mx-auto">We come to you, or you connect online. Training is always live, interactive, and tailored to your business.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {deliveryModes.map((mode, i) => {
              const Icon = mode.icon;
              return (
                <motion.div
                  key={mode.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-3xl bg-white border border-slate-200 p-6"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{mode.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{mode.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Panel */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Book a Training Session?</h2>
            <p className="text-purple-100 mb-8 max-w-xl mx-auto">
              Tell us your team size, location, and the modules you need. We'll send you a training plan and quote within 24 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-white text-purple-700 hover:bg-purple-50 font-semibold px-8 py-3 text-sm transition">
                Book Training <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:+254116246074" className="inline-flex items-center gap-2 rounded-full border border-white/30 hover:bg-white/10 text-white font-semibold px-8 py-3 text-sm transition">
                <Phone className="h-4 w-4" /> +254 116 246 074
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Training FAQs</h2>
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
              { label: 'Support & Maintenance', href: '/tallyprime/support' },
              { label: 'Customization', href: '/tallyprime/customization' },
              { label: 'TallyPrime Licensing', href: '/tallyprime/licensing' },
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
