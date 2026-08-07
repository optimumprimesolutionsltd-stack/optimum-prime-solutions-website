import { Link } from 'react-router-dom';
import { ArrowRight, Download, CheckCircle2, Shield, Star, Phone, MessageSquare, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

const plans = [
  {
    name: 'TallyPrime Silver',
    badge: 'Single User',
    color: 'border-slate-200',
    badgeColor: 'bg-slate-100 text-slate-600',
    features: [
      'Full accounting & inventory',
      'KRA eTIMS integration',
      'GST / VAT returns',
      'Payroll for up to 50 employees',
      'Single company, single user',
      '1 year Tally Software Services (TSS)',
    ],
    cta: 'Get a Quote',
    highlight: false,
  },
  {
    name: 'TallyPrime Gold',
    badge: 'Multi User',
    color: 'border-red-500',
    badgeColor: 'bg-red-50 text-red-600',
    features: [
      'Everything in Silver',
      'Unlimited concurrent users on LAN',
      'Multi-company support',
      'Advanced inventory & manufacturing',
      'Unlimited payroll employees',
      '1 year Tally Software Services (TSS)',
    ],
    cta: 'Get a Quote',
    highlight: true,
  },
  {
    name: 'TallyPrime Edit Log',
    badge: 'Audit Ready',
    color: 'border-slate-200',
    badgeColor: 'bg-green-50 text-green-600',
    features: [
      'Full audit trail for every entry',
      'Tamper-proof edit history',
      'Compliance with audit requirements',
      'Available as Silver or Gold add-on',
      'Ideal for NGOs, SACCOs & listed companies',
      '1 year Tally Software Services (TSS)',
    ],
    cta: 'Get a Quote',
    highlight: false,
  },
];

const tssFeatures = [
  'Free TallyPrime upgrades to all new versions',
  'KRA eTIMS compliance updates',
  'NHIF, NSSF & PAYE regulatory updates',
  'Priority technical support',
  'Access to Tally remote support tools',
  'New feature releases as they launch',
];

const faqs = [
  {
    q: 'What is the difference between Silver and Gold?',
    a: 'TallyPrime Silver supports one user at a time on one computer. TallyPrime Gold supports unlimited concurrent users on a local area network (LAN) or via cloud hosting. Most growing businesses choose Gold.',
  },
  {
    q: 'What is Tally Software Services (TSS)?',
    a: 'TSS is an annual subscription that keeps your TallyPrime up to date — including all version upgrades, KRA compliance updates, and access to Tally\'s support portal. Without an active TSS, your software still works but you won\'t receive updates.',
  },
  {
    q: 'Can I upgrade from Silver to Gold later?',
    a: 'Yes. You can upgrade from Silver to Gold at any time by paying the difference. Your data and configurations are fully preserved.',
  },
  {
    q: 'Is this a genuine TallyPrime licence?',
    a: 'Yes. Optimum Prime Solutions is an authorised TallyPrime partner in Kenya. Every licence we sell is genuine, registered with Tally Solutions, and comes with full local support.',
  },
];

export default function LicensingPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Buy TallyPrime Licence Kenya | Optimum Prime"
        description="Buy genuine TallyPrime Silver, Gold and Edit Log licences in Kenya. Authorised partner with competitive prices and full local support."
        service={{
          name: "TallyPrime Licensing",
          description: "Genuine TallyPrime Silver, Gold and Edit Log licences in Kenya from an authorised partner, with full local support.",
          serviceType: "Software licensing",
        }}
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Licensing solutions for your business in Ruiru and beyond."
        canonical="/tallyprime/licensing"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'TallyPrime Solutions', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/' },
          { name: 'Licensing', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/licensing/' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-600/20 border border-green-500/30 px-4 py-1.5 text-sm font-semibold text-green-400 mb-6">
              <Shield className="h-4 w-4" />
              Authorised TallyPrime Partner — Kenya
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Genuine TallyPrime Licences<br />
              <span className="text-green-400">With Full Local Support</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Buy TallyPrime Silver, Gold, or Edit Log directly from Kenya's authorised partner. Every licence includes Tally Software Services (TSS), KRA eTIMS compliance, and our dedicated local support team.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                View Pricing <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/254727209720?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20TallyPrime%20licensing"
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

      {/* Warning: Piracy */}
      <section className="bg-amber-50 border-y border-amber-200 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Beware of pirated Tally software.</strong> Unlicensed copies do not receive KRA eTIMS updates, expose your business to compliance risk, and are not eligible for support. Always buy from an authorised partner.
            </p>
          </div>
        </div>
      </section>

      {/* Licence Plans */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Choose Your TallyPrime Licence</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              All licences are genuine, registered with Tally Solutions, and include 1 year of Tally Software Services.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col rounded-3xl border-2 ${plan.color} bg-white p-6 shadow-sm ${plan.highlight ? 'shadow-red-100' : ''}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                      <Star className="h-3 w-3 fill-white" /> Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${plan.badgeColor} mb-3`}>{plan.badge}</span>
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                </div>
                <ul className="space-y-2.5 flex-grow mb-6">
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
                  {plan.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TSS Benefits */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-red-600 mb-3 block">Tally Software Services (TSS)</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Stay Compliant, Always Up to Date
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                TSS is the annual subscription that keeps your TallyPrime current. As KRA updates eTIMS requirements and the government changes PAYE, NHIF, or NSSF rates, your software updates automatically — at no extra charge.
              </p>
              <ul className="space-y-3">
                {tssFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-green-600 to-green-800 p-8 text-white">
              <Download className="h-10 w-10 text-green-200 mb-4" />
              <h3 className="text-xl font-bold mb-2">Get an Official Quote</h3>
              <p className="text-green-100 text-sm mb-6 leading-relaxed">
                Pricing depends on the number of users and companies. Contact us for a formal quotation — we respond within 1 hour on business days.
              </p>
              <div className="space-y-3">
                <Link
                  to="/contact#demo-form"
                  className="flex items-center justify-center gap-2 rounded-full bg-white text-green-700 hover:bg-green-50 font-semibold px-6 py-3 text-sm transition w-full"
                >
                  Request a Quote <ArrowRight className="h-4 w-4" />
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Licensing FAQs</h2>
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
              { label: 'Cloud Hosting', href: '/tallyprime/cloud-hosting' },
              { label: 'Training', href: '/tallyprime/training' },
              { label: 'Support & Maintenance', href: '/tallyprime/support' },
              { label: 'View All Pricing', href: '/pricing' },
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
