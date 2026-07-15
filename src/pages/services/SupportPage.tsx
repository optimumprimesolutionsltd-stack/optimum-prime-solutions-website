import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Headphones, Wrench, Clock, Shield, Phone, MessageSquare, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

const supportChannels = [
  { icon: MessageSquare, title: 'WhatsApp Support', desc: 'Send a message and get a response from a certified TallyPrime expert — typically within 30 minutes on business days.', badge: 'Fastest' },
  { icon: Phone, title: 'Phone Support', desc: 'Speak directly with our support team for urgent issues. Available Monday to Saturday, 8am–6pm EAT.', badge: null },
  { icon: Wrench, title: 'Remote Desktop', desc: 'We connect to your computer remotely and fix the issue while you watch — no waiting for a technician to travel to your office.', badge: 'Most Effective' },
  { icon: Headphones, title: 'On-Site Support', desc: 'For complex issues that require a physical visit, our team covers Nairobi, Ruiru, Kiambu, and surrounding areas.', badge: null },
];

const amcIncludes = [
  'Unlimited WhatsApp and phone support queries',
  'Remote desktop troubleshooting sessions',
  'TallyPrime version upgrades (with active TSS)',
  'KRA eTIMS compliance updates',
  'PAYE, NSSF, SHIF and Housing Levy rate updates',
  'Quarterly health check of your TallyPrime data',
  'User access and security review',
  'Priority response — issues escalated within 1 hour',
];

const plans = [
  {
    name: 'Basic AMC',
    desc: 'For single-user businesses with straightforward accounting needs.',
    highlight: false,
    color: 'border-slate-200',
    features: ['WhatsApp & phone support', 'Remote desktop support', 'Compliance updates', '2 on-site visits per year', 'Business hours support'],
  },
  {
    name: 'Standard AMC',
    desc: 'For growing businesses with multiple users and active payroll.',
    highlight: true,
    color: 'border-red-500',
    features: ['Everything in Basic', 'Unlimited remote sessions', 'Priority response (1 hr)', 'Quarterly data health check', '4 on-site visits per year', 'User training refreshers'],
  },
  {
    name: 'Premium AMC',
    desc: 'For multi-branch businesses and organisations with complex setups.',
    highlight: false,
    color: 'border-slate-200',
    features: ['Everything in Standard', 'Dedicated account manager', 'Monthly performance report', 'Unlimited on-site visits', 'After-hours emergency line', 'Annual system audit'],
  },
];

const faqs = [
  {
    q: 'What is an Annual Maintenance Contract (AMC)?',
    a: 'An AMC is a yearly support subscription that gives you access to our full support team for the duration of the contract. Instead of paying per incident, you get unlimited support for a fixed annual fee.',
  },
  {
    q: 'How quickly do you respond to support requests?',
    a: 'Standard AMC clients receive a response within 1 hour during business hours. Basic AMC clients receive a response within 2–4 hours. Emergency issues on Premium AMC are handled within 30 minutes.',
  },
  {
    q: 'Do you support older versions of Tally?',
    a: 'We support TallyPrime (all versions) and TallyERP 9. For businesses still on TallyERP 9, we strongly recommend upgrading to TallyPrime to maintain KRA eTIMS compliance.',
  },
  {
    q: 'What if I have an issue outside business hours?',
    a: 'Premium AMC clients have access to an after-hours emergency line. For Standard and Basic clients, urgent issues reported outside hours are addressed first thing the following morning.',
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime Support & Maintenance | Optimum Prime"
        description="Reliable TallyPrime support in Kenya — Annual Maintenance Contracts, remote desktop support, WhatsApp helpdesk, and on-site visits."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Support solutions for your business in Ruiru and beyond."
        canonical="/tallyprime/support"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'TallyPrime Solutions', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/' },
          { name: 'Support', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/support/' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-600/20 border border-orange-500/30 px-4 py-1.5 text-sm font-semibold text-orange-400 mb-6">
              <Headphones className="h-4 w-4" />
              TallyPrime Support & Maintenance
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Expert Support When<br />
              <span className="text-orange-400">You Need It Most</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Your business cannot afford downtime. Our certified TallyPrime support team is available via WhatsApp, phone, and remote desktop — resolving most issues within the hour, without waiting for a site visit.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/254727209720?text=Hi%2C%20I%20need%20TallyPrime%20support"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                <MessageSquare className="h-4 w-4" /> Get Support Now
              </a>
              <Link
                to="/contact#demo-form"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition"
              >
                Enquire About AMC <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time Strip */}
      <section className="bg-orange-600 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white">
            {[
              { value: '< 30 min', label: 'WhatsApp Response' },
              { value: '< 1 hr', label: 'Issue Resolution (AMC)' },
              { value: '6 days/wk', label: 'Support Availability' },
              { value: '100%', label: 'Remote Capable' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black mb-1">{s.value}</div>
                <div className="text-orange-100 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How We Support You</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Multiple channels, one team. We meet you where you are.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {supportChannels.map((ch, i) => {
              const Icon = ch.icon;
              return (
                <motion.div
                  key={ch.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  {ch.badge && (
                    <span className="absolute top-4 right-4 rounded-full bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5">{ch.badge}</span>
                  )}
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{ch.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{ch.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AMC Plans */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Annual Maintenance Contracts</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Predictable support costs, unlimited access to our team. Choose the plan that fits your business size.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3 mb-12">
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
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                      <Zap className="h-3 w-3" /> Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{plan.desc}</p>
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
                  className={`flex items-center justify-center gap-2 rounded-full font-semibold px-6 py-3 text-sm transition ${plan.highlight ? 'bg-red-600 hover:bg-red-700 text-white' : 'border border-slate-200 hover:border-red-300 hover:text-red-600 text-slate-700'}`}
                >
                  Get a Quote <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* AMC includes */}
          <div className="rounded-3xl bg-white border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-red-600" />
              <h3 className="text-xl font-bold text-slate-900">All AMC Plans Include</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {amcIncludes.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Support FAQs</h2>
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
              { label: 'Implementation', href: '/tallyprime/implementation' },
              { label: 'Training', href: '/tallyprime/training' },
              { label: 'Customization', href: '/tallyprime/customization' },
              { label: 'Cloud Hosting', href: '/tallyprime/cloud-hosting' },
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
