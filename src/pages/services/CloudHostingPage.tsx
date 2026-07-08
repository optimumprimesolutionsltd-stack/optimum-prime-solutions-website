import { Link } from 'react-router-dom';
import { ArrowRight, Cloud, CheckCircle2, Shield, Wifi, Monitor, Phone, MessageSquare, Server, Lock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

const features = [
  { icon: Globe, title: 'Access from Anywhere', desc: 'Open TallyPrime on any device — laptop, tablet, or phone — from your office, home, or while travelling across Kenya.' },
  { icon: Shield, title: '99.9% Uptime SLA', desc: 'Our cloud infrastructure is hosted on enterprise-grade servers with redundant connectivity and daily automated backups.' },
  { icon: Lock, title: 'Bank-Grade Security', desc: 'All data is encrypted in transit and at rest. Role-based access control ensures each user sees only what they need to.' },
  { icon: Server, title: 'Dedicated Tally Server', desc: 'Your TallyPrime runs on a dedicated virtual machine — not shared with other businesses. Your data is always yours.' },
  { icon: Wifi, title: 'Multi-User Collaboration', desc: 'Your entire team works on the same live data simultaneously — accounts, inventory, and payroll all in sync.' },
  { icon: Monitor, title: 'Remote Support Ready', desc: 'Our support team can connect to your cloud instance instantly to resolve issues without waiting for an on-site visit.' },
];

const plans = [
  {
    name: 'Starter',
    users: '1–2 Users',
    storage: '20 GB Storage',
    color: 'border-slate-200',
    highlight: false,
    features: ['TallyPrime Silver hosted', 'Daily automated backups', '99.9% uptime SLA', 'Email & WhatsApp support', 'SSL encryption'],
  },
  {
    name: 'Business',
    users: '3–10 Users',
    storage: '50 GB Storage',
    color: 'border-sky-500',
    highlight: true,
    features: ['TallyPrime Gold hosted', 'Daily automated backups', '99.9% uptime SLA', 'Priority WhatsApp support', 'SSL encryption', 'Monthly performance report'],
  },
  {
    name: 'Enterprise',
    users: '10+ Users',
    storage: '100 GB+ Storage',
    color: 'border-slate-200',
    highlight: false,
    features: ['TallyPrime Gold hosted', 'Hourly automated backups', '99.9% uptime SLA', 'Dedicated account manager', 'SSL encryption', 'Custom domain access', 'Monthly performance report'],
  },
];

const faqs = [
  {
    q: 'Do I still need to buy a TallyPrime licence for cloud hosting?',
    a: 'Yes. Cloud hosting is a separate service from the TallyPrime licence. You need a valid TallyPrime Gold licence to use multi-user cloud hosting. We can bundle both into a single package.',
  },
  {
    q: 'How do users access TallyPrime on the cloud?',
    a: 'Users connect via a secure remote desktop connection (RDP) or browser-based client. We set up each user\'s device in under 30 minutes. No technical knowledge required from your team.',
  },
  {
    q: 'What happens to my data if I stop the subscription?',
    a: 'We provide a full data export in TallyPrime backup format before decommissioning your instance. Your data is always yours.',
  },
  {
    q: 'Is my data backed up?',
    a: 'Yes. All plans include daily automated backups retained for 30 days. Enterprise plans include hourly backups. Restore requests are handled within 2 hours.',
  },
];

export default function CloudHostingPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime Cloud Hosting Kenya — Secure Remote Access for Your Tally Data"
        description="Host TallyPrime on the cloud in Kenya. Access your accounting data from anywhere, on any device. 99.9% uptime, daily backups, and multi-user access. Serving Nairobi, Ruiru and all of Kenya."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. CloudHosting solutions for your business in Ruiru and beyond."
        canonical="/tallyprime/cloud-hosting"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'TallyPrime Solutions', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/' },
          { name: 'Cloud Hosting', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/cloud-hosting/' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-600/20 border border-sky-500/30 px-4 py-1.5 text-sm font-semibold text-sky-400 mb-6">
              <Cloud className="h-4 w-4" />
              TallyPrime Cloud Hosting
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Your TallyPrime,<br />
              <span className="text-sky-400">Accessible Anywhere</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Stop being tied to one office computer. With Optimum Prime cloud hosting, your entire team accesses live TallyPrime data from any device, anywhere in Kenya — with enterprise security and 99.9% uptime.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact#demo-form"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                Book a Free Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/254116246074?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20TallyPrime%20cloud%20hosting"
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

      {/* Stats Strip */}
      <section className="bg-sky-600 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white">
            {[
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '< 30 min', label: 'User Onboarding' },
              { value: '30 days', label: 'Backup Retention' },
              { value: '< 2 hrs', label: 'Support Response' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black mb-1">{s.value}</div>
                <div className="text-sky-100 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Why Cloud-Host Your TallyPrime?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              On-premise TallyPrime limits your team to one location. Cloud hosting removes that constraint — permanently.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Cloud Hosting Plans</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Contact us for current pricing — plans are tailored to your number of users and storage requirements.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col rounded-3xl border-2 ${plan.color} bg-white p-6 shadow-sm`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-600 px-3 py-1 text-xs font-bold text-white">Most Popular</span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-sky-600 font-semibold mb-1">{plan.users}</p>
                <p className="text-xs text-slate-500 mb-4">{plan.storage}</p>
                <ul className="space-y-2 flex-grow mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact#demo-form"
                  className={`flex items-center justify-center gap-2 rounded-full font-semibold px-6 py-3 text-sm transition ${plan.highlight ? 'bg-sky-600 hover:bg-sky-700 text-white' : 'border border-slate-200 hover:border-sky-300 hover:text-sky-600 text-slate-700'}`}
                >
                  Get a Quote <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Cloud Hosting FAQs</h2>
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

      {/* CTA */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Move to the Cloud?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">We migrate your existing TallyPrime data to the cloud with zero downtime. Book a free demo and we'll show you exactly how it works.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition">
              Book a Free Demo <ArrowRight className="h-4 w-4" />
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
              { label: 'TallyPrime Licensing', href: '/tallyprime/licensing' },
              { label: 'Implementation', href: '/tallyprime/implementation' },
              { label: 'Support & Maintenance', href: '/tallyprime/support' },
              { label: 'Training', href: '/tallyprime/training' },
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
